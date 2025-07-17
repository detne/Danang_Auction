package com.danang_auction.model.dto.document;

import com.danang_auction.model.enums.AuctionDocumentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetSearchDTO {
    private String documentCode;
    private String title;
    private String category;
    private Double startingPrice;
    private AuctionDocumentStatus status;
    private LocalDateTime startTime;
    private Long sessionId;
}
