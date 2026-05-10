import { app, BrowserWindow } from "electron";
import path from "node:path";
import {registerAppHandlers} from "./ipc/app.handlers";
import {registerFileHandlers} from "./ipc/file.handler";
import {createWindow} from "./windows/createMainWindow";
import {registerSucursalesHandler} from "./ipc/sucursales.handler";
import {registerServiciosSucursalesHandler} from "./ipc/servicios.sucursales.handler";



app.whenReady().then(()=>{
    registerAppHandlers();
    registerFileHandlers();
    registerSucursalesHandler();
    registerServiciosSucursalesHandler();


    createWindow();

});




