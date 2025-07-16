package com.danang_auction.model.dto.session;

import com.danang_auction.model.enums.AuctionType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVisibilityRequestDTO {
    @NotNull
    private AuctionType type;
}
