import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  connect,
  disconnect,
  sendMessage,
  clearMessages,
  requestHistory,
  setActiveConversation,
  createPrivateConversation,
  initializeGroupConversation,
  loadDemoData,
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
  const dispatch = useDispatch();

  const connectionStatus = useSelector(selectConnectionStatus);
  const isConnected = useSelector(selectIsConnected);
  const isConnecting = useSelector(selectIsConnecting);
  const rawMessages = useSelector(selectWebSocketMessages);
  const chatMessages = useSelector(selectChatMessages);
  const usersMap = useSelector(selectUsersMap);
  const error = useSelector(selectWebSocketError);
  const isReconnecting = useSelector(selectIsReconnecting);
  const reconnectAttempts = useSelector(selectReconnectAttempts);
  const latestMessage = useSelector(selectLatestMessage);
  const currentUser = useSelector(selectCurrentUser);
  const currentUrl = useSelector((s: RootState) => s.websocket.url);
  const isLoadingHistory = useSelector(selectIsLoadingHistory);
  const conversations = useSelector(selectConversations);
  const activeConversationId = useSelector(selectActiveConversationId);
  const activeConversation = useSelector(selectActiveConversation);
  const conversationMessages = useSelector(selectConversationMessages);

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
      dispatch(createPrivateConversation({ otherUserId: otherUser.id, otherUser }));
    },
    [dispatch]
  );

  const handleInitializeGroupConversation = useCallback(
    (conversationId: number) => {
      dispatch(initializeGroupConversation({ conversationId }));
    },
    [dispatch]
  );

  const handleLoadDemoData = useCallback(
    (
      demoConversations: import('../types/ConversationTypes').AnyConversation[],
      demoUsers: import('../types/types').User[]
    ) => {
      dispatch(loadDemoData({ conversations: demoConversations, users: demoUsers }));
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
    loadDemoData: handleLoadDemoData,
    sendMessage: handleSendMessage,
    clearMessages: handleClearMessages,
  };
};
