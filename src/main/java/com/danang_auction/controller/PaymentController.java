package com.danang_auction.controller;

import com.danang_auction.model.dto.payment.DepositRequest;
import com.danang_auction.model.dto.payment.PaymentHistoryDTO;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.service.PaymentService;
import com.danang_auction.service.SepayService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/user/wallet")
@RequiredArgsConstructor
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;
    private final SepayService sepayService;

    // ✅ 1. Gửi yêu cầu nạp tiền → tạo QR Code + LƯU payment PENDING
    @PostMapping("/deposit-request")
    @PreAuthorize("hasRole('BIDDER')")
    public ResponseEntity<?> createDepositQRCode(
            @RequestBody DepositRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        Long amount = request.getAmount();
        Long userId = user.getId();

        // 📌 Nội dung chuyển khoản dạng: 10000{userId}
        String content = "DANANGAUCTIONUSER" + userId;

        // ✅ Tạo URL QR Code từ SePay
        String qrCodeUrl = sepayService.generateQRCode(amount.doubleValue(), content);

        // ✅ Tạo payment trạng thái PENDING nếu chưa tồn tại
        paymentService.createPendingPayment(userId, amount.doubleValue(), content);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "qrUrl", qrCodeUrl,
                "content", content,
                "amount", amount));
    }

    // ✅ 2. Lịch sử các giao dịch nạp tiền của tôi
    @GetMapping("/my-history")
    @PreAuthorize("hasRole('BIDDER')")
    public ResponseEntity<List<PaymentHistoryDTO>> getMyPaymentHistory(
            @AuthenticationPrincipal CustomUserDetails user) {

        List<PaymentHistoryDTO> history = paymentService.getMyPaymentHistory(user.getId());
        return ResponseEntity.ok(history);
    }

    // ✅ 3. Lấy số dư tài khoản
    @GetMapping("/balance")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getBalance(@AuthenticationPrincipal CustomUserDetails user) {
        try {
            Long userId = user.getId();
            log.info("📩 Lấy số dư cho userId: {}", userId);

            Long balance = paymentService.getBalanceByUserId(userId);

            log.info("✅ Balance for user {}: {}", userId, balance);
            return ResponseEntity.ok(Map.of("success", true, "balance", balance));

        } catch (Exception e) {
            log.error("❌ Lỗi khi xử lý /wallet/balance: ", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Có lỗi xảy ra, vui lòng thử lại"));
        }
    }
}
