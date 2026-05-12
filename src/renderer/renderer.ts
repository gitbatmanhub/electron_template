import { createIcons, icons } from "lucide";

type Sucursal = {
    idSucursal: string;
    nombre: string;
    codigo: string;
    activa: boolean;
};

type Servicio = {
    idServicio: string;
    idSucursal: string;
    nombre: string;
    codigo: string;
    descripcion?: string | null;
    activo: boolean;
    imagenUrl?: string | null;
    imagenFileName?: string | null;
};

type TurnoResponse = {
    turno?: string | number;
    codigo?: string | number;
    ticket?: string | number;
    codigoServicio?: string;
    numeroTurno?: string | number;
    numero?: string | number;
    data?: TurnoResponse;
};

const STORAGE_SUCURSAL_KEY = "totem.selectedSucursalId";
const app = document.getElementById("app") as HTMLDivElement;

let sucursales: Sucursal[] = [];
let servicios: Servicio[] = [];
let selectedSucursalId = localStorage.getItem(STORAGE_SUCURSAL_KEY) ?? "";
let isLoading = false;
let errorMessage = "";

window.addEventListener("load", async () => {
    render();
    await loadSucursales();

    if (selectedSucursalId) {
        await loadServicios(selectedSucursalId);
    }
});

window.addEventListener("afterprint", () => {
    closeTicket();
});

async function loadSucursales() {
    setLoading(true);
    try {
        const response = await window.api.sucursales.get_sucursales();
        sucursales = normalizeArray<Sucursal>(response).filter((sucursal) => sucursal.activa !== false);

        if (!sucursales.some((sucursal) => sucursal.idSucursal === selectedSucursalId)) {
            selectedSucursalId = "";
            localStorage.removeItem(STORAGE_SUCURSAL_KEY);
        }

        errorMessage = "";
    } catch (error) {
        errorMessage = "No se pudieron cargar las sucursales. Revisa la conexión e intenta de nuevo.";
        console.error("Error cargando sucursales:", error);
    } finally {
        setLoading(false);
    }
}

async function loadServicios(idSucursal: string) {
    setLoading(true);
    try {
        const response = await window.api.servicios.getBySucursal(idSucursal);
        servicios = normalizeArray<Servicio>(response).filter((servicio) => servicio.activo !== false);
        selectedSucursalId = idSucursal;
        localStorage.setItem(STORAGE_SUCURSAL_KEY, idSucursal);
        errorMessage = servicios.length
            ? ""
            : "Esta sucursal no tiene servicios activos para mostrar.";
    } catch (error) {
        servicios = [];
        errorMessage = "No se pudieron cargar los servicios. Revisa la conexión e intenta de nuevo.";
        console.error("Error cargando servicios:", error);
    } finally {
        setLoading(false);
    }
}

function render() {
    const selectedSucursal = getSelectedSucursal();

    app.innerHTML = `
        <header class="top-bar">
            <button id="settingsButton" class="icon-button" type="button" aria-label="Abrir configuración" title="Configuración">
                <i data-lucide="settings"></i>
            </button>
            <div class="brand-title">
                <h1>Bienvenido a Centro Médico Biomedicis</h1>
                <p>Selecciona tu servicio</p>
            </div>
            <button id="refreshButton" class="icon-button" type="button" aria-label="Actualizar servicios" title="Actualizar">
                <i data-lucide="refresh-cw"></i>
            </button>
        </header>

        <main class="totem-main">
            ${selectedSucursalId ? renderServiciosView(selectedSucursal?.nombre ?? "") : renderSetupView()}
        </main>

        <section id="ticketLayer" class="ticket-layer" aria-live="polite"></section>
    `;

    bindEvents();
    createIcons({ icons });
}

