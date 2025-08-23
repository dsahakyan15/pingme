import type { Middleware } from '@reduxjs/toolkit';
import {
  connect,
  connected,
  disconnected,
  connectionError,
  incomingMessageReceived,
  sendMessage,
  disconnect,
  startReconnecting,
  stopReconnecting,
  requestHistory,
  historyReceived,
  requestPrivateConversation,
} from '../slices/websocketSlice';
import type {
  SendMessagePayload,
  IncomingEnvelope,
  WebSocketStoredMessage,
} from '../../types/WebSocketTypes';
import type { RootState } from '../store';
import type { User } from '../../types/types';

interface HistoryMessage {
  message_id: number;
  conversation_id: number;
  sender_id: number;
  text?: string;
  message_text?: string;
  sent_at: string;
}

interface HistoryUser {
  user_id?: number;
  id?: number;
  username: string;
}

let websocket: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

export const websocketMiddleware: Middleware<object, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState().websocket;

  if (connect.match(action)) {
    // Закрываем существующее соединение
    if (websocket) {
      websocket.close();
      websocket = null;
    }

    // Очищаем таймер переподключения
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    const { url, protocols } = action.payload;

    try {
      websocket = new WebSocket(url, protocols);

      websocket.onopen = () => {
        store.dispatch(connected());
        // Автоматически запрашиваем историю сообщений при подключении
        store.dispatch(requestHistory());
      };

      websocket.onclose = (event) => {
        store.dispatch(disconnected());
        websocket = null;

        // Автоматическое переподключение если соединение было неожиданно закрыто
        if (!event.wasClean && state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          store.dispatch(startReconnecting());
          reconnectTimeout = setTimeout(() => {
            store.dispatch(connect({ url, protocols }));
          }, RECONNECT_DELAY);
        }
      };

      websocket.onerror = () => {
        store.dispatch(connectionError('WebSocket connection failed'));
      };

      websocket.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);

          // Обрабатываем ответ с историей сообщений
          if (raw.type === 'history.response' && raw.data) {
            const { messages = [], users = [] } = raw.data;

            // Преобразуем сообщения в формат WebSocketStoredMessage
            const formattedMessages: WebSocketStoredMessage[] = messages.map(
              (msg: HistoryMessage) => ({
                kind: 'incoming' as const,
                type: 'message',
                data: {
                  type: 'message',
                  message_id: msg.message_id,
                  conversation_id: msg.conversation_id,
                  sender_id: msg.sender_id,
                  text: msg.text || msg.message_text,
                  sent_at: msg.sent_at,
                },
                id: `msg-${msg.message_id}`,
                timestamp: new Date(msg.sent_at).getTime(),
              })
            );

            // Преобразуем пользователей в правильный формат
            const formattedUsers: User[] = users.map((user: HistoryUser) => ({
              type: 'user',
              id: user.user_id || user.id!,
              username: user.username,
            }));

            store.dispatch(
              historyReceived({
                messages: formattedMessages,
                users: formattedUsers,
              })
            );
            return;
          }

          // Обычная обработка входящих сообщений
          const envelope: IncomingEnvelope = {
            type: raw.type,
            data: raw.data,
            id: raw.id,
            timestamp: raw.timestamp || Date.now(),
          };
          store.dispatch(incomingMessageReceived(envelope));
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          store.dispatch(connectionError('Failed to parse incoming message'));
        }
      };
    } catch (error) {
      store.dispatch(connectionError(`Failed to create WebSocket connection: ${error}`));
    }
  }

  if (sendMessage.match(action) && websocket?.readyState === WebSocket.OPEN) {
    try {
      const payload: SendMessagePayload = action.payload;
      const outgoing = {
        type: payload.type,
        data: payload.data,
        timestamp: Date.now(),
      };
      websocket.send(JSON.stringify(outgoing));
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      store.dispatch(connectionError('Failed to send message'));
    }
  }

  if (requestHistory.match(action) && websocket?.readyState === WebSocket.OPEN) {
    try {
      // Отправляем запрос на получение истории сообщений
      const historyRequest = {
        type: 'history.request',
        data: {},
        timestamp: Date.now(),
      };
      websocket.send(JSON.stringify(historyRequest));
    } catch (error) {
      console.error('Failed to request message history:', error);
      store.dispatch(connectionError('Failed to request message history'));
    }
  }

  if (requestPrivateConversation.match(action) && websocket?.readyState === WebSocket.OPEN) {
    try {
      const otherUserId = action.payload.otherUserId;
      const currentUserId = state.currentUser?.id;

      if (!currentUserId) {
        console.error('Cannot create private conversation: no current user');
        return result;
      }

      // Отправляем запрос на создание приватного чата
      const conversationRequest = {
        type: 'conversation.create',
        data: {
          user1_id: currentUserId,
          user2_id: otherUserId,
        },
        timestamp: Date.now(),
      };
      websocket.send(JSON.stringify(conversationRequest));
    } catch (error) {
      console.error('Failed to request private conversation:', error);
      store.dispatch(connectionError('Failed to create private conversation'));
    }
  }

  if (disconnect.match(action)) {
    if (websocket) {
      websocket.close(1000, 'Client disconnected');
      websocket = null;
    }

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    store.dispatch(stopReconnecting());
  }

  return result;
};
