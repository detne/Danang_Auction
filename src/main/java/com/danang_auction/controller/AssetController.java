package com.danang_auction.controller;

import com.danang_auction.model.entity.User;
import com.danang_auction.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAsset(
            @PathVariable Long id,
            @AuthenticationPrincipal User user // ✅ Spring tự inject User từ token
    ) {
        assetService.deleteAsset(id, user.getId()); // ✅ dùng trực tiếp
        return ResponseEntity.ok("Tài sản đã được xoá thành công");
    }
}