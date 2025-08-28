import { useCallback } from 'react';
import { useAppDispatch , useAppSelector } from '@/app/hooks';
import {
  connect,
  disconnect,
  sendMessage,
  clearMessages,
  requestHistory,
  setActiveConversation,
  createPrivateConversation,
  requestPrivateConversation,
  initializeGroupConversation,
} from '../app/slices/websocketSlice';
import {
  selectConnectionStatus,
  selectIsConnected,
  selectIsConnecting,
  selectWebSocketMessages,
  selectWebSocketError,
  selectIsReconnecting,
  selectReconnectAttempts,
  selectLatestMessage,
  selectChatMessages,
  selectCurrentUser,
  selectUsersMap,
  selectIsLoadingHistory,
  selectConversations,
  selectActiveConversationId,
  selectActiveConversation,
  selectConversationMessages,
} from '../app/selectors/websocketSelectors';
import type { ConnectPayload, SendMessagePayload } from '../types/WebSocketTypes';
import type { OutgoingEventType, EventPayloadMap } from '../types/types';
import type { RootState } from '../app/store';

export const useWebSocketRTK = () => {
  const dispatch = useAppDispatch();

  const connectionStatus = useAppSelector(selectConnectionStatus);
  const isConnected = useAppSelector(selectIsConnected);
  const isConnecting = useAppSelector(selectIsConnecting);
  const rawMessages = useAppSelector(selectWebSocketMessages);
  const chatMessages = useAppSelector(selectChatMessages);
  const usersMap = useAppSelector(selectUsersMap);
  const error = useAppSelector(selectWebSocketError);
  const isReconnecting = useAppSelector(selectIsReconnecting);
  const reconnectAttempts = useAppSelector(selectReconnectAttempts);
  const latestMessage = useAppSelector(selectLatestMessage);
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUrl = useAppSelector((s: RootState) => s.websocket.url);
  const isLoadingHistory = useAppSelector(selectIsLoadingHistory);
  const conversations = useAppSelector(selectConversations);
  const activeConversationId = useAppSelector(selectActiveConversationId);
  const activeConversation = useAppSelector(selectActiveConversation);
  const conversationMessages = useAppSelector(selectConversationMessages);

  const handleConnect = useCallback(
    (url: string, protocols?: string | string[]) => {
      const payload: ConnectPayload = { url, protocols };
      dispatch(connect(payload));
    },
    [dispatch]
  );

  const handleDisconnect = useCallback(() => {
    dispatch(disconnect());
  }, [dispatch]);

  const handleSendMessage = useCallback(
    <T extends OutgoingEventType>(
      type: T,
      data: EventPayloadMap[T],
      options?: { optimisticId?: string }
    ) => {
      const payload: SendMessagePayload<T> = {
        type,
        data,
        meta: { optimisticId: options?.optimisticId },
      };
      dispatch(sendMessage(payload));
    },
    [dispatch]
  );

  const handleClearMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const handleReconnect = useCallback(() => {
    if (!currentUrl) return;
    if (isConnecting) return;
    if (connectionStatus === 'connected') return;
    dispatch(connect({ url: currentUrl }));
  }, [currentUrl, isConnecting, connectionStatus, dispatch]);

  const handleRequestHistory = useCallback(() => {
    dispatch(requestHistory());
  }, [dispatch]);

  const handleSetActiveConversation = useCallback(
    (conversationId: number) => {
      dispatch(setActiveConversation(conversationId));
    },
    [dispatch]
  );

  const handleCreatePrivateConversation = useCallback(
    (otherUser: import('../types/types').User) => {
      // Сначала проверяем, существует ли уже чат
      dispatch(createPrivateConversation({ otherUserId: otherUser.id, otherUser }));

      // Если чат не найден, отправляем запрос на сервер
      const existingConv = Object.values(conversations).find(
        (conv) =>
          conv.type === 'private' &&
          conv.participants.includes(otherUser.id) &&
          conv.participants.includes(currentUser?.id || 0)
      );

      if (!existingConv) {
        dispatch(requestPrivateConversation(otherUser.id));
      }
    },
    [dispatch, conversations, currentUser]
  );

  const handleInitializeGroupConversation = useCallback(
    (conversationId: number) => {
      dispatch(initializeGroupConversation({ conversationId }));
    },
    [dispatch]
  );

  return {
    connectionStatus,
    isConnected,
    isConnecting,
    isLoadingHistory,
    messages: rawMessages,
    chatMessages,
    conversationMessages,
    conversations,
    activeConversationId,
    activeConversation,
    usersMap,
    error,
    isReconnecting,
    reconnectAttempts,
    latestMessage,
    currentUser,
    url: currentUrl,
    connect: handleConnect,
    disconnect: handleDisconnect,
    reconnect: handleReconnect,
    requestHistory: handleRequestHistory,
    setActiveConversation: handleSetActiveConversation,
    createPrivateConversation: handleCreatePrivateConversation,
    initializeGroupConversation: handleInitializeGroupConversation,
    sendMessage: handleSendMessage,
    clearMessages: handleClearMessages,
  };
};
