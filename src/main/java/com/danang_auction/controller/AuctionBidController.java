package com.danang_auction.controller;

import com.danang_auction.model.dto.bid.AuctionBidDTO;
import com.danang_auction.model.dto.bid.BidRequestDTO;
import com.danang_auction.model.dto.bid.WinnerDTO;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.service.AuctionSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class AuctionBidController {

    private final AuctionSessionService auctionSessionService;

    // Người dùng submit bid cho một phiên đấu giá
    @PostMapping("/{id}/bids")
    public ResponseEntity<?> submitBid(
            @PathVariable("id") Long sessionId,
            @Valid @RequestBody BidRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
                System.out.println("userDetails=" + userDetails);
        Long userId = userDetails.getId(); // luôn có nếu JWT hợp lệ
        return ResponseEntity.ok(auctionSessionService.submitBid(sessionId, userId, request.getPrice()));
    }

    // Lấy lịch sử đấu giá của một phiên
    @GetMapping("/{id}/bids")
    public ResponseEntity<List<AuctionBidDTO>> getBidHistory(@PathVariable("id") Long sessionId) {
        List<AuctionBidDTO> bids = auctionSessionService.getBidHistory(sessionId);
        return ResponseEntity.ok(bids);
    }

    // Lấy người thắng cuộc của một phiên đấu giá
    @GetMapping("/{id}/winner")
    public ResponseEntity<?> getWinner(@PathVariable("id") Long sessionId) {
        WinnerDTO winner = auctionSessionService.getSessionWinner(sessionId);
        if (winner == null) {
            return ResponseEntity.ok().body(Map.of("message", "Không có ai thắng phiên này"));
        }
        return ResponseEntity.ok(winner);
    }
}