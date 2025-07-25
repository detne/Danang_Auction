package com.danang_auction.model.dto.session;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    // Nếu bạn muốn hiển thị thêm
    private String auctionType;
    private String biddingMethod = "Trả giá liên tục";
    private String location = "Chưa cập nhật";

    // Trường kiểm tra đã tham gia phiên chưa
    @JsonProperty("already_joined")
    private boolean alreadyJoined;

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
    }

    @JsonProperty("registration_start_time")
    public LocalDateTime getRegistrationStartTime() {
        return this.startTime != null ? this.startTime.minusDays(3) : null;
    }

    @JsonProperty("registration_end_time")
    public LocalDateTime getRegistrationEndTime() {
        return this.startTime != null ? this.startTime.minusHours(1) : null;
    }

    // Có thể bổ sung constructor/setter cho alreadyJoined nếu cần
    public void setAlreadyJoined(boolean alreadyJoined) {
        this.alreadyJoined = alreadyJoined;
    }

    public boolean isAlreadyJoined() {
        return alreadyJoined;
    }
}
