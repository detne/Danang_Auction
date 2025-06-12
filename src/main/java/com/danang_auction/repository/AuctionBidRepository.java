package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionBid;
import com.danang_auction.model.entity.AuctionSession;
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

    List<AuctionBid> findBySession(AuctionSession session);

    List<AuctionBid> findByUser(User user);

    Page<AuctionBid> findBySession(AuctionSession session, Pageable pageable);

    Page<AuctionBid> findByUser(User user, Pageable pageable);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.session = :session ORDER BY ab.price DESC, ab.timestamp ASC")
    List<AuctionBid> findBySessionOrderByPriceDescTimestampAsc(@Param("session") AuctionSession session);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.session = :session ORDER BY ab.price DESC, ab.timestamp ASC")
    List<AuctionBid> findTop1BySessionOrderByPriceDescTimestampAsc(@Param("session") AuctionSession session);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.session = :session AND ab.user = :user ORDER BY ab.price DESC")
    List<AuctionBid> findHighestBidByUserForSession(@Param("session") AuctionSession session, @Param("user") User user);

    @Query("SELECT MAX(ab.price) FROM AuctionBid ab WHERE ab.session = :session")
    Optional<BigDecimal> findMaxPriceForSession(@Param("session") AuctionSession session);

    @Query("SELECT COUNT(ab) FROM AuctionBid ab WHERE ab.session = :session")
    long countBySession(@Param("session") AuctionSession session);

    @Query("SELECT COUNT(DISTINCT ab.user) FROM AuctionBid ab WHERE ab.session = :session")
    long countUniqueUsersBySession(@Param("session") AuctionSession session);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.user = :user AND ab.session = :session ORDER BY ab.timestamp DESC")
    List<AuctionBid> findUserBidsForSession(@Param("user") User user, @Param("session") AuctionSession session);

    @Query("SELECT DISTINCT ab.user FROM AuctionBid ab WHERE ab.session = :session")
    List<User> findAllUsersBySession(@Param("session") AuctionSession session);

    @Query("SELECT ab FROM AuctionBid ab WHERE ab.session = :session AND ab.price >= :minPrice")
    List<AuctionBid> findBySessionAndPriceGreaterThanEqual(@Param("session") AuctionSession session, @Param("minPrice") BigDecimal minPrice);
}
