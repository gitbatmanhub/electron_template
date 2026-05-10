export async function getServiciosSucursales(idSucursal?: string) {
    const response = await fetch(`https://endpoint.grupobiomedicis.com/api/servicios/sucursal/${idSucursal}`);

    if (!response.ok) {
        throw new Error(`HTTP error ${response}`);
    }

    return response.json();
}