// src/main/java/com/danang_auction/controller/AdminController.java
package com.danang_auction.controller;

import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.UserRole;
import com.danang_auction.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminController {

    private final AdminStatsService adminStatsService;
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    // 1. Tổng quan hệ thống
    @GetMapping("/summary")
    public ResponseEntity<?> getSystemSummary() {
        return ResponseEntity.ok(adminStatsService.getSystemSummary());
    }

    // 2. Thống kê user theo vai trò & trạng thái
    @GetMapping("/users")
    public ResponseEntity<?> getUserStatstats() {
        return ResponseEntity.ok(adminStatsService.getUserStatstats());
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

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getAdminCategories(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != UserRole.ADMIN) {
            logger.warn("Unauthorized access to admin categories by user: {}", user != null ? user.getUsername() : "null");
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Quyền truy cập bị từ chối"));
        }

        try {
            List<Map<String, Object>> categories = List.of(
                    Map.of("id", 1, "name", "Điện tử", "itemCount", 45, "status", "active"),
                    Map.of("id", 2, "name", "Đồng hồ", "itemCount", 23, "status", "active")
            );
            return ResponseEntity.ok(Map.of("success", true, "data", categories));
        } catch (Exception e) {
            logger.error("Error in getAdminCategories: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }
}
