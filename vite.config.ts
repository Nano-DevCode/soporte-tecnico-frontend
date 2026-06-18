import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 1. Librerías base
          'vendor-react': ['react', 'react-dom', 'react-router'],
          
          // 2. Estado y peticiones HTTP
          'vendor-state': [
            '@tanstack/react-query', 
            'zustand', 
            'axios'
          ],

          // 3. Formularios y validación
          'vendor-forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          
          // 4. Tablas 
          'vendor-table': [
            '@tanstack/react-table'
          ],

          // 5. Iconos 
          'vendor-icons': [
            'lucide-react'
          ],

          // 6. Calendario 
          'vendor-calendar': [
            'react-day-picker'
          ],

          // 7. Lo que queda de la UI (Ahora será muchísimo más ligero)
          'vendor-ui': [
            '@base-ui/react',
            'sileo', 
            'sonner', 
            'radix-ui',
            'cmdk'
          ],

          // 8. Utilidades de estilo y fechas
          'vendor-utils': [
            'class-variance-authority', 
            'clsx', 
            'tailwind-merge',
            'date-fns'
          ],
          
          // 9. Traducciones
          'vendor-i18n': [
            'i18next', 
            'react-i18next', 
            'i18next-browser-languagedetector',
            'i18next-http-backend'
          ]
        }
      }
    }
  }
});