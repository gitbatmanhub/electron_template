
import {ipcMain} from "electron";
import {getSucursales} from "../services/sucursales.service";

export function registerSucursalesHandler() {
    ipcMain.handle("sucursales:get_sucursales", async (_event, apiBaseUrl?: string)=>{
        return getSucursales(apiBaseUrl);
    });
}
