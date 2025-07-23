package com.danang_auction.service;

import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.DepositStatus;
import com.danang_auction.model.enums.ParticipantStatus;
import com.danang_auction.model.enums.UserRole;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import com.danang_auction.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuctionParticipationService {

    private final AuctionSessionRepository auctionSessionRepository;
    private final UserRepository userRepository;
    private final AuctionSessionParticipantRepository participantRepository;

    public AuctionParticipationService(
            AuctionSessionRepository auctionSessionRepository,
            UserRepository userRepository,
            AuctionSessionParticipantRepository participantRepository) {
        this.auctionSessionRepository = auctionSessionRepository;
        this.userRepository = userRepository;
        this.participantRepository = participantRepository;
    }

    public void join(Long sessionId, Long userId) {
        AuctionSession session = auctionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phiên đấu giá"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        boolean alreadyJoined = participantRepository.existsByAuctionSessionIdAndUserId(sessionId, userId);
        if (alreadyJoined) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn đã tham gia phiên đấu giá này rồi");
        }

        AuctionSessionParticipant participant = new AuctionSessionParticipant();
        participant.setUser(user);
        participant.setAuctionSession(session);
        participant.setRole(UserRole.BIDDER);
        participant.setStatus(ParticipantStatus.APPROVED);
        participant.setDepositStatus(DepositStatus.PENDING);
        participantRepository.save(participant);
    }

    public Page<ParticipationRequest> getUserParticipations(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return participantRepository.findByUserId(userId, pageable);
    }
}
