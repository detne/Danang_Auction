package com.danang_auction.controller;

import com.danang_auction.model.dto.session.AuctionSessionAdminDTO;
import com.danang_auction.service.AuctionSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sessions")
@RequiredArgsConstructor
public class AdminAuctionSessionController {

    private final AuctionSessionService auctionSessionService;

    // GET /api/admin/sessions?status=UPCOMING&q=abc
    @GetMapping
    public ResponseEntity<?> getSessionsByAdmin(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q
    ) {
        List<AuctionSessionAdminDTO> sessions = auctionSessionService.searchSessionsForAdmin(status, q);
        return ResponseEntity.ok().body(sessions);
    }
}