import React, { useState, useEffect } from "react";
import { UserIcon, PhoneIcon, VideoIcon } from "../widgets/simpleIcons";
import { Link } from "react-router-dom";
import ClientInputForm from "../components/ClientInputForm";


export interface Message {
  id: number;
  text: string;
  sender: "user" | "contact";
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  // TODO: Реализовать WebSocket для реального времени
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Привет! Как дела?",
      sender: "contact",
      timestamp: "10:30",
    },
    {
      id: 2,
      text: "Привет! Всё отлично, спасибо! А у тебя как?",
      sender: "user",
      timestamp: "10:32",
    },
    {
      id: 3,
      text: "Тоже хорошо! Кстати, не забудь про завтрашнюю встречу",
      sender: "contact",
      timestamp: "10:33",
    },
    {
      id: 4,
      text: "Конечно, помню! В 15:00 в офисе, правильно?",
      sender: "user",
      timestamp: "10:35",
    },
    {
      id: 5,
      text: "Да, именно так. До встречи!",
      sender: "contact",
      timestamp: "10:36",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 animate-in fade-in slide-in-from-top-5">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Анна Иванова
              </h1>
              <p className="text-sm text-green-600">в сети</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              ← Главная
            </Link>
            <Link
              to="/ai"
              className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              🤖 AI
            </Link>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <PhoneIcon className="h-6 w-6 text-slate-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <VideoIcon className="h-6 w-6 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex animate-in fade-in slide-in-from-bottom-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-lg ${
                  msg.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-blue-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                >
                  <UserIcon className="h-4 w-4 text-white" />
                </div>

                <div
                  className={`group ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <ClientInputForm/>
      
    </div>
  );
};

export default ChatPage;
