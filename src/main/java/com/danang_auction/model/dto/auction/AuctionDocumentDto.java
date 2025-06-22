package com.danang_auction.model.dto.auction;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import lombok.Data;

@Data
public class AuctionDocumentDto {
    private long id;
    private String documentCode;
    private String description;
    private String status;

    public AuctionDocumentDto(AuctionDocument doc) {
        if (doc != null) {
            this.id = doc.getId();
            this.documentCode = doc.getDocumentCode();
            this.description = doc.getDescription();
            this.status = doc.getStatus() != null ? doc.getStatus().name() : null;
        }
    }
}