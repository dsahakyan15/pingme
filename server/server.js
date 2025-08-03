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
  db.run(`CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS conversations (
    conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    is_direct_message BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
  )`);
  db.run('DELETE FROM messages');
});

// REST-эндпоинт для получения истории сообщений (через HTTP-запрос)
// Клиент может запросить /messages, чтобы загрузить все сообщения из БД
app.get('/messages', (req, res) => {
  // Выполняем SQL-запрос на выборку всех сообщений, отсортированных по времени
  db.all('SELECT * FROM messages ORDER BY sent_at ASC', [], (err, rows) => {
    if (err) {
      // Если ошибка, отправляем статус 500 и сообщение об ошибке
      return res.status(500).json({ error: err.message });
    }
    // Преобразуем поле message_text -> text для совместимости с клиентом
    const formattedRows = rows.map((row) => ({
      ...row,
      text: row.message_text, // добавляем поле text из message_text
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
      if (msg.type == 'message') {
        // Сохраняем сообщение в базу данных
        db.run(
          'INSERT INTO messages (conversation_id,sender_id, message_text) VALUES (1,?, ?)',
          [msg.sender_id, msg.text], // Если sender_id не указан, используем 1
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
      } else if (msg.type == 'user') {
        // Сохраняем пользователя в базу данных
        db.run('INSERT OR IGNORE INTO users (username) VALUES (?)', [msg.username], (err) => {
          if (err) {
            console.error('Ошибка сохранения пользователя в БД:', err);
          }
        });
      }
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
