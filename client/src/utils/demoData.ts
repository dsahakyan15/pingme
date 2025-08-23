import type {
  AnyConversation,
  GroupConversation,
  PrivateConversation,
} from '../types/ConversationTypes';
import type { User, Message } from '../types/types';

export const demoUsers: User[] = [
  { type: 'user', id: 1, username: 'Narek' },
  { type: 'user', id: 2, username: 'Alice' },
  { type: 'user', id: 3, username: 'Bob' },
  { type: 'user', id: 4, username: 'Carol' },
  { type: 'user', id: 5, username: 'David' },
];

export const demoConversations: AnyConversation[] = [
  // Group conversation
  {
    id: 1,
    type: 'group',
    name: 'Общий чат',
    participants: [1, 2, 3, 4, 5],
    description: 'Общий групповой чат для всех пользователей',
    lastMessage: {
      text: 'Привет всем! Как дела?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 минут назад
      senderId: 2,
    },
    unreadCount: 3,
  } as GroupConversation,

  // Private conversations
  {
    id: 2,
    type: 'private',
    name: 'Alice',
    participants: [1, 2],
    otherUserId: 2,
    lastMessage: {
      text: 'Увидимся завтра!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 минут назад
      senderId: 2,
    },
    unreadCount: 1,
  } as PrivateConversation,

  {
    id: 3,
    type: 'private',
    name: 'Bob',
    participants: [1, 3],
    otherUserId: 3,
    lastMessage: {
      text: 'Спасибо за помощь с проектом!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 часа назад
      senderId: 1,
    },
  } as PrivateConversation,

  {
    id: 4,
    type: 'private',
    name: 'Carol',
    participants: [1, 4],
    otherUserId: 4,
    lastMessage: {
      text: 'Отлично! До встречи.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 день назад
      senderId: 4,
    },
  } as PrivateConversation,
];

export const demoMessages: Message[] = [
  // Group chat messages
  {
    type: 'message',
    message_id: 1,
    conversation_id: 1,
    sender_id: 2,
    text: 'Привет всем!',
    sent_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    type: 'message',
    message_id: 2,
    conversation_id: 1,
    sender_id: 3,
    text: 'Привет Alice! Как дела?',
    sent_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    type: 'message',
    message_id: 3,
    conversation_id: 1,
    sender_id: 2,
    text: 'Всё отлично! Работаю над новым проектом.',
    sent_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },

  // Private messages with Alice
  {
    type: 'message',
    message_id: 4,
    conversation_id: 2,
    sender_id: 1,
    text: 'Привет Alice! Как дела с презентацией?',
    sent_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    type: 'message',
    message_id: 5,
    conversation_id: 2,
    sender_id: 2,
    text: 'Привет! Почти готово, завтра покажу.',
    sent_at: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
  },
  {
    type: 'message',
    message_id: 6,
    conversation_id: 2,
    sender_id: 2,
    text: 'Увидимся завтра!',
    sent_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },

  // Private messages with Bob
  {
    type: 'message',
    message_id: 7,
    conversation_id: 3,
    sender_id: 3,
    text: 'Можешь помочь с багом в коде?',
    sent_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    type: 'message',
    message_id: 8,
    conversation_id: 3,
    sender_id: 1,
    text: 'Конечно! Давай посмотрим.',
    sent_at: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
  },
  {
    type: 'message',
    message_id: 9,
    conversation_id: 3,
    sender_id: 1,
    text: 'Спасибо за помощь с проектом!',
    sent_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];
