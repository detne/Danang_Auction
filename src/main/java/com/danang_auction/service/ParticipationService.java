package com.danang_auction.service;

import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ParticipationService {
    private final AuctionSessionParticipantRepository participantRepository;

    public ParticipationService(AuctionSessionParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

//    public ParticipationResponse getParticipationsByUser(Long userId, int page, int limit) {
//        Pageable pageable = PageRequest.of(page - 1, limit);
//        Page<ParticipationDTO> result = participantRepository.findByUserId(userId, pageable);
public Page<ParticipationRequest> getUserParticipations(Long userId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    return participantRepository.findByUserId(userId, pageable);
}


//        return new ParticipationResponse(
//                result.getContent(),
//                result.getTotalElements(),
//                page,
//                limit
//        );
    }

