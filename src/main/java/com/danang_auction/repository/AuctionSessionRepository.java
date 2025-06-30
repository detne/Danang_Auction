package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {

    List<AuctionSession> findByStatusOrderByStartTimeAsc(AuctionSessionStatus status);

    // ✅ Lấy phiên theo documentId
    @Query("SELECT s FROM AuctionSession s JOIN AuctionDocument d ON s.id = d.session.id WHERE d.id = :documentId")
    List<AuctionSession> findSessionsByDocumentId(@Param("documentId") Integer documentId);

    // ✅ Tìm kiếm nâng cao theo title, status, giá, ngày
    @Query("""
    SELECT DISTINCT s FROM AuctionSession s
    JOIN s.auctionDocuments d
    WHERE (:title IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%')))
      AND (:status IS NULL OR s.status = :status)
      AND (:minPrice IS NULL OR d.startingPrice >= :minPrice)
      AND (:maxPrice IS NULL OR d.startingPrice <= :maxPrice)
      AND (:date IS NULL OR FUNCTION('DATE', s.startTime) = :date)
      AND (
        s.auctionType = 'PUBLIC'
        OR (:userId IS NOT NULL AND s.auctionType = 'PRIVATE' AND s.createdBy.id = :userId)
      )
    ORDER BY s.startTime ASC
""")
    List<AuctionSession> searchSessions(
            @Param("title") String title,
            @Param("status") AuctionSessionStatus status,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("date") LocalDate date,
            @Param("userId") Long userId
    );
}