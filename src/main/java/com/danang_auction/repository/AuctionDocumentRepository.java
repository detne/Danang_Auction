package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionStatus;
import com.danang_auction.model.enums.AuctionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionDocumentRepository extends JpaRepository<AuctionDocument, Long> {

    // Tìm theo mã tài liệu
    Optional<AuctionDocument> findByDocumentCode(String documentCode);

    // Tìm theo phiên đấu giá
    List<AuctionDocument> findBySessionId(Long sessionId);

    // Tìm theo trạng thái
    List<AuctionDocument> findByStatus(AuctionStatus status);

    // Tìm theo loại đấu giá
    List<AuctionDocument> findByAuctionType(AuctionType auctionType);

    // Tìm tài liệu trong khoảng thời gian đấu giá
    List<AuctionDocument> findByStartTimeAfterAndEndTimeBefore(LocalDateTime start, LocalDateTime end);

    // Đếm số lượng tài liệu trong 1 phiên
    @Query("SELECT COUNT(ad) FROM AuctionDocument ad WHERE ad.session.id = :sessionId")
    long countBySessionId(@Param("sessionId") Long sessionId);

    // Lấy danh sách tài liệu theo người tạo
    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.user.id = :userId ORDER BY ad.createdAt DESC")
    List<AuctionDocument> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    // Lọc theo danh mục
    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.category.id = :categoryId")
    List<AuctionDocument> findByCategoryId(@Param("categoryId") Long categoryId);
}
