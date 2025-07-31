package com.danang_auction.service;

import com.danang_auction.exception.ForbiddenException;
import com.danang_auction.exception.NotFoundException;
import com.danang_auction.model.dto.bid.AuctionBidDTO;
import com.danang_auction.model.dto.bid.WinnerDTO;
import com.danang_auction.model.dto.session.AuctionSessionAdminDTO;
import com.danang_auction.model.dto.session.AuctionSessionDetailDTO;
import com.danang_auction.model.dto.session.AuctionSessionParticipantDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.AuctionType;
import com.danang_auction.model.enums.DepositStatus;
import com.danang_auction.model.enums.ParticipantStatus;
import com.danang_auction.model.enums.UserRole;
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
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import jakarta.transaction.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionSessionService {

    private final AuctionSessionParticipantRepository auctionSessionParticipantRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuctionSessionRepository auctionSessionRepository;
    private final AuctionDocumentRepository auctionDocumentRepository;
    private final AuctionBidRepository auctionBidRepository;
    private final EmailService emailService;
    private final UserService userService;
    private final SepayService sepayService;

    public List<AuctionSessionParticipantDTO> getParticipantsBySessionId(Long sessionId) {
        // Lấy userId từ SecurityContext
        Long currentUserId = jwtTokenProvider.getCurrentUserId();
        if (currentUserId == null) {
            throw new AccessDeniedException("No authenticated user found");
        }

        // Lấy danh sách participants
        List<AuctionSessionParticipant> participants = auctionSessionParticipantRepository
                .findByAuctionSessionId(sessionId);
        if (participants.isEmpty()) {
            throw new EntityNotFoundException("No participants found for session ID: " + sessionId);
        }

        // Kiểm tra xem người dùng có phải là organizer không
        AuctionSession session = participants.get(0).getAuctionSession();
        if (session == null || session.getOrganizer() == null
                || !session.getOrganizer().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Only the organizer can view participants");
        }

        // Ánh xạ sang DTO
        return participants.stream()
                .map(p -> new AuctionSessionParticipantDTO(
                        p.getUser().getId(),
                        p.getRole().name(), // ✅ Convert UserRole enum -> String
                        p.getStatus(),
                        p.getDepositStatus(),
                        p.getRegisteredAt()))
                .collect(Collectors.toList());
    }

    public AuctionSession createSessionFromApprovedAsset(AuctionDocument asset) {
        User user = userRepository.findById(asset.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Người dùng ID " + asset.getUser().getId() + " không tồn tại"));

        validateAuctionTime(asset.getStartTime(), asset.getEndTime());

        AuctionSession session = new AuctionSession();
        session.setSessionCode("AUC-" + System.currentTimeMillis());
        session.setTitle(asset.getDescription());
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

    public List<AuctionSessionSummaryDTO> getSessionsByAssetId(Integer assetId) {
        List<AuctionSession> sessions = auctionSessionRepository.findSessionsByDocumentId(assetId);
        return sessions.stream()
                .map(session -> {
                    String thumbnailUrl = null;
                    AuctionDocument doc = session.getAuctionDocument();
                    if (doc != null && doc.getImageRelations() != null && !doc.getImageRelations().isEmpty()) {
                        thumbnailUrl = doc.getImageRelations().get(0).getImage().getUrl();
                    }
                    return new AuctionSessionSummaryDTO(session, thumbnailUrl);
                })
                .collect(Collectors.toList());
    }

    public List<AuctionSessionSummaryDTO> searchSessions(
            String title,
            String description,
            String statusStr,
            String typeStr,
            LocalDate date,
            User currentUser) {

        List<AuctionSession> sessions = auctionSessionRepository.findAll();

        return sessions.stream()
                .filter(session -> {
                    // Type (PUBLIC/PRIVATE)
                    if (typeStr != null) {
                        try {
                            AuctionType type = AuctionType.valueOf(typeStr.toUpperCase());
                            if (session.getAuctionType() != type)
                                return false;
                        } catch (Exception e) {
                            return false;
                        }
                    }
                    // Quyền truy cập
                    if (session.getAuctionType() == AuctionType.PUBLIC) {
                        return true;
                    } else if (session.getAuctionType() == AuctionType.PRIVATE) {
                        return currentUser != null &&
                                session.getOrganizer() != null &&
                                session.getOrganizer().getId().equals(currentUser.getId());
                    }
                    return false;
                })
                // ... các filter còn lại như cũ ...
                .filter(session -> title == null || session.getTitle().toLowerCase().contains(title.toLowerCase()))
                .filter(session -> description == null || (session.getDescription() != null &&
                        session.getDescription().toLowerCase().contains(description.toLowerCase())))
                .filter(session -> {
                    if (statusStr == null)
                        return true;
                    try {
                        AuctionSessionStatus status = AuctionSessionStatus.valueOf(statusStr.toUpperCase());
                        boolean matchStatus = session.getStatus() == status;

                        if (status == AuctionSessionStatus.UPCOMING) {
                            return matchStatus &&
                                    session.getStartTime() != null &&
                                    session.getStartTime().isAfter(LocalDateTime.now());
                        }

                        return matchStatus;
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
                .map(session -> {
                    String thumbnailUrl = null;
                    AuctionDocument doc = session.getAuctionDocument();
                    if (doc != null && doc.getImageRelations() != null && !doc.getImageRelations().isEmpty()) {
                        thumbnailUrl = doc.getImageRelations().get(0).getImage().getUrl();
                    }
                    return new AuctionSessionSummaryDTO(session, thumbnailUrl);
                })
                .collect(Collectors.toList());
    }

    public List<AuctionSessionSummaryDTO> getFinishedPublicSessions() {
        List<AuctionSession> sessions = auctionSessionRepository
                .findByStatusAndAuctionType(AuctionSessionStatus.FINISHED, AuctionType.PUBLIC);

        return sessions.stream()
                .map(session -> {
                    AuctionDocument doc = session.getAuctionDocument();
                    String thumbnailUrl = null;
                    if (doc != null && doc.getImageRelations() != null && !doc.getImageRelations().isEmpty()) {
                        thumbnailUrl = doc.getImageRelations().get(0).getImage().getUrl(); // Lấy ảnh đầu tiên
                    }
                    return new AuctionSessionSummaryDTO(session, thumbnailUrl);
                })
                .collect(Collectors.toList());
    }

    public AuctionSessionDetailDTO getSessionByIdWithAccessControl(Long sessionId, CustomUserDetails user) {
        // 🔍 Tìm phiên đấu giá theo ID, bao gồm document và participant
        AuctionSession session = auctionSessionRepository.findByIdWithDocumentAndParticipants(sessionId)
                .orElseThrow(() -> new NotFoundException("Phiên đấu giá không tồn tại."));

        // 🔗 Lấy tài sản chính liên kết với phiên đấu giá
        AuctionDocument asset = auctionDocumentRepository.findBySessionId(session.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài sản liên kết với phiên này"));
        // CHỈ HỢP LÝ nếu bạn sửa mối quan hệ OneToOne

        if (asset == null) {
            throw new NotFoundException("Tài sản liên kết với phiên đấu giá không tồn tại.");
        }

        AuctionType type = asset.getAuctionType();

        // ✅ Nếu phiên là PUBLIC → ai cũng có thể xem
        if (type == AuctionType.PUBLIC) {
            return new AuctionSessionDetailDTO(session, asset);
        }

        // ✅ Nếu là PRIVATE → kiểm tra quyền truy cập
        if (type == AuctionType.PRIVATE) {
            if (user == null) {
                throw new AccessDeniedException("Bạn cần đăng nhập để xem phiên đấu giá riêng tư.");
            }

            boolean isApprovedParticipant = session.getParticipants().stream()
                    .anyMatch(p -> p.getUser().getId().equals(user.getId())
                            && p.getStatus() == ParticipantStatus.WAITING_START);

            if (!isApprovedParticipant) {
                throw new AccessDeniedException("Bạn chưa được duyệt tham gia phiên đấu giá này.");
            }

            return new AuctionSessionDetailDTO(session, asset);
        }

        throw new AccessDeniedException("Loại phiên đấu giá không hợp lệ.");
    }

    @Transactional
    public AuctionSessionDetailDTO getSessionByCodeWithAccessControl(String sessionCode, CustomUserDetails user) {
        AuctionSession session = auctionSessionRepository
                .findBySessionCodeWithDocumentAndParticipants(sessionCode)
                .orElseThrow(() -> new NotFoundException("Phiên đấu giá không tồn tại."));

        AuctionDocument asset = session.getAuctionDocument();
        AuctionType type = asset.getAuctionType();

        // 🔹 Auto cập nhật WAITING_START -> ONGOING nếu phiên đang ACTIVE
        if (session.getStatus() == AuctionSessionStatus.ACTIVE) {
            for (AuctionSessionParticipant p : session.getParticipants()) {
                if (p.getStatus() == ParticipantStatus.WAITING_START) {
                    p.setStatus(ParticipantStatus.ONGOING);
                    auctionSessionParticipantRepository.save(p);
                }
            }
        }

        // Tạo DTO
        AuctionSessionDetailDTO dto = new AuctionSessionDetailDTO(session, asset);

        boolean alreadyJoined = false;
        Double yourHighestBid = 0D;

        // Nếu có user đăng nhập
        if (user != null && user.getId() != null) {
            // Tìm participant hiện tại (nếu có)
            AuctionSessionParticipant me = session.getParticipants().stream()
                    .filter(p -> p.getUser().getId().equals(user.getId()))
                    .findFirst()
                    .orElse(null);

            if (me != null) {
                alreadyJoined = true;

                // Gán participant_status và deposit_status vào DTO để FE đọc trực tiếp
                dto.setParticipantStatus(me.getStatus().name());
                dto.setDepositStatus(me.getDepositStatus().name());
            }

            // Giá cao nhất user đã đấu giá
            yourHighestBid = Optional.ofNullable(
                    auctionBidRepository.findUserHighestBid(session.getId(), user.getId())).orElse(0D);
        }

        dto.setAlreadyJoined(alreadyJoined);
        dto.setYourHighestBid(yourHighestBid);

        // Nếu PUBLIC thì trả luôn
        if (type == AuctionType.PUBLIC) {
            return dto;
        }

        // Nếu PRIVATE → kiểm tra quyền truy cập
        if (type == AuctionType.PRIVATE) {
            if (user == null) {
                throw new AccessDeniedException("Bạn cần đăng nhập để xem phiên đấu giá riêng tư.");
            }

            boolean isApprovedParticipant = session.getParticipants().stream()
                    .anyMatch(p -> p.getUser().getId().equals(user.getId())
                            && p.getStatus() == ParticipantStatus.ONGOING);

            if (!isApprovedParticipant) {
                throw new AccessDeniedException("Bạn chưa được duyệt tham gia phiên đấu giá này.");
            }
            return dto;
        }

        throw new AccessDeniedException("Loại phiên đấu giá không hợp lệ.");
    }

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
                            .orElse(null); // Có thể null nếu dữ liệu lỗi
                    return new AuctionSessionAdminDTO(session, doc);
                })
                .collect(Collectors.toList());
    }

    public void updateSessionVisibility(Long sessionId, Long userId, AuctionType newType) {
        AuctionSession session = auctionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy phiên đấu giá"));

        // 🔍 Truy ngược từ AuctionDocument vì chỉ chiều document → session tồn tại
        AuctionDocument document = auctionDocumentRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài sản đấu giá gắn với phiên này."));

        // 🔐 Kiểm tra quyền sở hữu: userId phải là người tạo document
        if (!document.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền cập nhật phiên này.");
        }

        // 🚫 Không cho đổi nếu đã duyệt
        if (session.getStatus() == AuctionSessionStatus.APPROVED) {
            throw new AccessDeniedException("Phiên đã được duyệt, không thể thay đổi hình thức.");
        }

        // ✅ Cập nhật
        session.setAuctionType(newType);
        session.setUpdatedAt(LocalDateTime.now());
        auctionSessionRepository.save(session);
    }

    public BigDecimal getCurrentPrice(Long sessionId) {
        BigDecimal price = auctionBidRepository.findCurrentPriceBySessionId(sessionId);
        return price != null ? price : BigDecimal.ZERO;
    }

    public Map<String, Object> submitBid(Long sessionId, Long userId, Double price) {
        AuctionSession session = auctionSessionRepository.findWithDocumentById(sessionId)
                .orElseThrow(() -> new RuntimeException("Phiên đấu giá không tồn tại"));

        if (!AuctionSessionStatus.ACTIVE.equals(session.getStatus())) {
            throw new RuntimeException("Phiên đấu giá không hoạt động");
        }

        AuctionDocument document = session.getAuctionDocument();
        AuctionType auctionType = document.getAuctionType();

        // Kiểm tra duyệt participant **CHỈ VỚI PRIVATE**
        if (auctionType == AuctionType.PRIVATE) {
            auctionSessionParticipantRepository.findBySessionIdAndUserIdApproved(sessionId, userId)
                    .orElseThrow(() -> new RuntimeException("Bạn chưa được duyệt tham gia phiên đấu giá này"));
        }

        // Lấy giá hiện tại (nên dùng Double thay vì Long)
        Double currentPrice = auctionBidRepository.findCurrentPriceBySessionId(sessionId) != null
                ? auctionBidRepository.findCurrentPriceBySessionId(sessionId).doubleValue()
                : document.getStartingPrice();

        Double stepPrice = document.getStepPrice();

        // Kiểm tra giá hợp lệ (bắt buộc phải lớn hơn currentPrice và theo đúng bước
        // giá)
        if (price < currentPrice + stepPrice || ((price - currentPrice) % stepPrice != 0)) {
            throw new RuntimeException("Giá phải lớn hơn " + currentPrice + " và theo bước giá " + stepPrice);
        }

        // Lưu bid
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

    // Đăng ký tham gia phiên đấu giá
    @Transactional
    public void registerBidder(String sessionCode, CustomUserDetails userDetails) {
        // 1. Chỉ cho BIDDER tham gia
        if (userDetails.getRole() != UserRole.BIDDER) {
            throw new AccessDeniedException("Chỉ tài khoản BIDDER mới được tham gia đấu giá");
        }

        // 2. Lấy phiên đấu giá
        AuctionSession session = auctionSessionRepository.findBySessionCode(sessionCode)
                .orElseThrow(() -> new NotFoundException("Phiên đấu giá không tồn tại"));

        // 3. Kiểm tra trạng thái
        if (session.getStatus() != AuctionSessionStatus.UPCOMING
                && session.getStatus() != AuctionSessionStatus.ACTIVE) {
            throw new IllegalStateException("Phiên đấu giá không còn mở đăng ký");
        }

        // 4. Kiểm tra đã tham gia chưa
        boolean exists = auctionSessionParticipantRepository.existsByAuctionSessionIdAndUserId(
                session.getId(), userDetails.getId());
        if (exists) {
            throw new IllegalStateException("Bạn đã đăng ký phiên đấu giá này rồi");
        }

        // 5. Lấy user & kiểm tra số dư
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new NotFoundException("User không tồn tại"));

        AuctionDocument document = auctionDocumentRepository.findBySessionId(session.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài sản đấu giá"));

        double depositAmount = document.getDepositAmount();
        if (user.getBalance() < depositAmount) {
            throw new IllegalStateException("Số dư không đủ để đặt cọc. Vui lòng nạp thêm tiền.");
        }

        // 6. Trừ tiền và cập nhật balance
        user.setBalance(user.getBalance() - depositAmount);

        // 7. Xác định trạng thái phê duyệt
        ParticipantStatus status = ParticipantStatus.WAITING_START;

        // 8. Tạo participant
        AuctionSessionParticipant participant = new AuctionSessionParticipant();
        participant.setAuctionSession(session);
        participant.setUser(user);
        participant.setRole(UserRole.BIDDER);
        participant.setStatus(status);
        participant.setDepositStatus(DepositStatus.PAID); // Đã đặt cọc
        participant.setDepositAmount(depositAmount); // Lưu số tiền đặt cọc
        participant.setRegisteredAt(LocalDateTime.now());

        // 9. Lưu DB
        auctionSessionParticipantRepository.save(participant);
        userRepository.save(user);
    }

    // Lấy lịch sử đấu giá của phiên
    public List<AuctionBidDTO> getBidHistory(Long sessionId) {
        List<AuctionBid> bids = auctionBidRepository.findBySessionIdOrderByTimestampDesc(sessionId);
        return bids.stream()
                .map(bid -> new AuctionBidDTO(
                        bid.getUser().getId(),
                        bid.getUser().getFirstName() + " " + bid.getUser().getLastName(),
                        bid.getPrice(),
                        bid.getTimestamp()))
                .collect(Collectors.toList());
    }

    // Lấy người thắng cuộc của phiên đấu giá
    public WinnerDTO getSessionWinner(Long sessionId) {
        AuctionSession session = auctionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Phiên đấu giá không tồn tại"));

        // Kiểm tra đã kết thúc chưa
        if (session.getStatus() != AuctionSessionStatus.FINISHED) {
            throw new IllegalStateException("Phiên đấu giá chưa kết thúc");
        }

        // Lấy bid cao nhất (winner)
        AuctionBid highestBid = auctionBidRepository.findTopBySessionIdOrderByPriceDesc(sessionId)
                .orElse(null);

        if (highestBid == null)
            return null;

        return new WinnerDTO(
                highestBid.getUser().getId(),
                highestBid.getUser().getFirstName() + " " + highestBid.getUser().getLastName(),
                highestBid.getPrice(),
                highestBid.getTimestamp());
    }

    @Transactional
    public void closeSession(Long sessionId, Long userId) {
        // 1. Lấy phiên đấu giá
        AuctionSession session = auctionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Phiên đấu giá không tồn tại"));

        // 2. Chỉ organizer được phép kết thúc (bỏ qua check nếu là cronjob)
        if (userId != null && !session.getOrganizer().getId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền kết thúc phiên này");
        }

        // 3. Chỉ kết thúc khi phiên đang ACTIVE
        if (session.getStatus() != AuctionSessionStatus.ACTIVE) {
            throw new IllegalStateException("Chỉ được kết thúc khi phiên đang diễn ra");
        }

        // 4. Cập nhật trạng thái phiên
        session.setStatus(AuctionSessionStatus.FINISHED);
        session.setEndTime(LocalDateTime.now());
        auctionSessionRepository.save(session);

        // 5. Lấy bid thắng theo giá cao nhất
        AuctionBid winningBid = auctionBidRepository
                .findTopBySession_IdOrderByPriceDesc(sessionId)
                .orElse(null);

        Long winnerUserId = null;
        if (winningBid != null) {
            winnerUserId = winningBid.getUser().getId();

            // Đánh dấu bid thắng trong DB
            winningBid.setIsWinningBid(true);
            auctionBidRepository.save(winningBid);
        }

        // 6. Lấy danh sách participant của phiên
        List<AuctionSessionParticipant> participants = auctionSessionParticipantRepository
                .findByAuctionSessionId(sessionId);

        // 7. Xử lý winner/loser
        for (AuctionSessionParticipant p : participants) {
            if (winnerUserId != null && p.getUser().getId().equals(winnerUserId)) {
                // Winner
                p.setStatus(ParticipantStatus.WINNER);
                p.setDepositStatus(DepositStatus.PAID); // Giữ cọc

                double deposit = p.getDepositAmount() != null ? p.getDepositAmount() : 0.0;
                double finalPrice = winningBid.getPrice() - deposit;
                p.setPaidAt(LocalDateTime.now());
                p.setFinalPrice(Math.max(finalPrice, 0.0));

                String qrLink = sepayService.generateQRCode(
                        p.getFinalPrice(),
                        "DANANGAUCTIONUSER" + p.getUser().getId());

                String depositPageUrl = "https://your-domain.com/wallet/deposit?userId=" + p.getUser().getId();

                // ✅ Gửi email kèm QR
                emailService.sendAuctionWinnerEmailWithQR(
                        p.getUser().getEmail(),
                        session.getTitle(),
                        p.getFinalPrice(),
                        qrLink,
                        depositPageUrl);

            } else {
                // Loser
                p.setStatus(ParticipantStatus.LOSER);
                p.setDepositStatus(DepositStatus.REFUNDED);

                // Refund tiền cọc
                if (p.getDepositAmount() != null && p.getDepositAmount() > 0) {
                    userService.increaseBalance(p.getUser().getId(), p.getDepositAmount());
                }
            }

            auctionSessionParticipantRepository.save(p);
        }
    }
}