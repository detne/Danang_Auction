package com.danang_auction.model.dto.session;

import com.danang_auction.model.entity.AuctionSession;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuctionSessionSummaryDTO {
    private Long id;
    private String title;
    private String sessionCode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    public AuctionSessionSummaryDTO(AuctionSession session) {
        this.id = session.getId();
        this.title = session.getTitle();
        this.sessionCode = session.getSessionCode();
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
        this.status = session.getStatus().name();
    }
}
