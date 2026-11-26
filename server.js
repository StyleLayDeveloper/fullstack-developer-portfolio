
/* 1. Подключаем Express */
const express = require("express");

/* 2. Подключаем встроенный модуль Path */
const path = require("path");

/* 3. Создаём приложение */
const app = express();

/* 4. Определяем порт сервера */
const PORT = process.env.PORT || 3000;

/* 5. Подключаем статические файлы */
app.use(express.static(path.join(__dirname, "public")));

/* 6. Запускаем сервер */
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
