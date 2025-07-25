package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionBidRepository extends JpaRepository<AuctionBid, Long> {

    // Lấy tất cả bid của một phiên
    List<AuctionBid> findBySessionId(Long sessionId);

    // Lấy bid cao nhất của một phiên
    @Query("SELECT b FROM AuctionBid b WHERE b.session.id = :sessionId ORDER BY b.price DESC LIMIT 1")
    Optional<AuctionBid> findTopBySessionIdOrderByPriceDesc(@Param("sessionId") Long sessionId);

    // Lấy danh sách trả giá của một user trong phiên cụ thể
    @Query("SELECT b FROM AuctionBid b WHERE b.session.id = :sessionId AND b.user.id = :userId ORDER BY b.timestamp DESC")
    List<AuctionBid> findBySessionIdAndUserId(@Param("sessionId") Long sessionId, @Param("userId") Long userId);

    @Query("SELECT MAX(b.price) FROM AuctionBid b WHERE b.session.id = :sessionId")
    BigDecimal findCurrentPriceBySessionId(@Param("sessionId") Long sessionId);

    // Lấy giá trị cao nhất của bid trong một phiên
    @Query("SELECT MAX(b.price) FROM AuctionBid b WHERE b.session.id = :sessionId")
    Long findHighestBidAmount(@Param("sessionId") Long sessionId);

    // LẤY DANH SÁCH NGƯỜI THẮNG MỚI NHẤT PHÙ HỢP VỚI DB THỰC TẾ
    @Query(value = """
        SELECT 
            s.id AS session_id, 
            s.title AS session_title, 
            u.id AS winner_id, 
            u.first_name, 
            u.username, 
            MAX(b.bid_amount) AS bid_amount, 
            MAX(b.bid_time) AS bid_time
        FROM auction_sessions s
        JOIN users u ON s.winner_id = u.id
        LEFT JOIN auction_bids b ON b.session_id = s.id AND b.user_id = s.winner_id
        WHERE s.winner_id IS NOT NULL
        GROUP BY s.id, s.title, u.id, u.first_name, u.username
        ORDER BY s.end_time DESC
    """, nativeQuery = true)
    List<Object[]> findLatestWinners();

    // Lấy tất cả bid của một phiên, mới nhất trước
    List<AuctionBid> findBySessionIdOrderByTimestampDesc(Long sessionId);
}