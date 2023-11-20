# Используем официальный образ Node.js
FROM node:18

# Создаем и устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build

# Указываем порт, который будет использоваться приложением
EXPOSE 3000

CMD ["npm", "start"]
