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

    // ⏰ Chạy mỗi 1 phút
    @Scheduled(cron = "0 * * * * *") // every minute
    public void updateSessionStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<AuctionSession> sessions = sessionRepository.findAll();

        for (AuctionSession session : sessions) {
            if (session.getStatus() == AuctionSessionStatus.UPCOMING &&
                    session.getStartTime().isBefore(now)) {
                session.setStatus(AuctionSessionStatus.ACTIVE);
                sessionRepository.save(session);
                log.info("🔄 Phiên {} đã chuyển sang ACTIVE", session.getSessionCode());
            }

            if (session.getStatus() == AuctionSessionStatus.ACTIVE &&
                    session.getEndTime().isBefore(now)) {
                session.setStatus(AuctionSessionStatus.FINISHED);
                sessionRepository.save(session);
                log.info("✅ Phiên {} đã kết thúc", session.getSessionCode());
            }
        }
    }
}