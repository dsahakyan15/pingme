import React from 'react';
import type { User } from '../types/types';

interface UserListItemProps {
  user: User;
  isOnline?: boolean;
  hasUnreadMessages?: boolean;
  onClick: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  isOnline = false,
  hasUnreadMessages = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar with online status */}
        <div className={`relative ${isOnline ? 'status-online' : ''}`}>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{user.username}</p>
          <p className="text-xs text-gray-500">{isOnline ? 'Онлайн' : 'Не в сети'}</p>
        </div>

        {/* Unread indicator */}
        {hasUnreadMessages && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
      </div>
    </div>
  );
};

interface UserListProps {
  users: User[];
  currentUserId?: number;
  onUserSelect: (user: User) => void;
  onlineUsers?: Set<number>;
  usersWithUnreadMessages?: Set<number>;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  currentUserId,
  onUserSelect,
  onlineUsers = new Set(),
  usersWithUnreadMessages = new Set(),
}) => {
  // Filter out current user and sort by online status
  const filteredUsers = users
    .filter((user) => user.id !== currentUserId)
    .sort((a, b) => {
      const aOnline = onlineUsers.has(a.id);
      const bOnline = onlineUsers.has(b.id);

      // Online users first
      if (aOnline && !bOnline) return -1;
      if (bOnline && !aOnline) return 1;

      // Then alphabetically
      return a.username.localeCompare(b.username);
    });

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700 text-sm">Пользователи ({filteredUsers.length})</h3>
      </div>

      {filteredUsers.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          isOnline={onlineUsers.has(user.id)}
          hasUnreadMessages={usersWithUnreadMessages.has(user.id)}
          onClick={() => onUserSelect(user)}
        />
      ))}

      {filteredUsers.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <p>Нет доступных пользователей</p>
        </div>
      )}
    </div>
  );
};
