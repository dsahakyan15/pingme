import React, { useState } from 'react';
import type { User } from '../types/types';

interface NewChatButtonProps {
  users: User[];
  currentUserId?: number;
  onCreatePrivateChat: (user: User) => void;
}

export const NewChatButton: React.FC<NewChatButtonProps> = ({
  users,
  currentUserId,
  onCreatePrivateChat,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const availableUsers = users.filter((user) => user.id !== currentUserId);

  if (availableUsers.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-100"
      >
        + Новый чат
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-20 max-h-48 overflow-y-auto">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onCreatePrivateChat(user);
                  setIsOpen(false);
                }}
                className="w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-900">{user.username}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
