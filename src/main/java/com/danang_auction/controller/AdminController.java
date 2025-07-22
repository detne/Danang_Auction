// src/main/java/com/danang_auction/controller/AdminController.java
package com.danang_auction.controller;

import com.danang_auction.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminController {

    private final AdminStatsService adminStatsService;

    // 1. Tổng quan hệ thống
    @GetMapping("/summary")
    public ResponseEntity<?> getSystemSummary() {
        return ResponseEntity.ok(adminStatsService.getSystemSummary());
    }

    // 2. Thống kê user theo vai trò & trạng thái
    @GetMapping("/users")
    public ResponseEntity<?> getUserStats() {
        return ResponseEntity.ok(adminStatsService.getUserStats());
    }

    // 3. Thống kê phiên đấu giá
    @GetMapping("/auctions")
    public ResponseEntity<?> getAuctionSessionStats() {
        return ResponseEntity.ok(adminStatsService.getAuctionSessionStats());
    }

    // 4. Thống kê doanh thu theo tháng
    @GetMapping("/revenue")
    public ResponseEntity<?> getMonthlyRevenue() {
        return ResponseEntity.ok(adminStatsService.getMonthlyRevenue());
    }

    // 5. Danh sách người thắng mới nhất
    @GetMapping("/winners")
    public ResponseEntity<?> getRecentWinners() {
        return ResponseEntity.ok(adminStatsService.getRecentWinners());
    }
}
