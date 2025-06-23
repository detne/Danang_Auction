package com.danang_auction.model.dto.participation;

import lombok.Data;

@Data
public class DepositRefundRequestDto {
    private Long userId;
    private Long auctionSessionId;
    private String reason; // Lý do hoàn tiền (nếu cần)

    // Setter để cập nhật userId từ token
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}