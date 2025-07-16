package com.danang_auction.model.dto.session;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AuctionSessionAdminDTO {
    private Long id;
    private String sessionCode;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    private Integer assetId;
    private String documentCode;
    private String description;

    public AuctionSessionAdminDTO(AuctionSession session, AuctionDocument document) {
        this.id = session.getId();
        this.sessionCode = session.getSessionCode();
        this.title = session.getTitle();
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
        this.status = session.getStatus().name();

        if (document != null) {
            this.assetId = document.getId();
            this.documentCode = document.getDocumentCode();
            this.description = document.getDescription();
        }
    }
}
