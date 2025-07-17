package com.danang_auction.service;

import com.danang_auction.model.dto.payment.PaymentDto;
import com.danang_auction.model.entity.Payment;
import com.danang_auction.repository.PaymentRepository;
import com.danang_auction.model.enums.PaymentStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private PaymentRepository paymentRepository;

    public List<PaymentDto> getAllPayments() {
        log.debug("Fetching all payments");
        List<Payment> payments = paymentRepository.findAll();
        log.debug("Retrieved {} payments", payments.size());
        return payments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private PaymentDto convertToDto(Payment payment) {
        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        dto.setType(payment.getType() != null ? payment.getType().name() : null);
        dto.setStatus(payment.getStatus() != null ? payment.getStatus().name() : null);
        dto.setAmount(payment.getAmount());
        dto.setTimestamp(payment.getTimestamp());
        dto.setUserId(payment.getUser() != null ? payment.getUser().getId() : null);
        dto.setSessionId(payment.getSession() != null ? payment.getSession().getId() : null);
        return dto;
    }

    public BigDecimal sumRevenue(PaymentStatus status) {
        log.debug("Calculating revenue for status: {}", status);
        return paymentRepository.sumRevenue(status);
    }

    public BigDecimal sumRevenueByMonth(PaymentStatus status, int month) {
        log.debug("Calculating revenue for status: {} and month: {}", status, month);
        return paymentRepository.sumRevenueByMonth(status, month);
    }
}