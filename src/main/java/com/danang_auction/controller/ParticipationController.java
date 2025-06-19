package com.danang_auction.controller;

import com.danang_auction.model.dto.entityDTO.ParticipationDTO;
import com.danang_auction.model.dto.entityDTO.ParticipationResponse;
import com.danang_auction.service.ParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
            @RequestParam(defaultValue = "10") int size
//            Authentication authentication
    ) {
//        Long userId = (Long) authentication.getPrincipal();
//        return participationService.getParticipationsByUser(userId, page, limit);
        Long userId = 2L;

        Page<ParticipationDTO> result = participationService.getUserParticipations(userId, page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("data", result.getContent());
        response.put("total", result.getTotalElements());
        response.put("page", result.getNumber());
        response.put("limit", result.getSize());
        response.put("size", result.getNumberOfElements());

        return ResponseEntity.ok(response);
    }
}

