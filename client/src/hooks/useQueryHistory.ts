import { useState } from "react";
import { formatTimestamp, generateId } from "../utils/common";

export interface QueryHistoryItem {
  id: number;
  query: string;
  timestamp: string;
}

interface UseQueryHistoryReturn {
  history: QueryHistoryItem[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

export const useQueryHistory = (): UseQueryHistoryReturn => {
  const [history, setHistory] = useState<QueryHistoryItem[]>([
    { id: 1, query: "How to create a React component?", timestamp: "10:30" },
  ]);

  const addToHistory = (query: string) => {
    const newItem: QueryHistoryItem = {
      id: generateId(),
      query,
      timestamp: formatTimestamp(),
    };

    setHistory((prev) => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addToHistory,
    clearHistory,
  };
};
