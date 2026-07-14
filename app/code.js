/**
 * code.js — renderer process entry point.
 *
 * All communication with the main process goes through window.iodispAPI,
 * which is injected by preload.cjs via contextBridge.
 */

const keysContainer = document.querySelector("#keysContainer");

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
// Context menu / theme
// ---------------------------------------------------------------------------

window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    window.iodispAPI.showContextMenu();
});

window.iodispAPI.onSetTheme((theme) => {
    keysContainer.setAttribute("data-theme", theme);
});

// ---------------------------------------------------------------------------
// Key events from main process
// ---------------------------------------------------------------------------

window.iodispAPI.onKeysUpdate(renderKeys);
