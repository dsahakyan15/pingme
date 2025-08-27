import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  SendMessagePayload,
  WebSocketStoredMessage,
  IncomingEnvelope,
} from '../../types/WebSocketTypes';
import type { User } from '../../types/types';

export interface ChatState {
  messages: {
    byId: Record<string, WebSocketStoredMessage>;
    allIds: string[];
  };
  currentUser: User | null;
  pendingUsername?: string;
  userMap: Record<number, User>;
}

const initialState: ChatState = {
  messages: {
    byId: {},
    allIds: [],
  },
  currentUser: null,
  pendingUsername: undefined,
  userMap: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    incomingMessageReceived: {
        reducer: (state, action: PayloadAction<WebSocketStoredMessage>) => {
            const message = action.payload;
            if (!state.messages.byId[message.id]) {
                state.messages.byId[message.id] = message;
                state.messages.allIds.push(message.id);
            }

            if (action.payload.type === 'user') {
                const userData = (action.payload as IncomingEnvelope<User>).data;
                if (userData && typeof userData.id === 'number') {
                    state.userMap[userData.id] = userData;
                }
                if (state.pendingUsername && userData.username === state.pendingUsername) {
                    state.currentUser = userData;
                    state.pendingUsername = undefined;
                }
            }
        },
        prepare: (payload: IncomingEnvelope) => {
            const stored: WebSocketStoredMessage = {
                kind: 'incoming',
                ...payload,
                id: payload.id || crypto.randomUUID(),
                timestamp: payload.timestamp || Date.now(),
            };
            return { payload: stored };
        }
    },

    sendMessage: {
      reducer: (state, action: PayloadAction<WebSocketStoredMessage>) => {
        const message = action.payload;
        if (!state.messages.byId[message.id]) {
            state.messages.byId[message.id] = message;
            state.messages.allIds.push(message.id);
        }

        if (action.payload.type === 'user.register') {
            const payloadData = action.payload.data as { username: string };
            state.pendingUsername = payloadData.username;
        }
      },
      prepare: (payload: SendMessagePayload) => {
        const optimisticId = payload.meta?.optimisticId || crypto.randomUUID();
        const stored: WebSocketStoredMessage = {
            kind: 'outgoing',
            ...payload,
            id: optimisticId,
            timestamp: Date.now(),
            optimistic: true,
        } as WebSocketStoredMessage;
        return { payload: stored };
      },
    },

    clearMessages: (state) => {
      state.messages.byId = {};
      state.messages.allIds = [];
    },

    setCurrentUser: (state, action: PayloadAction<{ user: { id: number; username: string } }>) => {
      const u = { type: 'user', ...action.payload.user } as User;
      state.currentUser = u;
      state.userMap[u.id] = u;
    },
  },
});

export const {
  incomingMessageReceived,
  sendMessage,
  clearMessages,
  setCurrentUser,
} = chatSlice.actions;

export default chatSlice.reducer;
