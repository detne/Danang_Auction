package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.AuctionSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {

    List<AuctionSession> findByStatusOrderByStartTimeAsc(AuctionSessionStatus status);

    @Query("SELECT s FROM AuctionSession s JOIN AuctionDocument d ON s.id = d.session.id WHERE d.id = :documentId")
    List<AuctionSession> findSessionsByDocumentId(@Param("documentId") Integer documentId);

    @Query("""
        SELECT s FROM AuctionSession s
        LEFT JOIN FETCH s.participants p
        LEFT JOIN FETCH p.user
        WHERE s.id = :id
    """)
    Optional<AuctionSession> findByIdWithDocumentAndParticipants(@Param("id") Long id);

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
            @Param("keyword") String keyword
    );

    @Query("SELECT s FROM AuctionSession s JOIN FETCH s.auctionDocument WHERE s.id = :id")
    Optional<AuctionSession> findWithDocumentById(@Param("id") Long id);

    @Query("""
        SELECT u FROM User u
        WHERE u.id IN (
            SELECT b.user.id FROM AuctionBid b
            JOIN b.session s
            JOIN AuctionSessionParticipant p ON b.user.id = p.user.id AND b.session.id = p.auctionSession.id
            WHERE p.status = 'APPROVED'
              AND s.endTime IS NOT NULL
            GROUP BY b.session.id, b.user.id
            HAVING b.price = (
                SELECT MAX(b2.price) FROM AuctionBid b2 WHERE b2.session.id = b.session.id
            )
        )
        ORDER BY (
            SELECT MAX(b.timestamp) FROM AuctionBid b WHERE b.user.id = u.id
        ) DESC
        LIMIT 10
    """)
    List<User> findRecentWinners();
}