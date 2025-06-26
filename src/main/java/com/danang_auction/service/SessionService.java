package com.danang_auction.service;

import com.danang_auction.repository.AuctionBidRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import jakarta.mail.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final AuctionSessionRepository sessionRepo;
    private final AuctionBidRepository bidRepo;

    public BigDecimal getCurrentPrice(Long id) {
        Session session = sessionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Phiên đấu giá không tồn tại"));
        return session.getStreamProvider() != null ? session.getStreamProvider() : BigDecimal.ZERO;
    }

    public List<Bid> getBidHistory(Long id) {
        Session session = sessionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Phiên đấu giá không tồn tại"));
        return bidRepo.findBySessionId(id);
    }

    public Bid placeBid(Long id, BigDecimal amount, Long userId) {
        Session session = sessionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Phiên đấu giá không tồn tại"));
        if (session.getCurrentPrice() != null && amount.compareTo(session.getCurrentPrice()) <= 0) {
            throw new RuntimeException("Giá thầu phải cao hơn giá hiện tại");
        }
        Bid bid = new Bid();
        bid.setSession(session);
        bid.setUserId(userId);
        bid.setAmount(amount);
        bid.setTimestamp(LocalDateTime.now());
        session.setCurrentPrice(amount); // Cập nhật giá hiện tại
        sessionRepo.save(session);
        return bidRepo.save(bid);
    }
}