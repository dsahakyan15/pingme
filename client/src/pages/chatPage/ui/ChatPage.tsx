import React, { useEffect, useState } from 'react';

import ClientInputForm from '../../../components/ClientInputForm';
import { useWebSocketRTK } from '../../../hooks/useWebSocketRTK';
import UserLoginForm from '../../../components/UserLoginForm';
import Header from './components/Header';
import ChatMessage from '../../../components/chat/ChatMessage';
import type { Message } from '../../../types/types';
import { useAppSelector } from '../../../app/hooks';

const ChatPage: React.FC = () => {
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const { isConnected, chatMessages, sendMessage, error, connect, currentUser } = useWebSocketRTK();
  const usersMap = useAppSelector((s) => (s.websocket.userMap ?? {}));

  useEffect(() => {
    connect('ws://localhost:3000');
  }, [connect]);

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
  }, [chatMessages]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {!isAuthenticated ? (
        <UserLoginForm setSender={setSender} onSendMessage={sendMessage} />
      ) : (
        <>
          <Header isConnected={isConnected} connectionError={error || undefined} />
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {chatMessages.map((msg: Message, index) => {
                const isCurrentUser = currentUser ? msg.sender_id === currentUser.id : false;
                const senderName = usersMap[msg.sender_id]?.username;
                return (
                  <div
                    key={msg.message_id}
                    className={`flex animate-in fade-in slide-in-from-bottom-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ChatMessage msg={msg} isCurrentUser={isCurrentUser} senderId={msg.sender_id} senderName={senderName} />
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <ClientInputForm onSendMessage={sendMessage} user_id={currentUser?.id} isConnected={isConnected} />
        </>
      )}
    </div>
  );
};

export default ChatPage;
