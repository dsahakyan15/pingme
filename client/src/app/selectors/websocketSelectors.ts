import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { WebSocketStoredMessage, IncomingEnvelope } from '../../types/WebSocketTypes';
import type { Message } from '../../types/types';
import type { WebSocketState } from '../../types/WebSocketTypes';

export const selectWebSocketState = (state: RootState) => state.websocket as WebSocketState;

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
    messages.filter((m: WebSocketStoredMessage) => m.kind === 'incoming' && (m as IncomingEnvelope).type === messageType)
);

// Domain chat messages (incoming only type==='message')
export const selectChatMessages = createSelector(
  [selectWebSocketMessages],
  (messages) => messages
    .filter((m): m is WebSocketStoredMessage & IncomingEnvelope<Message> => m.kind === 'incoming' && (m as IncomingEnvelope).type === 'message')
    .map((m) => (m as unknown as IncomingEnvelope<Message>).data)
);

export const selectCurrentUser = createSelector(
  [selectWebSocketState],
  (ws) => ws.currentUser
);

export const selectUsersMap = createSelector([
  selectWebSocketState,
], (ws: WebSocketState) => ws.userMap ?? {});

export const makeSelectUsernameById = () => createSelector([
  selectUsersMap,
  (_: RootState, userId: number | undefined) => userId,
], (map, userId) => (userId != null ? map[userId]?.username : undefined));

export const selectUsernameById = (state: RootState, userId: number | undefined) => {
  if (userId == null) return undefined;
  const ws: WebSocketState = selectWebSocketState(state);
  return ws.userMap?.[userId]?.username;
};
