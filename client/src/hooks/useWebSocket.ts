// Импортируем необходимые хуки React
import { useEffect, useRef, useState, useCallback } from 'react';

// Импортируем тип сообщения (предполагаем, что он определен в types.ts)
import type { Message, User } from '../types/types';

// Кастомный хук для работы с WebSocket и загрузкой истории из БД
export const useWebSocket = (url: string) => {
  // Состояние подключения к серверу
  const [isConnected, setIsConnected] = useState(false);

  // Список сообщений чата (инициализируется пустым, загружается из БД)
  const [messages, setMessages] = useState<Message[]>([]);

  // Строка ошибки соединения (если есть)
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Ссылка на текущий WebSocket
  const wsRef = useRef<WebSocket | null>(null);

  // Счетчик попыток переподключения
  const reconnectAttempts = useRef(0);

  // Максимальное количество попыток переподключения
  const maxReconnectAttempts = 5;

  // Функция для загрузки истории сообщений из сервера (через HTTP)
  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/messages'); // Укажите правильный URL сервера
      if (!response.ok) {
        throw new Error('Ошибка загрузки сообщений');
      }
      const data: Message[] = await response.json();
      setMessages(data); // Обновляем состояние сообщениями из БД
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
      setConnectionError('Не удалось загрузить историю сообщений');
    }
  }, []);

  // Функция для подключения к WebSocket
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      // Событие: соединение установлено
      ws.onopen = () => {
        console.log('WebSocket подключен');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
      };

      // Событие: получено сообщение от сервера
      ws.onmessage = (event) => {
        try {
          const message: Message = JSON.parse(event.data);
          console.log('Получено сообщение:', message);
          setMessages((prev) => [...prev, message]);
        } catch (error) {
          console.error('Ошибка при парсинге сообщения:', error);
        }
      };

      // Событие: соединение закрыто
      ws.onclose = () => {
        console.log('WebSocket отключен');
        setIsConnected(false);
        // Автоматическое переподключение
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setConnectionError(`Переподключение... (попытка ${reconnectAttempts.current})`);
          setTimeout(() => {
            connect();
          }, 3000);
        } else {
          setConnectionError('Не удалось подключиться к серверу');
        }
      };

      // Событие: ошибка WebSocket
      ws.onerror = (error) => {
        console.error('Ошибка WebSocket:', error);
        setConnectionError('Ошибка соединения');
      };
    } catch (error) {
      console.error('Ошибка при создании WebSocket:', error);
      setConnectionError('Не удалось создать соединение');
    }
  }, [url]);

  // Функция для отправки сообщения на сервер
  const sendMessage = useCallback((message: Message | User) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      // Добавляем сообщение в локальное состояние для мгновенного отображения
      // setMessages((prev) => [...prev, message])/
    } else {
      console.error('WebSocket is not connected');
      setConnectionError('Не удалось отправить сообщение: нет подключения');
    }
  }, []);

  // Функция для ручного переподключения к серверу
  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    setConnectionError(null);
    connect();
  }, [connect]);

  // Эффект: подключаемся к серверу и загружаем историю при монтировании
  useEffect(() => {
    loadMessages(); // Сначала загружаем историю из БД
    connect(); // Затем подключаемся к WebSocket

    // Отключаемся от сервера при размонтировании
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, loadMessages]);

  // Возвращаем все необходимые данные и методы
  return {
    isConnected, // статус подключения
    messages, // список сообщений
    sendMessage, // функция отправки сообщения
    connectionError, // строка ошибки соединения
    reconnect, // функция переподключения
  };
};
