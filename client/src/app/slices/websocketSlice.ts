import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  WebSocketState,
  ConnectPayload,
  SendMessagePayload,
  WebSocketStoredMessage,
  IncomingEnvelope,
} from '../../types/WebSocketTypes';
import type { User } from '../../types/types';

const STORAGE_KEY = 'chat.currentUser';
const loadPersistedUser = (): User | null => {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === 'number' && typeof parsed.username === 'string') {
      return { type: 'user', id: parsed.id, username: parsed.username } as User;
    }
    return null;
  } catch {
    return null;
  }
};

const persistedUser = loadPersistedUser();
const initialState: WebSocketState = {
  connectionStatus: 'disconnected',
  messages: [],
  url: null,
  error: null,
  isReconnecting: false,
  reconnectAttempts: 0,
  currentUser: persistedUser,
  pendingUsername: undefined,
  userMap: persistedUser ? { [persistedUser.id]: persistedUser } : {},
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<ConnectPayload>) => {
      state.url = action.payload.url;
      state.connectionStatus = 'connecting';
      state.error = null;
      state.isReconnecting = false;
    },

    connected: (state) => {
      state.connectionStatus = 'connected';
      state.error = null;
      state.isReconnecting = false;
      state.reconnectAttempts = 0;
    },

    disconnected: (state) => {
      state.connectionStatus = 'disconnected';
    },

    connectionError: (state, action: PayloadAction<string>) => {
      state.connectionStatus = 'error';
      state.error = action.payload;
      state.isReconnecting = false;
    },

    incomingMessageReceived: (state, action: PayloadAction<IncomingEnvelope>) => {
      const stored: WebSocketStoredMessage = {
        kind: 'incoming',
        ...action.payload,
        id: action.payload.id || crypto.randomUUID(),
        timestamp: action.payload.timestamp || Date.now(),
      };
      if (stored.type === 'user') {
        const userData = (stored as IncomingEnvelope<User>).data;
        if (userData && typeof userData.id === 'number') {
          if (!state.userMap) state.userMap = {};
          state.userMap[userData.id] = userData;
        }
        if (state.pendingUsername && userData.username === state.pendingUsername) {
            state.currentUser = userData;
            state.pendingUsername = undefined;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: userData.id, username: userData.username }));
            } catch {
              // ignore storage errors
            }
        }
      }
      state.messages.push(stored);
    },

    sendMessage: (state, action: PayloadAction<SendMessagePayload>) => {
      const optimisticId = action.payload.meta?.optimisticId || crypto.randomUUID();
      const stored: WebSocketStoredMessage = {
        kind: 'outgoing',
        ...action.payload,
        id: optimisticId,
        timestamp: Date.now(),
        optimistic: true,
      } as WebSocketStoredMessage;
      if (action.payload.type === 'user.register') {
        const payloadData = action.payload.data as { username: string };
        state.pendingUsername = payloadData.username;
      }
      state.messages.push(stored);
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    disconnect: (state) => {
      state.url = null;
      state.connectionStatus = 'disconnected';
      state.error = null;
      state.isReconnecting = false;
      state.reconnectAttempts = 0;
      state.pendingUsername = undefined; // keep user & userMap for persistence
    },

    startReconnecting: (state) => {
      state.isReconnecting = true;
      state.reconnectAttempts += 1;
    },

    stopReconnecting: (state) => {
      state.isReconnecting = false;
    },

    setCurrentUser: (state, action: PayloadAction<{ user: { id: number; username: string } }>) => {
      const u = { type: 'user', ...action.payload.user } as User;
      state.currentUser = u;
      if (!state.userMap) state.userMap = {};
      state.userMap[u.id] = u;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: u.id, username: u.username }));
      } catch {
        // ignore storage errors
      }
    },
  },
});

export const {
  connect,
  connected,
  disconnected,
  connectionError,
  incomingMessageReceived,
  sendMessage,
  clearMessages,
  disconnect,
  startReconnecting,
  stopReconnecting,
  setCurrentUser,
} = websocketSlice.actions;

export default websocketSlice.reducer;
