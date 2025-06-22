package com.danang_auction.service;

import com.danang_auction.exception.ResourceNotFoundException;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.model.enums.DepositStatus;
import com.danang_auction.model.enums.ParticipantStatus;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import com.danang_auction.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ParticipationService {
    private final AuctionSessionParticipantRepository participantRepository;
    private final UserRepository userRepo;
    private final AuctionSessionRepository sessionRepo;

    public Page<ParticipationRequest> getUserParticipations(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return participantRepository.findByUserId(userId, pageable);
    }

    @Transactional
    public void cancelParticipation(Long userId, Long sessionId) {
        System.out.println("Đang hủy hồ sơ với userId: " + userId + ", sessionId: " + sessionId);

        // Tìm participant theo userId và sessionId
        AuctionSessionParticipant participant = participantRepository.findByUserIdAndSessionId(userId, sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ tham gia với userId: " + userId + ", sessionId: " + sessionId));

        // Kiểm tra trạng thái: chỉ được hủy nếu trạng thái là NEW
        if (!participant.getStatus().equals(ParticipantStatus.NEW)) {
            System.out.println("Trạng thái không hợp lệ: " + participant.getStatus());
            throw new ResourceNotFoundException("Không thể hủy hồ sơ đã được duyệt hoặc đặt cọc");
        }

        // Cập nhật trạng thái sang REJECTED
        participant.setStatus(ParticipantStatus.REJECTED);
        participantRepository.save(participant);

        System.out.println("Hồ sơ userId: " + userId + ", sessionId: " + sessionId + " đã được hủy, trạng thái: " + participant.getStatus());
    }
}
