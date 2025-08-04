# WebSocket RTK Implementation

Реализация WebSocket функционала с использованием Redux Toolkit (RTK) для замены хука
`useWebSocket`.

## Структура файлов

```
src/
├── app/
│   ├── slices/
│   │   └── websocketSlice.ts          # RTK slice для WebSocket состояния
│   ├── middleware/
│   │   └── websocketMiddleware.ts     # Middleware для обработки WebSocket соединений
│   ├── selectors/
│   │   └── websocketSelectors.ts      # Селекторы для доступа к WebSocket состоянию
│   └── store.ts                       # Конфигурация Redux store
├── hooks/
│   └── useWebSocketRTK.ts            # Хук для использования WebSocket RTK
├── types/
│   └── WebSocketTypes.ts             # TypeScript типы
└── components/
    └── WebSocketDemo.tsx             # Демо компонент
```

## Основные возможности

### 1. WebSocket Slice (`websocketSlice.ts`)

- Управление состоянием соединения
- Хранение сообщений
- Обработка ошибок
- Автоматическое переподключение

### 2. WebSocket Middleware (`websocketMiddleware.ts`)

- Создание и управление WebSocket соединениями
- Обработка событий WebSocket (open, close, message, error)
- Автоматическое переподключение при обрыве соединения
- Отправка сообщений через WebSocket

### 3. Селекторы (`websocketSelectors.ts`)

- Оптимизированный доступ к состоянию
- Мемоизация для производительности
- Фильтрация сообщений по типу

### 4. Хук `useWebSocketRTK`

- Простой интерфейс для использования WebSocket
- Типизированные методы
- Реактивное обновление состояния

## Использование

### Базовое подключение

```typescript
import { useWebSocketRTK } from '../hooks/useWebSocketRTK';

const MyComponent = () => {
  const { isConnected, messages, error, connect, disconnect, sendMessage } = useWebSocketRTK();

  const handleConnect = () => {
    connect('ws://localhost:8080');
  };

  const handleSendMessage = () => {
    sendMessage('chat', { text: 'Hello World!' });
  };

  return (
    <div>
      <button onClick={handleConnect} disabled={isConnected}>
        Connect
      </button>
      <button onClick={handleSendMessage} disabled={!isConnected}>
        Send Message
      </button>
      <button onClick={disconnect} disabled={!isConnected}>
        Disconnect
      </button>

      {messages.map((message) => (
        <div key={message.id}>
          {message.type}: {JSON.stringify(message.data)}
        </div>
      ))}
    </div>
  );
};
```

### Продвинутое использование с селекторами

```typescript
import { useSelector } from 'react-redux';
import { selectMessagesByType } from '../app/selectors/websocketSelectors';

const ChatComponent = () => {
  const chatMessages = useSelector((state) => selectMessagesByType(state, 'chat'));

  return (
    <div>
      {chatMessages.map((message) => (
        <div key={message.id}>{message.data.text}</div>
      ))}
    </div>
  );
};
```

## API Reference

### useWebSocketRTK()

Возвращает объект с следующими свойствами и методами:

#### Состояние

- `connectionStatus`: `'connecting' | 'connected' | 'disconnected' | 'error'`
- `isConnected`: `boolean`
- `isConnecting`: `boolean`
- `messages`: `WebSocketMessage[]`
- `error`: `string | null`
- `isReconnecting`: `boolean`
- `reconnectAttempts`: `number`
- `latestMessage`: `WebSocketMessage | null`

#### Методы

- `connect(url: string, protocols?: string | string[])`: Подключение к WebSocket
- `disconnect()`: Отключение от WebSocket
- `sendMessage(type: string, data: unknown)`: Отправка сообщения
- `clearMessages()`: Очистка истории сообщений

## Типы

### WebSocketMessage

```typescript
interface WebSocketMessage {
  id?: string;
  type: string;
  data: any;
  timestamp?: number;
}
```

### WebSocketState

```typescript
interface WebSocketState {
  connectionStatus: WebSocketConnectionStatus;
  messages: WebSocketMessage[];
  url: string | null;
  error: string | null;
  isReconnecting: boolean;
  reconnectAttempts: number;
}
```

## Преимущества RTK подхода

1. **Централизованное состояние**: Все WebSocket состояние в одном месте
2. **Переиспользование**: Легко использовать в разных компонентах
3. **Тестирование**: Простое тестирование логики через действия и селекторы
4. **DevTools**: Полная интеграция с Redux DevTools
5. **TypeScript**: Полная типизация
6. **Производительность**: Мемоизация селекторов
7. **Автоматическое переподключение**: Встроенная логика переподключения

## Миграция с useWebSocket

Для миграции с старого хука `useWebSocket`:

1. Замените импорт:

```typescript
// Было
import { useWebSocket } from '../hooks/useWebSocket';

// Стало
import { useWebSocketRTK } from '../hooks/useWebSocketRTK';
```

2. Обновите вызов хука:

```typescript
// Было
const { isConnected, messages, sendMessage } = useWebSocket(url);

// Стало
const { isConnected, messages, sendMessage, connect } = useWebSocketRTK();
connect(url);
```

## Конфигурация

### Настройка переподключения

В `websocketMiddleware.ts` можно настроить параметры переподключения:

```typescript
const MAX_RECONNECT_ATTEMPTS = 5; // Максимальное количество попыток
const RECONNECT_DELAY = 3000; // Задержка между попытками (мс)
```

### Настройка сериализации

В `store.ts` можно настроить проверку сериализации:

```typescript
serializableCheck: {
  ignoredActions: ['websocket/sendMessage'], // Игнорировать эти действия
}
```
