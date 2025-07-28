package com.danang_auction.model.dto.payment;

import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.PaymentType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentHistoryDTO {
    private Long id;
    private Double amount;
    private PaymentType type;
    private PaymentStatus status;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
}
