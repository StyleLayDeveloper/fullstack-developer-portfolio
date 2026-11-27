
const express = require("express");
const router = express.Router();

const {
    login,
    checkAuth,
    logout
} = require("../controllers/authController");

// Вход администратора
router.post("/login", login);

// Проверка авторизации
router.get("/status", checkAuth);

// Выход администратора
router.post("/logout", logout);

module.exports = router;
