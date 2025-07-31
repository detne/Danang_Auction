package com.danang_auction.repository;

import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.AuctionSessionParticipantId;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionSessionParticipantRepository
        extends JpaRepository<AuctionSessionParticipant, AuctionSessionParticipantId> {

    // Trả về danh sách phiên người dùng đã tham gia
    @Query("SELECT new com.danang_auction.model.dto.participation.ParticipationRequest(" +
            "asp.auctionSession.id, " +
            "asp.auctionSession.title, " +
            "asp.auctionSession.startTime, " +
            "asp.auctionSession.endTime, " +
            "asp.role, " +
            "asp.status, " +
            "asp.depositStatus, " +
            "asp.registeredAt) " +
            "FROM AuctionSessionParticipant asp " +
            "WHERE asp.user.id = :userId")
    Page<ParticipationRequest> findByUserId(@Param("userId") Long userId, Pageable pageable);

    // Trả về danh sách người tham gia phiên đấu giá
    @Query("SELECT p FROM AuctionSessionParticipant p WHERE p.auctionSession.id = :sessionId")
    List<AuctionSessionParticipant> findByAuctionSessionId(@Param("sessionId") Long sessionId);

    // Kiểm tra người dùng đã được duyệt trong phiên
    @Query("SELECT p FROM AuctionSessionParticipant p WHERE p.auctionSession.id = :sessionId AND p.user.id = :userId AND p.status = 'APPROVED'")
    Optional<AuctionSessionParticipant> findBySessionIdAndUserIdApproved(@Param("sessionId") Long sessionId,
            @Param("userId") Long userId);

    // Check đã tham gia phiên
    boolean existsByAuctionSessionIdAndUserId(Long sessionId, Long userId);

    // ✅ Tìm Winner theo giá đấu cao nhất
    @Query("SELECT asp FROM AuctionSessionParticipant asp " +
            "WHERE asp.auctionSession.id = :sessionId " +
            "AND asp.user.id = (" +
            "  SELECT b.user.id FROM AuctionBid b " +
            "  WHERE b.session.id = :sessionId " +
            "  AND b.price = (" +
            "    SELECT MAX(b2.price) FROM AuctionBid b2 WHERE b2.session.id = :sessionId" +
            "  )" +
            ")")
    Optional<AuctionSessionParticipant> findWinnerBySessionId(@Param("sessionId") Long sessionId);
}