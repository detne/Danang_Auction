package com.danang_auction.service;

import com.danang_auction.model.dto.AuctionSessionParticipantDTO;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.User;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import com.danang_auction.util.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuctionSessionService {

    private final AuctionSessionParticipantRepository auctionSessionParticipantRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public List<AuctionSessionParticipantDTO> getParticipantsBySessionId(Long sessionId) {
        // Lấy userId từ SecurityContext
        Long currentUserId = jwtTokenProvider.getCurrentUserId();
        if (currentUserId == null) {
            throw new AccessDeniedException("No authenticated user found");
        }

        // Lấy danh sách participants
        List<AuctionSessionParticipant> participants = auctionSessionParticipantRepository.findByAuctionSessionId(sessionId);
        if (participants.isEmpty()) {
            throw new EntityNotFoundException("No participants found for session ID: " + sessionId);
        }

        // Kiểm tra xem người dùng có phải là organizer không
        AuctionSession session = participants.get(0).getAuctionSession();
        if (session == null || session.getOrganizer() == null || !session.getOrganizer().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Only the organizer can view participants");
        }

        // Ánh xạ sang DTO
        return participants.stream()
                .map(p -> new AuctionSessionParticipantDTO(
                        p.getUser().getId(),
                        p.getRole(),
                        p.getStatus(),
                        p.getDepositStatus(),
                        p.getRegisteredAt()
                ))
                .collect(Collectors.toList());
    }
}