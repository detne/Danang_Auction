package com.danang_auction.service;

import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.UserRole;
import com.danang_auction.model.enums.UserStatus;
import com.danang_auction.repository.AuctionSessionRepository;
import com.danang_auction.repository.PaymentRepository;
import com.danang_auction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final AuctionSessionRepository auctionSessionRepository;
    private final PaymentRepository paymentRepository;

    public Map<String, Object> getSummaryStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalAuctions", auctionSessionRepository.count());
        stats.put("totalRevenue", paymentRepository.sumRevenue(PaymentStatus.COMPLETED));
        return stats;
    }

    public Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("usersByRole", userRepository.countByRole(UserRole.ADMIN));
        stats.put("usersByStatus", userRepository.countByStatus(UserStatus.ACTIVE));
        return stats;
    }

    public Map<String, Object> getAuctionStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSessions", auctionSessionRepository.count());
        stats.put("sessionsByStatus", auctionSessionRepository.findByStatusOrderByStartTimeAsc(AuctionSessionStatus.APPROVED));
        return stats;
    }

    public Map<String, Object> getRevenueStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", paymentRepository.sumRevenue(PaymentStatus.COMPLETED));
        stats.put("revenueByMonth", paymentRepository.sumRevenueByMonth(PaymentStatus.COMPLETED, 7));
        return stats;
    }

    public Map<String, Object> getWinnerStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("recentWinners", auctionSessionRepository.findRecentWinners());
        return stats;
    }
}