const { app, BrowserWindow } = require("electron");
const electronWindowState = require("electron-window-state");
require("@electron/remote/main").initialize();

function createWindow() {
    var windowState = electronWindowState({
        defaultWidth: 400,
        defaultHeight: 100
    });

    var mainWindow = new BrowserWindow({
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            webviewTag: true,
        },
        icon: "app/icon.png",
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile("app/index.html");
    mainWindow.setAlwaysOnTop(true);

    require("@electron/remote/main").enable(mainWindow.webContents);

    windowState.manage(mainWindow);
    
}

app.whenReady().then(function() {
    createWindow();
});

app.on("window-all-closed", function() { app.quit(); });