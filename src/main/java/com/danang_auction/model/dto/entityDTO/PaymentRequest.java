package com.danang_auction.model.dto.entityDTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class PaymentRequest {

    @NotNull(message = "Session ID is required")
    private Long sessionId;

    private String file; // Biên lai (ảnh/PDF)

    @NotNull(message = "Transaction code is required")
    private String transactionCode;

    @NotNull(message = "Payment method is required")
    private String paymentMethod;

    private String bankName;

    @Positive(message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String note;

    // Getters and Setters
}
