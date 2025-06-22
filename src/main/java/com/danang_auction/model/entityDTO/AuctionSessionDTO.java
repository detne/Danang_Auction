package com.danang_auction.model.entityDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuctionSessionDTO {
    private Long id;
    private String title;
    private String sessionCode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
}
