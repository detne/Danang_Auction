package com.danang_auction.controller;

import com.danang_auction.model.dto.document.*;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.User;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.security.UserDetailsImpl;
import com.danang_auction.service.AuctionDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AuctionDocumentController {

    private static final Logger logger = LoggerFactory.getLogger(AuctionDocumentController.class);

    private final AuctionDocumentService auctionDocumentService;

    // Search assets (with optional keyword)
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> getAssets(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            Page<AuctionDocument> assetsPage = auctionDocumentService.searchAssets(q, page, limit);
            List<AuctionDocumentSummaryDTO> data = assetsPage.getContent().stream()
                    .map(AuctionDocumentSummaryDTO::new)
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
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Get asset by ID
    @GetMapping("/{id}")
    public ResponseEntity<AuctionDocumentDetailDTO> getAssetById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userDetails != null ? userDetails.getUser() : null;
        AuctionDocumentDetailDTO dto = auctionDocumentService.getAssetById(id, user);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<?> createAuctionDocument(
            @Valid @RequestBody CreateAuctionDocumentDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        try {
            AuctionDocument doc = auctionDocumentService.createAsset(dto, user.getId(), user.getRole().name());
            return ResponseEntity.ok(new AuctionDocumentDTO(doc));
        } catch (Exception e) {
            e.printStackTrace(); // ❗ Log rõ lỗi ra console
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Lỗi server: " + e.getMessage()));
        }
    }

    // Update asset
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole(UserRole.ORGANIZER, UserRole.ADMIN)")
    public ResponseEntity<?> updateAsset(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateAuctionDocumentDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        AuctionDocument updatedDoc = auctionDocumentService.updateAsset(id, dto, user);
        AuctionDocumentDTO response = new AuctionDocumentDTO(updatedDoc);
        return ResponseEntity.ok().body(response);
    }

    // Delete asset
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAsset(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        auctionDocumentService.deleteAsset(id, user.getId());
        return ResponseEntity.ok("Tài sản đã được xoá thành công");
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole(UserRole.ORGANIZER, UserRole.ADMIN)")
    public ResponseEntity<?> getMyAssets(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<AuctionDocumentDTO> myAssets = auctionDocumentService.getOwnedAssets(currentUser.getId());
        return ResponseEntity.ok(Map.of("success", true, "data", myAssets));
    }

    // Upload asset images
    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadAssetImages(
            @PathVariable("id") Integer assetId,
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(
                auctionDocumentService.uploadAssetImages(assetId, List.of(files), user.getId(), user.getRole().name()));
    }

    // Delete asset image
    @DeleteMapping("images/{imageId}")
    @PreAuthorize("hasAnyRole(UserRole.ORGANIZER, UserRole.ADMIN)")
    public ResponseEntity<?> deleteAssetImage(
            @PathVariable("imageId") int imageId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Map<String, String> result = auctionDocumentService.deleteAssetImage((long) imageId, userDetails.toUser());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole(UserRole.ADMIN, UserRole.ORGANIZER)")
    public ResponseEntity<?> getAllAssets() {
        List<AuctionDocument> assets = auctionDocumentService.getAllAssets();
        List<AuctionDocumentDTO> data = assets.stream()
                .map(AuctionDocumentDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }

}