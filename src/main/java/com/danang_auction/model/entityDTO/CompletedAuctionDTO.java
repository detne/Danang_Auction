package com.danang_auction.model.entityDTO;

import com.danang_auction.model.entity.Category;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.model.enums.AuctionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
public class CompletedAuctionDTO {
    private Integer assetId;
    private String description;
    private Category category;
    private Double startingPrice;
    private Double winningPrice;
    private LocalDateTime endTime;
    private AuctionType auctionType;
    private AuctionSessionStatus status;
}
