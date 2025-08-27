import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type WebSocketConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ConnectionState {
  connectionStatus: WebSocketConnectionStatus;
  url: string | null;
  error: string | null;
  isReconnecting: boolean;
  reconnectAttempts: number;
}

const initialState: ConnectionState = {
  connectionStatus: 'disconnected',
  url: null,
  error: null,
  isReconnecting: false,
  reconnectAttempts: 0,
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<{ url: string, protocols?: string | string[] }>) => {
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
      // Don't reset URL on temporary disconnection
      state.connectionStatus = 'disconnected';
    },
    connectionError: (state, action: PayloadAction<string>) => {
      state.connectionStatus = 'error';
      state.error = action.payload;
      state.isReconnecting = false;
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
  disconnect,
  startReconnecting,
  stopReconnecting,
} = connectionSlice.actions;

export default connectionSlice.reducer;
