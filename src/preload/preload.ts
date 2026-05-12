import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    file: {
        open: () => ipcRenderer.invoke("file:open")
    },
    sucursales: {
        get_sucursales: () => ipcRenderer.invoke("sucursales:get_sucursales")
    },
    servicios: {
        getBySucursal: (idSucursal: string) =>
            ipcRenderer.invoke("servicios:get-by-sucursal", idSucursal)
    },
    turnos: {
        create: (idServicio: string) =>
            ipcRenderer.invoke("turnos:create", idServicio)
    },
    printer: {
        printCurrent: () => ipcRenderer.invoke("printer:print-current")
    }
});
