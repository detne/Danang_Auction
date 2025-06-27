package com.danang_auction.service;

import com.danang_auction.model.entity.AuctionBid;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.repository.AuctionBidRepository;
import com.danang_auction.repository.AuctionSessionParticipantRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import lombok.RequiredArgsConstructor;
import com.danang_auction.model.entity.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final AuctionSessionRepository sessionRepo;
    private final AuctionBidRepository bidRepo;
    private final AuctionSessionParticipantRepository participantRepo;

    public BigDecimal getCurrentPrice(Long sessionId) {
        BigDecimal price = bidRepo.findCurrentPriceBySessionId(sessionId);
        return price != null ? price : BigDecimal.ZERO;
    }

    public Map<String, Object> submitBid(Long sessionId, Long userId, Double price) {
        AuctionSession session = sessionRepo.findWithDocumentById(sessionId)
                .orElseThrow(() -> new RuntimeException("Phiên đấu giá không tồn tại"));

        if (!AuctionSessionStatus.ACTIVE.equals(session.getStatus())) {
            throw new RuntimeException("Phiên đấu giá không hoạt động");
        }

        // Kiểm tra người tham gia
        AuctionSessionParticipant participant = participantRepo.findBySessionIdAndUserIdApproved(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("Bạn chưa được duyệt tham gia phiên đấu giá này"));

        // Lấy giá hiện tại
        Long highestBid = bidRepo.findHighestBidAmount(sessionId);
        Double currentPrice = highestBid != null ? highestBid : session.getAuctionDocument().getStartingPrice();
        Double stepPrice = session.getAuctionDocument().getStepPrice();

        // Kiểm tra hợp lệ
        if (price < currentPrice + stepPrice ||
                (price - currentPrice) % stepPrice != 0) {
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

        bidRepo.save(bid);

        return Map.of("message", "Đấu giá thành công", "price", price);
    }
}
