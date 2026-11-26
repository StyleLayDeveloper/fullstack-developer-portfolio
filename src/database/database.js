
/* 1. Подключаем SQLite */
const Database = require("better-sqlite3");
const path = require("path");

/* 2. Создаём или открываем базу данных */
const dbPath = path.join(__dirname, "portfolio.db");
const db = new Database(dbPath);

/* 3. Создаём таблицу сообщений */
db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

/* 4. Экспортируем подключение */
module.exports = db;

console.log("SQLite database connected successfully!");
