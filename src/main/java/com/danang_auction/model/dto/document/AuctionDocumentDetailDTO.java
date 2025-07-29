package com.danang_auction.model.dto.document;

import com.danang_auction.model.dto.image.ImageDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import com.danang_auction.model.entity.AuctionDocument;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDocumentDetailDTO {
    private Long id;
    private String documentCode;
    private String description;
    private Double startingPrice;
    private Double stepPrice;
    private String categoryName;
    private String ownerUsername;
    private List<String> imageUrls;
    private Double depositAmount;

    private List<ImageDTO> images;
    private AuctionSessionSummaryDTO session;

    // Trong AuctionDocumentDetailDTO.java
    public AuctionDocumentDetailDTO(AuctionDocument document) {
        this.id = document.getId();
        this.documentCode = document.getCode();
        this.description = document.getDescription();
        this.startingPrice = document.getStartingPrice();
        this.stepPrice = document.getStepPrice();
        this.categoryName = document.getCategory() != null ? document.getCategory().getName() : null;
        this.ownerUsername = document.getUser() != null ? document.getUser().getUsername() : null;
        this.imageUrls = document.getImageUrls();
        this.depositAmount = document.getDepositAmount();
        // Nếu có field images hoặc session... bạn tự set thêm ở đây
    }
}