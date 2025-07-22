package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.model.enums.AuctionType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.EntityGraph;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {

  // ✅ Thêm method này
  List<AuctionSession> findByStatusOrderByStartTimeAsc(AuctionSessionStatus status);

  // ✅ Lấy các phiên từ document ID thông qua quan hệ document → session
  @Query("SELECT s FROM AuctionSession s JOIN AuctionDocument d ON s.id = d.session.id WHERE d.id = :documentId")
  List<AuctionSession> findSessionsByDocumentId(@Param("documentId") Integer documentId);

  // ✅ Tìm kiếm nâng cao — KHÔNG dùng s.auctionDocument vì không tồn tại
  // Nên chuyển việc filter theo price sang join với AuctionDocument trong Service
  // nếu cần
  @Query("""
          SELECT DISTINCT s FROM AuctionSession s
          WHERE (:title IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%')))
            AND (:status IS NULL OR s.status = :status)
            AND (:date IS NULL OR FUNCTION('DATE', s.startTime) = :date)
            AND (
              s.auctionType = 'PUBLIC'
              OR (:userId IS NOT NULL AND s.auctionType = 'PRIVATE')
            )
          ORDER BY s.startTime ASC
      """)
  List<AuctionSession> searchSessions(
      @Param("title") String title,
      @Param("status") AuctionSessionStatus status,
      @Param("date") LocalDate date,
      @Param("userId") Long userId);

  @Query("""
          SELECT s FROM AuctionSession s
          LEFT JOIN FETCH s.participants p
          LEFT JOIN FETCH p.user
          WHERE s.id = :id
      """)
  Optional<AuctionSession> findByIdWithDocumentAndParticipants(@Param("id") Long id);

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

  // ✅ Tìm kiếm phiên theo trạng thái và từ khóa
  @Query("""
          SELECT s FROM AuctionSession s
          WHERE (:status IS NULL OR s.status = :status)
            AND (:keyword IS NULL OR
              LOWER(s.title) LIKE :keyword OR
              LOWER(s.description) LIKE :keyword OR
              LOWER(s.sessionCode) LIKE :keyword)
      """)
  List<AuctionSession> searchSessionsByStatusAndKeyword(
      @Param("status") AuctionSessionStatus status,
      @Param("keyword") String keyword);

  @Query("SELECT s FROM AuctionSession s JOIN FETCH s.auctionDocument WHERE s.id = :id")
  Optional<AuctionSession> findWithDocumentById(@Param("id") Long id);

  // Tìm phiên đã kết thúc (endTime < now)
  @Query("SELECT s FROM AuctionSession s WHERE s.endTime < :now")
  List<AuctionSession> findEndedSessions(@Param("now") LocalDateTime now);

  @EntityGraph(attributePaths = { "auctionDocument", "participants", "participants.user" })
  Optional<AuctionSession> findBySessionCode(String sessionCode);

  // Hoặc nếu muốn rõ ràng (dùng JPQL)
  @Query("""
          SELECT s FROM AuctionSession s
          LEFT JOIN FETCH s.auctionDocument d
          LEFT JOIN FETCH s.participants p
          LEFT JOIN FETCH p.user
          WHERE s.sessionCode = :sessionCode
      """)
  Optional<AuctionSession> findBySessionCodeWithDocumentAndParticipants(@Param("sessionCode") String sessionCode);

  // AuctionSessionRepository.java
  List<AuctionSession> findByStatusAndAuctionType(AuctionSessionStatus status, AuctionType auctionType);

  @Query("""
          SELECT s FROM AuctionSession s
          LEFT JOIN FETCH s.auctionDocument
          WHERE s.startTime > :now
          ORDER BY s.startTime ASC
      """)
  List<AuctionSession> findUpcomingWithDocument(@Param("now") LocalDateTime now);
}
