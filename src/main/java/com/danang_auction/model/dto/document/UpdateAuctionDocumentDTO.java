package com.danang_auction.model.dto.document;

import com.danang_auction.model.enums.AuctionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateAuctionDocumentDTO {
    private Double depositAmount;
    private Boolean isDepositRequired;
    private String status;
    private AuctionType auctionType;
    private Double startingPrice;
    private Double stepPrice;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long categoryId;
    private String description;
}