package com.danang_auction.model.entityDTO;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.ImageRelation;
import com.danang_auction.model.entity.User;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class AssetResponseDTO {
    private Integer id;
    private String documentCode;
    private String description;
    private Double startingPrice;
    private Double stepPrice;
    private List<ImageDTO> images;
    private AuctionSessionDTO session;

    // ✅ Constructor bạn cần:
    public AssetResponseDTO(AuctionDocument doc, User user) {
        this.id = doc.getId().intValue(); // Vì kiểu là Integer
        this.documentCode = doc.getDocumentCode();
        this.description = doc.getDescription();
        this.startingPrice = doc.getStartingPrice();
        this.stepPrice = doc.getStepPrice();

    }
}
