package com.danang_auction.model.dto.session;

import com.danang_auction.model.enums.AuctionSessionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionResultDTO {

    private AuctionSessionStatus status;
    private WinnerInfo winner;
    private Double price;
    private Long totalBids;
    private List<ParticipantInfo> participants;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WinnerInfo {
        private String username;
        private LocalDateTime bidTime;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantInfo {
        private String username;
        private String role;
        private String status;
    }
}