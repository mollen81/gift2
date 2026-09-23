package service;

import dto.DataResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class TelegramNotificationService {
    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendNotification(DataResponseDto response) {
        String message = formatMessage(response);

        String url = String.format("https://api.telegram.org/bot%s/sendMessage", botToken);

        String requestBody = String.format("chat_id=%s&text=%s&parse_mode=HTML",
                chatId, URLEncoder.encode(message, StandardCharsets.UTF_8));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(res -> System.out.println("Уведомление отправлено: " + res.statusCode()));
    }


    private String formatMessage(DataResponseDto response) {
        return """
                <b> Это победа 🎉</b>
                <b>Активность:</b> %s
               <b>Ресторан:</b> %s
               <b>Ссылка на карту:</b> %s
               <b>Дата:</b> %s
               <b>Время:</b> %s
               """.formatted(
                response.customActivity() != null ? response.customActivity() : response.activity(),
                response.customRestaurant() != null ? response.customRestaurant() : response.restaurant(),
                response.mapLink() != null ? response.mapLink() : "Не указана",
                response.date(),
                response.time()
        );
    }
}
