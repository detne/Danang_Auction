package com.danang_auction.model.dto.document;

import com.danang_auction.model.dto.image.ImageDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDocumentDetailDTO {
    private Integer id;
    private String documentCode;
    private String description;
    private Double startingPrice;
    private Double stepPrice;

    private List<ImageDTO> images;
    private AuctionSessionSummaryDTO session;
}
