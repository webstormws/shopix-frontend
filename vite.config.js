import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite konfiguratsiyasi — React va dev-server sozlamalari
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/media": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
