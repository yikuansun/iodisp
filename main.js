import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import windowStateKeeper from "electron-window-state";
import { uIOhook, UiohookKey } from "uiohook-napi";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Key mapping
// ---------------------------------------------------------------------------

function buildKeymap() {
    const remapping = JSON.parse(
        fs.readFileSync(path.join(__dirname, "app", "remap.json"), "utf-8")
    );

    const keymap = {};
    for (const [keyName, keyCode] of Object.entries(UiohookKey)) {
        // Collapse Right-variants (e.g. ShiftRight → Shift) unless explicitly remapped
        const normalized = remapping[keyName]
            ?? (keyName.endsWith("Right") ? keyName.replace("Right", "") : keyName);
        keymap[keyCode] = normalized;
    }
    return keymap;
}

const keymap = buildKeymap();

// ---------------------------------------------------------------------------
// Window
// ---------------------------------------------------------------------------

function createWindow() {
    const windowState = windowStateKeeper({ defaultWidth: 400, defaultHeight: 100 });

    const win = new BrowserWindow({
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        alwaysOnTop: true,
        transparent: true,
        frame: false,
        backgroundColor: "#00000000",
        icon: path.join(__dirname, "app", "icon.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            sandbox: false,       // required for preload to use require()
            nodeIntegration: false,
        },
    });

    win.setMenuBarVisibility(false);
    win.loadFile(path.join(__dirname, "app", "index.html"));

    windowState.manage(win);
    return win;
}

// ---------------------------------------------------------------------------
// IPC — key events forwarded from main to renderer
// ---------------------------------------------------------------------------

function startKeyHook(win) {
    const keysPressed = new Set();

    const send = () => win.webContents.send("keys-update", [...keysPressed]);

    uIOhook.on("keydown", (e) => {
        const name = keymap[e.keycode];
        if (name) keysPressed.add(name);
        send();
    });

    uIOhook.on("keyup", (e) => {
        const name = keymap[e.keycode];
        if (name) keysPressed.delete(name);
        send();
    });

    uIOhook.start();

    win.on("closed", () => uIOhook.stop());
}

// ---------------------------------------------------------------------------
// IPC — context menu requested by renderer
// ---------------------------------------------------------------------------

ipcMain.on("show-context-menu", (event, currentTheme, showFrame) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const themes = [
        { label: "Default",    id: "default"    },
        { label: "Dark Slick", id: "dark-slick" },
    ];
    const menu = Menu.buildFromTemplate([
        {
            label: "Theme",
            submenu: themes.map(({ label, id }) => ({
                label,
                type: "radio",
                checked: currentTheme === id,
                click: () => event.sender.send("set-theme", id),
            })),
        },
        {
            label: "Show Frame",
            type: "checkbox",
            checked: showFrame,
            click: (item) => event.sender.send("set-show-frame", item.checked),
        },
        { type: "separator" },
        { role: "quit" },
    ]);
    menu.popup({ window: win });
});

ipcMain.on("exit", () => app.quit());

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------

app.whenReady().then(() => {
    const win = createWindow();
    startKeyHook(win);
});

app.on("window-all-closed", () => app.quit());
