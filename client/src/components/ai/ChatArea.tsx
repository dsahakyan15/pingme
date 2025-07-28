import React from "react";
import ReactMarkdown from "react-markdown";
import { SparklesIcon } from "../Icons";
import type { ChatMessage } from "../../types";

interface ChatAreaProps {
  chatMessages: ChatMessage[];
  isLoading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  chatMessages,
  isLoading,
}) => {
  return (
    <div className="flex-1 mb-6 overflow-y-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-6 min-h-[500px] max-h-[500px] overflow-y-auto">
        {chatMessages.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">
            <SparklesIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">
              Start a conversation with the AI assistant
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="prose max-w-none">
                    {message.role === "user" ? (
                      <p className="text-white">{message.content}</p>
                    ) : (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-blue-200"
                        : "text-slate-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-4 rounded-xl">
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
