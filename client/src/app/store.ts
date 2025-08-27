import { configureStore } from '@reduxjs/toolkit';
import connectionReducer from './slices/connectionSlice';
import chatReducer from './slices/chatSlice';
import { WebSocketClient } from './infrastructure/websocketClient';
import { createConnectionLifecycleMiddleware } from './middleware/connectionLifecycleMiddleware';
import { createMessagingMiddleware } from './middleware/messagingMiddleware';

// Создаем store без middleware для получения типов
const rootReducer = {
  connection: connectionReducer,
  chat: chatReducer,
};

const tempStore = configureStore({ reducer: rootReducer });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof tempStore.getState>;

const client = new WebSocketClient();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/sendMessage', 'chat/incomingMessageReceived'],
      },
    }).concat(
      createConnectionLifecycleMiddleware(client),
      createMessagingMiddleware(client)
    ),
});

export type AppDispatch = typeof store.dispatch;

export { store };
