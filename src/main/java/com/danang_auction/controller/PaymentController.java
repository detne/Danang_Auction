package com.danang_auction.controller;

import com.danang_auction.model.dto.payment.PaymentDto;
import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping("/payments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPayments() {
        try {
            List<PaymentDto> payments = paymentService.getAllPayments();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", payments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi xảy ra, vui lòng thử lại: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/payments/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRevenue(@RequestParam PaymentStatus status) {
        try {
            BigDecimal revenue = paymentService.sumRevenue(status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", revenue);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi xảy ra, vui lòng thử lại: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/payments/revenue/month")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRevenueByMonth(@RequestParam PaymentStatus status, @RequestParam int month) {
        try {
            BigDecimal revenue = paymentService.sumRevenueByMonth(status, month);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", revenue);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi xảy ra, vui lòng thử lại: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}