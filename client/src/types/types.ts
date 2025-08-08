// === Incoming (Server) ===

export interface Message {
  type: "message";
  message_id: number;
  conversation_id: number;
  sender_id: number;
  text: string;
  sent_at: string;
}
export interface User {
  type: "user";
  id: number;
  username: string;
}
 export interface SystemMessage {
  type: "system";
  code: string;
  text: string;
  timestamp: string;
 }

 export type IncomingPayload = Message | User | SystemMessage;

export interface ServerEnvelope<T extends { type: string } = IncomingPayload> {
 type: T['type'];
 data: T;
}

 // === Outgoing (Client) ===
 export interface EventPayloadMap {
  'message.send':{
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
 }
 export type OutgoingEventType = keyof EventPayloadMap;

 export interface OutgoingEnvelope<T extends OutgoingEventType> {
  type: T;
  data: EventPayloadMap[T];
 }

export type SendMessagePayload<T extends OutgoingEventType = OutgoingEventType> = OutgoingEnvelope<T>

export type AnyWebSocketMessage = IncomingPayload;