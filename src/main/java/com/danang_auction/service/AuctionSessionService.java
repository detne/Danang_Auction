package com.danang_auction.service;

import com.danang_auction.model.dto.session.AuctionSessionParticipantDTO;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.User;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.util.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.repository.AuctionDocumentRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import java.time.LocalDateTime;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuctionSessionService {

    private final AuctionSessionParticipantRepository auctionSessionParticipantRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuctionSessionRepository sessionRepository;
    private final AuctionDocumentRepository documentRepository;


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

    public AuctionSession createSessionFromApprovedAsset(AuctionDocument asset) {
        User user = userRepository.findById(asset.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Người dùng ID " + asset.getUser().getId() + " không tồn tại"));

        validateAuctionTime(asset.getStartTime(), asset.getEndTime());

        AuctionSession session = new AuctionSession();
        session.setSessionCode("AUC-" + System.currentTimeMillis());
        session.setTitle("Phiên đấu giá - " + asset.getDocumentCode());
        session.setDescription(
                asset.getDescription() != null ? asset.getDescription() : "Phiên đấu giá từ tài sản được duyệt"
        );
        session.setStatus(AuctionSessionStatus.UPCOMING);
        session.setAuctionType(asset.getAuctionType());
        session.setStartTime(asset.getStartTime());
        session.setEndTime(asset.getEndTime());
        session.setCreatedBy(user);

        AuctionSession savedSession = sessionRepository.save(session);

        asset.setSession(savedSession);
        documentRepository.save(asset);

        System.out.println("🧾 Đang tạo phiên cho tài sản: " + asset.getDocumentCode());
        System.out.println("👤 User tổ chức: " + user.getId() + ", " + user.getUsername());
        System.out.println("⏰ Thời gian phiên: " + session.getStartTime() + " - " + session.getEndTime());

        return savedSession;
    }

    private void validateAuctionTime(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thời gian bắt đầu và kết thúc không được để trống"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        if (!startTime.isAfter(now)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thời gian bắt đầu phải sau thời gian hiện tại"
            );
        }

        if (!endTime.isAfter(startTime)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thời gian kết thúc phải sau thời gian bắt đầu"
            );
        }
    }
}