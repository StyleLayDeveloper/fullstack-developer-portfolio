
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

const canvas = document.querySelector("#code-rain");
const context = canvas?.getContext("2d");

if (canvas && context && !reducedMotion) {

    const symbols = "01アイウエオカキクケコ{}[]<>/";
    const fontSize = 16;

    let columns = 0;
    let drops = [];

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = rect.width * pixelRatio;
        canvas.height = rect.height * pixelRatio;

        context.setTransform(
            pixelRatio, 0, 0,
            pixelRatio, 0, 0
        );

        columns = Math.ceil(rect.width / fontSize);

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

            context.globalAlpha = Math.random() * 0.7 + 0.3;

            context.fillText(
                symbol,
                i * fontSize,
                drops[i] * fontSize
            );

            if (drops[i] * fontSize > height &&
                Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i] += 0.35;
        }

        context.globalAlpha = 1;

        requestAnimationFrame(drawCode);
    }

    resizeCanvas();
    drawCode();

    window.addEventListener("resize", resizeCanvas);
}
