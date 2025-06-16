package com.danang_auction.model.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
public class AuctionSessionParticipantId implements Serializable {
    private Long userId;
    private Long auctionSessionId;

    // Constructors
    public AuctionSessionParticipantId() {}

    public AuctionSessionParticipantId(Long userId, Long auctionSessionId) {
        this.userId = userId;
        this.auctionSessionId = auctionSessionId;
    }

    // Override equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuctionSessionParticipantId that = (AuctionSessionParticipantId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(auctionSessionId, that.auctionSessionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, auctionSessionId);
    }
}
