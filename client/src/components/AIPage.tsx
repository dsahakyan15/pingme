import React, { useState } from "react";
import { Link } from "react-router-dom";

// Временные SVG иконки
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

const SparklesIcon = ({ className }: { className?: string }) => (
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
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Cog6ToothIcon = ({ className }: { className?: string }) => (
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
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ChatBubbleLeftRightIcon = ({ className }: { className?: string }) => (
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
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const AIPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, query: "Как создать React компонент?", timestamp: "10:30" },
    { id: 2, query: "Объясни принципы TypeScript", timestamp: "09:15" },
    { id: 3, query: "Лучшие практики Tailwind CSS", timestamp: "08:45" },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);

    // Симуляция API запроса
    setTimeout(() => {
      setResponse(
        `Это ответ на ваш запрос: "${query}". AI обработал ваш вопрос и готов предоставить подробную информацию по данной теме.`
      );
      setHistory((prev) => [
        {
          id: Date.now(),
          query,
          timestamp: new Date().toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
      setQuery("");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-1 border-r border-slate-200 bg-white/50 backdrop-blur-sm">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  История
                </h3>
                <p className="text-sm text-slate-500">Ваши запросы</p>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-white border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer group animate-in slide-in-from-left-5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.query}
                </p>
                <p className="text-xs text-slate-400 mt-1">{item.timestamp}</p>
              </div>
            ))}
          </div>

          {/* Settings Button */}
          <div className="p-4 border-t border-slate-200">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
              <Cog6ToothIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Настройки</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-sm border-b border-slate-200 p-6 animate-in fade-in slide-in-from-top-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  AI Assistant
                </h1>
                <p className="text-slate-500">Ваш персональный помощник</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                ← Главная
              </Link>
              <Link
                to="/chat"
                className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                💬 Чат
              </Link>
              <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-slate-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Interaction Area */}
        <div className="flex-1 p-6 flex flex-col max-w-4xl mx-auto w-full">
          {/* Query Input */}
          <div
            className="mb-8 animate-in fade-in slide-in-from-bottom-5"
            style={{ animationDelay: "200ms" }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Задайте вопрос AI ассистенту..."
                  className="w-full p-4 pr-12 border border-slate-300 rounded-xl resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Response Area */}
          <div
            className="flex-1 animate-in fade-in slide-in-from-bottom-5"
            style={{ animationDelay: "400ms" }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-6 min-h-[300px]">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5 text-blue-600" />
                <span>Ответ AI</span>
              </h3>

              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              ) : response ? (
                <div className="prose max-w-none animate-in fade-in slide-in-from-bottom-3">
                  <p className="text-slate-700 leading-relaxed">{response}</p>
                </div>
              ) : (
                <div className="text-center text-slate-400 mt-20">
                  <SparklesIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Задайте вопрос, чтобы получить ответ от AI
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPage;
