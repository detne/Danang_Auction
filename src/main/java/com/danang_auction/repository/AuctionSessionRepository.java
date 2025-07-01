package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {

    // ✅ Thêm method này
    List<AuctionSession> findByStatusOrderByStartTimeAsc(AuctionSessionStatus status);

    // ✅ Thêm method này để lấy phiên theo tài sản (document) ID
    @Query("SELECT s FROM AuctionSession s JOIN AuctionDocument d ON s.id = d.session.id WHERE d.id = :documentId")
    List<AuctionSession> findSessionsByDocumentId(@Param("documentId") Integer documentId);
    // Tìm các phiên theo organizer
    List<AuctionSession> findByOrganizerId(Long organizerId);

    // Tìm các phiên theo trạng thái
    List<AuctionSession> findByStatus(AuctionSessionStatus status);

    // Tìm phiên đang diễn ra (startTime <= now <= endTime)
    @Query("SELECT s FROM AuctionSession s WHERE s.startTime <= :now AND s.endTime >= :now")
    List<AuctionSession> findActiveSessions(@Param("now") LocalDateTime now);

    // Tìm phiên sắp diễn ra (startTime > now)
    @Query("SELECT s FROM AuctionSession s WHERE s.startTime > :now")
    List<AuctionSession> findUpcomingSessions(@Param("now") LocalDateTime now);

    // Tìm phiên đã kết thúc (endTime < now)
    @Query("SELECT s FROM AuctionSession s WHERE s.endTime < :now")
    List<AuctionSession> findEndedSessions(@Param("now") LocalDateTime now);

    @Query("SELECT s FROM AuctionSession s JOIN FETCH s.auctionDocument WHERE s.id = :id")
    Optional<AuctionSession> findWithDocumentById(@Param("id") Long id);
}