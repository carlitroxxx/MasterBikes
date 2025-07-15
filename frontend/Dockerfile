FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npx react-scripts build
RUN npm install -g serve
CMD ["serve", "-s", "build"]