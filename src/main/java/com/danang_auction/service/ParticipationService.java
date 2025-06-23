package com.danang_auction.service;

import com.danang_auction.model.dto.participation.DepositRefundRequestDto;
import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.model.entity.AuctionSessionParticipantId;
import com.danang_auction.model.enums.DepositStatus;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ParticipationService {
    private static final Logger logger = LoggerFactory.getLogger(ParticipationService.class);

    private final AuctionSessionParticipantRepository participantRepository;

    public ParticipationService(AuctionSessionParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    public Page<ParticipationRequest> getUserParticipations(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return participantRepository.findByUserId(userId, pageable);
    }

    public void processRefund(DepositRefundRequestDto request) {
        // ✅ Tạo composite key với userId và auctionSessionId
        AuctionSessionParticipantId participantId = new AuctionSessionParticipantId(
                request.getUserId(),
                request.getAuctionSessionId()
        );

        // ✅ Tìm participant bằng composite key
        var participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        // 🔍 DEBUG: Log thông tin để kiểm tra
        logger.info("Found participant - Status: {}, DepositStatus: {}, User: {}, AuctionSession: {}",
                participant.getStatus(),
                participant.getDepositStatus(),
                participant.getUser().getId(),
                participant.getAuctionSession().getId());

        // ✅ Kiểm tra nhiều điều kiện để cho phép refund - THÊM APPROVED
        String currentStatus = participant.getStatus() != null ? participant.getStatus().toString() : "null";

        if ("APPROVED".equals(currentStatus) ||  // ← THÊM DÒNG NÀY
                "LOST".equals(currentStatus) ||
                "CANCELLED".equals(currentStatus) ||
                "FAILED".equals(currentStatus) ||
                "REJECTED".equals(currentStatus)) {

            logger.info("Refund approved for status: {}", currentStatus);
            participant.setDepositStatus(DepositStatus.REFUNDED);
            participantRepository.save(participant);

        } else {
            logger.warn("Refund not allowed for current status: {}", currentStatus);
            throw new RuntimeException("Refund not allowed for current status: " + currentStatus +
                    ". Allowed statuses: APPROVED, LOST, CANCELLED, FAILED, REJECTED"); // ← CẬP NHẬT MESSAGE
        }
    }
}