# Этап 1: Сборка статики
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Собираем Vite проект (артефакты появятся в папке dist)
RUN npm run build

# Этап 2: Nginx
FROM nginx:alpine
# Копируем наш кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Копируем собранный проект из первого этапа
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]