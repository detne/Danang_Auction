package com.danang_auction.controller;

import com.danang_auction.service.AssetService;
import com.danang_auction.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/assets")
@RequiredArgsConstructor
public class AuctionController {

    private final AssetService assetService;

    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveAsset(@PathVariable Integer id) {
        try {
            assetService.approveAsset(id);
            return ResponseEntity.ok("Tài sản đã được phê duyệt");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Yêu cầu không hợp lệ");
        }
    }
}