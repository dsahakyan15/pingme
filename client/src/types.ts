export interface Message {
  id: number;
  text: string;
  senderId: number;
  sendetAt: string;
  conversationId: number;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}
