package com.danang_auction.service;

import com.danang_auction.model.enums.UserRole;
import com.danang_auction.exception.ForbiddenException;
import com.danang_auction.exception.NotFoundException;
import com.danang_auction.model.dto.session.AuctionSessionAdminDTO;
import com.danang_auction.model.dto.session.AuctionSessionDetailDTO;
import com.danang_auction.model.dto.session.AuctionSessionParticipantDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.AuctionType;
import com.danang_auction.model.enums.ParticipantStatus;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.util.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.repository.AuctionBidRepository;
import com.danang_auction.repository.AuctionDocumentRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import com.danang_auction.model.entity.AuctionBid;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuctionSessionService {

    private final AuctionSessionParticipantRepository auctionSessionParticipantRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuctionSessionRepository auctionSessionRepository;
    private final AuctionDocumentRepository auctionDocumentRepository;
    private final AuctionBidRepository auctionBidRepository;

    // Phương thức lấy danh sách người tham gia phiên đấu giá
    public List<AuctionSessionParticipantDTO> getParticipantsBySessionId(Long sessionId) {
        Long currentUserId = jwtTokenProvider.getCurrentUserId();
        if (currentUserId == null) {
            throw new AccessDeniedException("No authenticated user found");
        }

        List<AuctionSessionParticipant> participants = auctionSessionParticipantRepository
                .findByAuctionSessionId(sessionId);
        if (participants.isEmpty()) {
            throw new EntityNotFoundException("No participants found for session ID: " + sessionId);
        }

        AuctionSession session = participants.get(0).getAuctionSession();
        if (session == null || session.getOrganizer() == null
                || !session.getOrganizer().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Only the organizer can view participants");
        }

        return participants.stream()
                .map(p -> new AuctionSessionParticipantDTO(
                        p.getUser().getId(),
                        p.getRole(),
                        p.getStatus(),
                        p.getDepositStatus(),
                        p.getRegisteredAt()))
                .collect(Collectors.toList());
    }

    // Tạo phiên đấu giá từ tài sản đã được phê duyệt
    public AuctionSession createSessionFromApprovedAsset(AuctionDocument asset) {
        User user = userRepository.findById(asset.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Người dùng ID " + asset.getUser().getId() + " không tồn tại"));

        validateAuctionTime(asset.getStartTime(), asset.getEndTime());

        AuctionSession session = new AuctionSession();
        session.setSessionCode("AUC-" + System.currentTimeMillis());
        session.setTitle("Phiên đấu giá - " + asset.getDescription());
        session.setDescription(
                asset.getDescription() != null ? asset.getDescription() : "Phiên đấu giá từ tài sản được duyệt");
        session.setStatus(AuctionSessionStatus.UPCOMING);
        session.setAuctionType(asset.getAuctionType());
        session.setStartTime(asset.getStartTime());
        session.setEndTime(asset.getEndTime());
        session.setOrganizer(user);

        AuctionSession savedSession = auctionSessionRepository.save(session);

        asset.setSession(savedSession);
        auctionDocumentRepository.save(asset);

        System.out.println("🧾 Đang tạo phiên cho tài sản: " + asset.getDocumentCode());
        System.out.println("👤 User tổ chức: " + user.getId() + ", " + user.getUsername());
        System.out.println("⏰ Thời gian phiên: " + session.getStartTime() + " - " + session.getEndTime());

        return savedSession;
    }

    // Kiểm tra thời gian đấu giá hợp lệ
    private void validateAuctionTime(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thời gian bắt đầu và kết thúc không được để trống");
        }

        LocalDateTime now = LocalDateTime.now();

        if (!startTime.isAfter(now)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thời gian bắt đầu phải sau thời gian hiện tại");
        }

        if (!endTime.isAfter(startTime)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thời gian kết thúc phải sau thời gian bắt đầu");
        }
    }

    // Lấy các phiên đấu giá theo mã tài sản
    public List<AuctionSessionSummaryDTO> getSessionsByAssetId(Integer assetId) {
        List<AuctionSession> sessions = auctionSessionRepository.findSessionsByDocumentId(assetId);
        return sessions.stream()
                .map(AuctionSessionSummaryDTO::new)
                .collect(Collectors.toList());
    }

    // Tìm kiếm phiên đấu giá
    public List<AuctionSessionSummaryDTO> searchSessions(
            String title,
            String description,
            String statusStr,
            LocalDate date,
            User currentUser) {
        List<AuctionSession> sessions = auctionSessionRepository.findAll();

        return sessions.stream()
                .filter(session -> {
                    if (session.getAuctionType() == AuctionType.PUBLIC) {
                        return true;
                    } else if (session.getAuctionType() == AuctionType.PRIVATE) {
                        return currentUser != null &&
                                session.getOrganizer() != null &&
                                session.getOrganizer().getId().equals(currentUser.getId());
                    }
                    return false;
                })
                .filter(session -> title == null || session.getTitle().toLowerCase().contains(title.toLowerCase()))
                .filter(session -> description == null || (session.getDescription() != null &&
                        session.getDescription().toLowerCase().contains(description.toLowerCase())))
                .filter(session -> {
                    if (statusStr == null)
                        return true;
                    try {
                        AuctionSessionStatus status = AuctionSessionStatus.valueOf(statusStr.toUpperCase());
                        return session.getStatus() == status;
                    } catch (IllegalArgumentException e) {
                        return false;
                    }
                })
                .filter(session -> {
                    if (date == null)
                        return true;
                    return session.getStartTime() != null &&
                            session.getStartTime().toLocalDate().isEqual(date);
                })
                .map(AuctionSessionSummaryDTO::new)
                .collect(Collectors.toList());
    }

    // Lấy chi tiết phiên đấu giá với quyền truy cập
    public AuctionSessionDetailDTO getSessionByIdWithAccessControl(Long sessionId, CustomUserDetails user) {
        AuctionSession session = auctionSessionRepository.findByIdWithDocumentAndParticipants(sessionId)
                .orElseThrow(() -> new NotFoundException("Phiên đấu giá không tồn tại."));

        AuctionDocument asset = auctionDocumentRepository.findBySessionId(session.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài sản liên kết với phiên này"));

        if (asset == null) {
            throw new NotFoundException("Tài sản liên kết với phiên đấu giá không tồn tại.");
        }

        AuctionType type = asset.getAuctionType();

        if (type == AuctionType.PUBLIC) {
            return new AuctionSessionDetailDTO(session, asset);
        }

        if (type == AuctionType.PRIVATE) {
            if (user == null) {
                throw new AccessDeniedException("Bạn cần đăng nhập để xem phiên đấu giá riêng tư.");
            }

            boolean isApprovedParticipant = session.getParticipants().stream()
                    .anyMatch(p -> p.getUser().getId().equals(user.getId())
                            && p.getStatus() == ParticipantStatus.APPROVED);

            if (!isApprovedParticipant) {
                throw new AccessDeniedException("Bạn chưa được duyệt tham gia phiên đấu giá này.");
            }

            return new AuctionSessionDetailDTO(session, asset);
        }

        throw new AccessDeniedException("Loại phiên đấu giá không hợp lệ.");
    }

    // Lấy danh sách phiên đấu giá cho quản trị viên
    public List<AuctionSessionAdminDTO> searchSessionsForAdmin(String statusStr, String keyword) {
        AuctionSessionStatus status = null;

        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = AuctionSessionStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Trạng thái phiên không hợp lệ.");
            }
        }

        String searchKeyword = keyword != null ? "%" + keyword.toLowerCase() + "%" : null;

        List<AuctionSession> sessions = auctionSessionRepository.searchSessionsByStatusAndKeyword(status,
                searchKeyword);

        return sessions.stream()
                .map(session -> {
                    AuctionDocument doc = auctionDocumentRepository.findBySession(session)
                            .orElse(null);
                    return new AuctionSessionAdminDTO(session, doc);
                })
                .collect(Collectors.toList());
    }

    // Cập nhật hình thức phiên đấu giá
    public void updateSessionVisibility(Long sessionId, Long userId, AuctionType newType) {
        AuctionSession session = auctionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy phiên đấu giá"));

        AuctionDocument document = auctionDocumentRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài sản đấu giá gắn với phiên này."));

        if (!document.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền cập nhật phiên này.");
        }

        if (session.getStatus() == AuctionSessionStatus.APPROVED) {
            throw new AccessDeniedException("Phiên đã được duyệt, không thể thay đổi hình thức.");
        }

        session.setAuctionType(newType);
        session.setUpdatedAt(LocalDateTime.now());
        auctionSessionRepository.save(session);
    }

    // Lấy giá hiện tại của phiên đấu giá
    public BigDecimal getCurrentPrice(Long sessionId) {
        BigDecimal price = auctionBidRepository.findCurrentPriceBySessionId(sessionId);
        return price != null ? price : BigDecimal.ZERO;
    }

    // Đặt giá cho phiên đấu giá
    public Map<String, Object> submitBid(Long sessionId, Long userId, Double price) {
        AuctionSession session = auctionSessionRepository.findWithDocumentById(sessionId)
                .orElseThrow(() -> new RuntimeException("Phiên đấu giá không tồn tại"));

        if (!AuctionSessionStatus.ACTIVE.equals(session.getStatus())) {
            throw new RuntimeException("Phiên đấu giá không hoạt động");
        }

        auctionSessionParticipantRepository.findBySessionIdAndUserIdApproved(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("Bạn chưa được duyệt tham gia phiên đấu giá này"));

        Long highestBid = auctionBidRepository.findHighestBidAmount(sessionId);
        Double currentPrice = highestBid != null ? highestBid : session.getAuctionDocument().getStartingPrice();
        Double stepPrice = session.getAuctionDocument().getStepPrice();

        if (price < currentPrice + stepPrice || (price - currentPrice) % stepPrice != 0) {
            throw new RuntimeException("Giá phải lớn hơn " + currentPrice + " và theo bước giá " + stepPrice);
        }

        AuctionBid bid = new AuctionBid();
        bid.setSession(session);

        User user = new User();
        user.setId(userId);
        bid.setUser(user);

        bid.setPrice(price);
        bid.setTimestamp(LocalDateTime.now());

        auctionBidRepository.save(bid);

        return Map.of("message", "Đấu giá thành công", "price", price);
    }

    // Thêm phương thức lấy người thắng cuộc
    // Thêm phương thức lấy người thắng cuộc
    public AuctionSessionParticipantDTO getWinnerBySessionId(Long sessionId) {
        // Lấy phiên đấu giá từ sessionId
        AuctionSession session = auctionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Phiên đấu giá không tồn tại hoặc chưa kết thúc."));

        // Kiểm tra xem phiên đấu giá có kết thúc hay không
        if (session.getStatus() != AuctionSessionStatus.FINISHED) {
            throw new NotFoundException("Phiên đấu giá chưa kết thúc, không thể xác định người thắng cuộc.");
        }

        // Truy vấn người thắng cuộc dựa trên giá đấu cao nhất
        AuctionBid highestBid = auctionBidRepository.findTopBySessionIdOrderByPriceDesc(sessionId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giá đấu cao nhất trong phiên đấu giá."));

        // Lấy người tham gia đã phê duyệt với giá đấu cao nhất
        AuctionSessionParticipant winnerParticipant = auctionSessionParticipantRepository
                .findBySessionIdAndUserIdApproved(sessionId, highestBid.getUser().getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người tham gia với giá đấu cao nhất."));

        // Chuyển đổi sang DTO và trả về
        return new AuctionSessionParticipantDTO(
                winnerParticipant.getUser().getId(),
                winnerParticipant.getRole(),
                winnerParticipant.getStatus(),
                winnerParticipant.getDepositStatus(),
                winnerParticipant.getRegisteredAt()
        );
    }


}
