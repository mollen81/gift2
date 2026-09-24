package com.mollen.invitation.controller;

import com.mollen.invitation.dto.DataResponseDto;
import com.mollen.invitation.service.TelegramNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class MainController {
    private final TelegramNotificationService telegramService;

    public MainController(TelegramNotificationService telegramService) {
        this.telegramService = telegramService;
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submitAnswer(@RequestBody DataResponseDto response) {
        telegramService.sendNotification(response);

        return ResponseEntity.ok().build();
    }
}
