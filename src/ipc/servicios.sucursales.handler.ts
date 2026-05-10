
import {ipcMain} from "electron";
import {getSucursales} from "../services/sucursales.service";
import {getServiciosSucursales} from "../services/servicios.sucursales.service";

export function registerServiciosSucursalesHandler(idSucursal?: string) {
    ipcMain.handle("servicios_sucursales:get_servicios_sucursales", async ()=>{
        return getServiciosSucursales(idSucursal);
    });
}