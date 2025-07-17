package com.danang_auction.controller;

import com.danang_auction.model.dto.bid.BidRequestDTO;
import com.danang_auction.service.AuctionSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class AuctionBidController {

    private final AuctionSessionService auctionSessionService;

    @PostMapping("/{id}/bids")
    public ResponseEntity<?> submitBid(
            @PathVariable("id") Long sessionId,
            @Valid @RequestBody BidRequestDTO request,
            @RequestAttribute("userId") Long userId // Giả sử middleware JWT đã giải mã userId và inject vào
    ) {
        return ResponseEntity.ok(auctionSessionService.submitBid(sessionId, userId, request.getPrice()));
    }
}
