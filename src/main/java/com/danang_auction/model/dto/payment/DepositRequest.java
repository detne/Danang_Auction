package com.danang_auction.model.dto.payment;

import com.danang_auction.model.enums.PaymentChannel;

import lombok.Data;

@Data
public class DepositRequest {
    private Long amount;
    private PaymentChannel paymentChannel;
}