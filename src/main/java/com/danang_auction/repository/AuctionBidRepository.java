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

    List<AuctionBid> findBySessionId(Long sessionId);

    @Query("SELECT b FROM AuctionBid b WHERE b.session.id = :sessionId ORDER BY b.price DESC")
    Optional<AuctionBid> findTopBySessionIdOrderByPriceDesc(@Param("sessionId") Long sessionId);

    // Thêm phương thức để lấy danh sách trả giá của một user trong phiên cụ thể
    @Query("SELECT b FROM AuctionBid b WHERE b.session.id = :sessionId AND b.user.id = :userId ORDER BY b.timestamp DESC")
    List<AuctionBid> findBySessionIdAndUserId(@Param("sessionId") Long sessionId, @Param("userId") Long userId);

    @Query("SELECT MAX(b.price) FROM AuctionBid b WHERE b.session.id = :sessionId")
    BigDecimal findCurrentPriceBySessionId(@Param("sessionId") Long sessionId);

    @Query("SELECT MAX(b.price) FROM AuctionBid b WHERE b.session.id = :sessionId")
    Long findHighestBidAmount(@Param("sessionId") Long sessionId);
}