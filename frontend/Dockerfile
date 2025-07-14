FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build de producción
RUN npm run build

# Servir los archivos estáticos (usando 'serve')
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]