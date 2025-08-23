import React from 'react';
import type { AnyConversation } from '../types/ConversationTypes';
import type { User } from '../types/types';

interface ChatHeaderProps {
  activeConversation: AnyConversation | null;
  usersMap: Record<number, User>;
  currentUserId?: number;
  isConnected: boolean;
  onlineUsersCount?: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeConversation,
  usersMap,
  currentUserId,
  isConnected,
  onlineUsersCount = 0,
}) => {
  const getConversationTitle = () => {
    if (!activeConversation) return 'Выберите чат';

    if (activeConversation.type === 'group') {
      return activeConversation.name;
    }

    // For private conversation, show the other user's name
    const otherUserId = activeConversation.participants.find((id) => id !== currentUserId);
    const otherUser = otherUserId ? usersMap[otherUserId] : null;
    return otherUser?.username || `User ${otherUserId}`;
  };

  const getConversationSubtitle = () => {
    if (!activeConversation) return '';

    if (activeConversation.type === 'group') {
      const participantCount = activeConversation.participants.length;
      return `${participantCount} участников • ${onlineUsersCount} онлайн`;
    }

    // For private conversation, show online status
    const otherUserId = activeConversation.participants.find((id) => id !== currentUserId);
    return otherUserId ? 'Онлайн' : 'Не в сети'; // Simplified for now
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
              activeConversation?.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
            }`}
          >
            {activeConversation?.type === 'group'
              ? 'G'
              : getConversationTitle().charAt(0).toUpperCase()}
          </div>

          {/* Conversation info */}
          <div>
            <h2 className="font-semibold text-gray-900">{getConversationTitle()}</h2>
            <p className="text-sm text-gray-500">{getConversationSubtitle()}</p>
          </div>
        </div>

        {/* Connection status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          ></div>
          <span className="text-sm text-gray-500">{isConnected ? 'Подключено' : 'Отключено'}</span>
        </div>
      </div>
    </div>
  );
};
