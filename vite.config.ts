
// import path from "path"
// import tailwindcss from "@tailwindcss/vite"

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })

import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 1. Librerías base de la aplicación
          'vendor-react': ['react', 'react-dom', 'react-router'],
          
          // 2. Manejo de estado, formularios y peticiones HTTP
          'vendor-state': [
            '@tanstack/react-query', 
            'zustand', 
            'react-hook-form', 
            'axios'
          ],
          
          // 3. Componentes visuales, iconos y utilidades de estilo
          'vendor-ui': [
            'lucide-react', 
            'sileo', 
            'sonner', 
            'radix-ui', 
            'class-variance-authority', 
            'clsx', 
            'tailwind-merge'
          ],
          
          // 4. Sistema de traducciones
          'vendor-i18n': [
            'i18next', 
            'react-i18next', 
            'i18next-browser-languagedetector'
          ]
        }
      }
    }
  }
})