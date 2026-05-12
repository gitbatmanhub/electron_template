import { BrowserWindow, ipcMain } from "electron";

interface TicketPrintData {
    brand: string;
    branch: string;
    code: string;
    service: string;
    date: string;
    footer: string;
}

export function registerPrinterHandlers() {
    ipcMain.handle("printer:print-ticket", async (_event, ticket: TicketPrintData) => {
        const silent = process.env.TOTEM_SILENT_PRINT !== "false";
        const printWindow = new BrowserWindow({
            show: false,
            width: 320,
            height: 620,
            autoHideMenuBar: true,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false
            }
        });

        return new Promise<boolean>((resolve, reject) => {
            printWindow.webContents.once("did-finish-load", async () => {
                const pageHeight = await getTicketPageHeight(printWindow);

                printWindow.webContents.print(
                    {
                        silent,
                        printBackground: true,
                        margins: {
                            marginType: "none"
                        },
                        pageSize: {
                            width: 72000,
                            height: pageHeight
                        }
                    },
                    (success, failureReason) => {
                        printWindow.close();

                        if (success) {
                            resolve(true);
                            return;
                        }

                        reject(new Error(failureReason || "No se pudo imprimir el ticket"));
                    }
                );
            });

            printWindow.webContents.once("did-fail-load", (_event, _errorCode, errorDescription) => {
                printWindow.close();
                reject(new Error(errorDescription || "No se pudo cargar el ticket para imprimir"));
            });

            printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderTicketHtml(ticket))}`);
        });
    });
}

function renderTicketHtml(ticket: TicketPrintData) {
    return `
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <style>
        @page {
            size: 72mm auto;
            margin: 0;
        }

        * {
            box-sizing: border-box;
        }

        html,
        body {
            width: 72mm;
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #111111;
            font-family: Arial, Helvetica, sans-serif;
        }

        .ticket {
            width: 72mm;
            padding: 6mm 4mm;
            text-align: center;
        }

        .brand {
            margin: 0;
            font-size: 17px;
            font-weight: 800;
        }

        .branch,
        .date,
        .footer {
            margin: 2.5mm 0 0;
            font-size: 12px;
            font-weight: 700;
        }

        .label {
            margin: 8mm 0 0;
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .code {
            display: block;
            margin-top: 2mm;
            font-size: 42px;
            font-weight: 900;
            line-height: 1;
        }

        .service {
            margin: 6mm 0 0;
            font-size: 16px;
            font-weight: 900;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <main class="ticket">
        <p class="brand">${escapeHtml(ticket.brand)}</p>
        <p class="branch">${escapeHtml(ticket.branch)}</p>
        <p class="label">Turno</p>
        <strong class="code">${escapeHtml(ticket.code)}</strong>
        <p class="service">${escapeHtml(ticket.service)}</p>
        <p class="date">${escapeHtml(ticket.date)}</p>
        <p class="footer">${escapeHtml(ticket.footer)}</p>
    </main>
</body>
</html>`;
}

async function getTicketPageHeight(printWindow: BrowserWindow) {
    const contentHeight = await printWindow.webContents.executeJavaScript(`
        Math.ceil(document.querySelector(".ticket").getBoundingClientRect().height)
    `) as number;
    const cssPixelToMicrons = 25400 / 96;
    const safetyPaddingMicrons = 2500;
    const minTicketHeightMicrons = 45000;

    return Math.max(
        minTicketHeightMicrons,
        Math.ceil(contentHeight * cssPixelToMicrons) + safetyPaddingMicrons
    );
}

function escapeHtml(value: string) {
    return `${value ?? ""}`
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
