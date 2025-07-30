package com.danang_auction.service;

import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.repository.*;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuctionParticipationService {

    private final AuctionSessionParticipantRepository participantRepository;

    public AuctionParticipationService(
            AuctionSessionParticipantRepository participantRepository) {

        this.participantRepository = participantRepository;
    }

    @Transactional
    public Page<ParticipationRequest> getUserParticipations(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return participantRepository.findByUserId(userId, pageable);
    }
}