package com.danang_auction.controller;

import com.danang_auction.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @GetMapping("/{id}/current-price")
    public ResponseEntity<BigDecimal> getCurrentPrice(@PathVariable("id") Long sessionId) {
        BigDecimal currentPrice = sessionService.getCurrentPrice(sessionId);
        return ResponseEntity.ok(currentPrice);
    }
}
