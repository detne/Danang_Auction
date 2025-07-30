package com.danang_auction.controller;

import com.danang_auction.model.dto.webhook.SepayWebhookPayload;
import com.danang_auction.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class SepayWebhookController {

    private final PaymentService paymentService;

    @Value("${sepay.webhook-api-key}")
    private String configuredApiKey;

    /**
     * ✅ Xử lý webhook SePay khi có giao dịch mới
     */
    @PostMapping("/sepay-payment")
    public ResponseEntity<String> handleSepayWebhook(
            @RequestBody SepayWebhookPayload payload,
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        log.info("📩 Nhận webhook SePay: Header = {}", authHeader);

        // Kiểm tra API Key (không phân biệt hoa thường + trim)
        String expectedHeader = "Apikey " + configuredApiKey;
        if (authHeader == null || !authHeader.trim().equalsIgnoreCase(expectedHeader)) {
            log.warn("❌ API Key không hợp lệ: {}", authHeader);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid API Key");
        }

        // Validate payload
        if (payload == null || payload.getDescription() == null) {
            log.error("❌ Payload hoặc description rỗng!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid payload");
        }

        try {
            log.info("✅ Webhook hợp lệ, payload = {}", payload);
            boolean processed = paymentService.processSepayWebhook(payload);

            if (!processed) {
                return ResponseEntity.ok("⚠️ Transaction ignored or already processed");
            }

            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception ex) {
            log.error("❌ Lỗi xử lý webhook: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Webhook processing failed");
        }
    }
}
