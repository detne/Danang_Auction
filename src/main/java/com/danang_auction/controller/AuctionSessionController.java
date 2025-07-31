package com.danang_auction.controller;

import com.danang_auction.exception.ForbiddenException;
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

    // Lấy danh sách participants của một phiên (nếu cần cho organizer)
    @GetMapping("/{id}/participants")
    public ResponseEntity<List<AuctionSessionParticipantDTO>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(auctionSessionService.getParticipantsBySessionId(id));
    }

    // API SEARCH CHUẨN: Lấy danh sách phiên đấu giá, có filter title, status, type,
    // date (PUBLIC ai cũng truy cập được)
    @GetMapping
    public ResponseEntity<List<AuctionSessionSummaryDTO>> searchSessions(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type, // <<== THÊM LOẠI PHIÊN
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal User currentUser) {
        List<AuctionSessionSummaryDTO> sessions = auctionSessionService
                .searchSessions(title, description, status, type, date, currentUser);
        return ResponseEntity.ok(sessions);
    }

    // Xem chi tiết phiên theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionDetail(
            @PathVariable("id") Long sessionId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            AuctionSessionDetailDTO sessionDetail = auctionSessionService.getSessionByIdWithAccessControl(sessionId,
                    userDetails);
            return ResponseEntity.ok(sessionDetail);
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(403).body("Bạn không có quyền xem phiên đấu giá này.");
        } catch (NotFoundException ex) {
            return ResponseEntity.status(404).body("Phiên đấu giá không tồn tại.");
        }
    }

    // Xem chi tiết phiên theo sessionCode
    @GetMapping("/code/{sessionCode}")
    public ResponseEntity<?> getSessionDetailByCode(
            @PathVariable("sessionCode") String sessionCode,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            AuctionSessionDetailDTO sessionDetail = auctionSessionService
                    .getSessionByCodeWithAccessControl(sessionCode, userDetails);
            return ResponseEntity.ok(sessionDetail);
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(403).body("Bạn không có quyền xem phiên đấu giá này.");
        } catch (NotFoundException ex) {
            return ResponseEntity.status(404).body("Phiên đấu giá không tồn tại.");
        }
    }

    // Đổi hình thức phiên (chỉ cho organizer)
    @PutMapping("/{id}/visibility")
    public ResponseEntity<?> updateVisibility(
            @PathVariable Long id,
            @RequestBody @Valid UpdateVisibilityRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        auctionSessionService.updateSessionVisibility(id, userDetails.getId(), request.getType());
        return ResponseEntity.ok().body(Map.of("message", "Cập nhật hình thức phiên thành công."));
    }

    // Lấy giá hiện tại của phiên
    @GetMapping("/{id}/current-price")
    public ResponseEntity<BigDecimal> getCurrentPrice(@PathVariable("id") Long sessionId) {
        BigDecimal currentPrice = auctionSessionService.getCurrentPrice(sessionId);
        return ResponseEntity.ok(currentPrice);
    }

    // Đăng ký tham gia phiên đấu giá (chỉ cho BIDDER)
    @PostMapping("/{sessionCode}/register")
    public ResponseEntity<?> registerForSession(
            @PathVariable String sessionCode,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        try {
            auctionSessionService.registerBidder(sessionCode, userDetails);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "status", "WAITING_START",
                    "message", "Đăng ký tham gia phiên đấu giá và đặt cọc thành công!"));

        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "message", "Bạn không có quyền tham gia phiên đấu giá này."));

        } catch (NotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Phiên đấu giá không tồn tại."));

        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!"));
        }
    }

    // Kết thúc phiên đấu giá (chỉ cho ORGANIZER)
    @PutMapping("/{id}/close")
    public ResponseEntity<?> closeSession(
            @PathVariable("id") Long sessionId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            auctionSessionService.closeSession(sessionId, userDetails.getId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Phiên đấu giá đã được kết thúc!"));
        } catch (ForbiddenException ex) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", ex.getMessage()));
        }
    }
}