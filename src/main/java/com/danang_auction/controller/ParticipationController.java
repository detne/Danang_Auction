package com.danang_auction.controller;

import com.danang_auction.exception.ResourceNotFoundException;
import com.danang_auction.model.dto.participation.ParticipationRequest;
import com.danang_auction.service.ParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/participations")
@RequiredArgsConstructor
public class ParticipationController {
    private final ParticipationService participationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserParticipations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam Long userId
    ) {
        Page<ParticipationRequest> result = participationService.getUserParticipations(userId, page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("data", result.getContent());
        response.put("total", result.getTotalElements());
        response.put("page", result.getNumber());
        response.put("limit", result.getSize());
        response.put("size", result.getNumberOfElements());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/{sessionId}/cancel")
    public ResponseEntity<String> cancelParticipation(@PathVariable Long userId, @PathVariable Long sessionId) {
        try {
            participationService.cancelParticipation(userId, sessionId);
            return ResponseEntity.ok("{\"message\": \"Participation canceled\"}");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body("{\"message\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("{\"message\": \"Không thể hủy hồ sơ\"}");
        }
    }
}