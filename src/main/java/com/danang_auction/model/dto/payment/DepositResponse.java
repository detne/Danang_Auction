package com.danang_auction.model.dto.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class DepositResponse {
    @JsonProperty("transaction_code")
    private String transactionCode;

    @JsonProperty("qr_url")
    private String qrUrl;

    @JsonProperty("status")
    private String status;

    @JsonProperty("amount")
    private Double amount;

    @JsonProperty("verified_at")
    private LocalDateTime verifiedAt;

    // ✅ Constructor bổ sung
    public DepositResponse(String transactionCode, Double amount, String qrUrl, String status,
            LocalDateTime verifiedAt) {
        this.transactionCode = transactionCode;
        this.amount = amount;
        this.qrUrl = qrUrl;
        this.status = status;
        this.verifiedAt = verifiedAt;
    }
}
