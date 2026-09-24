package com.mollen.invitation.service;

import com.mollen.invitation.dto.DataResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.InetSocketAddress;
import java.net.ProxySelector;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
@Slf4j
public class TelegramNotificationService {

    static {
        System.setProperty("java.net.preferIPv4Stack", "true");

        // ВАЖНО: Укажите здесь порт вашего локального прокси-клиента.
        // 10808 — стандартный SOCKS5 порт для большинства VLESS/Xray клиентов.
        System.setProperty("socksProxyHost", "127.0.0.1");
        System.setProperty("socksProxyPort", "10808");

        // Если ваш клиент использует HTTP-прокси (часто порт 10809),
        // закомментируйте две строки выше и раскомментируйте эти:
        // System.setProperty("https.proxyHost", "127.0.0.1");
        // System.setProperty("https.proxyPort", "10809");
    }

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public void sendNotification(DataResponseDto response) {
        String message = formatMessage(response);
        String url = String.format("https://api.telegram.org/bot%s/sendMessage", botToken);
        String requestBody = String.format("chat_id=%s&text=%s&parse_mode=HTML",
                chatId, URLEncoder.encode(message, StandardCharsets.UTF_8));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        try {
            log.info("Отправка запроса в Telegram (IPv4). Ждем ответ...");

            // Синхронный вызов — сработает или упадет максимум за 10 секунд
            HttpResponse<String> res = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (res.statusCode() >= 200 && res.statusCode() < 300) {
                log.info("Уведомление успешно доставлено! Код: {}", res.statusCode());
            } else {
                log.error("Telegram ответил ошибкой {}: {}", res.statusCode(), res.body());
            }
        } catch (Exception e) {
            log.error("Сетевая ошибка при обращении к Telegram: {}", e.getMessage(), e);
        }
    }

    private String formatMessage(DataResponseDto response) {
        return """
               <b>Это победа 🎉</b>
               <b>Активность:</b> %s
               <b>Ресторан:</b> %s
               <b>Ссылка на карту:</b> %s
               <b>Дата:</b> %s
               <b>Время:</b> %s
               """.formatted(
                response.customActivity() != null && !response.customActivity().isBlank() ? response.customActivity() : response.activity(),
                response.customRestaurant() != null && !response.customRestaurant().isBlank() ? response.customRestaurant() : response.restaurant(),
                response.mapLink() != null && !response.mapLink().isBlank() ? response.mapLink() : "Не указана",
                response.date(),
                response.time()
        );
    }
}