# 1. Build stage
FROM node:18-bullseye AS builder
WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Compila la aplicación
RUN npm run build

# 2. Runtime stage
FROM node:18-bullseye
WORKDIR /app

# Crea un usuario sin privilegios
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copia todo desde builder
COPY --from=builder --chown=appuser:appgroup /app .

# Asegura que los permisos sean correctos
RUN chown -R appuser:appgroup /app

USER appuser

# Expone puerto y define CMD
EXPOSE ${PORT:-3000}
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/health || exit 1

CMD ["node", "dist/main.js"]
