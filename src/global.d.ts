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
    descripcion: string
    idCategoriaCola: string
    activo: boolean
    imagenUrl: string
    imagenFileName: string
    deletedAt: any
}

