package com.danang_auction.controller;

import com.danang_auction.model.dto.session.AuctionSessionParticipantDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import com.danang_auction.model.entity.User;
import com.danang_auction.service.AuctionSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class AuctionSessionController {

    private final AuctionSessionService auctionSessionService;

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<AuctionSessionParticipantDTO>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(auctionSessionService.getParticipantsBySessionId(id));
    }

    @GetMapping
    public ResponseEntity<List<AuctionSessionSummaryDTO>> searchSessions(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal User currentUser // ⚠️ Spring Security lấy user hiện tại
    ) {
        List<AuctionSessionSummaryDTO> sessions = auctionSessionService
                .searchSessions(title, status, minPrice, maxPrice, date, currentUser);
        return ResponseEntity.ok(sessions);
    }
}