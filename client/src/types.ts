
export interface Message {
  id: number;
  text: string;
  sender: "user" | "contact";
  timestamp: string;
}