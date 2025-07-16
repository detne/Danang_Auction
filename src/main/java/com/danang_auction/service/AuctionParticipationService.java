package com.danang_auction.service;

import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AuctionParticipationService {
    private final AuctionSessionParticipantRepository participantRepository;

    public AuctionParticipationService(AuctionSessionParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

public Page<ParticipationRequest> getUserParticipations(Long userId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    return participantRepository.findByUserId(userId, pageable);
}
    }

