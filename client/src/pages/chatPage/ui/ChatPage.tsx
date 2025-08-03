import React, { useEffect, useState } from "react";
import { UserIcon } from "../../../widgets/simpleIcons";
import ClientInputForm from "../../../components/ClientInputForm";
import { useWebSocket } from "../../../hooks/useWebSocket";
import UserLoginForm from "../../../components/UserLoginForm";
import Header from "./components/Header";


const ChatPage: React.FC = () => {
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const { isConnected, messages, sendMessage, connectionError, reconnect } =
    useWebSocket("ws://localhost:3000");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sender, setSender] = useState<string>('');

  useEffect(() => {
    if (sender) {
      setIsAuthenticated(true);
    }
  }, [sender]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    console.log('----', messages);

  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">


      {!isAuthenticated ?
        <>
          <UserLoginForm
            setSender={setSender}
            onSendMessage={sendMessage} />
        </>
        :
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
                  className={`flex animate-in fade-in slide-in-from-bottom-3 ${isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUser
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                      }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCurrentUser
                        ? "bg-blue-600"
                        : "bg-gradient-to-r from-blue-500 to-purple-600"
                        }`}
                    >
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>

                    <div
                      className={`group ${isCurrentUser ? "text-right" : "text-left"
                        }`}
                    >
                      <div
                        className={`p-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${isCurrentUser
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                          }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.sent_at}
                      </p>
                    </div>
                  </div>
                </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Form */}
      {/* TODO qcel username-in server heto ira id-n nor ste tal,jmnk 1 a drac */}
          <ClientInputForm
            onSendMessage={sendMessage}
            user_id={1}
            isConnected={isConnected}
          />


        </>}

    </div>
  );
};

export default ChatPage;
