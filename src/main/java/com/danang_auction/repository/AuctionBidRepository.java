package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionBid;
import com.danang_auction.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionBidRepository extends JpaRepository<AuctionBid, Long> {

    List<AuctionBid> findByAuctionSessionId(Long auctionSessionId);

    List<AuctionBid> findByBidder(User bidder);

    Page<AuctionBid> findByAuctionSessionId(Long auctionSessionId, Pageable pageable);

    Page<AuctionBid> findByBidder(User bidder, Pageable pageable);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.auctionSessionId = :auctionSessionId ORDER BY ab.bidAmount DESC, ab.bidTime ASC")
    List<AuctionBid> findByAuctionSessionIdOrderByBidAmountDescBidTimeAsc(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.auctionSessionId = :auctionSessionId ORDER BY ab.bidAmount DESC, ab.bidTime ASC LIMIT 1")
    Optional<AuctionBid> findHighestBidForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.auctionSessionId = :auctionSessionId AND ab.bidder = :bidder ORDER BY ab.bidAmount DESC LIMIT 1")
    Optional<AuctionBid> findHighestBidByUserForAuctionSession(@Param("auctionSessionId") Long auctionSessionId, @Param("bidder") User bidder);

    @Query("SELECT MAX(ab.bidAmount) FROM AuctionBid ab WHERE ab.auctionSessionId = :auctionSessionId")
    Optional<BigDecimal> findMaxBidAmountForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT COUNT(ab) FROM AuctionBid ab WHERE ab.auctionSessionId = :auctionSessionId")
    long countBidsForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT COUNT(DISTINCT ab.bidder) FROM AuctionBid ab WHERE ab.auctionSessionId = :auctionSessionId")
    long countUniqueBiddersForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.bidder = :bidder AND ab.auctionSessionId = :auctionSessionId ORDER BY ab.bidTime DESC")
    List<AuctionBid> findBidsByUserForAuctionSession(@Param("bidder") User bidder, @Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT DISTINCT ab.bidder FROM AuctionBid ab WHERE ab.auctionSessionId = :auctionSessionId")
    List<User> findAllBiddersForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.auctionSessionId = :auctionSessionId AND ab.bidAmount >= :minAmount")
    List<AuctionBid> findBidsAboveAmount(@Param("auctionSessionId") Long auctionSessionId, @Param("minAmount") BigDecimal minAmount);
}