import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect, disconnect, sendMessage, clearMessages } from '../app/slices/websocketSlice';
import {
  selectConnectionStatus,
  selectIsConnected,
  selectIsConnecting,
  selectWebSocketMessages,
  selectWebSocketError,
  selectIsReconnecting,
  selectReconnectAttempts,
  selectLatestMessage,
} from '../app/selectors/websocketSelectors';
import type { ConnectPayload, SendMessagePayload } from '../types/WebSocketTypes';

export const useWebSocketRTK = () => {
  const dispatch = useDispatch();

  const connectionStatus = useSelector(selectConnectionStatus);
  const isConnected = useSelector(selectIsConnected);
  const isConnecting = useSelector(selectIsConnecting);
  const messages = useSelector(selectWebSocketMessages);
  const error = useSelector(selectWebSocketError);
  const isReconnecting = useSelector(selectIsReconnecting);
  const reconnectAttempts = useSelector(selectReconnectAttempts);
  const latestMessage = useSelector(selectLatestMessage);

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
    (type: string, data: unknown) => {
      const payload: SendMessagePayload = { type, data };
      dispatch(sendMessage(payload));
    },
    [dispatch]
  );

  const handleClearMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  return {
    connectionStatus,
    isConnected,
    isConnecting,
    messages,
    error,
    isReconnecting,
    reconnectAttempts,
    latestMessage,
    connect: handleConnect,
    disconnect: handleDisconnect,
    sendMessage: handleSendMessage,
    clearMessages: handleClearMessages,
  };
};
