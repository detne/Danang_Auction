package com.danang_auction.model.dto.document;

import com.danang_auction.model.entity.AuctionDocument;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuctionDocumentDto {
    private Integer id;
    private String documentCode;
    private String description;

    public AuctionDocumentDto(AuctionDocument doc) {
        this.id = doc.getId();
        this.documentCode = doc.getDocumentCode();
        this.description = doc.getDescription();
    }
}
