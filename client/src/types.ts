export interface Message {
  id: number;
  text: string;
  sender: "user" | "contact";
  timestamp: string;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}
