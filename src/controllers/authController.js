
const bcrypt = require("bcrypt");


// Проверка логина и пароля администратора
async function login(req, res) {
    const { username, password } = req.body;

    // Проверяем логин
    if (username !== process.env.ADMIN_USERNAME) {
        return res.status(401).json({
            success: false,
            message: "Неверный логин или пароль"
        });
    }

    // Проверяем пароль
    const passwordMatch = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
    );

    if (!passwordMatch) {
        return res.status(401).json({
            success: false,
            message: "Неверный логин или пароль"
        });
    }

    // Создаём новую сессию после авторизации
    req.session.regenerate((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Не удалось создать сессию"
            });
        }

        // Назначаем права администратора
        req.session.isAdmin = true;

        // Сохраняем сессию
        req.session.save((error) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Не удалось сохранить сессию"
                });
            }

            res.json({
                success: true,
                message: "Авторизация успешна"
            });
        });
    });
}


// Проверка статуса авторизации
function checkAuth(req, res) {
    res.json({
        isAdmin: req.session.isAdmin === true
    });
}

// Выход администратора из системы
function logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Не удалось выйти из системы"
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Вы успешно вышли из системы"
        });
    });
}

module.exports = {
    login,
    checkAuth,
    logout
};