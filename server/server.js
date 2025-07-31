// Импортируем необходимые модули
const express = require('express'); // Для создания HTTP-сервера
const http = require('http'); // Для создания сервера
const WebSocket = require('ws'); // Для работы с WebSocket
const sqlite3 = require('sqlite3').verbose(); // Для работы с SQLite базой данных
const cors = require('cors'); // Для разрешения CORS-запросов

// Создаем приложение Express
const app = express();
app.use(cors());
// Создаем HTTP-сервер на базе Express
const server = http.createServer(app);

// Создаем WebSocket-сервер, привязанный к HTTP-серверу
const wss = new WebSocket.Server({ server });

// Подключаемся к файлу базы данных SQLite (chat.db создастся автоматически, если не существует)
const db = new sqlite3.Database('./chat.db');

// Создаем таблицу для сообщений, если она еще не существует
// Это происходит один раз при запуске сервера
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run('DELETE FROM messages');
});

// REST-эндпоинт для получения истории сообщений (через HTTP-запрос)
// Клиент может запросить /messages, чтобы загрузить все сообщения из БД
app.get('/messages', (req, res) => {
  // Выполняем SQL-запрос на выборку всех сообщений, отсортированных по времени
  db.all('SELECT * FROM messages ORDER BY timestamp ASC', [], (err, rows) => {
    if (err) {
      // Если ошибка, отправляем статус 500 и сообщение об ошибке
      return res.status(500).json({ error: err.message });
    }
    // Преобразуем поле message -> text для совместимости с клиентом
    const formattedRows = rows.map((row) => ({
      ...row,
      text: row.message, // добавляем поле text
    }));
    // Отправляем массив сообщений в формате JSON
    res.json(formattedRows);
  });
});

// Обработка новых WebSocket-подключений
wss.on('connection', (ws) => {
  console.log('Новый клиент подключился, всего подключено:', wss.clients.size);

  // Обработка входящих сообщений от клиента
  ws.on('message', (data) => {
    try {
      // Парсим JSON из входящих данных
      const msg = JSON.parse(data);

      // Сохраняем сообщение в базу данных
      db.run(
        'INSERT INTO messages (user, message) VALUES (?, ?)',
        [msg.userId || 'contact', msg.text], // Если user не указан, используем 'contact'
        (err) => {
          if (err) {
            console.error('Ошибка сохранения в БД:', err);
          }
        }
      );

      // Подготавливаем сообщение для рассылки (добавляем timestamp)
      const messageToSend = {
        ...msg,
        timestamp: new Date().toLocaleTimeString('ru-RU'),
      };

      // Рассылаем сообщение всем подключенным клиентам
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageToSend));
        }
      });
    } catch (error) {
      console.error('Ошибка при обработке сообщения:', error);
    }
  });

  // Обработка отключения клиента
  ws.on('close', () => {
    console.log('Клиент отключился, всего подключено:', wss.clients.size);
  });

  // Обработка ошибок WebSocket
  ws.on('error', (error) => {
    console.error('Ошибка WebSocket:', error);
  });
});

// Запускаем сервер на порту (по умолчанию 3000)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`WebSocket доступен на ws://localhost:${PORT}`);
});
