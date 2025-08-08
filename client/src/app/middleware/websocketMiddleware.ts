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
} from '../slices/websocketSlice';
import type { SendMessagePayload, IncomingEnvelope } from '../../types/WebSocketTypes';
import type { RootState } from '../store';

let websocket: WebSocket | null = null;
let reconnectTimeout: number | null = null;
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
