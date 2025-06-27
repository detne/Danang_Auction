package com.danang_auction.controller;

import com.danang_auction.model.dto.asset.CreateAuctionDocumentDto;
import com.danang_auction.model.dto.asset.UpdateAuctionDocumentDto;
import com.danang_auction.model.dto.auction.AuctionDocumentDto;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.entityDTO.AssetResponseDTO;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.danang_auction.model.dto.asset.ReviewRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private static final Logger logger = LoggerFactory.getLogger(AssetController.class);

    private final AuctionDocumentService assetService;
    private final AuctionSessionService auctionDocumentService;

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

    @PostMapping
    public ResponseEntity<?> createAuctionDocument(
            @Valid @RequestBody CreateAuctionDocumentDto dto,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        AuctionDocument doc = assetService.create(dto, user.getId(), user.getRole().name());
        return ResponseEntity.ok().body(doc);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingAssets(@RequestParam("status") String status) {
        return ResponseEntity.ok(assetService.getAssetsByStatus(status));
    }


    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadAssetImages(
            @PathVariable("id") Integer assetId,
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return ResponseEntity.ok(
                assetService.uploadAssetImages(assetId, List.of(files), user.getId(), user.getRole().name())
        );
    }

    @PutMapping("/admin/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reviewAsset(
            @PathVariable("id") Long id,
            @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.ok(assetService.reviewAsset(id, request.getAction(), request.getReason()));
    }

    @DeleteMapping("images/{imageId}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> deleteAssetImage(
            @PathVariable("imageId") int imageId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        assetService.deleteAssetImage((long) imageId, userDetails.toUser());
        Map<String, String> result = assetService.deleteAssetImage((long) imageId, userDetails.toUser());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> updateAsset(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateAuctionDocumentDto dto,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        AuctionDocument updatedDoc = assetService.updateAsset(id, dto, user);
        AuctionDocumentDto response = new AuctionDocumentDto(updatedDoc); // convert sang DTO
        return ResponseEntity.ok().body(response);
    }
}