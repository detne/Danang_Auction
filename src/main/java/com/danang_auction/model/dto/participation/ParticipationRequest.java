package com.danang_auction.model.dto.participation;

import com.danang_auction.model.enums.DepositStatus;
import com.danang_auction.model.enums.ParticipantStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ParticipationRequest {
    private Long sessionId;
    private String sessionTitle;
    private LocalDateTime sessionStartTime;
    private LocalDateTime sessionEndTime;

    private String role;
    private ParticipantStatus status;
    private DepositStatus depositStatus;
    private LocalDateTime registeredAt;


}
