
/* 1. Подключаем библиотеки */
const express = require("express");
const path = require("path");

/* 2. Подключаем базу данных */
const db = require("./src/database/database");

/* 3. Подключаем маршруты */
const messageRoutes = require("./src/routes/messageRoutes");

/* 4. Создаём приложение */
const app = express();
const PORT = process.env.PORT || 3000;

/* 5. Настраиваем обработку запросов */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 6. Подключаем статические файлы */
app.use(express.static(path.join(__dirname, "public")));

/* 7. Подключаем API */
app.use("/api/messages", messageRoutes);

/* 8. Запускаем сервер */
app.listen(PORT, () => {
    console.log("Database is ready:", !!db);
    console.log(`Server is running at http://localhost:${PORT}`);
});
