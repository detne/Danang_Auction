package com.danang_auction.controller;

import com.danang_auction.service.AuthService;
import com.danang_auction.service.DeleteAssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {
    private final AuthService authService;
    private final DeleteAssetService assetService;

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAsset(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Long userId = authService.extractUserIdFromToken(token);
        assetService.deleteAsset(id, userId);
        return ResponseEntity.ok("Tài sản đã được xoá thành công");
    }
}

