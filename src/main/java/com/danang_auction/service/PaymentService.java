package com.danang_auction.service;

import com.danang_auction.model.entity.Payment;
import com.danang_auction.model.dto.paymentsDTO.PaymentDto;
import com.danang_auction.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<PaymentDto> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private PaymentDto convertToDto(Payment payment) {
        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        dto.setType(payment.getType() != null ? payment.getType().name() : null);
        dto.setStatus(payment.getStatus() != null ? payment.getStatus().name() : null);
        dto.setPrice(payment.getPrice());
        dto.setTimestamp(payment.getTimestamp() != null ? payment.getTimestamp().toString() : null);
        dto.setUserId(payment.getUser() != null ? payment.getUser().getId() : null);
        dto.setSessionId(payment.getSession() != null ? payment.getSession().getId() : null);
        return dto;
    }
}