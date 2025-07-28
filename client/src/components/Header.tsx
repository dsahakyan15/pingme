import React from "react";
import { Link } from "react-router-dom";
import { SparklesIcon, ChatBubbleLeftRightIcon } from "./Icons";

interface HeaderProps {
  onClearChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearChat }) => {
  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-slate-200 p-6 animate-in fade-in slide-in-from-top-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
            <p className="text-slate-500">Your personal assistant</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onClearChat}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer"
          >
            🗑️ Clear Chat
          </button>
          <Link
            to="/"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            ← Home
          </Link>
          <Link
            to="/chat"
            className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            💬 Chat
          </Link>
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
