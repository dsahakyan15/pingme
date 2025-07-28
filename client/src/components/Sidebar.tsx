import React from "react";
import { ClockIcon } from "./Icons";
import type { QueryHistoryItem } from "../hooks/useQueryHistory";

interface SidebarProps {
  history: QueryHistoryItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ history }) => {
  return (
    <div className="hidden lg:flex lg:w-80 lg:flex-col">
      <div className="flex flex-col flex-1 border-r border-slate-200 bg-white/50 backdrop-blur-sm">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">History</h3>
              <p className="text-sm text-slate-500">Your queries</p>
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
      </div>
    </div>
  );
};
