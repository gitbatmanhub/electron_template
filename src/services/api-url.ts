const DEFAULT_API_BASE_URL = "http://localhost:3000";

export function buildApiUrl(apiBaseUrl: string | undefined, path: string) {
    const baseUrl = normalizeApiBaseUrl(apiBaseUrl);
    return `${baseUrl}${path}`;
}

function normalizeApiBaseUrl(apiBaseUrl: string | undefined) {
    const rawBaseUrl = (apiBaseUrl || DEFAULT_API_BASE_URL).trim();
    const parsedUrl = new URL(rawBaseUrl);
    const path = parsedUrl.pathname.replace(/\/api\/?$/, "").replace(/\/+$/, "");

    return `${parsedUrl.origin}${path}`;
}
