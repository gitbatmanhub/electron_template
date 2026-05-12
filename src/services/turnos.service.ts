export interface CrearTurnoPayload {
    idServicio: string;
    origen: "Totem";
}

const API_BASE_URL = "https://endpoint.grupobiomedicis.com";

export async function crearTurno(payload: CrearTurnoPayload) {
    const response = await fetch(`${API_BASE_URL}/api/turnos`, {
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
