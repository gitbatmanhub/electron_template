export {};

declare global {
    interface Window {
        api: {
            app: {
                getVersion: () => Promise<string>;
            };
            file: {
                open: () => Promise<string | null>;
            };
            sucursales: {
                get_sucursales: () => Promise<Sucursal[]>;
            };
            servicios: {
                getBySucursal: (idSucursal: string) => Promise<ServiciosSucursales[]>;
            };
            turnos: {
                create: (idServicio: string) => Promise<TurnoResponse>;
            };
            printer: {
                printCurrent: () => Promise<boolean>;
            };
        };
    }
}


export interface Sucursal {
    idSucursal: string
    nombre: string
    codigo: string
    activa: boolean
}

export interface ServiciosSucursales {
    idServicio: string
    idSucursal: string
    nombre: string
    codigo: string
    descripcion?: string | null
    idCategoriaCola?: string
    activo: boolean
    imagenUrl?: string | null
    imagenFileName?: string | null
    deletedAt?: any
}

export interface TurnoResponse {
    turno?: string | number
    codigo?: string | number
    ticket?: string | number
    codigoServicio?: string
    numeroTurno?: string | number
    numero?: string | number
    data?: TurnoResponse
}
