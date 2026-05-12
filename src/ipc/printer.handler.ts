import { BrowserWindow, ipcMain } from "electron";

export function registerPrinterHandlers() {
    ipcMain.handle("printer:print-current", async (event) => {
        const window = BrowserWindow.fromWebContents(event.sender);

        if (!window) {
            throw new Error("No se encontró la ventana para imprimir");
        }

        const silent = process.env.TOTEM_SILENT_PRINT === "true";

        return new Promise<boolean>((resolve, reject) => {
            window.webContents.print(
                {
                    silent,
                    printBackground: true
                },
                (success, failureReason) => {
                    if (success) {
                        resolve(true);
                        return;
                    }

                    reject(new Error(failureReason || "No se pudo imprimir el ticket"));
                }
            );
        });
    });
}
