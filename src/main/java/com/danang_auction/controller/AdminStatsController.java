package com.danang_auction.controller;

import com.danang_auction.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private static final Logger log = LoggerFactory.getLogger(AdminStatsController.class);

    private final AdminStatsService adminStatsService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummaryStats() {
        try {
            Map<String, Object> stats = adminStatsService.getSummaryStats();
            return ResponseEntity.ok(Map.of("success", true, "data", stats));
        } catch (Exception e) {
            log.error("Error in getSummaryStats: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        try {
            Map<String, Object> stats = adminStatsService.getUserStats();
            return ResponseEntity.ok(Map.of("success", true, "data", stats));
        } catch (Exception e) {
            log.error("Error in getUserStats: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/auctions")
    public ResponseEntity<Map<String, Object>> getAuctionStats() {
        try {
            Map<String, Object> stats = adminStatsService.getAuctionStats();
            return ResponseEntity.ok(Map.of("success", true, "data", stats));
        } catch (Exception e) {
            log.error("Error in getAuctionStats: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats() {
        try {
            Map<String, Object> stats = adminStatsService.getRevenueStats();
            return ResponseEntity.ok(Map.of("success", true, "data", stats));
        } catch (Exception e) {
            log.error("Error in getRevenueStats: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/winners")
    public ResponseEntity<Map<String, Object>> getWinnerStats() {
        try {
            Map<String, Object> stats = adminStatsService.getWinnerStats();
            return ResponseEntity.ok(Map.of("success", true, "data", stats));
        } catch (Exception e) {
            log.error("Error in getWinnerStats: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }
}