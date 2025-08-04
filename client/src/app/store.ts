import { configureStore } from '@reduxjs/toolkit';
import websocketReducer from './slices/websocketSlice';
import { websocketMiddleware } from './middleware/websocketMiddleware';

// Создаем store без middleware для получения типов
const rootReducer = {
  websocket: websocketReducer,
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = {
  websocket: ReturnType<typeof websocketReducer>;
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['websocket/sendMessage'],
      },
    }).concat(websocketMiddleware),
});

export type AppDispatch = typeof store.dispatch;

export { store };
