import React, { useEffect } from 'react';

import ClientInputForm from '../../../components/ClientInputForm';
import { useWebSocketRTK } from '../../../hooks/useWebSocketRTK';
import UserLoginForm from '../../../components/UserLoginForm';
import Header from './components/Header';
import { UsersBar } from './components/UsersBar';
import ChatMessage from '../../../components/chat/ChatMessage';
import { ChatHeader } from '../../../components/ChatHeader';
import { EmptyChatState } from '../../../components/EmptyChatState';
import type { Message, User } from '../../../types/types';
import { useAppSelector } from '../../../app/hooks';

const ChatPage: React.FC = () => {
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const {
    isConnected,
    chatMessages,
    conversationMessages,
    conversations,
    activeConversationId,
    activeConversation,
    error,
    usersMap,
    connect,
    currentUser,
    isLoadingHistory,
    requestHistory,
    setActiveConversation,
    createPrivateConversation,
  } = useWebSocketRTK();

  useEffect(() => {
    connect('ws://localhost:3000');
  }, [connect]);

  const isAuthenticated = useAppSelector((state) => state.websocket.isRegistered);
  const handleConversationSelect = (conversationId: number) => {
    setActiveConversation(conversationId);
  };

  const handleUserSelect = (user: User) => {
    createPrivateConversation(user);
  };

  // Get messages for the active conversation
  const displayMessages = activeConversationId ? conversationMessages : chatMessages; // Fallback to all messages if no active conversation

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  console.log(isLoadingHistory);

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {!isAuthenticated ? (
        // TODO
        <UserLoginForm />
      ) : (
        <>
          <Header isConnected={isConnected} connectionError={error || undefined} />
          <div className="flex flex-1 flex-row">
            <div className="w-1/5 bg-white border-r border-gray-200">
              <UsersBar
                conversations={conversations}
                activeConversationId={activeConversationId}
                onConversationSelect={handleConversationSelect}
                onUserSelect={handleUserSelect}
              />
            </div>
            <div className="w-4/5 flex flex-col bg-white border-l border-gray-200 relative">
              <ChatHeader
                activeConversation={activeConversation}
                usersMap={usersMap || {}}
                currentUserId={currentUser?.id}
                isConnected={isConnected}
                onlineUsersCount={Object.keys(usersMap || {}).length}
              />

              <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                  {isLoadingHistory && (
                    <div className="flex justify-center py-4">
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Загружается история сообщений...</span>
                      </div>
                    </div>
                  )}

                  {!isLoadingHistory && displayMessages.length === 0 && (
                    <EmptyChatState
                      onRequestHistory={requestHistory}
                      conversationName={activeConversation?.name}
                    />
                  )}

                  {displayMessages.map((msg: Message, index) => {
                    const isCurrentUser = currentUser ? msg.sender_id === currentUser.id : false;
                    const senderName = usersMap && usersMap[msg.sender_id]?.username;
                    return (
                      <div
                        key={msg.message_id}
                        className={`flex message-enter ${isCurrentUser ? 'justify-end' : 'justify-start'
                          }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <ChatMessage
                          msg={msg}
                          isCurrentUser={isCurrentUser}
                          senderId={msg.sender_id}
                          senderName={senderName}
                        />
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <ClientInputForm
                user_id={currentUser?.id}
                isConnected={isConnected}
                conversationId={activeConversationId || 1}
              />
            </div>
          </div>{' '}
        </>
      )}
    </div>
  );
};

export default ChatPage;
