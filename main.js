const { app, BrowserWindow } = require("electron");
require("@electron/remote/main").initialize();

function createWindow() {
    var mainWindow = new BrowserWindow({
        width: 800,
        height: 200,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            webviewTag: true,
            devTools: false
        }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile("app/index.html");

    require("@electron/remote/main").enable(mainWindow.webContents);
    
}

app.whenReady().then(function() {
    createWindow();
});

app.on("window-all-closed", function() { app.quit(); });