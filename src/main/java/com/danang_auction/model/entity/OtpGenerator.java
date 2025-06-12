package com.danang_auction.model.entity;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class OtpGenerator {
    public String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit
    }
}
