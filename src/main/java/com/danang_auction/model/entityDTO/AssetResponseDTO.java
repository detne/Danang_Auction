package com.danang_auction.model.entityDTO;

import lombok.Data;
import lombok.Setter;

import java.util.List;

@Data
@Setter
public class AssetResponseDTO {
    private Integer id;
    private String documentCode;
    private String description;
    private Double startingPrice;
    private Double stepPrice;

    private List<ImageDTO> images;
    private AuctionSessionDTO session;
}
