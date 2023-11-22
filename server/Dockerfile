# Используем официальный образ Node.js
FROM node:latest

# Создаем и устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server/ .

EXPOSE 8080

CMD ["npm", "start"]
