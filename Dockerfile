# Используем Node.js образ
FROM node:16-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем все файлы приложения
COPY . .

# Открываем порт, на котором работает встроенный сервер разработки React
EXPOSE 10.8.0.1:8081

# Запускаем приложение
CMD ["yarn", "start"]