function renderSetupView() {
    return `
        <section class="setup-panel" aria-label="Selección de sucursal">
            <div class="setup-panel__header">
                <span class="setup-eyebrow">Inicio</span>
                <h2>Selecciona una sucursal</h2>
                <p>Esta pantalla queda disponible para configurar el tótem antes de atender pacientes.</p>
            </div>

            <label class="field-label" for="sucursalSelect">Sucursal</label>
            <select id="sucursalSelect" class="branch-select">
                <option value="">Selecciona una sucursal</option>
                ${sucursales.map((sucursal) => `
                    <option value="${escapeHtml(sucursal.idSucursal)}" ${sucursal.idSucursal === selectedSucursalId ? "selected" : ""}>
                        ${escapeHtml(sucursal.nombre)}
                    </option>
                `).join("")}
            </select>
            
            <div>
                        ${renderStatus()}

</div>


            <div class="setup-actions">
                <button id="reloadBranchesButton" class="secondary-button" type="button">
                    <i data-lucide="refresh-cw"></i>
                    Actualizar
                </button>
                <button id="continueButton" class="primary-button" type="button" ${!sucursales.length ? "disabled" : ""}>
                    Continuar
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
        </section>
    `;
}

function renderServiciosView(sucursalNombre: string) {
    const count = servicios.length;
    const columns = count <= 4 ? Math.max(count, 1) : Math.min(4, Math.ceil(count / 2));
    const rows = count <= 4 ? 1 : 2;
    const cardWidth = count <= 4 ? 430 : 350;
    const gap = 32;
    const calculatedWidth = columns * cardWidth + Math.max(columns - 1, 0) * gap;

    return `
        <section class="services-shell">
            <div class="branch-chip">
                <i data-lucide="map-pin"></i>
                ${escapeHtml(sucursalNombre)}
            </div>

            ${renderStatus()}

            <div
                class="services-grid services-grid--${count <= 4 ? "large" : "compact"}"
                style="--columns: ${columns}; --visible-rows: ${rows}; --grid-width: min(90vw, ${calculatedWidth}px);"
            >
                ${servicios.map(renderServiceCard).join("")}
            </div>
        </section>
    `;
}

function renderServiceCard(servicio: Servicio) {
    return `
        <button class="service-card" type="button" data-service-id="${escapeHtml(servicio.idServicio)}">
            <span class="service-media">
                ${servicio.imagenUrl ? `
                    <img src="${escapeHtml(servicio.imagenUrl)}" alt="" loading="lazy">
                ` : renderFallbackIcon()}
            </span>
            <span class="service-name">${escapeHtml(servicio.nombre).toUpperCase()}</span>
            <span class="service-divider"></span>
            ${servicio.descripcion ? `<span class="service-description">${escapeHtml(servicio.descripcion)}</span>` : ""}
        </button>
    `;
}

function renderFallbackIcon() {
    return `
        <span class="service-fallback" aria-hidden="true">
            <i data-lucide="stethoscope"></i>
        </span>
    `;
}

function renderStatus() {
    if (isLoading) {
        return `<div class="status-message status-message--loading">Cargando...</div>`;
    }

    if (errorMessage) {
        return `<div class="status-message status-message--error">${escapeHtml(errorMessage)}</div>`;
    }

    return "";
}

function bindEvents() {
    document.getElementById("settingsButton")?.addEventListener("click", () => {
        servicios = [];
        selectedSucursalId = "";
        localStorage.removeItem(STORAGE_SUCURSAL_KEY);
        render();
    });

    document.getElementById("refreshButton")?.addEventListener("click", async () => {
        if (selectedSucursalId) {
            await loadServicios(selectedSucursalId);
        } else {
            await loadSucursales();
        }
    });

    document.getElementById("reloadBranchesButton")?.addEventListener("click", loadSucursales);

    document.getElementById("continueButton")?.addEventListener("click", async () => {
        const select = document.getElementById("sucursalSelect") as HTMLSelectElement | null;
        const idSucursal = select?.value ?? "";

        if (!idSucursal) {
            errorMessage = "Selecciona una sucursal para continuar.";
            render();
            return;
        }

        await loadServicios(idSucursal);
    });

    document.querySelectorAll<HTMLButtonElement>(".service-card").forEach((card) => {
        card.addEventListener("click", async () => {
            const servicio = servicios.find((item) => item.idServicio === card.dataset.serviceId);

            if (servicio) {
                await createTurno(servicio);
            }
        });
    });

    document.querySelectorAll<HTMLImageElement>(".service-media img").forEach((image) => {
        image.addEventListener("error", () => {
            image.replaceWith(htmlToElement(renderFallbackIcon()));
            createIcons({ icons });
        });
    });
}

