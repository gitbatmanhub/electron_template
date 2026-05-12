import { buildApiUrl } from "./api-url";

export interface CrearTurnoPayload {
    idServicio: string;
    origen: "Totem";
}

export async function crearTurno(payload: CrearTurnoPayload, apiBaseUrl?: string) {
    const response = await fetch(buildApiUrl(apiBaseUrl, "/api/turnos"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    return response.json();
}
