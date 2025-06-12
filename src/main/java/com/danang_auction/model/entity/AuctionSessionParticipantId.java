package com.danang_auction.model.entity;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionSessionParticipantId implements Serializable {
    private Long user;
    private Long auctionSession;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AuctionSessionParticipantId)) return false;
        AuctionSessionParticipantId that = (AuctionSessionParticipantId) o;
        return Objects.equals(user, that.user) &&
                Objects.equals(auctionSession, that.auctionSession);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, auctionSession);
    }
}
