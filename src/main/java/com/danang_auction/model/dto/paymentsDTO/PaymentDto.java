package com.danang_auction.model.dto.paymentsDTO;

import lombok.Data;

@Data
public class PaymentDto {
    private Integer id;
    private String type;
    private String status;
    private Double price;
    private String timestamp;
    private Long userId; // Chỉ lấy ID của User
    private Long sessionId; // Chỉ lấy ID của AuctionSession
}