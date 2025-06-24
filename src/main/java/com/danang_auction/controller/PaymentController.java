package com.danang_auction.controller;

import com.danang_auction.model.entity.Payment;
import com.danang_auction.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class
PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<String> createPayment(@RequestParam Long userId,
                                                @RequestParam Long sessionId,
                                                @RequestParam Double amount,
                                                @RequestParam String paymentMethod) {
        try {
            Payment payment = paymentService.createPayment(userId, sessionId, "TX12345", amount, paymentMethod);
            return ResponseEntity.status(201).body("Payment created successfully for session " + sessionId);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
