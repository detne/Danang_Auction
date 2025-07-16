package com.danang_auction.model.dto.document;

import com.danang_auction.model.dto.image.ImageDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import lombok.Data;
import lombok.Setter;

import java.util.List;

@Data
@Setter
public class AuctionDocumentDetailDTO {
    private Long id;
    private String documentCode;
    private String description;
    private Double startingPrice;
    private Double stepPrice;

    private List<ImageDTO> images;
    private AuctionSessionSummaryDTO session;

    public AuctionDocumentDetailDTO(Long id, String documentCode, String description, Double startingPrice, Double stepPrice, List<ImageDTO> images, AuctionSessionSummaryDTO session) {
        this.id = id;
        this.documentCode = documentCode;
        this.description = description;
        this.startingPrice = startingPrice;
        this.stepPrice = stepPrice;
        this.images = images;
        this.session = session;
    }
}
