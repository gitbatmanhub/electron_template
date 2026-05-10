
import {ipcMain} from "electron";
import {getSucursales} from "../services/sucursales.service";

export function registerSucursalesHandler() {
    ipcMain.handle("sucursales:get_sucursales", async ()=>{
        return getSucursales();
    });
}