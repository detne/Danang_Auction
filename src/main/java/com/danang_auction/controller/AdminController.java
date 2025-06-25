package com.danang_auction.controller;

import com.danang_auction.model.dto.auction.AuctionDocumentDto;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final AssetService assetService;

    // Endpoint lấy thống kê tổng quan
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats(
            @AuthenticationPrincipal User user // Đảm bảo chỉ admin truy cập
    ) {
        try {
            if (user == null || !"ADMIN".equals(user.getRole())) {
                logger.warn("Unauthorized access to admin stats by user: {}", user != null ? user.getUsername() : "null");
                return ResponseEntity.status(403).body(Map.of("success", false, "message", "Quyền truy cập bị từ chối"));
            }
            logger.debug("Fetching admin stats for user: {}", user.getUsername());
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", 1250); // Giả lập, thay bằng logic từ UserRepository
            stats.put("totalAuctions", 89); // Giả lập, thay bằng logic từ AuctionDocumentRepository
            stats.put("totalRevenue", 2500000L); // Sử dụng Long để tránh lỗi số
            stats.put("activeAuctions", 12); // Giả lập, đếm AuctionDocument với status "active"
            return ResponseEntity.ok(Map.of("success", true, "data", stats));
        } catch (Exception e) {
            logger.error("Error in getAdminStats: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Endpoint lấy danh sách người dùng
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAdminUsers(
            @AuthenticationPrincipal User user
    ) {
        try {
            if (user == null || !"ADMIN".equals(user.getRole())) {
                logger.warn("Unauthorized access to admin users by user: {}", user != null ? user.getUsername() : "null");
                return ResponseEntity.status(403).body(Map.of("success", false, "message", "Quyền truy cập bị từ chối"));
            }
            logger.debug("Fetching admin users for user: {}", user.getUsername());
            List<Map<String, Object>> users = new ArrayList<>();
            users.add(Map.of("id", 1L, "name", "Nguyễn Văn A", "email", "a@gmail.com", "status", "active", "joinDate", "2024-01-15"));
            users.add(Map.of("id", 2L, "name", "Trần Thị B", "email", "b@gmail.com", "status", "inactive", "joinDate", "2024-02-20"));
            return ResponseEntity.ok(Map.of("success", true, "data", users));
        } catch (Exception e) {
            logger.error("Error in getAdminUsers: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Endpoint lấy danh sách phiên đấu giá
    @GetMapping("/auctions")
    public ResponseEntity<Map<String, Object>> getAdminAuctions(
            @AuthenticationPrincipal User user
    ) {
        try {
            if (user == null || !"ADMIN".equals(user.getRole())) {
                logger.warn("Unauthorized access to admin auctions by user: {}", user != null ? user.getUsername() : "null");
                return ResponseEntity.status(403).body(Map.of("success", false, "message", "Quyền truy cập bị từ chối"));
            }
            logger.debug("Fetching admin auctions for user: {}", user.getUsername());
            List<AuctionDocument> auctions = new ArrayList<>();

            // Tạo AuctionDocument với constructor mặc định và set các thuộc tính
            AuctionDocument auction1 = new AuctionDocument();
            auction1.setId(1);
            auction1.setDocumentCode("DOC001");
            auction1.setDescription("Điện thoại iPhone 15");
            auction1.setStatus(AuctionDocumentStatus.APPROVED);
            auction1.setStartingPrice(15000000.0);
            auction1.setStepPrice(500000.0);

            AuctionDocument auction2 = new AuctionDocument();
            auction2.setId(2);
            auction2.setDocumentCode("DOC002");
            auction2.setDescription("Đồng hồ Rolex");
            auction2.setStatus(AuctionDocumentStatus.APPROVED);
            auction2.setStartingPrice(50000000.0);
            auction2.setStepPrice(1000000.0);

            auctions.add(auction1);
            auctions.add(auction2);

            List<AuctionDocumentDto> data = auctions.stream()
                    .map(AuctionDocumentDto::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(Map.of("success", true, "data", data));
        } catch (Exception e) {
            logger.error("Error in getAdminAuctions: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Endpoint lấy danh sách danh mục
    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getAdminCategories(
            @AuthenticationPrincipal User user
    ) {
        try {
            if (user == null || !"ADMIN".equals(user.getRole())) {
                logger.warn("Unauthorized access to admin categories by user: {}", user != null ? user.getUsername() : "null");
                return ResponseEntity.status(403).body(Map.of("success", false, "message", "Quyền truy cập bị từ chối"));
            }
            logger.debug("Fetching admin categories for user: {}", user.getUsername());
            List<Map<String, Object>> categories = new ArrayList<>();
            categories.add(Map.of("id", 1L, "name", "Điện tử", "itemCount", 45, "status", "active"));
            categories.add(Map.of("id", 2L, "name", "Đồng hồ", "itemCount", 23, "status", "active"));
            return ResponseEntity.ok(Map.of("success", true, "data", categories));
        } catch (Exception e) {
            logger.error("Error in getAdminCategories: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }
}