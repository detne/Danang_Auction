package com.danang_auction.controller;

import com.danang_auction.model.dto.document.AuctionDocumentDTO;
import com.danang_auction.model.dto.document.ReviewRequest;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.service.AuctionDocumentService;
import lombok.RequiredArgsConstructor;

import org.apache.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/assets")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAssetController {

    private final AuctionDocumentService auctionDocumentService;

    /**
     * API: GET /api/admin/assets
     * 📌 Chức năng: Lọc danh sách tài sản theo trạng thái và từ khóa (status + q)
     * 🔐 Quyền: ADMIN
     * 🧩 Ví dụ:
     * - /api/admin/assets?status=PENDING_APPROVAL
     * - /api/admin/assets?status=REJECTED&q=máy tính
     */
    @GetMapping
    public ResponseEntity<?> getAssetsByStatusAndKeyword(
            @RequestParam(defaultValue = "PENDING_CREATE") String status,
            @RequestParam(required = false) String q) {
        try {
            AuctionDocumentStatus enumStatus = AuctionDocumentStatus.valueOf(status.toUpperCase());
            List<AuctionDocumentDTO> result = auctionDocumentService.getAssetsByStatusAndKeyword(enumStatus, q);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ Trạng thái không hợp lệ: " + status);
        }
    }

    /**
     * API: PUT /api/admin/assets/{id}/review
     * 📌 Chức năng: Admin duyệt hoặc từ chối tài sản (APPROVE hoặc REJECT)
     * 🔐 Quyền: ADMIN
     */
    @PutMapping("/{id}/review")
    public ResponseEntity<AuctionSessionSummaryDTO> reviewAsset(
            @PathVariable("id") Long id,
            @RequestBody ReviewRequest request,
            @RequestAttribute("userId") Long adminId) { // ✅ lấy từ middleware JWT
        System.out.println("🔐 Admin ID nhận được từ JWT: " + adminId);
        if (adminId == null) {
            throw new ResponseStatusException(HttpStatus.SC_UNAUTHORIZED, "Không xác định được người dùng", null);
        }
        AuctionSessionSummaryDTO result = auctionDocumentService.reviewAsset(
                id,
                request.getAction(),
                request.getReason(),
                adminId // ✅ truyền vào đây
        );
        return ResponseEntity.ok(result);
    }

    /**
     * API: GET /api/admin/assets/all
     * 📌 Chức năng: Trả về danh sách toàn bộ tài sản trong hệ thống (không phân
     * trang)
     * 🔐 Quyền: ADMIN hoặc ORGANIZER
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllAssets() {
        List<AuctionDocumentDTO> data = auctionDocumentService.getAllAssets()
                .stream()
                .map(AuctionDocumentDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }
}