package com.danang_auction.model.dto.payment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DepositStatusResponse {
    private String transactionCode;
    private String status;         // PENDING, COMPLETED, FAILED, CANCELLED
    private Double amount;
    private LocalDateTime verifiedAt;
}