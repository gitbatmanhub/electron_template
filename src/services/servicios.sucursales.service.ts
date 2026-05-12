import { buildApiUrl } from "./api-url";

export async function getServiciosSucursales(idSucursal: string, apiBaseUrl?: string) {
    const response = await fetch(buildApiUrl(apiBaseUrl, `/api/servicios/sucursal/${idSucursal}`));

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    return response.json();
}
