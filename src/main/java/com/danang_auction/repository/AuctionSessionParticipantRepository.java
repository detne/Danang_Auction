package com.danang_auction.repository;

import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionSessionParticipantRepository extends JpaRepository<AuctionSessionParticipant, Long> {

    // Trả về danh sách phiên người dùng đã tham gia
    @Query("SELECT new com.danang_auction.model.dto.participation.ParticipationDTO(" +
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
}
