import React, { useState } from 'react';
import { ConversationList } from '../../../../components/ConversationList';
import { UserList } from '../../../../components/UserList';
import { NewChatButton } from '../../../../components/NewChatButton';
import { useWebSocketRTK } from '../../../../hooks/useWebSocketRTK';
import type { User } from '../../../../types/types';
import type { AnyConversation } from '../../../../types/ConversationTypes';

type TabType = 'conversations' | 'users';

interface UsersBarProps {
  conversations: AnyConversation[];
  activeConversationId: number | null;
  onConversationSelect: (conversationId: number) => void;
  onUserSelect: (user: User) => void;
}

export const UsersBar: React.FC<UsersBarProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  onUserSelect,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('conversations');
  const { usersMap, currentUser } = useWebSocketRTK();

  const users = Object.values(usersMap || {});

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'conversations'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Чаты
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Пользователи
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'conversations' && (
          <>
            <NewChatButton
              users={users}
              currentUserId={currentUser?.id}
              onCreatePrivateChat={onUserSelect}
            />
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onConversationSelect={onConversationSelect}
                usersMap={usersMap || {}}
                currentUserId={currentUser?.id}
              />
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <UserList
            users={users}
            currentUserId={currentUser?.id}
            onUserSelect={onUserSelect}
            onlineUsers={new Set(users.map((u) => u.id))} // Для демонстрации - все онлайн
          />
        )}
      </div>
    </div>
  );
};
