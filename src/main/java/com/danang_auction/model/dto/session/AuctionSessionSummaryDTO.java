package com.danang_auction.model.dto.session;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    private String thumbnailUrl;
    @JsonProperty("starting_price")
    private Long startingPrice;

    public AuctionSessionSummaryDTO(AuctionSession session, String thumbnailUrl) {
        this.id = session.getId();
        this.title = session.getTitle();
        this.sessionCode = session.getSessionCode();
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
        this.status = session.getStatus().name();
        this.thumbnailUrl = thumbnailUrl;

        AuctionDocument document = session.getAuctionDocument();
        this.startingPrice = (document != null && document.getStartingPrice() != null)
                ? document.getStartingPrice().longValue()
                : 0L;
    }
}
