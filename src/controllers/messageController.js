
const db = require("../database/database");

// Сохранение нового сообщения
function createMessage(req, res) {
    const { name, email, message } = req.body;

    // Проверяем обязательные поля
    if (!name || !email || !message) {
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

    statement.run(name.trim(), email.trim(), message.trim());

    res.status(201).json({
        success: true,
        message: "Сообщение успешно отправлено!"
    });
}

module.exports = {
    createMessage
};
