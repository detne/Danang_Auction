package com.danang_auction.service;

import com.danang_auction.model.dto.session.AuctionSessionParticipantDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
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
    private final AuctionSessionRepository auctionSessionRepository;
    private final AuctionDocumentRepository auctionDocumentRepository;


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

    private String generateSessionCode() {
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder("AUC-");
        for (int i = 0; i < 8; i++) {
            int index = (int) (Math.random() * alphabet.length());
            sb.append(alphabet.charAt(index));
        }
        return sb.toString();
    }


    public AuctionSession createSessionFromApprovedAsset(AuctionDocument asset) {
        if (asset == null) {
            throw new IllegalArgumentException("Tài sản không được null");
        }

        if (asset.getSession() != null) {
            throw new IllegalStateException("Tài sản này đã được gán với phiên đấu giá");
        }

        // Validate thời gian
        validateAuctionTime(asset.getStartTime(), asset.getEndTime());

        // Lấy người tổ chức (chính là người tạo tài sản)
        User organizer = userRepository.findById(asset.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Người tổ chức không tồn tại"));

        // Tạo phiên đấu giá mới
        AuctionSession session = new AuctionSession();
        session.setSessionCode(generateSessionCode()); // Sinh mã định dạng session
        session.setTitle("Phiên đấu giá - " + asset.getDocumentCode());
        session.setDescription(asset.getDescription() != null ? asset.getDescription() : "Phiên đấu giá từ tài sản được duyệt");
        session.setStatus(AuctionSessionStatus.UPCOMING);
        session.setAuctionType(asset.getAuctionType());
        session.setStartTime(asset.getStartTime());
        session.setEndTime(asset.getEndTime());

        session.setCreatedBy(organizer); // Tạm thời là chính organizer
        session.setOrganizer(organizer);
        session.setCategory(asset.getCategory());

        // Lưu session
        AuctionSession savedSession = auctionSessionRepository.save(session);

        // Gán ngược lại cho tài sản
        asset.setSession(savedSession);
        auctionDocumentRepository.save(asset);

        System.out.println("Đã tạo phiên cho tài sản: " + asset.getDocumentCode());
        System.out.println("Người tổ chức: " + organizer.getId() + ", " + organizer.getUsername());
        System.out.println("Thời gian phiên: " + session.getStartTime() + " - " + session.getEndTime());

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
