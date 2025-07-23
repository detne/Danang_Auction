package com.danang_auction.controller;

import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.service.AuctionParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;



@RestController
@RequestMapping("/api/participations")
@RequiredArgsConstructor
public class ParticipationController {
    private final AuctionParticipationService auctionParticipationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserParticipations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long userId = 2L;

        Page<ParticipationRequest> result = auctionParticipationService.getUserParticipations(userId, page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("data", result.getContent());
        response.put("total", result.getTotalElements());
        response.put("page", result.getNumber());
        response.put("limit", result.getSize());
        response.put("size", result.getNumberOfElements());

        return ResponseEntity.ok(response);
    }
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinAuctionSession(
            @PathVariable("id") Long sessionId,
            @RequestAttribute("userId") Long userId // từ JWT
    ) {
        auctionParticipationService.join(sessionId, userId);
        return ResponseEntity.ok("Đã tham gia phiên đấu giá");
    }
}

