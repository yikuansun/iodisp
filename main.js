const { app, BrowserWindow } = require("electron");
require("@electron/remote/main").initialize();

function createWindow() {
    var mainWindow = new BrowserWindow({
        width: 800,
        height: 200,
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            webviewTag: true,
        }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile("app/index.html");
    mainWindow.setAlwaysOnTop(true);

    require("@electron/remote/main").enable(mainWindow.webContents);
    
}

app.whenReady().then(function() {
    createWindow();
});

app.on("window-all-closed", function() { app.quit(); });