/**
 * code.js — renderer process entry point.
 *
 * All communication with the main process goes through window.iodispAPI,
 * which is injected by preload.cjs via contextBridge.
 */

const keysContainer = document.querySelector("#keysContainer");

// ---------------------------------------------------------------------------
// Theme — persisted in localStorage
// ---------------------------------------------------------------------------

const THEME_KEY = "iodisp-theme";
const DEFAULT_THEME = "dark-slick";

function applyTheme(theme) {
    keysContainer.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
}

// Restore saved theme on load
applyTheme(localStorage.getItem(THEME_KEY) ?? DEFAULT_THEME);

// ---------------------------------------------------------------------------
// Key display
// ---------------------------------------------------------------------------

function renderKeys(keys) {
    keysContainer.innerHTML = "";

    keys.forEach((keyName, index) => {
        const keyDiv = document.createElement("div");
        keyDiv.textContent = keyName;
        keyDiv.className = "keyDiv";

        // Single-character keys get a fixed square-ish width; longer ones expand.
        if (keyName.length <= 1) {
            keyDiv.style.width = "34px";
        } else {
            keyDiv.style.padding = "0 10px";
        }

        keysContainer.appendChild(keyDiv);

        // Append a "+" separator between keys (not after the last one)
        if (index < keys.length - 1) {
            const plus = document.createElement("div");
            plus.textContent = "+";
            plus.className = "plus";
            keysContainer.appendChild(plus);
        }
    });
}

// ---------------------------------------------------------------------------
// Show Frame — in-memory only (resets to true on each app launch)
// ---------------------------------------------------------------------------

let showFrame = true;

function applyShowFrame(value) {
    showFrame = value;
    document.querySelector("#menuBar").style.top = value ? "0px" : "-25px";
    document.body.style.boxShadow = value ? "" : "inset 0 0 0 white";
}

// ---------------------------------------------------------------------------
// Context menu / theme
// ---------------------------------------------------------------------------

window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    window.iodispAPI.showContextMenu(localStorage.getItem(THEME_KEY) ?? DEFAULT_THEME, showFrame);
});

window.iodispAPI.onSetTheme(applyTheme);
window.iodispAPI.onSetShowFrame(applyShowFrame);

// ---------------------------------------------------------------------------
// Key events from main process
// ---------------------------------------------------------------------------

window.iodispAPI.onKeysUpdate(renderKeys);

document.getElementById("exitButton").addEventListener("click", () => {
    window.iodispAPI.exit();
});

document.getElementById("minimizeButton").addEventListener("click", () => {
    window.iodispAPI.minimize();
});