package com.danang_auction.model.dto.bid;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuctionBidDTO {
    private Long userId;
    private String fullName;
    private Double price;
    private LocalDateTime timestamp;

    public AuctionBidDTO(Long userId, String fullName, Double price, LocalDateTime timestamp) {
        this.userId = userId;
        this.fullName = fullName;
        this.price = price;
        this.timestamp = timestamp;
    }
}
