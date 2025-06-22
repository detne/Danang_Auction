package com.danang_auction.model.dto.auction;

import com.danang_auction.model.entity.AuctionDocument;
import lombok.Data;

@Data
public class AuctionDocumentDto {
    private Integer id;
    private String documentCode;
    private String description;
    private String status;

    public AuctionDocumentDto(AuctionDocument doc) {
        this.id = doc.getId();
        this.documentCode = doc.getDocumentCode();
        this.description = doc.getDescription();
        this.status = doc.getStatus().name();
    }
}
