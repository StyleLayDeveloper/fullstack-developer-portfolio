
/* =================================
   ADMIN PANEL
================================= */

// Находим элементы страницы
const loginForm = document.querySelector("#login-form");
const loginSection = document.querySelector("#admin-login");
const dashboard = document.querySelector("#admin-dashboard");
const loginStatus = document.querySelector("#login-status");
const messagesList = document.querySelector("#messages-list");
const logoutButton = document.querySelector("#logout-button");


// =================================
// Проверка авторизации
// =================================

async function checkAuth() {
    try {
        const response = await fetch("/api/auth/status");
        const result = await response.json();

        if (result.isAdmin) {
            showDashboard();
            loadMessages();
        } else {
            showLogin();
        }

    } catch (error) {
        console.error("Auth check error:", error);
        showLogin();
        loginStatus.textContent = "Не удалось проверить авторизацию";
    }
}


// =================================
// Отображение интерфейса
// =================================

// Показываем форму входа
function showLogin() {
    loginSection.hidden = false;
    dashboard.hidden = true;
}

// Показываем панель администратора
function showDashboard() {
    loginSection.hidden = true;
    dashboard.hidden = false;
}


// =================================
// Авторизация администратора
// =================================

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
        loginStatus.textContent = "Выполняется вход...";

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        loginStatus.textContent = result.message;
        loginForm.reset();

        showDashboard();
        loadMessages();

    } catch (error) {
        loginStatus.textContent = error.message;
    }
});


// =================================
// Загрузка сообщений
// =================================

async function loadMessages() {
    try {
        const response = await fetch("/api/messages");
        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Не удалось загрузить сообщения"
            );
        }

        messagesList.innerHTML = "";

        if (result.messages.length === 0) {
            messagesList.textContent = "Сообщений пока нет.";
            return;
        }

        result.messages.forEach((message) => {

            // Создаём карточку сообщения
            const messageElement = document.createElement("article");

            // Имя отправителя
            const nameElement = document.createElement("h3");
            nameElement.textContent = message.name;

            // Email отправителя
            const emailElement = document.createElement("p");
            emailElement.textContent = message.email;

            // Текст сообщения
            const textElement = document.createElement("p");
            textElement.textContent = message.message;

            // Дата отправки
            const dateElement = document.createElement("small");
            dateElement.textContent = message.created_at;

            // Кнопка удаления
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.dataset.id = message.id;
            deleteButton.textContent = "$ delete";

            // Собираем карточку
            messageElement.append(
                nameElement,
                emailElement,
                textElement,
                dateElement,
                deleteButton
            );

            messagesList.appendChild(messageElement);
        });

    } catch (error) {
        messagesList.textContent = error.message;
    }
}


// =================================
// Удаление сообщений
// =================================

messagesList.addEventListener("click", async (event) => {

    if (!event.target.classList.contains("delete-button")) {
        return;
    }

    const messageId = event.target.dataset.id;

    try {
        const response = await fetch(`/api/messages/${messageId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        loadMessages();

    } catch (error) {
        alert(error.message);
    }
});


// =================================
// Выход администратора
// =================================

logoutButton.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Не удалось выйти из системы");
        }

        showLogin();

    } catch (error) {
        alert(error.message);
    }
});


// =================================
// Запуск проверки авторизации
// =================================

checkAuth();
