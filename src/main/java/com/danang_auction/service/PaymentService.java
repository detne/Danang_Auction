package com.danang_auction.service;


import com.danang_auction.model.dto.payment.DepositResponse;
import com.danang_auction.model.entity.Payment;
import com.danang_auction.model.enums.PaymentChannel;
import com.danang_auction.model.enums.PaymentStatus;
import com.danang_auction.model.enums.PaymentType;
import com.danang_auction.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserService userService;

    public DepositResponse createDeposit(Long userId, Double amount, PaymentChannel channel) {
        String transactionCode = "NAP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = new Payment();
        payment.setUser(userService.getById(userId));
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setType(PaymentType.DEPOSIT);
        payment.setTransactionCode(transactionCode);
        payment.setTimestamp(LocalDateTime.now());
        payment.setPaymentChannel(channel); // ✅ đúng kiểu

        paymentRepository.save(payment);

        String qrUrl = switch (channel) {
            case BANK -> String.format(
                    "https://img.vietqr.io/image/TPB-00000012421-print.png?amount=%.0f&addInfo=%s&accountName=%s",
                    amount, transactionCode, "NGUYEN%20SONG%20GIA%20HUY");
            case MOMO -> "https://img.vietqr.io/image/momo.png";
            case ZALOPAY -> "http://localhost:3000/images/zalopay.png";
            default -> null;
        };

        DepositResponse response = new DepositResponse();
        response.setTransactionCode(transactionCode);
        response.setQrUrl(qrUrl);
        response.setAmount(amount);
        response.setStatus(payment.getStatus().name());
        response.setVerifiedAt(null);

        return response;
    }

    public DepositResponse checkDepositStatus(Long userId, String transactionCode) {
        Payment payment = paymentRepository.findByTransactionCodeAndUserId(transactionCode, userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch"));

        DepositResponse response = new DepositResponse();
        response.setTransactionCode(payment.getTransactionCode());
        response.setStatus(payment.getStatus().name());
        response.setAmount(payment.getAmount());
        response.setVerifiedAt(payment.getVerifiedAt());

        return response;
    }
}