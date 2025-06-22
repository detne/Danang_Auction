package com.danang_auction.model.dto.entityDTO;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.enums.DepositStatus;
import com.danang_auction.model.enums.ParticipantStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ParticipationDTO {
    private Long sessionId;
    private String sessionTitle;
    private LocalDateTime sessionStartTime;
    private LocalDateTime sessionEndTime;

    private String role;
    private ParticipantStatus status;
    private DepositStatus depositStatus;
    private LocalDateTime registeredAt;


}
