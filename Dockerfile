# Etapa 1: Construcción
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Instalamos dependencias de forma limpia
COPY package*.json ./
RUN npm ci

# Copiamos el código y generamos los archivos estáticos
COPY . .
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine AS runner

# Copiamos los archivos compilados (Vite usa la carpeta 'dist')
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos nuestra configuración de Nginx para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]