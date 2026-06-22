import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-react', test: /node_modules\/(react-router|react-dom|react)\// },
            { name: 'vendor-state', test: /node_modules\/(@tanstack\/react-query|zustand|axios)/ },
            { name: 'vendor-forms', test: /node_modules\/(react-hook-form|@hookform\/resolvers|zod)/ },
            { name: 'vendor-table', test: /node_modules\/@tanstack\/react-table/ },
            { name: 'vendor-icons', test: /node_modules\/lucide-react/ },
            { name: 'vendor-calendar', test: /node_modules\/react-day-picker/ },
            { name: 'vendor-ui', test: /node_modules\/(@base-ui\/react|sileo|sonner|radix-ui|cmdk)/ },
            { name: 'vendor-utils', test: /node_modules\/(class-variance-authority|clsx|tailwind-merge|date-fns)/ },
            { name: 'vendor-i18n', test: /node_modules\/i18next/ },
            { name: 'vendor-core', test: /node_modules/ },
          ],
        },
      },
    },
  },
});