import {app, BrowserWindow} from "electron";
import path from "node:path";

export function createWindow() {
    const isDev = process.env.NODE_ENV === "development";

    const win = new BrowserWindow({
        // fullscreen: true,
        // kiosk: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "../preload/preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        },
    });



    if (isDev) {
        win.loadURL("http://127.0.0.1:5173");
    } else {
        win.loadFile(path.join(__dirname, "../renderer/index.html"));
    }
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
