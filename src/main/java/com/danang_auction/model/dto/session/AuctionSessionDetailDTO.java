package com.danang_auction.model.dto.session;

import com.danang_auction.model.dto.document.AuctionDocumentDetailDTO;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AuctionSessionDetailDTO {
    private Long id;
    private String title;
    private String sessionCode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    private String documentCode;
    private String description;
    private String categoryName;
    private String ownerUsername;
    private List<String> imageUrls;
    private Double startingPrice;
    private Double stepPrice;
    private Double depositAmount;
    private AuctionDocumentDetailDTO asset;

    // Thông tin thêm
    private String auctionType;
    private String biddingMethod = "Trả giá liên tục";
    private String location = "Chưa cập nhật";

    // Kiểm tra đã tham gia chưa
    @JsonProperty("already_joined")
    private boolean alreadyJoined;

    // Giá thầu cao nhất của người dùng
    @JsonProperty("your_highest_bid")
    private Double yourHighestBid;

    // Trạng thái participant (WAITING_START, ONGOING, WINNER, LOSER)
    @JsonProperty("participant_status")
    private String participantStatus;

    // Trạng thái đặt cọc (PENDING, PAID, REFUNDED)
    @JsonProperty("deposit_status")
    private String depositStatus;

    public AuctionSessionDetailDTO(AuctionSession session, AuctionDocument document) {
        this.id = session.getId();
        this.title = session.getTitle();
        this.sessionCode = session.getSessionCode();
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
        this.status = session.getStatus().name();

        this.documentCode = document.getCode();
        this.description = document.getDescription();
        this.categoryName = document.getCategory() != null ? document.getCategory().getName() : null;
        this.ownerUsername = document.getUser() != null ? document.getUser().getUsername() : null;
        this.imageUrls = document.getImageUrls();
        this.startingPrice = document.getStartingPrice();
        this.stepPrice = document.getStepPrice();
        this.depositAmount = document.getDepositAmount();
        this.auctionType = session.getAuctionType().name();
        this.asset = new AuctionDocumentDetailDTO(document);
    }

    @JsonProperty("registration_start_time")
    public LocalDateTime getRegistrationStartTime() {
        return this.startTime != null ? this.startTime.minusDays(3) : null;
    }

    @JsonProperty("registration_end_time")
    public LocalDateTime getRegistrationEndTime() {
        return this.startTime != null ? this.startTime.minusHours(1) : null;
    }

    public void setAlreadyJoined(boolean alreadyJoined) {
        this.alreadyJoined = alreadyJoined;
    }

    public boolean isAlreadyJoined() {
        return alreadyJoined;
    }

    public void setParticipantStatus(String participantStatus) {
        this.participantStatus = participantStatus;
    }

    public void setDepositStatus(String depositStatus) {
        this.depositStatus = depositStatus;
    }
}