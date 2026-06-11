import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Opcional: Sube un poco el límite de advertencia ya que 500kb es muy estricto para apps modernas
    chunkSizeWarningLimit: 800, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 1. Iconos (Aislamos Lucide para que no contamine la UI)
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }

            // 2. React y Router base
            if (id.includes("react-router") || id.includes("@remix-run")) {
              return "vendor-router";
            }
            if (id.includes("react-dom") || id.includes("node_modules/react/")) {
              return "vendor-react";
            }

            // 3. Manejo de estado, formularios y peticiones HTTP
            if (
              id.includes("@tanstack") ||
              id.includes("axios") ||
              id.includes("zustand") ||
              id.includes("react-hook-form") ||
              id.includes("@hookform/resolvers")
            ) {
              return "vendor-data";
            }

            // 4. Fechas y Calendario (Aislamos date-fns y react-day-picker)
            if (id.includes("date-fns") || id.includes("react-day-picker")) {
              return "vendor-date";
            }

            // 5. Validaciones (Aislamos Zod y sus posibles idiomas fantasmas)
            if (id.includes("zod")) {
              return "vendor-zod";
            }

            // 6. Sistema de traducciones
            if (id.includes("i18next")) {
              return "vendor-i18n";
            }

            // 7. Componentes visuales y utilidades de estilo
            if (
              id.includes("@base-ui") ||
              id.includes("radix-ui") ||
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("sonner") ||
              id.includes("cmdk")
            ) {
              return "vendor-ui";
            }
          }
        },
      },
    },
  },
});