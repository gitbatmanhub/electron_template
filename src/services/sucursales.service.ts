import { buildApiUrl } from "./api-url";

export async function getSucursales(apiBaseUrl?: string) {
    const response = await fetch(buildApiUrl(apiBaseUrl, "/api/sucursales"));

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    return response.json();
}
