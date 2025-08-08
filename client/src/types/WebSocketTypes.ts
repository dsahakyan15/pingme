// Strongly typed WebSocket protocol & state

export type WebSocketConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

import type { Message, User, SystemMessage, IncomingPayload, OutgoingEventType, EventPayloadMap, SendMessagePayload as BaseSendMessagePayload } from './types';

export interface IncomingEnvelope<T extends IncomingPayload = IncomingPayload> {
  type: T['type'];
  data: T;
  timestamp?: number;
  id?: string;
}

export type WebSocketStoredMessage =
  | ({ kind: 'incoming' } & IncomingEnvelope)
  | ({ kind: 'outgoing'; optimistic?: boolean } & BaseSendMessagePayload<OutgoingEventType> & { id: string; timestamp: number });

export interface WebSocketState {
  connectionStatus: WebSocketConnectionStatus;
  messages: WebSocketStoredMessage[];
  url: string | null;
  error: string | null;
  isReconnecting: boolean;
  reconnectAttempts: number;
  currentUser: User | null;
  pendingUsername?: string; // username awaiting server ack
  userMap?: Record<number, User>; // map of known users
}

export interface ConnectPayload {
  url: string;
  protocols?: string | string[];
}

export type SendMessagePayload<T extends OutgoingEventType = OutgoingEventType> = {
  type: T;
  data: EventPayloadMap[T];
  meta?: { optimisticId?: string };
};

export interface TypingEventPayload {
  conversation_id: number;
  sender_id: number;
}

export type { Message, User, SystemMessage };
