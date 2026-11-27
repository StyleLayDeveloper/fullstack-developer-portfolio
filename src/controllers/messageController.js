
const db = require("../database/database");


// Сохранение нового сообщения
function createMessage(req, res) {
    const { name, email, message } = req.body;

    // Проверяем тип данных
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string"
    ) {
        return res.status(400).json({
            success: false,
            error: "Некорректные данные"
        });
    }

    // Удаляем лишние пробелы по краям
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    // Проверяем, что поля не пустые
    if (!cleanName || !cleanEmail || !cleanMessage) {
        return res.status(400).json({
            success: false,
            error: "Все поля обязательны для заполнения"
        });
    }

    // Сохраняем сообщение в SQLite
    const statement = db.prepare(`
        INSERT INTO messages (name, email, message)
        VALUES (?, ?, ?)
    `);

    statement.run(cleanName, cleanEmail, cleanMessage);

    res.status(201).json({
        success: true,
        message: "Сообщение успешно отправлено!"
    });
}

// Получение всех сообщений из базы данных
function getMessages(req, res) {
    const messages = db.prepare(`
        SELECT id, name, email, message, created_at
        FROM messages
        ORDER BY created_at DESC
    `).all();

    res.json({
        success: true,
        messages
    });
}

// Удаление сообщения по ID
function deleteMessage(req, res) {
    const { id } = req.params;

    const result = db.prepare(`
        DELETE FROM messages
        WHERE id = ?
    `).run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Сообщение не найдено"
        });
    }

    res.json({
        success: true,
        message: "Сообщение успешно удалено"
    });
}

module.exports = {
    createMessage,
    getMessages,
    deleteMessage
};