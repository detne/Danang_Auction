package com.danang_auction.service;

import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.*;
import com.danang_auction.repository.*;

import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuctionParticipationService {

    private final AuctionSessionRepository auctionSessionRepository;
    private final UserRepository userRepository;
    private final AuctionSessionParticipantRepository participantRepository;
    private final AuctionDocumentRepository auctionDocumentRepository;

    public AuctionParticipationService(
            AuctionSessionRepository auctionSessionRepository,
            UserRepository userRepository,
            AuctionSessionParticipantRepository participantRepository,
            AuctionDocumentRepository auctionDocumentRepository) {
        this.auctionSessionRepository = auctionSessionRepository;
        this.userRepository = userRepository;
        this.participantRepository = participantRepository;
        this.auctionDocumentRepository = auctionDocumentRepository;
    }

    @Transactional
    public void join(Long sessionId, Long userId) {
        // Lấy phiên đấu giá
        AuctionSession session = auctionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phiên đấu giá"));

        // Lấy thông tin người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        // Kiểm tra người dùng đã tham gia chưa
        boolean alreadyJoined = participantRepository.existsByAuctionSessionIdAndUserId(sessionId, userId);
        if (alreadyJoined) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn đã tham gia phiên đấu giá này rồi");
        }

        // Lấy tài sản liên kết với phiên đấu giá
        AuctionDocument document = auctionDocumentRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài sản đấu giá"));

        // Nếu yêu cầu đặt cọc
        if (Boolean.TRUE.equals(document.getIsDepositRequired())) {
            double depositAmount = document.getDepositAmount();
            if (user.getBalance() < depositAmount) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số dư không đủ để đặt cọc");
            }

            // Trừ tiền và cập nhật lại số dư
            user.setBalance(user.getBalance() - depositAmount);
        }

        // Tạo đối tượng participant
        AuctionSessionParticipant participant = new AuctionSessionParticipant();
        participant.setUser(user);
        participant.setAuctionSession(session);
        participant.setRole(UserRole.BIDDER);
        participant.setDepositStatus(DepositStatus.PAID);

        // Nếu là phiên public thì tự động approved, còn private thì cần duyệt
        ParticipantStatus status = document.getAuctionType().isPublic()
                ? ParticipantStatus.APPROVED
                : ParticipantStatus.NEW;
        participant.setStatus(status);

        // Lưu thông tin
        participantRepository.save(participant);
        userRepository.save(user);
    }

    public Page<ParticipationRequest> getUserParticipations(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return participantRepository.findByUserId(userId, pageable);
    }
}