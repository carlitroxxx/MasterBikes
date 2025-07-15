FROM node:20-alpine as builder

WORKDIR /app

# 1. Copia solo los archivos esenciales primero
COPY package.json package-lock.json ./

# 2. Verifica explícitamente el package.json
RUN cat package.json && npm install

# 3. Copia el resto de los archivos
COPY . .

# 4. Verifica la estructura del proyecto
RUN ls -la

# 5. Ejecuta el build con modo verbose
RUN npm run build --verbose