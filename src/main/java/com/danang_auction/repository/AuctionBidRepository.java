package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionBid;
import com.danang_auction.model.entity.AuctionSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuctionBidRepository extends JpaRepository<AuctionBid, Long> {
    Optional<AuctionBid> findTopBySessionOrderByPriceDesc(AuctionSession session);
}