// src/main/java/com/danang_auction/controller/AdminController.java
package com.danang_auction.controller;

import com.danang_auction.model.dto.user.UserProfileResponse;
import com.danang_auction.model.dto.user.UserVerifyRequest;
import com.danang_auction.service.AdminStatsService;
import com.danang_auction.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminStatsService adminStatsService;
    private final UserService userService;

    // 1. Tổng quan hệ thống
    @GetMapping("/stats/summary")
    public ResponseEntity<?> getSystemSummary() {
        return ResponseEntity.ok(adminStatsService.getSystemSummary());
    }

    // 2. Thống kê user theo vai trò & trạng thái
    @GetMapping("/stats/users")
    public ResponseEntity<?> getUserStatstats() {
        return ResponseEntity.ok(adminStatsService.getUserStatstats());
    }

    // 3. Thống kê phiên đấu giá
    @GetMapping("/stats/auctions")
    public ResponseEntity<?> getAuctionSessionStats() {
        return ResponseEntity.ok(adminStatsService.getAuctionSessionStats());
    }

    // 4. Thống kê doanh thu theo tháng
    @GetMapping("/stats/revenue")
    public ResponseEntity<?> getMonthlyRevenue() {
        return ResponseEntity.ok(adminStatsService.getMonthlyRevenue());
    }

    // 5. Danh sách người thắng mới nhất
    @GetMapping("/stats/winners")
    public ResponseEntity<?> getRecentWinners() {
        return ResponseEntity.ok(adminStatsService.getRecentWinners());
    }

    // 6. Duyệt xác minh người dùng
    @PostMapping("/users/{id}/verify")
    public ResponseEntity<?> verifyUser(
            @PathVariable Long id,
            @RequestBody UserVerifyRequest request) {
        userService.verifyUser(id, request);
        return ResponseEntity.ok(Map.of("message", "Xác minh thành công"));
    }

    // 7. Lấy danh sách user theo trạng thái (pending, approved, rejected)
    @GetMapping("/users")
    public ResponseEntity<?> getUsersByStatus(@RequestParam("status") String status) {
        return ResponseEntity.ok(userService.getUsersByVerificationStatus(status));
    }

    // 8. Lấy chi tiết user theo id (bao gồm ảnh CCCD)
    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfileResponse> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProfileById(id));
    }

}