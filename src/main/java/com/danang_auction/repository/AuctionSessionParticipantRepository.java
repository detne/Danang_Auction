package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.ParticipantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionSessionParticipantRepository extends JpaRepository<AuctionSessionParticipant, com.danang_auction.model.entity.AuctionSessionParticipantId> {

    List<AuctionSessionParticipant> findByAuctionSession(AuctionSession auctionSession);

    List<AuctionSessionParticipant> findByParticipant(User participant);

    List<AuctionSessionParticipant> findByStatus(ParticipantStatus status);

    Optional<AuctionSessionParticipant> findByAuctionSessionAndParticipant(AuctionSession auctionSession, User participant);

    @Query("SELECT asp FROM AuctionSessionParticipant asp WHERE asp.auctionSession = :auctionSession AND asp.status = :status")
    List<AuctionSessionParticipant> findByAuctionSessionAndStatus(@Param("auctionSession") AuctionSession auctionSession, @Param("status") ParticipantStatus status);

    @Query("SELECT asp FROM AuctionSessionParticipant asp WHERE asp.participant = :participant AND asp.status = :status")
    List<AuctionSessionParticipant> findByParticipantAndStatus(@Param("participant") User participant, @Param("status") ParticipantStatus status);

    @Query("SELECT COUNT(asp) FROM AuctionSessionParticipant asp WHERE asp.auctionSession = :auctionSession AND asp.status = 'APPROVED'")
    long countApprovedParticipantsForAuctionSession(@Param("auctionSession") AuctionSession auctionSession);

    @Query("SELECT COUNT(asp) FROM AuctionSessionParticipant asp WHERE asp.auctionSession = :auctionSession AND asp.status = 'PENDING'")
    long countPendingParticipantsForAuctionSession(@Param("auctionSession") AuctionSession auctionSession);

    @Query("SELECT asp.participant FROM AuctionSessionParticipant asp WHERE asp.auctionSession = :auctionSession AND asp.status = 'APPROVED'")
    List<User> findApprovedParticipantsForAuctionSession(@Param("auctionSession") AuctionSession auctionSession);

    @Query("SELECT asp FROM AuctionSessionParticipant asp WHERE asp.registeredAt BETWEEN :startDate AND :endDate")
    List<AuctionSessionParticipant> findRegistrationsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT asp FROM AuctionSessionParticipant asp WHERE asp.auctionSession = :auctionSession ORDER BY asp.registeredAt ASC")
    List<AuctionSessionParticipant> findByAuctionSessionOrderByRegisteredAt(@Param("auctionSession") AuctionSession auctionSession);


    boolean existsByAuctionSessionAndParticipant(AuctionSession auctionSession, User participant);
}
