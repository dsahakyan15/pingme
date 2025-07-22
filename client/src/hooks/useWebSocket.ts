import { useEffect, useRef, useState, useCallback } from "react";
import type { Message } from "../pages/ChatPage";

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    // Add some initial demo messages
    {
      id: 1,
      text: "Привет! Как дела?",
      sender: "contact",
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      id: 2,
      text: "Привет! Все отлично, спасибо! А у тебя как дела?",
      sender: "user",
      timestamp: new Date(Date.now() - 240000).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      id: 3,
      text: "Тоже хорошо! Хочешь сходить куда-нибудь на выходных?",
      sender: "contact",
      timestamp: new Date(Date.now() - 180000).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket подключен");
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Получено сообщение:", message);

          setMessages((prev) => [...prev, message]);
        } catch (error) {
          console.error("Ошибка при парсинге сообщения:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket отключен");
        setIsConnected(false);

        // Автоматическое переподключение
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setConnectionError(
            `Переподключение... (попытка ${reconnectAttempts.current})`
          );
          setTimeout(() => {
            connect();
          }, 3000);
        } else {
          setConnectionError("Не удалось подключиться к серверу");
        }
      };

      ws.onerror = (error) => {
        console.error("Ошибка WebSocket:", error);
        setConnectionError("Ошибка соединения");
      };
    } catch (error) {
      console.error("Ошибка при создании WebSocket:", error);
      setConnectionError("Не удалось создать соединение");
    }
  }, [url]);

  const sendMessage = useCallback((message: Message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      // Also add the message to local state for immediate UI feedback
      setMessages((prev) => [...prev, message]);
    } else {
      console.error("WebSocket is not connected");
      setConnectionError("Не удалось отправить сообщение: нет подключения");
    }
  }, []);

  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    setConnectionError(null);
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    messages,
    sendMessage,
    connectionError,
    reconnect,
  };
};
