package com.danang_auction.controller;

import com.danang_auction.model.entity.AuctionBid;
import com.danang_auction.model.dto.bid.BidRequestDTO;
import com.danang_auction.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auction")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @GetMapping("/current-price/{sessionId}")
    public ResponseEntity<Map<String, Object>> getCurrentPrice(@PathVariable Integer sessionId) {
        try {
            Double price = sessionService.getCurrentPrice(sessionId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", price);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi khi lấy giá hiện tại: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/bid-history/{sessionId}")
    public ResponseEntity<Map<String, Object>> getBidHistory(@PathVariable Integer sessionId) {
        try {
            List<AuctionBid> bids = sessionService.getBidHistory(sessionId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", bids);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi khi lấy lịch sử trả giá: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/place-bid/{sessionId}")
    public ResponseEntity<Map<String, Object>> placeBid(
            @PathVariable Integer sessionId,
            @Valid @RequestBody BidRequestDTO request) {
        try {
            AuctionBid bid = sessionService.placeBid(sessionId, request.getAmount(), request.getUserId());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", bid);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi khi đặt giá: " + e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        }
    }
}