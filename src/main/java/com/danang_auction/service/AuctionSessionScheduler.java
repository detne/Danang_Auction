package com.danang_auction.service;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.repository.AuctionSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionSessionScheduler {

    private final AuctionSessionRepository sessionRepository;
    private final AuctionSessionService auctionSessionService; // Service chứa hàm closeSession

    /**
     * Cronjob chạy mỗi phút để update trạng thái phiên đấu giá
     * - UPCOMING -> ACTIVE khi startTime <= now
     * - ACTIVE -> FINISHED khi endTime <= now (và tự động xử lý winner/loser)
     */
    @Scheduled(cron = "0 * * * * *") // chạy mỗi phút
    public void updateSessionStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<AuctionSession> sessions = sessionRepository.findAll();

        for (AuctionSession session : sessions) {
            // 1️⃣ UPCOMING -> ACTIVE
            if (session.getStatus() == AuctionSessionStatus.UPCOMING &&
                    !session.getStartTime().isAfter(now)) {
                session.setStatus(AuctionSessionStatus.ACTIVE);
                sessionRepository.save(session);
                log.info("🔄 Phiên {} đã chuyển sang ACTIVE", session.getSessionCode());
            }

            // 2️⃣ ACTIVE -> FINISHED + xử lý winner/loser
            if (session.getStatus() == AuctionSessionStatus.ACTIVE &&
                    !session.getEndTime().isAfter(now)) {
                try {
                    // Gọi service xử lý winner/loser và final_price
                    auctionSessionService.closeSession(session.getId(), session.getOrganizer().getId());
                    log.info("✅ Phiên {} đã kết thúc và xử lý winner/loser thành công",
                            session.getSessionCode());
                } catch (Exception e) {
                    log.error("❌ Lỗi khi kết thúc phiên {}: {}", session.getSessionCode(), e.getMessage());
                    // fallback: vẫn đánh dấu FINISHED
                    session.setStatus(AuctionSessionStatus.FINISHED);
                    sessionRepository.save(session);
                }
            }
        }
    }
}
