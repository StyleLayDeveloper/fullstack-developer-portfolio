
const express = require("express");
const router = express.Router();

const {
    createMessage,
    getMessages,
    deleteMessage
} = require("../controllers/messageController");

const { requireAdmin } = require("../middleware/authMiddleware");

// Отправка сообщения
router.post("/", createMessage);

// Получение сообщений (только для администратора)
router.get("/", requireAdmin, getMessages);

// Удаление сообщения (только для администратора)
router.delete("/:id", requireAdmin, deleteMessage);

module.exports = router;
