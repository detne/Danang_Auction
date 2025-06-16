package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.enums.AuctionStatus;
import com.danang_auction.model.enums.AuctionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionDocumentRepository extends JpaRepository<AuctionDocument, Long> {

    // Tìm theo user
    List<AuctionDocument> findByUserId(Long userId);

    // Tìm theo session
    List<AuctionDocument> findBySessionId(Long sessionId);

    // Tìm theo document code
    Optional<AuctionDocument> findByDocumentCode(String documentCode);

    // Tìm theo category
    List<AuctionDocument> findByCategoryId(Long categoryId);

    // Tìm theo status
    List<AuctionDocument> findByStatus(AuctionStatus status);

    // Tìm theo auction type
    List<AuctionDocument> findByAuctionType(AuctionType auctionType);

    // Tìm theo khoảng thời gian
    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.startTime >= :startTime AND ad.endTime <= :endTime")
    List<AuctionDocument> findByTimeRange(@Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);

    // Tìm theo khoảng giá
    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.startingPrice >= :minPrice AND ad.startingPrice <= :maxPrice")
    List<AuctionDocument> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                           @Param("maxPrice") BigDecimal maxPrice);

    // Tìm theo description chứa keyword
    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.description LIKE %:keyword%")
    List<AuctionDocument> findByDescriptionContaining(@Param("keyword") String keyword);

    // Kiểm tra document code có tồn tại không
    boolean existsByDocumentCode(String documentCode);

    // Đếm số lượng theo session
    @Query("SELECT COUNT(ad) FROM AuctionDocument ad WHERE ad.session.id = :sessionId")
    long countBySessionId(@Param("sessionId") Long sessionId);

    // Tìm những auction sắp bắt đầu
    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.startTime > :now ORDER BY ad.startTime ASC")
    List<AuctionDocument> findUpcomingAuctions(@Param("now") LocalDateTime now);

    // Tìm những auction đang diễn ra
    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.startTime <= :now AND ad.endTime >= :now")
    List<AuctionDocument> findActiveAuctions(@Param("now") LocalDateTime now);
}