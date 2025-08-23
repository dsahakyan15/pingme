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
  db.run('DELETE FROM users');
  db.run('DELETE FROM conversations');
  db.run('DELETE FROM conversation_participants');
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

function broadcast(jsonObj) {
  const payload = JSON.stringify(jsonObj);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function send(ws, jsonObj) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(jsonObj));
  }
}

// Обработка новых WebSocket-подключений
wss.on('connection', (ws) => {
  console.log('Новый клиент подключился, всего подключено:', wss.clients.size);

  // Обработка входящих сообщений от клиента
  ws.on('message', (data) => {
    try {
      // Парсим JSON из входящих данных
      const msg = JSON.parse(data);

      // Обработка запроса истории сообщений
      if (msg.type === 'history.request') {
        // Получаем все сообщения и пользователей
        db.all('SELECT * FROM messages ORDER BY sent_at ASC', [], (err, messages) => {
          if (err) {
            console.error('Ошибка получения истории сообщений:', err);
            return;
          }

          db.all('SELECT * FROM users', [], (userErr, users) => {
            if (userErr) {
              console.error('Ошибка получения пользователей:', err);
              return;
            }

            // Отправляем историю клиенту
            const historyResponse = {
              type: 'history.response',
              data: {
                messages: messages.map((msg) => ({
                  ...msg,
                  text: msg.message_text, // добавляем поле text для совместимости
                })),
                users: users,
              },
            };

            send(ws, historyResponse);
          });
        });
        return;
      }

      // Поддержка нового протокола: { type: 'message.send', data: {...} }
      if (msg.type === 'message.send' && msg.data) {
        const { conversation_id = 1, sender_id, text } = msg.data;
        if (!sender_id || !text) return;
        db.run(
          'INSERT INTO messages (conversation_id, sender_id, message_text) VALUES (?,?,?)',
          [conversation_id, sender_id, text],
          function (err) {
            if (err) {
              console.error('Ошибка сохранения в БД (message.send):', err);
              return;
            }
            const messageEnvelope = {
              type: 'message',
              data: {
                type: 'message',
                message_id: this.lastID,
                conversation_id,
                sender_id,
                text,
                sent_at: new Date().toISOString(),
              },
            };
            broadcast(messageEnvelope);
          }
        );
      } else if (msg.type === 'user.register' && msg.data) {
        const { username } = msg.data;
        if (!username) return;
        db.run('INSERT OR IGNORE INTO users (username) VALUES (?)', [username], (err) => {
          if (err) {
            console.error('Ошибка сохранения пользователя (user.register):', err);
          }
          db.get(
            'SELECT user_id, username FROM users WHERE username = ?',
            [username],
            (selErr, row) => {
              if (selErr) {
                console.error('Ошибка выборки пользователя:', selErr);
                return;
              }
              if (!row) return;
              const userEnvelope = {
                type: 'user',
                data: { type: 'user', id: row.user_id, username: row.username },
              };
              // Отправляем только инициатору регистрацию + можно вещать всем (решили вещать всем)
              broadcast(userEnvelope);
            }
          );
        });
      } else if (msg.type === 'message') {
        // legacy формат: { type:'message', sender_id, text }
        const { conversation_id = 1, sender_id, text } = msg;
        if (!sender_id || !text) return;
        db.run(
          'INSERT INTO messages (conversation_id, sender_id, message_text) VALUES (?,?,?)',
          [conversation_id, sender_id, text],
          function (err) {
            if (err) {
              console.error('Ошибка сохранения в БД (legacy message):', err);
              return;
            }
            const messageEnvelope = {
              type: 'message',
              data: {
                type: 'message',
                message_id: this.lastID,
                conversation_id,
                sender_id,
                text,
                sent_at: new Date().toISOString(),
              },
            };
            broadcast(messageEnvelope);
          }
        );
      } else if (msg.type === 'user') {
        // legacy user
        const { username } = msg;
        if (!username) return;
        db.run('INSERT OR IGNORE INTO users (username) VALUES (?)', [username], (err) => {
          if (err) {
            console.error('Ошибка сохранения пользователя (legacy user):', err);
          }
          db.get(
            'SELECT user_id, username FROM users WHERE username = ?',
            [username],
            (selErr, row) => {
              if (selErr) {
                console.error('Ошибка выборки пользователя:', selErr);
                return;
              }
              if (!row) return;
              const userEnvelope = {
                type: 'user',
                data: { type: 'user', id: row.user_id, username: row.username },
              };
              broadcast(userEnvelope);
            }
          );
        });
      } else {
        // Неизвестный тип — можно логировать
        console.warn('Необработанный тип сообщения:', msg.type);
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
