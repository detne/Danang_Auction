package com.danang_auction.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auction_bids")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionBid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "bid_amount", nullable = false)
    private Double price;

    @Column(name = "bid_time", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "is_winning_bid")
    private Boolean isWinningBid = false; // Đánh dấu bid thắng khi phiên kết thúc

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private AuctionSession session;

    public AuctionBid(Double price, User user, AuctionSession session) {
        this.price = price;
        this.user = user;
        this.session = session;
        this.timestamp = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}