FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve
COPY --from=builder /app/build /app/build
WORKDIR /app
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]