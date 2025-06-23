package com.danang_auction.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Deposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionCode;
    private String sessionTitle;
    private Long userId;
    private Double depositAmount;
    private String status;
    private LocalDateTime paymentTimestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id", referencedColumnName = "id")
    private AuctionSession auctionSession;  // Liên kết với AuctionSession

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionCode() {
        return sessionCode;
    }

    public void setSessionCode(String sessionCode) {
        this.sessionCode = sessionCode;
    }

    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(Double depositAmount) {
        this.depositAmount = depositAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getPaymentTimestamp() {
        return paymentTimestamp;
    }

    public void setPaymentTimestamp(LocalDateTime paymentTimestamp) {
        this.paymentTimestamp = paymentTimestamp;
    }

    public AuctionSession getAuctionSession() {
        return auctionSession;
    }

    public void setAuctionSession(AuctionSession auctionSession) {
        this.auctionSession = auctionSession;
    }
}
