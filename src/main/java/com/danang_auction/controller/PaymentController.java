package com.danang_auction.controller;

import com.danang_auction.model.dto.payment.DepositRequest;
import com.danang_auction.model.dto.payment.DepositResponse;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/wallet")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/deposit-request")
    public ResponseEntity<?> createDepositRequest(
            @RequestBody DepositRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        if (request.getAmount() == null || request.getAmount() <= 0) {
            return ResponseEntity.badRequest().body("Số tiền nạp không hợp lệ.");
        }

        if (request.getPaymentChannel() == null) {
            return ResponseEntity.badRequest().body("Phương thức thanh toán không hợp lệ.");
        }

        System.out.println("Received deposit request: amount=" + request.getAmount()
                + ", channel=" + request.getPaymentChannel());

        DepositResponse response = paymentService.createDeposit(
                user.getId(),
                request.getAmount().doubleValue(),
                request.getPaymentChannel());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/deposit-status")
    public ResponseEntity<?> checkDepositStatus(
            @RequestParam("transaction_code") String transactionCode,
            @AuthenticationPrincipal CustomUserDetails user) {
        DepositResponse result = paymentService.checkDepositStatus(user.getId(), transactionCode);
        return ResponseEntity.ok(result);
    }
}