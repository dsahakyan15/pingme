// Types for conversation management

export type ConversationType = 'group' | 'private';

export interface Conversation {
  id: number;
  type: ConversationType;
  name: string;
  participants: number[]; // user IDs
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: number;
  };
  unreadCount?: number;
}

export interface PrivateConversation extends Conversation {
  type: 'private';
  otherUserId: number; // the other participant in private chat
}

export interface GroupConversation extends Conversation {
  type: 'group';
  description?: string;
}

export type AnyConversation = PrivateConversation | GroupConversation;

export interface ConversationState {
  conversations: Record<number, AnyConversation>;
  activeConversationId: number | null;
  isLoadingConversations: boolean;
}
