package com.danang_auction.service;

import com.danang_auction.model.dto.admin.RevenueDTO;
import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.PaymentType;
import com.danang_auction.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final AuctionSessionRepository auctionSessionRepository;
    private final AuctionDocumentRepository auctionDocumentRepository;
    private final PaymentRepository paymentRepository;
    private final AuctionBidRepository auctionBidRepository;

    // 1. Tổng quan hệ thống
    public Map<String, Object> getSystemSummary() {
        long userCount = userRepository.count();
        long sessionCount = auctionSessionRepository.count();
        long assetCount = auctionDocumentRepository.count();
        Double totalRevenue = paymentRepository.sumTotalRevenue(PaymentStatus.COMPLETED, PaymentType.FINAL);

        Map<String, Object> result = new HashMap<>();
        result.put("totalUsers", userCount);
        result.put("totalSessions", sessionCount);
        result.put("totalAssets", assetCount);
        result.put("totalRevenue", totalRevenue == null ? 0 : totalRevenue);
        return result;
    }

    // 2. Thống kê user theo role và trạng thái
    public Map<String, Object> getUserStats() {
        Map<String, Long> byRole = userRepository.countByRole();
        Map<String, Long> byStatus = userRepository.countByStatus();

        Map<String, Object> result = new HashMap<>();
        result.put("byRole", byRole);
        result.put("byStatus", byStatus);
        return result;
    }

    // 3. Thống kê phiên đấu giá
    public Map<String, Object> getAuctionSessionStats() {
        Map<String, Long> byStatus = auctionSessionRepository.countByStatus();
        Map<String, Long> byType = auctionSessionRepository.countByType();

        Map<String, Object> result = new HashMap<>();
        result.put("byStatus", byStatus);
        result.put("byType", byType);
        return result;
    }

    // 4. Thống kê doanh thu từng tháng
    public List<RevenueDTO> getMonthlyRevenue() {
        List<Object[]> rawResult = paymentRepository.monthlyRevenue(PaymentStatus.COMPLETED, PaymentType.FINAL);

        return rawResult.stream().map(obj -> {
            Integer month = (Integer) obj[0];
            Integer year = (Integer) obj[1];
            Double total = (Double) obj[2];
            return new RevenueDTO(month, year, total);
        }).toList();
    }

    // 5. Danh sách người thắng mới nhất
    public List<Map<String, Object>> getRecentWinners() {
        List<Object[]> recent = auctionBidRepository.findLatestWinners();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] obj : recent) {
            Map<String, Object> map = new HashMap<>();
            map.put("sessionId", obj[0]);
            map.put("sessionTitle", obj[1]);
            map.put("winnerId", obj[2]);
            map.put("winnerName", obj[3]);
            map.put("winnerUsername", obj[4]);
            map.put("winAmount", obj[5]);
            map.put("winTime", obj[6]);
            result.add(map);
        }
        return result;
    }
}
