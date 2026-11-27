// Проверяем, авторизован ли администратор
function requireAdmin(req, res, next) {
    if (req.session.isAdmin !== true) {
        return res.status(401).json({
            success: false,
            message: "Необходима авторизация"
        });
    }

    next();
}

module.exports = {
    requireAdmin
};