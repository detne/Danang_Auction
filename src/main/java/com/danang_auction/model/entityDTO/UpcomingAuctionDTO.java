package com.danang_auction.model.entityDTO;

import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.model.enums.AuctionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class UpcomingAuctionDTO {
    private Integer assetId;
    private String title;
    private String category;
    private Double startingPrice;
    private Long sessionId;
    private LocalDateTime startTime;
    private AuctionType auctionType;
    private AuctionSessionStatus status;

}
