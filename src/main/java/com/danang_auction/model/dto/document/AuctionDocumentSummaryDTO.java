package com.danang_auction.model.dto.document;

import com.danang_auction.model.entity.AuctionDocument;
import lombok.Data;

@Data
public class AuctionDocumentSummaryDTO {
    private Integer id;
    private String documentCode;
    private String description;
    private String status;

    public AuctionDocumentSummaryDTO(AuctionDocument doc) {
        if (doc != null) {
            this.id = doc.getId().intValue();
            this.documentCode = doc.getDocumentCode();
            this.description = doc.getDescription();
            this.status = doc.getStatus() != null ? doc.getStatus().name() : null;
        }
    }
}