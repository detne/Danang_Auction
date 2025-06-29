package com.danang_auction.model.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum AuctionType {
    PUBLIC,
    PRIVATE,
}
