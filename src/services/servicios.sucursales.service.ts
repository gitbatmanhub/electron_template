export async function getSucursales() {
    const response = await fetch("https://endpoint.grupobiomedicis.com/api/sucursales");

    if (!response.ok) {
        throw new Error(`HTTP error ${response}`);
    }

    return response.json();
}