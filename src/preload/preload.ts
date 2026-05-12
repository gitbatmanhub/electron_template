import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    file: {
        open: () => ipcRenderer.invoke("file:open")
    },
    sucursales: {
        get_sucursales: (apiBaseUrl?: string) => ipcRenderer.invoke("sucursales:get_sucursales", apiBaseUrl)
    },
    servicios: {
        getBySucursal: (idSucursal: string, apiBaseUrl?: string) =>
            ipcRenderer.invoke("servicios:get-by-sucursal", idSucursal, apiBaseUrl)
    },
    turnos: {
        create: (idServicio: string, apiBaseUrl?: string) =>
            ipcRenderer.invoke("turnos:create", idServicio, apiBaseUrl)
    },
    printer: {
        printTicket: (ticket: {
            brand: string;
            branch: string;
            code: string;
            service: string;
            date: string;
            footer: string;
        }) => ipcRenderer.invoke("printer:print-ticket", ticket)
    }
});
