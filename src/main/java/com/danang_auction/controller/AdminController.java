package com.danang_auction.controller;

import com.danang_auction.model.dto.document.AuctionDocumentSummaryDTO;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.UserRole;
import com.danang_auction.service.AuctionDocumentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final AuctionDocumentService auctionDocumentService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats(@AuthenticationPrincipal User user) {
        if (user == null || !"ADMIN".equals(user.getRole())) {
            logger.warn("Unauthorized access to admin stats by user: {}", user != null ? user.getUsername() : "null");
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Quyền truy cập bị từ chối"));
        }

        try {
            logger.info("Fetching admin statistics");
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", 1250);
            stats.put("totalAuctions", 89);
            stats.put("totalRevenue", 2500000L);
            stats.put("activeAuctions", 12);
            return ResponseEntity.ok(Map.of("success", true, "data", stats));
        } catch (Exception e) {
            logger.error("Error in getAdminStats: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAdminUsers(@AuthenticationPrincipal User user) {
        if (user == null || !"ADMIN".equals(user.getRole())) {
            logger.warn("Unauthorized access to admin users by user: {}", user != null ? user.getUsername() : "null");
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Quyền truy cập bị từ chối"));
        }

        try {
            List<Map<String, Object>> users = List.of(
                    Map.of("id", 1, "name", "Nguyễn Văn A", "email", "a@gmail.com", "status", "active", "joinDate", "2024-01-15"),
                    Map.of("id", 2, "name", "Trần Thị B", "email", "b@gmail.com", "status", "inactive", "joinDate", "2024-02-20")
            );
            return ResponseEntity.ok(Map.of("success", true, "data", users));
        } catch (Exception e) {
            logger.error("Error in getAdminUsers: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/auctions")
    public ResponseEntity<Map<String, Object>> getAdminAuctions(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != UserRole.ADMIN) {
            logger.warn("Unauthorized access to admin auctions by user: {}", user != null ? user.getUsername() : "null");
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Quyền truy cập bị từ chối"));
        }

        try {
            AuctionDocument doc1 = new AuctionDocument();
            doc1.setId(1L);
            doc1.setDocumentCode("DOC001");
            doc1.setDescription("Điện thoại iPhone 15");
            doc1.setStatus(AuctionDocumentStatus.APPROVED);
            doc1.setStartingPrice(15000000.0);
            doc1.setStepPrice(500000.0);

            AuctionDocument doc2 = new AuctionDocument();
            doc2.setId(2L);
            doc2.setDocumentCode("DOC002");
            doc2.setDescription("Đồng hồ Rolex");
            doc2.setStatus(AuctionDocumentStatus.APPROVED);
            doc2.setStartingPrice(50000000.0);
            doc2.setStepPrice(1000000.0);

            List<AuctionDocumentSummaryDTO> data = List.of(
                    new AuctionDocumentSummaryDTO(doc1),
                    new AuctionDocumentSummaryDTO(doc2)
            );

            return ResponseEntity.ok(Map.of("success", true, "data", data));
        } catch (Exception e) {
            logger.error("Error in getAdminAuctions: ", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
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
