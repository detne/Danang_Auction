package com.danang_auction.model.dto.session;

import com.danang_auction.model.dto.document.AuctionDocumentDTO;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuctionSessionDetailDTO {
    private Long id;
    private String title;
    private String sessionCode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private AuctionDocumentDTO document;

    public AuctionSessionDetailDTO(AuctionSession session, AuctionDocument document) {
        this.id = session.getId();
        this.title = session.getTitle();
        this.sessionCode = session.getSessionCode();
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
        this.status = session.getStatus().name();
        this.document = new AuctionDocumentDTO(document);
    }
}
