import { defineConfig } from "vite";
import path from "path";
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
    root: path.resolve(__dirname, "src"),
    base: "./",
    plugins: [
        tailwindcss(),

    ],
    server: {
        host: "127.0.0.1",
        port: 5173,
        strictPort: true
    },
    build: {
        outDir: path.resolve(__dirname, "dist/renderer"),
        emptyOutDir: true
    }
});
