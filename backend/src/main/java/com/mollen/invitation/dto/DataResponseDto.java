package com.mollen.invitation.dto;

public record DataResponseDto (
    String activity,
    String customActivity,
    String restaurant,
    String customRestaurant,
    String mapLink,
    String date,
    String time
) {}