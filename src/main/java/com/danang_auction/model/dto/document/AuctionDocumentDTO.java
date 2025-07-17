package com.danang_auction.model.dto.document;

import com.danang_auction.model.dto.user.UserShortDto;
import com.danang_auction.model.dto.category.CategoryShortDto;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.model.enums.AuctionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuctionDocumentDTO {
    private Integer id;
    private String documentCode;
    private String description;
    private Double depositAmount;
    private Boolean isDepositRequired;
    private AuctionDocumentStatus status;
    private AuctionType auctionType;
    private Double startingPrice;
    private Double stepPrice;
    private LocalDateTime registeredAt;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String rejectedReason;
    private String categoryName;

    private UserShortDto user;
    private CategoryShortDto category;

    public AuctionDocumentDTO(AuctionDocument doc) {
        this.id = Math.toIntExact(doc.getId());
        this.documentCode = doc.getDocumentCode();
        this.description = doc.getDescription();
        this.depositAmount = doc.getDepositAmount();
        this.isDepositRequired = doc.getIsDepositRequired();
        this.status = doc.getStatus();
        this.auctionType = doc.getAuctionType();
        this.startingPrice = doc.getStartingPrice();
        this.stepPrice = doc.getStepPrice();
        this.registeredAt = doc.getRegisteredAt();
        this.startTime = doc.getStartTime();
        this.endTime = doc.getEndTime();
        this.createdAt = doc.getCreatedAt();
        this.updatedAt = doc.getUpdatedAt();
        this.rejectedReason = doc.getRejectedReason();

        if (doc.getUser() != null) {
            this.user = new UserShortDto(doc.getUser());
        }

        if (doc.getCategory() != null) {
            this.category = new CategoryShortDto(doc.getCategory());
        }
    }
}
