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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    //Search assets (with optional keyword)
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

    //Get asset by ID
    @GetMapping("/{id}")
    public ResponseEntity<AuctionDocumentDetailDTO> getAssetById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        User user = userDetails != null ? userDetails.getUser() : null;
        AuctionDocumentDetailDTO dto = auctionDocumentService.getAssetById(id, user);
        return ResponseEntity.ok(dto);
    }

    //Create asset
    @PostMapping
    public ResponseEntity<?> createAuctionDocument(
            @Valid @RequestBody CreateAuctionDocumentDTO dto,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        AuctionDocument doc = auctionDocumentService.create(dto, user.getId(), user.getRole().name());
        return ResponseEntity.ok(new AuctionDocumentDTO(doc));
    }

    //Update asset
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> updateAsset(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateAuctionDocumentDTO dto,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        AuctionDocument updatedDoc = auctionDocumentService.updateAsset(id, dto, user);
        AuctionDocumentDTO response = new AuctionDocumentDTO(updatedDoc);
        return ResponseEntity.ok().body(response);
    }

    //Delete asset
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAsset(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        auctionDocumentService.deleteAsset(id, user.getId());
        return ResponseEntity.ok("Tài sản đã được xoá thành công");
    }

    //Get assets by status (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAssetsByStatus(
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        if (status != null) {
            return ResponseEntity.ok(auctionDocumentService.getAssetsByStatus(status));
        }
        return ResponseEntity.badRequest().body("Thiếu tham số trạng thái (status).");
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> getMyAssets(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        List<AuctionDocumentDTO> myAssets = auctionDocumentService.getOwnedAssets(currentUser.getId());
        return ResponseEntity.ok(myAssets);
    }

    //Upload asset images
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

    //Review asset (admin approve/reject)
    @PutMapping("/admin/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuctionSessionSummaryDTO> reviewAsset(
            @PathVariable("id") Long id,
            @RequestBody ReviewRequest request
    ) {
        AuctionSessionSummaryDTO result = auctionDocumentService.reviewAsset(id, request.getAction(), request.getReason());
        return ResponseEntity.ok(result);
    }

    //Delete asset image
    @DeleteMapping("images/{imageId}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> deleteAssetImage(
            @PathVariable("imageId") int imageId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Map<String, String> result = auctionDocumentService.deleteAssetImage((long) imageId, userDetails.toUser());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchAssets(
            @RequestParam(value = "q", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<AssetSearchDTO> result = auctionDocumentService.searchAssetsByKeyword(keyword, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", result.getContent());
            response.put("totalPages", result.getTotalPages());
            response.put("totalElements", result.getTotalElements());
            response.put("currentPage", result.getNumber());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi khi tìm kiếm tài sản: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
