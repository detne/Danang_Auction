package com.danang_auction.model.dto.payment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentDto {
    private Integer id;
    private String type;
    private String status;
    private Double amount;
    private LocalDateTime timestamp;
    private Long userId;
    private Long sessionId;
}