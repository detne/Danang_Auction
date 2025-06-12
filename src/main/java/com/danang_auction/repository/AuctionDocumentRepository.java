package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.AuctionStatus;
import com.danang_auction.model.enums.AuctionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionDocumentRepository extends JpaRepository<AuctionDocument, Long> {

    List<AuctionDocument> findBySession(AuctionSession session);

    List<AuctionDocument> findByUser(User user);

    List<AuctionDocument> findByStatus(AuctionStatus status);

    List<AuctionDocument> findByAuctionType(AuctionType auctionType);

    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.session = :session AND ad.status = :status")
    List<AuctionDocument> findBySessionAndStatus(@Param("session") AuctionSession session, @Param("status") AuctionStatus status);

    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.createdAt BETWEEN :startDate AND :endDate")
    List<AuctionDocument> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    boolean existsByDocumentCode(String documentCode);

    @Query("SELECT COUNT(ad) FROM AuctionDocument ad WHERE ad.session = :session")
    long countBySession(@Param("session") AuctionSession session);
}
