// === Incoming (Server) ===

export interface Message {
  type: 'message';
  message_id: number;
  conversation_id: number;
  sender_id: number;
  text: string;
  sent_at: string;
}
export interface User {
  type: 'user';
  id: number;
  username: string;
}
export interface SystemMessage {
  type: 'system';
  code: string;
  text: string;
  timestamp: string;
}

export interface HistoryResponse {
  type: 'history.response';
  messages: Message[];
  users: User[];
}

export interface ConversationCreatedPayload {
  type: 'conversation.created';
  conversation_id: number;
  participants: number[];
  is_direct_message: boolean;
}

export type IncomingPayload =
  | Message
  | User
  | SystemMessage
  | HistoryResponse
  | ConversationCreatedPayload;

export interface ServerEnvelope<T extends { type: string } = IncomingPayload> {
  type: T['type'];
  data: T;
}

// === Outgoing (Client) ===
export interface EventPayloadMap {
  'message.send': {
    conversation_id: number;
    sender_id: number;
    text: string;
  };
  'user.register': {
    username: string;
  };
  'user.typing': {
    conversation_id: number;
    sender_id: number;
  };
  'conversation.create': {
    user1_id: number;
    user2_id: number;
  };
  'history.request': Record<string, never>;
}
export type OutgoingEventType = keyof EventPayloadMap;

export interface OutgoingEnvelope<T extends OutgoingEventType> {
  type: T;
  data: EventPayloadMap[T];
}

export type SendMessagePayload<T extends OutgoingEventType = OutgoingEventType> =
  OutgoingEnvelope<T>;

export type AnyWebSocketMessage = IncomingPayload;

// Chat types shared across AI chat components and hooks

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string; // formatted display timestamp
}

export type { ChatMessage as DefaultChatMessage };
