import React from 'react';

interface EmptyChatStateProps {
  onRequestHistory: () => void;
  conversationName?: string;
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({
  onRequestHistory,
  conversationName,
}) => {
  return (
    <div className="flex flex-col justify-center items-center py-16 text-gray-500">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center empty-state-icon">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {conversationName ? `Нет сообщений в "${conversationName}"` : 'Нет сообщений'}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {conversationName
            ? `Начните общение в ${conversationName} — отправьте первое сообщение!`
            : 'Выберите чат или создайте новый для начала общения'}
        </p>

        {/* Action button */}
        {conversationName && (
          <button
            onClick={onRequestHistory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Обновить историю
          </button>
        )}
      </div>
    </div>
  );
};
