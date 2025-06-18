package com.danang_auction.controller;

import com.danang_auction.model.dto.AuctionSessionParticipantDTO;
import com.danang_auction.service.AuctionSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class AuctionSessionController {

    private final AuctionSessionService auctionSessionService;

    @GetMapping("/{id}/participations")
    public ResponseEntity<List<AuctionSessionParticipantDTO>> getParticipations(@PathVariable Long id) {
        return ResponseEntity.ok(auctionSessionService.getParticipationsBySessionId(id));
    }
}