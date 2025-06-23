package com.danang_auction.model.dto.auction;

import com.danang_auction.model.enums.DepositStatus;
import java.time.LocalDateTime;

public class DepositDto {
    private String sessionCode;
    private String sessionTitle;
    private Long userId;
    private String username;
    private DepositStatus depositStatus; // Sử dụng DepositStatus thay cho String
    private LocalDateTime registeredAt;

    // Constructor phù hợp với truy vấn JPQL
    public DepositDto(String sessionCode, String sessionTitle, Long userId, String username,
                      DepositStatus depositStatus, LocalDateTime registeredAt) {
        this.sessionCode = sessionCode;
        this.sessionTitle = sessionTitle;
        this.userId = userId;
        this.username = username;
        this.depositStatus = depositStatus;
        this.registeredAt = registeredAt;
    }

    // Getter và Setter cho các trường
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public DepositStatus getDepositStatus() {
        return depositStatus;
    }

    public void setDepositStatus(DepositStatus depositStatus) {
        this.depositStatus = depositStatus;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }
}
