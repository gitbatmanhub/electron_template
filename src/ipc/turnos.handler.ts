import { ipcMain } from "electron";
import { crearTurno } from "../services/turnos.service";

export function registerTurnosHandlers() {
    ipcMain.handle("turnos:create", async (_event, idServicio: string, apiBaseUrl?: string) => {
        if (!idServicio) {
            throw new Error("idServicio es requerido");
        }

        return crearTurno({
            idServicio,
            origen: "Totem"
        }, apiBaseUrl);
    });
}
