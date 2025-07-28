package com.danang_auction.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SepayService {

    @Value("${sepay.account}")
    private String sepayAccount;

    @Value("${sepay.bank}")
    private String sepayBank;

    public String generateQRCode(Double amount, String content) {
        return String.format(
            "https://qr.sepay.vn/img?acc=%s&bank=%s&amount=%.0f&des=%s",
            sepayAccount, sepayBank, amount, content
        );
    }
}
