import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  WebSocketState,
  ConnectPayload,
  SendMessagePayload,
  WebSocketStoredMessage,
  IncomingEnvelope,
} from '../../types/WebSocketTypes';
import type { User } from '../../types/types';
import type {
  AnyConversation,
  GroupConversation,
  PrivateConversation,
} from '../../types/ConversationTypes';
import type { Message } from '../../types/types';

const initialState: WebSocketState = {
  connectionStatus: 'disconnected',
  messages: [],
  url: null,
  error: null,
  isReconnecting: false,
  reconnectAttempts: 0,
  currentUser: null,
  isRegistered: false,
  pendingUsername: undefined,
  userMap: {},
  isLoadingHistory: false,
  conversations: {},
  activeConversationId: null,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<ConnectPayload>) => {
      state.url = action.payload.url;
      state.connectionStatus = 'connecting';
      state.error = null;
      state.isReconnecting = false;
    },

    connected: (state) => {
      state.connectionStatus = 'connected';
      state.error = null;
      state.isReconnecting = false;
      state.reconnectAttempts = 0;

      // Автоматически инициализируем групповой чат при подключении
      if (!state.conversations[1]) {
        const groupConv: GroupConversation = {
          id: 1,
          type: 'group',
          name: 'Общий чат',
          participants: [],
          description: 'Общий групповой чат для всех пользователей',
        };
        state.conversations[1] = groupConv;
      }

      // Устанавливаем групповой чат как активный по умолчанию
      if (!state.activeConversationId) {
        state.activeConversationId = 1;
      }
    },

    requestHistory: (state) => {
      // Действие для запроса истории сообщений

      state.isLoadingHistory = true;
    },

    historyReceived: (
      state,
      action: PayloadAction<{ messages: WebSocketStoredMessage[]; users: User[] }>
    ) => {
      const { messages, users } = action.payload;

      // Создаем Set существующих ID сообщений для быстрого поиска
      const existingMessageIds = new Set(
        state.messages.map((msg) => {
          // Для исторических сообщений используем message_id из data
          if (msg.kind === 'incoming' && msg.type === 'message') {
            const messageData = (msg as IncomingEnvelope<Message>).data;
            return `msg-${messageData.message_id}`;
          }
          return msg.id;
        })
      );

      // Фильтруем новые сообщения, исключая дубликаты
      const newMessages = messages.filter((msg) => !existingMessageIds.has(msg.id));

      // Добавляем только новые сообщения в начало списка (так как это история)
      state.messages = [...newMessages, ...state.messages];

      // Обновляем карту пользователей
      if (!state.userMap) state.userMap = {};
      users.forEach((user) => {
        state.userMap![user.id] = user;
      });

      // Завершаем загрузку истории
      state.isLoadingHistory = false;
    },

    disconnected: (state) => {
      state.connectionStatus = 'disconnected';
      state.isLoadingHistory = false; // Сбрасываем состояние загрузки при отключении
    },

    connectionError: (state, action: PayloadAction<string>) => {
      state.connectionStatus = 'error';
      state.error = action.payload;
      state.isReconnecting = false;
      state.isLoadingHistory = false; // Сбрасываем состояние загрузки при ошибке
    },

    incomingMessageReceived: (state, action: PayloadAction<IncomingEnvelope>) => {
      const stored: WebSocketStoredMessage = {
        kind: 'incoming',
        ...action.payload,
        id: action.payload.id || crypto.randomUUID(),
        timestamp: action.payload.timestamp || Date.now(),
      };

      if (stored.type === 'user') {
        const userData = (stored as IncomingEnvelope<User>).data;
        if (userData && typeof userData.id === 'number') {
          if (!state.userMap) state.userMap = {};
          state.userMap[userData.id] = userData;

          // Добавляем пользователя в групповой чат
          if (
            state.conversations[1] &&
            !state.conversations[1].participants.includes(userData.id)
          ) {
            state.conversations[1].participants.push(userData.id);
          }
        }
        if (state.pendingUsername && userData.username === state.pendingUsername) {
          state.currentUser = userData;
          state.isRegistered = true;
          state.pendingUsername = undefined;
        }
      }

      if (stored.type === 'conversation.created') {
        const convData = (
          stored as IncomingEnvelope<import('../../types/types').ConversationCreatedPayload>
        ).data;
        if (convData && convData.conversation_id && convData.is_direct_message) {
          // Создаем приватную конверсацию
          const otherUserId = convData.participants.find(
            (id: number) => id !== state.currentUser?.id
          );
          if (otherUserId && state.userMap && state.userMap[otherUserId]) {
            const otherUser = state.userMap[otherUserId];
            const newConversation: PrivateConversation = {
              id: convData.conversation_id,
              type: 'private',
              name: otherUser.username,
              participants: convData.participants,
              otherUserId,
            };
            state.conversations[convData.conversation_id] = newConversation;
          }
        }
      }

      // Update conversation with last message
      if (stored.type === 'message') {
        const messageData = (stored as IncomingEnvelope<Message>).data;
        const conversationId = messageData.conversation_id;

        if (state.conversations[conversationId]) {
          state.conversations[conversationId].lastMessage = {
            text: messageData.text,
            timestamp: messageData.sent_at,
            senderId: messageData.sender_id,
          };
        }

        // Проверяем на дублирование перед добавлением сообщения
        const messageId = `msg-${messageData.message_id}`;
        const exists = state.messages.some((msg) => {
          if (msg.kind === 'incoming' && msg.type === 'message') {
            const existingMessageData = (msg as IncomingEnvelope<Message>).data;
            return existingMessageData.message_id === messageData.message_id;
          }
          return msg.id === messageId;
        });

        if (!exists) {
          state.messages.push(stored);
        }
      } else {
        state.messages.push(stored);
      }
    },

    sendMessage: (state, action: PayloadAction<SendMessagePayload>) => {
      const optimisticId = action.payload.meta?.optimisticId || crypto.randomUUID();
      const stored: WebSocketStoredMessage = {
        kind: 'outgoing',
        ...action.payload,
        id: optimisticId,
        timestamp: Date.now(),
        optimistic: true,
      } as WebSocketStoredMessage;

      if (action.payload.type === 'user.register') {
        const payloadData = action.payload.data as { username: string };
        state.pendingUsername = payloadData.username;
      }

      // Проверяем на дублирование перед добавлением оптимистичного сообщения
      const exists = state.messages.some((msg) => msg.id === optimisticId);
      if (!exists) {
        state.messages.push(stored);
      }
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    disconnect: (state) => {
      state.url = null;
      state.connectionStatus = 'disconnected';
      state.error = null;
      state.isReconnecting = false;
      state.reconnectAttempts = 0;
      state.isLoadingHistory = false; // Сбрасываем состояние загрузки при разъединении
      state.pendingUsername = undefined; // keep user & userMap for persistence
    },

    startReconnecting: (state) => {
      state.isReconnecting = true;
      state.reconnectAttempts += 1;
    },

    stopReconnecting: (state) => {
      state.isReconnecting = false;
    },

    // setCurrentUser: (state, action: PayloadAction<{ user: { id: number; username: string } }>) => {
    //   const u = { type: 'user', ...action.payload.user } as User;
    //   state.currentUser = u;
    //   state.isRegistered = true;
    //   if (!state.userMap) state.userMap = {};
    //   state.userMap[u.id] = u;
    // },

    // Conversation actions
    setActiveConversation: (state, action: PayloadAction<number>) => {
      state.activeConversationId = action.payload;
    },

    addConversation: (state, action: PayloadAction<AnyConversation>) => {
      state.conversations[action.payload.id] = action.payload;
    },

    createPrivateConversation: (
      state,
      action: PayloadAction<{ otherUserId: number; otherUser: User }>
    ) => {
      const { otherUserId } = action.payload;
      if (!state.currentUser) return;

      // Check if conversation already exists
      const existingConv = Object.values(state.conversations).find(
        (conv) =>
          conv.type === 'private' &&
          conv.participants.includes(otherUserId) &&
          conv.participants.includes(state.currentUser!.id)
      );

      if (existingConv) {
        state.activeConversationId = existingConv.id;
        return;
      }

      // Отправляем запрос на создание приватного чата на сервер
      // Сервер создаст conversation_id и отправит обратно
    },

    requestPrivateConversation: {
      reducer: () => {
        // Это действие будет обработано middleware для отправки запроса на сервер
      },
      prepare: (otherUserId: number) => ({
        payload: { otherUserId },
      }),
    },

    initializeGroupConversation: (state, action: PayloadAction<{ conversationId: number }>) => {
      const { conversationId } = action.payload;

      // Create default group conversation if it doesn't exist
      if (!state.conversations[conversationId]) {
        const groupConv: GroupConversation = {
          id: conversationId,
          type: 'group',
          name: 'Общий чат',
          participants: [],
          description: 'Общий групповой чат для всех пользователей',
        };
        state.conversations[conversationId] = groupConv;
      }

      // Set as active if no other conversation is active
      if (!state.activeConversationId) {
        state.activeConversationId = conversationId;
      }
    },
  },
});

export const {
  connect,
  connected,
  disconnected,
  connectionError,
  requestHistory,
  historyReceived,
  incomingMessageReceived,
  sendMessage,
  clearMessages,
  disconnect,
  startReconnecting,
  stopReconnecting,
  setActiveConversation,
  addConversation,
  createPrivateConversation,
  requestPrivateConversation,
  initializeGroupConversation,
} = websocketSlice.actions;

export default websocketSlice.reducer;
