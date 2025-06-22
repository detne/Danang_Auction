package com.danang_auction.repository;

import com.danang_auction.model.dto.entityDTO.ParticipationDTO;
import com.danang_auction.model.dto.entityDTO.ParticipationResponse;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionSessionParticipantRepository extends JpaRepository<AuctionSessionParticipant, Long> {
    @Query("""
    SELECT new com.danang_auction.model.dto.entityDTO.ParticipationDTO(
        asp.auctionSession.id,
        asp.auctionSession.title,
        asp.auctionSession.startTime,
        asp.auctionSession.endTime,
        asp.role,
        asp.status,
        asp.depositStatus,
        asp.registeredAt
    )
    FROM AuctionSessionParticipant asp
    WHERE asp.user.id = :userId
""")
    Page<ParticipationDTO> findByUserId(@Param("userId") Long userId, Pageable pageable);
}