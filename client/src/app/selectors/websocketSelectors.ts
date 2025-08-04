import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { WebSocketMessage } from '../../types/WebSocketTypes';

export const selectWebSocketState = (state: RootState) => state.websocket;

export const selectConnectionStatus = createSelector(
  [selectWebSocketState],
  (websocket) => websocket.connectionStatus
);

export const selectIsConnected = createSelector(
  [selectConnectionStatus],
  (status) => status === 'connected'
);

export const selectIsConnecting = createSelector(
  [selectConnectionStatus],
  (status) => status === 'connecting'
);

export const selectWebSocketMessages = createSelector(
  [selectWebSocketState],
  (websocket) => websocket.messages
);

export const selectWebSocketError = createSelector(
  [selectWebSocketState],
  (websocket) => websocket.error
);

export const selectIsReconnecting = createSelector(
  [selectWebSocketState],
  (websocket) => websocket.isReconnecting
);

export const selectReconnectAttempts = createSelector(
  [selectWebSocketState],
  (websocket) => websocket.reconnectAttempts
);

export const selectLatestMessage = createSelector(
  [selectWebSocketMessages],
  (messages) => messages[messages.length - 1] || null
);

export const selectMessagesByType = createSelector(
  [selectWebSocketMessages, (_: RootState, messageType: string) => messageType],
  (messages, messageType) =>
    messages.filter((message: WebSocketMessage) => message.type === messageType)
);
