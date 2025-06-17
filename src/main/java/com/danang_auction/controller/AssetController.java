package com.danang_auction.controller;

import com.danang_auction.model.entity.AuctionDocument;
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
import java.util.Map;

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

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", assetsPage.getContent());
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
}