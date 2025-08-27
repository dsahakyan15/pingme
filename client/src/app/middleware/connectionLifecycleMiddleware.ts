import type { Middleware } from '@reduxjs/toolkit';
import { connect, connected, disconnected, connectionError, startReconnecting, stopReconnecting, disconnect } from '../slices/connectionSlice';
import type { RootState } from '../store';
import type { IWebSocketClient } from '../infrastructure/websocketClient';

let reconnectTimeout: number | null = null;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

export const createConnectionLifecycleMiddleware = (client: IWebSocketClient): Middleware<object, RootState> => {
  return (store) => {
    client
      .on('open', () => {
        store.dispatch(connected());
      })
      .on('close', (event) => {
        store.dispatch(disconnected());

        const state = store.getState().connection;
        if (!event.wasClean && state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS && state.url) {
          store.dispatch(startReconnecting());
          reconnectTimeout = setTimeout(() => {
              const latestState = store.getState().connection;
              if(latestState.url) {
                  store.dispatch(connect({ url: latestState.url }));
              }
          }, RECONNECT_DELAY);
        }
      })
      .on('error', () => {
        store.dispatch(connectionError('WebSocket connection failed'));
      });

    return (next) => (action) => {
      const result = next(action);

      if (connect.match(action)) {
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
        const { url, protocols } = action.payload;
        client.connect(url, protocols);
      }

      if (disconnect.match(action)) {
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
        client.disconnect();
        store.dispatch(stopReconnecting());
      }

      return result;
    };
  };
};
