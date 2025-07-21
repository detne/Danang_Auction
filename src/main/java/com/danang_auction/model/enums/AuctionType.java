package com.danang_auction.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AuctionType {
    PUBLIC("PUBLIC"),
    PRIVATE("PRIVATE");

    private final String value;

    AuctionType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static AuctionType fromValue(String value) {
        for (AuctionType type : AuctionType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid AuctionType: " + value);
    }
}