async function createTurno(servicio: Servicio) {
    setLoading(true);
    try {
        const response = await window.api.turnos.create(servicio.idServicio);
        const ticketCode = buildTicketCode(response, servicio);
        isLoading = false;
        errorMessage = "";
        render();
        showTicket(servicio, ticketCode);
        setTimeout(printTicket, 350);
    } catch (error) {
        isLoading = false;
        errorMessage = "No se pudo crear el turno. Intenta nuevamente.";
        console.error("Error creando turno:", error);
        render();
    }
}

function showTicket(servicio: Servicio, ticketCode: string) {
    const selectedSucursal = getSelectedSucursal();
    const ticketLayer = document.getElementById("ticketLayer") as HTMLElement;
    const now = new Date();

    ticketLayer.innerHTML = `
        <div class="ticket-backdrop">
            <article class="ticket-card" role="dialog" aria-modal="true" aria-label="Turno generado">
                <button id="closeTicketButton" class="ticket-close" type="button" aria-label="Cerrar">
                    <i data-lucide="x"></i>
                </button>
                <div id="printableTicket" class="ticket-paper">
                    <p class="ticket-brand">Centro Médico Biomedicis</p>
                    <p class="ticket-branch">${escapeHtml(selectedSucursal?.nombre ?? "")}</p>
                    <p class="ticket-label">Turno</p>
                    <strong class="ticket-code">${escapeHtml(ticketCode)}</strong>
                    <p class="ticket-service">${escapeHtml(servicio.nombre)}</p>
                    <p class="ticket-date">${now.toLocaleDateString("es-EC")} ${now.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}</p>
                    <p class="ticket-footer">Gracias por su visita</p>
                </div>
                <div class="ticket-actions">
                    <button id="printTicketButton" class="primary-button" type="button">
                        <i data-lucide="printer"></i>
                        Imprimir
                    </button>
                    <button id="doneTicketButton" class="secondary-button" type="button">Finalizar</button>
                </div>
            </article>
        </div>
    `;

    document.getElementById("closeTicketButton")?.addEventListener("click", closeTicket);
    document.getElementById("doneTicketButton")?.addEventListener("click", closeTicket);
    document.getElementById("printTicketButton")?.addEventListener("click", printTicket);
    createIcons({ icons });
}

async function printTicket() {
    try {
        await window.api.printer.printCurrent();
        closeTicket();
    } catch (error) {
        console.error("Error imprimiendo ticket:", error);
        window.print();
    }
}

function closeTicket() {
    const ticketLayer = document.getElementById("ticketLayer");

    if (ticketLayer) {
        ticketLayer.innerHTML = "";
    }

    render();
}

function buildTicketCode(response: TurnoResponse, servicio: Servicio) {
    const turno = response?.data ?? response;
    const prioritized = turno?.turno ?? turno?.codigo ?? turno?.ticket;

    if (prioritized !== undefined && prioritized !== null && `${prioritized}`.trim()) {
        return `${prioritized}`;
    }

    const codigoServicio = turno?.codigoServicio ?? servicio.codigo;
    const numeroTurno = turno?.numeroTurno ?? turno?.numero ?? "";

    return `${codigoServicio}${numeroTurno}`.trim();
}

function setLoading(value: boolean) {
    isLoading = value;
    render();
}

function getSelectedSucursal() {
    return sucursales.find((sucursal) => sucursal.idSucursal === selectedSucursalId);
}

function normalizeArray<T>(response: unknown): T[] {
    if (Array.isArray(response)) {
        return response;
    }

    if (response && typeof response === "object" && "data" in response) {
        const data = (response as { data: unknown }).data;
        return Array.isArray(data) ? data : [];
    }

    return [];
}

function htmlToElement(html: string) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild as HTMLElement;
}

function escapeHtml(value: string | number | null | undefined) {
    return `${value ?? ""}`
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
