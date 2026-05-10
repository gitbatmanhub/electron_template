import { ipcMain, app } from "electron";

export function registerAppHandlers() {
    ipcMain.handle("app:api", () => {
        return app.getVersion();
    });
}