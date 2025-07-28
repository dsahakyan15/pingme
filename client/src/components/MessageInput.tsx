import React, { useState } from "react";
import { PaperAirplaneIcon } from "./Icons";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    onSendMessage(query);
    setQuery("");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Continue the conversation with the AI assistant..."
            className="w-full p-4 pr-12 border border-slate-300 rounded-xl resize-none h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
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
  );
};
