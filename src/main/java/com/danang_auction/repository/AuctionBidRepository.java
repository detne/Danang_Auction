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

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.auctionSession.id = :auctionSessionId ORDER BY ab.price DESC, ab.timestamp ASC")
    List<AuctionBid> findByAuctionSessionIdOrderByPriceDescTimestampAsc(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.auctionSession.id = :auctionSessionId ORDER BY ab.price DESC, ab.timestamp ASC LIMIT 1")
    Optional<AuctionBid> findHighestBidForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.auctionSession.id = :auctionSessionId AND ab.user.id = :userId ORDER BY ab.price DESC LIMIT 1")
    Optional<AuctionBid> findHighestBidByUserForAuctionSession(@Param("auctionSessionId") Long auctionSessionId, @Param("userId") Integer userId);

    @Query("SELECT MAX(ab.price) FROM AuctionBid ab WHERE ab.auctionSession.id = :auctionSessionId")
    Optional<BigDecimal> findMaxPriceForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT COUNT(ab) FROM AuctionBid ab WHERE ab.auctionSession.id = :auctionSessionId")
    long countBidsForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT COUNT(DISTINCT ab.user) FROM AuctionBid ab WHERE ab.auctionSession.id = :auctionSessionId")
    long countUniqueBiddersForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.user.id = :userId AND ab.auctionSession.id = :auctionSessionId ORDER BY ab.timestamp DESC")
    List<AuctionBid> findBidsByUserForAuctionSession(@Param("userId") Integer userId, @Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT DISTINCT ab.user FROM AuctionBid ab WHERE ab.auctionSession.id = :auctionSessionId")
    List<User> findAllBiddersForAuctionSession(@Param("auctionSessionId") Long auctionSessionId);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.auctionSession.id = :auctionSessionId AND ab.price >= :minAmount")
    List<AuctionBid> findBidsAboveAmount(@Param("auctionSessionId") Long auctionSessionId, @Param("minAmount") BigDecimal minAmount);
}