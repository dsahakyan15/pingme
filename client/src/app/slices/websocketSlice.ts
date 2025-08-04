import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  WebSocketState,
  WebSocketMessage,
  ConnectPayload,
  SendMessagePayload,
} from '../../types/WebSocketTypes';

const initialState: WebSocketState = {
  connectionStatus: 'disconnected',
  messages: [],
  url: null,
  error: null,
  isReconnecting: false,
  reconnectAttempts: 0,
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

    messageReceived: (state, action: PayloadAction<WebSocketMessage>) => {
      const message: WebSocketMessage = {
        ...action.payload,
        id: action.payload.id || crypto.randomUUID(),
        timestamp: action.payload.timestamp || Date.now(),
      };
      state.messages.push(message);
    },

    sendMessage: (state, action: PayloadAction<SendMessagePayload>) => {
      // Обрабатывается в middleware
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
    },

    startReconnecting: (state) => {
      state.isReconnecting = true;
      state.reconnectAttempts += 1;
    },

    stopReconnecting: (state) => {
      state.isReconnecting = false;
    },
  },
});

export const {
  connect,
  connected,
  disconnected,
  connectionError,
  messageReceived,
  sendMessage,
  clearMessages,
  disconnect,
  startReconnecting,
  stopReconnecting,
} = websocketSlice.actions;

export default websocketSlice.reducer;
