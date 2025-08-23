import React from 'react';
import type { AnyConversation } from '../types/ConversationTypes';
import type { User } from '../types/types';

interface ConversationListItemProps {
  conversation: AnyConversation;
  isActive: boolean;
  onClick: () => void;
  usersMap: Record<number, User>;
  currentUserId?: number;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isActive,
  onClick,
  usersMap,
  currentUserId,
}) => {
  const getConversationName = () => {
    if (conversation.type === 'group') {
      return conversation.name;
    }

    // For private conversation, show the other user's name
    const otherUserId = conversation.participants.find((id: number) => id !== currentUserId);
    const otherUser = otherUserId ? usersMap[otherUserId] : null;
    return otherUser?.username || `User ${otherUserId}`;
  };

  const getLastMessageText = () => {
    if (!conversation.lastMessage) return 'Нет сообщений';

    const senderName = usersMap[conversation.lastMessage.senderId]?.username || 'Неизвестно';
    return `${senderName}: ${conversation.lastMessage.text}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors chat-hover ${
        isActive ? 'conversation-active' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
            conversation.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          {conversation.type === 'group' ? 'G' : getConversationName().charAt(0).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">{getConversationName()}</h3>
            {conversation.lastMessage && (
              <span className="text-xs text-gray-500">
                {formatTimestamp(conversation.lastMessage.timestamp)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate">{getLastMessageText()}</p>
            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center unread-badge">
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConversationListProps {
  conversations: AnyConversation[];
  activeConversationId: number | null;
  onConversationSelect: (conversationId: number) => void;
  usersMap: Record<number, User>;
  currentUserId?: number;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations = [],
  activeConversationId,
  onConversationSelect,
  usersMap,
  currentUserId,
}) => {
  // Sort conversations: group chat first, then by last message time
  const sortedConversations = [...conversations].sort((a, b) => {
    // Group chat always first
    if (a.type === 'group' && b.type !== 'group') return -1;
    if (b.type === 'group' && a.type !== 'group') return 1;

    // Then by last message time
    const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
    const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {sortedConversations.map((conversation) => (
        <div key={conversation.id} className="conversation-transition">
          <ConversationListItem
            conversation={conversation}
            isActive={activeConversationId === conversation.id}
            onClick={() => onConversationSelect(conversation.id)}
            usersMap={usersMap}
            currentUserId={currentUserId}
          />
        </div>
      ))}

      {conversations.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <p>Нет активных разговоров</p>
        </div>
      )}
    </div>
  );
};
