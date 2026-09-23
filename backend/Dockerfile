# Этап 1: Сборка
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build

# Копируем файлы Gradle Wrapper и конфигурацию
COPY gradlew .
COPY gradle/ ./gradle/
COPY build.gradle settings.gradle ./

# Выдаем права на выполнение врапперу
RUN chmod +x ./gradlew

# Кэшируем зависимости (полезно для ускорения повторных сборок)
RUN ./gradlew dependencies --no-daemon || true

# Копируем исходный код
COPY src ./src

# Собираем толстый jar-файл (Spring Boot)
RUN ./gradlew bootJar --no-daemon

# Этап 2: Финальный легковесный образ
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Забираем собранный jar-файл из папки build/libs/.
# Примечание: если плагин Spring Boot генерирует дополнительный -plain.jar,
# убедись, что копируется именно основной. Часто он имеет суффикс -SNAPSHOT.
COPY --from=builder /build/build/libs/*-SNAPSHOT.jar app.jar
# Либо просто: COPY --from=builder /build/build/libs/*.jar app.jar (если файл один)

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]