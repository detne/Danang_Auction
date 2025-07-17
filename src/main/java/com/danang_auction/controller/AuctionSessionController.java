package com.danang_auction.controller;

import com.danang_auction.exception.NotFoundException;
import com.danang_auction.model.dto.session.AuctionSessionDetailDTO;
import com.danang_auction.model.dto.session.AuctionSessionParticipantDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import com.danang_auction.model.dto.session.UpdateVisibilityRequestDTO;
import com.danang_auction.model.entity.User;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.service.AuctionSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class AuctionSessionController {

    private final AuctionSessionService auctionSessionService;

    // Lấy danh sách người tham gia phiên đấu giá
    @GetMapping("/{id}/participants")
    public ResponseEntity<List<AuctionSessionParticipantDTO>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(auctionSessionService.getParticipantsBySessionId(id));
    }

    // Tìm kiếm các phiên đấu giá
    @GetMapping
    public ResponseEntity<List<AuctionSessionSummaryDTO>> searchSessions(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal User currentUser
    ) {
        List<AuctionSessionSummaryDTO> sessions = auctionSessionService
                .searchSessions(title, description, status, date, currentUser);
        return ResponseEntity.ok(sessions);
    }

    // Lấy chi tiết của phiên đấu giá
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

    // Cập nhật hình thức của phiên đấu giá
    @PutMapping("/{id}/visibility")
    public ResponseEntity<?> updateVisibility(
            @PathVariable Long id,
            @RequestBody @Valid UpdateVisibilityRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        auctionSessionService.updateSessionVisibility(id, userDetails.getId(), request.getType());
        return ResponseEntity.ok().body(Map.of("message", "Cập nhật hình thức phiên thành công."));
    }

    // Lấy giá hiện tại của phiên đấu giá
    @GetMapping("/{id}/current-price")
    public ResponseEntity<BigDecimal> getCurrentPrice(@PathVariable("id") Long sessionId) {
        BigDecimal currentPrice = auctionSessionService.getCurrentPrice(sessionId);
        return ResponseEntity.ok(currentPrice);
    }

    // Lấy người thắng cuộc của phiên đấu giá
    @GetMapping("/{id}/winner")
    public ResponseEntity<?> getWinner(@PathVariable Long id) {
        try {
            // Lấy người thắng cuộc có giá thầu cao nhất trong phiên đấu giá
            AuctionSessionParticipantDTO winner = auctionSessionService.getWinnerBySessionId(id);

            if (winner == null) {
                return ResponseEntity.status(404).body("Không có người thắng cuộc.");
            }

            return ResponseEntity.ok(winner);
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(403).body("Bạn không có quyền xem người thắng cuộc.");
        } catch (NotFoundException ex) {
            return ResponseEntity.status(404).body("Phiên đấu giá không tồn tại hoặc chưa kết thúc.");
        }
    }

}



