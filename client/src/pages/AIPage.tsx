import React from 'react';
import { useAIChat, useQueryHistory } from '../hooks';
import { Sidebar, ChatArea, MessageInput, Header } from '../components';

const AIPage: React.FC = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { chatMessages, isLoading, sendMessage, clearChat } = useAIChat({
    apiKey,
  });
  const { history, addToHistory } = useQueryHistory();

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
    addToHistory(message);
  };

  const handleClearChat = () => {
    clearChat();
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar history={history} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <Header onClearChat={handleClearChat} />

        {/* Chat Area */}
        <div className="flex-1 min-h-0 p-6 flex flex-col w-full">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ChatArea chatMessages={chatMessages} isLoading={isLoading} />
          </div>
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default AIPage;
