require("dotenv").config();

/* 1. Подключаем библиотеки */
const express = require("express");
const path = require("path");
const session = require("express-session");

/* 2. Подключаем базу данных */
const db = require("./src/database/database");

/* 3. Подключаем маршруты */
const messageRoutes = require("./src/routes/messageRoutes");
const authRoutes = require("./src/routes/authRoutes");

/* 4. Создаём приложение */
const app = express();
// Настройка пользовательских сессий

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
    }
}));
const PORT = process.env.PORT || 3000;

/* 5. Настраиваем обработку запросов */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 6. Подключаем статические файлы */
app.use(express.static(path.join(__dirname, "public")));

/* 7. Подключаем API */
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

/* 8. Запускаем сервер */
app.listen(PORT, () => {
    console.log("Database is ready:", !!db);
    console.log(`Server is running at http://localhost:${PORT}`);
});
