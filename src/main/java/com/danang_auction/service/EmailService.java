package com.danang_auction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP for Password Reset");
        message.setText("Your OTP code is: " + otp + ". It will expire in 10 minutes.");
        mailSender.send(message);
    }

    public void sendIdentityVerifyRequest(String to, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Request for Identity Verification");
        message.setText("Your identity verification request has been received. Reason: " + reason +
                ". Please upload new images for verification.");
        mailSender.send(message);
    }
}