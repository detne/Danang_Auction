package com.danang_auction.model.dto.session;

import com.danang_auction.model.enums.ParticipantStatus;
import com.danang_auction.model.enums.DepositStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuctionSessionParticipantDTO {
    private Long userId;
    private String userRole;
    private ParticipantStatus status;
    private DepositStatus depositStatus;
    private LocalDateTime registeredAt;

    public AuctionSessionParticipantDTO(Long userId, String userRole, ParticipantStatus status, DepositStatus depositStatus, LocalDateTime registeredAt) {
        this.userId = userId;
        this.userRole = userRole;
        this.status = status;
        this.depositStatus = depositStatus;
        this.registeredAt = registeredAt;
    }
}