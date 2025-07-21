import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// Временные SVG иконки (заменят heroicons)
const PaperAirplaneIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const VideoIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

interface Message {
  id: number;
  text: string;
  sender: "user" | "contact";
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState("");
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Симуляция ответа собеседника
    setTimeout(() => {
      const autoReply: Message = {
        id: Date.now() + 1,
        text: "Получил ваше сообщение! Отвечу чуть позже.",
        sender: "contact",
        timestamp: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1000);
  };

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
      <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-bottom-5">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                className="w-full p-3 border border-slate-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
