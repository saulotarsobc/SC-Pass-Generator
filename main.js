// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 390,
        height: 600,
        maxWidth: 390,
        maxHeight: 600,
        minWidth: 390,
        minHeight: 600,
    });

    mainWindow.loadFile('index.html');
    mainWindow.setMenu(null);
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
