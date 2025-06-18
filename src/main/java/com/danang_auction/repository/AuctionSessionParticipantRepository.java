package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.ParticipantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionSessionParticipantRepository extends JpaRepository<AuctionSessionParticipant, Long> {
    @Query("SELECT p FROM AuctionSessionParticipant p WHERE p.auctionSession.id = :sessionId")
    List<AuctionSessionParticipant> findByAuctionSessionId(@Param("sessionId") Long sessionId);
}