import { ipcMain, dialog } from "electron";
import { readTextFile } from "../services/file.service";

export function registerFileHandlers() {
    ipcMain.handle("file:open", async () => {
        const result = await dialog.showOpenDialog({
            properties: ["openFile"]
        });

        if (result.canceled) return null;

        return readTextFile(result.filePaths[0]);
    });
}