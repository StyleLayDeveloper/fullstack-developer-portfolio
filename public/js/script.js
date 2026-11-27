
/* =================================
   1. ПЕЧАТАЮЩИЙСЯ ТЕРМИНАЛ
================================= */

const terminal = document.querySelector("#terminal-output");

const terminalMessages = [
    "Initializing portfolio...",
    "Loading projects...",
    "Connecting to database...",
    "System ready."
];

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

async function typeTerminal() {
    if (!terminal) return;

    for (const message of terminalMessages) {
        const line = document.createElement("p");

        line.classList.add("terminal-line");
        line.textContent = "> ";

        terminal.appendChild(line);

        for (const character of message) {
            line.textContent += character;

            if (!reducedMotion) {
                await new Promise(resolve =>
                    setTimeout(resolve, 35)
                );
            }
        }

        if (!reducedMotion) {
            await new Promise(resolve =>
                setTimeout(resolve, 400)
            );
        }
    }

    const cursor = document.createElement("span");

    cursor.classList.add("terminal-cursor");
    cursor.textContent = "█";

    terminal.appendChild(cursor);
}

typeTerminal();


/* =================================
   2. ПАДАЮЩИЙ КОД
================================= */


/* =================================
   2. ПАДАЮЩИЙ КОД
================================= */

const canvas = document.querySelector("#code-rain");
const context = canvas?.getContext("2d");

if (canvas && context && !reducedMotion) {

    const symbols = "01アイウエオカキクケコ{}[]<>/";
    const fontSize = 16;

    // Проверяем, на какой странице находимся
    const isAdminPage = document.querySelector(".admin-container") !== null;

    let columns = 0;
    let drops = [];

    // Настройки анимации
    const columnSpacing = isAdminPage ? 20 : fontSize;
    const speed = isAdminPage ? 0.27 : 0.35;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = rect.width * pixelRatio;
        canvas.height = rect.height * pixelRatio;

        context.setTransform(
            pixelRatio, 0, 0,
            pixelRatio, 0, 0
        );

        columns = Math.ceil(rect.width / columnSpacing);

        drops = Array.from(
            { length: columns },
            () => Math.random() * -50
        );
    }

    function drawCode() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        context.fillStyle = "rgba(8, 8, 8, 0.09)";
        context.fillRect(0, 0, width, height);

        context.font = fontSize + "px monospace";
        context.fillStyle = "#D9822B";

        for (let i = 0; i < drops.length; i++) {

            const symbol = symbols[
                Math.floor(Math.random() * symbols.length)
            ];

            context.globalAlpha = isAdminPage
                ? Math.random() * 0.4 + 0.25
                : Math.random() * 0.7 + 0.3;

            context.fillText(
                symbol,
                i * columnSpacing,
                drops[i] * fontSize
            );

            if (
                drops[i] * fontSize > height &&
                Math.random() > 0.975
            ) {
                drops[i] = 0;
            }

            drops[i] += speed;
        }

        context.globalAlpha = 1;

        requestAnimationFrame(drawCode);
    }

    resizeCanvas();
    drawCode();

    window.addEventListener("resize", resizeCanvas);
}

    /* 3. Mobile navigation */

    const menuToggle = document.querySelector("#menu-toggle");
    const navigation = document.querySelector("#navigation");

    if (menuToggle && navigation) {

        // Открытие и закрытие меню
        menuToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Закрыть меню" : "Открыть меню"
            );
        });

        // Закрытие меню после выбора раздела
        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Открыть меню");
            });
        });

    }



    // Находим контактную форму и элемент для отображения статуса
    const contactForm = document.querySelector("#contact-form");
    const formStatus = document.querySelector("#form-status");

    // Проверяем, что форма существует
    if (contactForm && formStatus) {

        contactForm.addEventListener("submit", async (event) => {
            // Отменяем стандартную отправку формы
            event.preventDefault();

            // Получаем данные из полей формы
            const formData = new FormData(contactForm);

            const messageData = {
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message")
            };

            // Показываем сообщение об отправке
            formStatus.textContent = "Sending message...";

            try {
                // Отправляем данные на Express-сервер
                const response = await fetch("/api/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(messageData)
                });

                const responseText = await response.text();
                const result = responseText ? JSON.parse(responseText) : {};

                // Проверяем результат отправки
                if (!response.ok) {
                    throw new Error(result.error || "Something went wrong");
                }

                // Показываем успешный результат
                formStatus.textContent = result.message;

                // Очищаем форму
                contactForm.reset();

            } catch (error) {
                // Показываем ошибку
                formStatus.textContent = error.message;
            }
        });
    }