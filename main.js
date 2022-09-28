const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 390,
        height: 600,
        maxWidth: 390,
        maxHeight: 600,
        minWidth: 390,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './preload.js'),
        },
        icon: path.join(__dirname, './icon/icon.png'),
    });
    mainWindow.loadFile('index.html');
    mainWindow.setMenu(null);
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('request-main-process-action', (event, arg) => {
    event.sender.send('main-process-response', arg);
});