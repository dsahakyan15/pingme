import React, { useEffect, useState } from 'react';

import ClientInputForm from '../../../components/ClientInputForm';
import { useWebSocket } from '../../../hooks/useWebSocket';
import UserLoginForm from '../../../components/UserLoginForm';
import Header from './components/Header';
import ChatMessage from '../../../components/chat/ChatMessage';

const ChatPage: React.FC = () => {
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const { isConnected, messages, sendMessage, connectionError, reconnect } =
    useWebSocket('ws://localhost:3000');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sender, setSender] = useState<string>('');

  useEffect(() => {
    if (sender) {
      setIsAuthenticated(true);
    }
  }, [sender]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    console.log('----', messages);
  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {!isAuthenticated ? (
        <>
          <UserLoginForm setSender={setSender} onSendMessage={sendMessage} />
        </>
      ) : (
        <>
          {/* Header */}
          <Header
            isConnected={isConnected}
            connectionError={connectionError || undefined}
            reconnect={reconnect}
          />
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((msg, index) => {
                const isCurrentUser = msg.sender_id === 1; // TODO: заменить на динамическое сравнение с текущим пользователем
                return (
                  <div
                    key={msg.message_id}
                    className={`flex animate-in fade-in slide-in-from-bottom-3 ${
                      isCurrentUser ? 'justify-end' : 'justify-start'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ChatMessage msg={msg} isCurrentUser={isCurrentUser} 
                    senderId={msg.sender_id} />
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Form */}
          {/* TODO qcel username-in server heto ira id-n nor ste tal,jmnk 1 a drac */}
          <ClientInputForm onSendMessage={sendMessage} user_id={1} isConnected={isConnected} />
        </>
      )}
    </div>
  );
};

export default ChatPage;
