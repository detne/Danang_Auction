package com.danang_auction.controller;

import com.danang_auction.model.dto.auction.AuctionDocumentDto;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.entityDTO.AssetResponseDTO;
import com.danang_auction.model.entityDTO.UpcomingAuctionDTO;
import com.danang_auction.security.UserDetailsImpl;
import com.danang_auction.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private static final Logger logger = LoggerFactory.getLogger(AssetController.class);

    private final AssetService assetService;

    @GetMapping(params = "q") // Chỉ ánh xạ khi có tham số 'q'
    public ResponseEntity<Map<String, Object>> getAssets(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            logger.debug("Searching assets with q={}, page={}, limit={}", q, page, limit);
            Page<AuctionDocument> assetsPage = assetService.searchAssets(q, page, limit);
            logger.debug("Found {} assets", assetsPage.getTotalElements());

            // ✅ Convert sang DTO để tránh lỗi ByteBuddy proxy
            List<AuctionDocumentDto> data = assetsPage.getContent().stream()
                    .map(AuctionDocumentDto::new)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", data);
            response.put("total", assetsPage.getTotalElements());
            response.put("page", assetsPage.getNumber() + 1);
            response.put("limit", assetsPage.getSize());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in getAssets: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi xảy ra, vui lòng thử lại! Chi tiết: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    // ✅ [GET] Danh sách tài sản sắp đấu giá (trước là /api/home/upcoming → giờ gộp luôn ở đây)
    @GetMapping("/upcoming-auctions")
    public ResponseEntity<Map<String, Object>> getUpcomingAuctions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Page<UpcomingAuctionDTO> results = assetService.getUpcomingAuctions(page, limit);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("assets", results.getContent());
        response.put("currentPage", results.getNumber());
        response.put("totalItems", results.getTotalElements());
        response.put("totalPages", results.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAsset(
            @PathVariable Long id,
            @AuthenticationPrincipal User user // Spring tự inject User từ token
    ) {
        assetService.deleteAsset(id, user.getId()); // dùng trực tiếp
        return ResponseEntity.ok("Tài sản đã được xoá thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetResponseDTO> getAssetById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetailsImpl userDetails // có thể null
    ) {
        User user = userDetails != null ? userDetails.getUser() : null;
        AssetResponseDTO dto = assetService.getAssetById(id, user);
        return ResponseEntity.ok(dto);
    }
}