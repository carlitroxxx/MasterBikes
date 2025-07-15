FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# 1. Copia SOLO los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# 2. Instala dependencias
RUN npm install

# 3. Copia el resto de los archivos
COPY . .

# 4. Verifica que package.json existe
RUN ls -la && cat package.json

# 5. Ejecuta el build
RUN npm run build

# 6. Instala serve para producción
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]