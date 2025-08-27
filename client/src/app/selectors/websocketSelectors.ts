import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { WebSocketStoredMessage, IncomingEnvelope } from '../../types/WebSocketTypes';
import type { Message } from '../../types/types';
import type { ConnectionState } from '../slices/connectionSlice';
import type { ChatState } from '../slices/chatSlice';

// Base selectors
export const selectConnectionState = (state: RootState) => state.connection as ConnectionState;
export const selectChatState = (state: RootState) => state.chat as ChatState;

// Connection selectors
export const selectConnectionStatus = createSelector(
  [selectConnectionState],
  (connection) => connection.connectionStatus
);

export const selectIsConnected = createSelector(
  [selectConnectionStatus],
  (status) => status === 'connected'
);

export const selectIsConnecting = createSelector(
  [selectConnectionStatus],
  (status) => status === 'connecting'
);

export const selectWebSocketError = createSelector(
  [selectConnectionState],
  (connection) => connection.error
);

export const selectIsReconnecting = createSelector(
  [selectConnectionState],
  (connection) => connection.isReconnecting
);

export const selectReconnectAttempts = createSelector(
  [selectConnectionState],
  (connection) => connection.reconnectAttempts
);

// Chat selectors
export const selectMessagesById = createSelector(
    [selectChatState],
    (chat) => chat.messages.byId
);

export const selectAllMessageIds = createSelector(
    [selectChatState],
    (chat) => chat.messages.allIds
);

export const selectWebSocketMessages = createSelector(
  [selectAllMessageIds, selectMessagesById],
  (allIds, byId) => allIds.map(id => byId[id])
);

export const selectLatestMessage = createSelector(
  [selectAllMessageIds, selectMessagesById],
  (allIds, byId) => {
    const lastId = allIds[allIds.length - 1];
    return lastId ? byId[lastId] : null;
  }
);

export const selectMessagesByType = createSelector(
  [selectWebSocketMessages, (_: RootState, messageType: string) => messageType],
  (messages, messageType) =>
    messages.filter((m: WebSocketStoredMessage) => m.kind === 'incoming' && (m as IncomingEnvelope).type === messageType)
);

export const selectChatMessages = createSelector(
  [selectWebSocketMessages],
  (messages) => messages
    .filter((m): m is WebSocketStoredMessage & IncomingEnvelope<Message> => m.kind === 'incoming' && (m as IncomingEnvelope).type === 'message')
    .map((m) => (m as unknown as IncomingEnvelope<Message>).data)
);

export const selectCurrentUser = createSelector(
  [selectChatState],
  (chat) => chat.currentUser
);

export const selectUsersMap = createSelector(
    [selectChatState],
    (chat) => chat.userMap ?? {}
);

export const makeSelectUsernameById = () => createSelector(
  [selectUsersMap, (_: RootState, userId: number | undefined) => userId],
  (map, userId) => (userId != null ? map[userId]?.username : undefined)
);

export const selectUsernameById = (state: RootState, userId: number | undefined) => {
  if (userId == null) return undefined;
  const chatState: ChatState = selectChatState(state);
  return chatState.userMap?.[userId]?.username;
};
