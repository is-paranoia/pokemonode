# Используем официальный образ Node.js
FROM node:18

# Создаем и устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server/ .

EXPOSE 8080

CMD ["npm", "start"]
