import { app, BrowserWindow } from "electron";
import path from "node:path";
import {registerAppHandlers} from "./ipc/app.handlers";
import {registerFileHandlers} from "./ipc/file.handler";
import {createWindow} from "./windows/createMainWindow";
import {registerSucursalesHandler} from "./ipc/sucursales.handler";
import {registerServiciosHandlers} from "./ipc/servicios.sucursales.handler";
import {registerTurnosHandlers} from "./ipc/turnos.handler";
import {registerPrinterHandlers} from "./ipc/printer.handler";



app.whenReady().then(()=>{
    registerAppHandlers();
    registerFileHandlers();
    registerSucursalesHandler();
    registerServiciosHandlers();
    registerTurnosHandlers();
    registerPrinterHandlers();


    createWindow();

});


