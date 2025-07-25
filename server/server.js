const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Хранилище всех подключенных клиентов
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("Новый клиент подключился");

  // Добавляем клиента в список
  clients.add(ws);

  // Обрабатываем входящие сообщения
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      console.log("Получено сообщение:", message);

      // Создаем сообщение для пересылки
      const messageToSend = {
        id: Date.now() + Math.random(),
        text: message.text,
        sender: "contact", // Для получателя это сообщение от собеседника
        timestamp: new Date().toLocaleTimeString("ru-RU"),
      };

      // Отправляем сообщение ВСЕМ подключенным клиентам, кроме отправителя
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageToSend));
        }
      });
    } catch (error) {
      console.error("Ошибка при обработке сообщения:", error);
    }
  });

  // Удаляем клиента при отключении
  ws.on("close", () => {
    console.log("Клиент отключился");
    clients.delete(ws);
  });

  // Обрабатываем ошибки
  ws.on("error", (error) => {
    console.error("Ошибка WebSocket:", error);
    clients.delete(ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`WebSocket доступен на ws://localhost:${PORT}`);
});
