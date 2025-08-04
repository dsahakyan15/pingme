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
export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}
