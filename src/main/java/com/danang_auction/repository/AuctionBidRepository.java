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

    // Tìm tất cả bid theo session
    List<AuctionBid> findBySessionId(Long sessionId);

    // Tìm tất cả bid theo user
    List<AuctionBid> findByUser(User user);

    // Phân trang bid theo session
    Page<AuctionBid> findBySessionId(Long sessionId, Pageable pageable);

    // Phân trang bid theo user
    Page<AuctionBid> findByUser(User user, Pageable pageable);

    // Sắp xếp bid theo session: giá giảm dần, thời gian tăng dần
    @Query("SELECT ab FROM AuctionBid ab WHERE ab.session.id = :sessionId ORDER BY ab.price DESC, ab.timestamp ASC")
    List<AuctionBid> findBySessionOrderByPriceDescTimestampAsc(@Param("sessionId") Long sessionId);

    // Lấy top n bid cao nhất trong 1 phiên (dùng phân trang)
    @Query("SELECT ab FROM AuctionBid ab WHERE ab.session.id = :sessionId ORDER BY ab.price DESC, ab.timestamp ASC")
    List<AuctionBid> findTopBidsBySession(@Param("sessionId") Long sessionId, Pageable pageable);

    // Lấy bid cao nhất của 1 user trong 1 phiên
    @Query("SELECT ab FROM AuctionBid ab WHERE ab.session.id = :sessionId AND ab.user = :user ORDER BY ab.price DESC")
    Optional<AuctionBid> findHighestBidByUserForSession(@Param("sessionId") Long sessionId, @Param("user") User user);

    // Giá cao nhất trong 1 phiên
    @Query("SELECT MAX(ab.price) FROM AuctionBid ab WHERE ab.session.id = :sessionId")
    Optional<BigDecimal> findMaxBidAmountForSession(@Param("sessionId") Long sessionId);

    // Số lượng bid trong 1 phiên
    @Query("SELECT COUNT(ab) FROM AuctionBid ab WHERE ab.session.id = :sessionId")
    long countBidsForSession(@Param("sessionId") Long sessionId);

    // Số lượng user duy nhất trong 1 phiên
    @Query("SELECT COUNT(DISTINCT ab.user) FROM AuctionBid ab WHERE ab.session.id = :sessionId")
    long countUniqueUsersForSession(@Param("sessionId") Long sessionId);

    // Tất cả bid của 1 user trong 1 phiên, mới nhất trước
    @Query("SELECT ab FROM AuctionBid ab WHERE ab.user = :user AND ab.session.id = :sessionId ORDER BY ab.timestamp DESC")
    List<AuctionBid> findBidsByUserForSession(@Param("user") User user, @Param("sessionId") Long sessionId);

    // Lấy danh sách tất cả user đã bid trong 1 phiên
    @Query("SELECT DISTINCT ab.user FROM AuctionBid ab WHERE ab.session.id = :sessionId")
    List<User> findAllBiddersForSession(@Param("sessionId") Long sessionId);

    // Lấy các bid >= mức giá chỉ định
    @Query("SELECT ab FROM AuctionBid ab WHERE ab.session.id = :sessionId AND ab.price >= :minPrice")
    List<AuctionBid> findBidsAbovePrice(@Param("sessionId") Long sessionId, @Param("minPrice") BigDecimal minPrice);
}
