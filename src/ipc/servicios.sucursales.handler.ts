import { ipcMain } from "electron";
import {getServiciosSucursales} from "../services/servicios.sucursales.service";

export function registerServiciosHandlers() {
    ipcMain.handle("servicios:get-by-sucursal", async (_event, idSucursal: string) => {
        if (!idSucursal) {
            throw new Error("idSucursal es requerido");
        }

        return getServiciosSucursales(idSucursal);
    });
}