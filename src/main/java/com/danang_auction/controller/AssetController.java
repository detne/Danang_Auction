package com.danang_auction.controller;

import com.danang_auction.model.dto.document.*;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.User;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.security.UserDetailsImpl;
import com.danang_auction.service.AuctionDocumentService;
import com.danang_auction.service.AuctionSessionService;
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
public class AssetController {

    private static final Logger logger = LoggerFactory.getLogger(AssetController.class);

    private final AuctionDocumentService auctionDocumentService;
    private final AuctionSessionService auctionSessionService;

    // ✅ Search assets (with optional keyword)
    @GetMapping(params = "q")
    public ResponseEntity<Map<String, Object>> getAssets(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
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
                    "message", "Có lỗi xảy ra: " + e.getMessage()
            ));
        }
    }

    // ✅ Get asset by ID
    @GetMapping("/{id}")
    public ResponseEntity<AuctionDocumentDetailDTO> getAssetById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        User user = userDetails != null ? userDetails.getUser() : null;
        AuctionDocumentDetailDTO dto = auctionDocumentService.getAssetById(id, user);
        return ResponseEntity.ok(dto);
    }

    // ✅ Create asset
    @PostMapping
    public ResponseEntity<?> createAuctionDocument(
            @Valid @RequestBody CreateAuctionDocumentDto dto,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        AuctionDocument doc = auctionDocumentService.create(dto, user.getId(), user.getRole().name());
        return ResponseEntity.ok().body(doc);
    }

    // ✅ Update asset
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> updateAsset(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateAuctionDocumentDto dto,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        AuctionDocument updatedDoc = auctionDocumentService.updateAsset(id, dto, user);
        AuctionDocumentDto response = new AuctionDocumentDto(updatedDoc);
        return ResponseEntity.ok().body(response);
    }

    // ✅ Delete asset
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAsset(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        auctionDocumentService.deleteAsset(id, user.getId());
        return ResponseEntity.ok("Tài sản đã được xoá thành công");
    }

    // ✅ Get assets by status (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingAssets(@RequestParam("status") String status) {
        return ResponseEntity.ok(auctionDocumentService.getAssetsByStatus(status));
    }

    // ✅ Upload asset images
    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadAssetImages(
            @PathVariable("id") Integer assetId,
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return ResponseEntity.ok(
                auctionDocumentService.uploadAssetImages(assetId, List.of(files), user.getId(), user.getRole().name())
        );
    }

    // ✅ Review asset (admin approve/reject)
    @PutMapping("/admin/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reviewAsset(
            @PathVariable("id") Long id,
            @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.ok(auctionDocumentService.reviewAsset(id, request.getAction(), request.getReason()));
    }

    // ✅ Delete asset image
    @DeleteMapping("images/{imageId}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> deleteAssetImage(
            @PathVariable("imageId") int imageId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Map<String, String> result = auctionDocumentService.deleteAssetImage((long) imageId, userDetails.toUser());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/sessions")
    public ResponseEntity<List<AuctionSessionSummaryDTO>> getSessionsByAssetId(@PathVariable("id") Integer id) {
        List<AuctionSessionSummaryDTO> sessions = auctionSessionService.getSessionsByAssetId(id);
        return ResponseEntity.ok(sessions);
    }
}
