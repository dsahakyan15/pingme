import React, { useState } from 'react';
import { PaperAirplaneIcon } from '../widgets/simpleIcons';
import type { EventPayloadMap, OutgoingEventType } from '../types/types';

interface ClientInputFormProps {
  onSendMessage: <T extends OutgoingEventType>(type: T, data: EventPayloadMap[T]) => void;
  isConnected?: boolean;
  user_id?: number;
  conversationId?: number;
}

const ClientInputForm: React.FC<ClientInputFormProps> = ({
  onSendMessage,
  isConnected = false,
  user_id = 0,
  conversationId = 1,
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user_id) return;

    onSendMessage('message.send', {
      conversation_id: conversationId,
      sender_id: user_id,
      text: message.trim(),
    });
    setMessage('');
  };

  return (
    <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-bottom-5">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Напишите сообщение..."
              className="w-full p-3 border border-slate-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || !isConnected || !user_id}
            className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
        {!isConnected && <p className="text-sm text-red-500 mt-2">WebSocket не подключен</p>}
      </div>
    </div>
  );
};

export default ClientInputForm;
