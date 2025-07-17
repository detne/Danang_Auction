package com.danang_auction.controller;

import com.danang_auction.exception.NotFoundException;
import com.danang_auction.model.dto.session.*;
import com.danang_auction.model.entity.User;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.service.AuctionSessionService;
import com.danang_auction.util.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class AuctionSessionController {

    private final AuctionSessionService auctionSessionService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<AuctionSessionParticipantDTO>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(auctionSessionService.getParticipantsBySessionId(id));
    }

    @GetMapping
    public ResponseEntity<List<AuctionSessionSummaryDTO>> searchSessions(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String decription,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal User currentUser // ⚠️ Spring Security lấy user hiện tại
    ) {
        List<AuctionSessionSummaryDTO> sessions = auctionSessionService
                .searchSessions(title, decription, status, date, currentUser);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionDetail(
            @PathVariable("id") Long sessionId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            AuctionSessionDetailDTO sessionDetail = auctionSessionService.getSessionByIdWithAccessControl(sessionId, userDetails);
            return ResponseEntity.ok(sessionDetail);
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(403).body("Bạn không có quyền xem phiên đấu giá này.");
        } catch (NotFoundException ex) {
            return ResponseEntity.status(404).body("Phiên đấu giá không tồn tại.");
        }
    }

    @PutMapping("/{id}/visibility")
    public ResponseEntity<?> updateVisibility(
            @PathVariable Long id,
            @RequestBody @Valid UpdateVisibilityRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        auctionSessionService.updateSessionVisibility(id, userDetails.getId(), request.getType());
        return ResponseEntity.ok().body(Map.of("message", "Cập nhật hình thức phiên thành công."));
    }

    @GetMapping("/{id}/result")
    public ResponseEntity<?> getAuctionResult(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            Long currentUserId = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                currentUserId = jwtTokenProvider.getUserIdFromToken(token);
            }

            AuctionResultDTO result = auctionSessionService.getAuctionResultById(id, currentUserId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", result);

            return ResponseEntity.ok(response);

        } catch (ResponseStatusException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getReason());

            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi xảy ra, vui lòng thử lại");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}