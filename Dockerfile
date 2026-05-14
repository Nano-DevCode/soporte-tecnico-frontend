# Etapa 1: Construcción
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Instalamos pnpm globalmente
RUN npm install -g pnpm

# Copiamos package.json, el nuevo pnpm-lock.yaml y la configuración de pnpm
COPY package.json pnpm-lock.yaml .npmrc* ./

# Instalamos dependencias de forma limpia y bloqueada (equivalente a npm ci)
RUN pnpm install --frozen-lockfile

# Copiamos el código y generamos los archivos estáticos
COPY . .
RUN pnpm build

# Etapa 2: Producción con Nginx
FROM nginx:alpine AS runner

# Copiamos los archivos compilados (Vite usa la carpeta 'dist')
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos tu configuración de Nginx para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]