package com.danang_auction.service;

import com.danang_auction.model.dto.auth.LoginRequest;
import com.danang_auction.model.dto.auth.LoginResponse;
import com.danang_auction.model.dto.auth.RegisterRequest;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.AccountType;
import com.danang_auction.model.enums.Gender;
import com.danang_auction.model.enums.UserRole;
import com.danang_auction.model.enums.UserStatus;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.security.JwtTokenProvider;
import com.danang_auction.util.AesEncryptUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AesEncryptUtil aesEncryptUtil;
    private final EmailService emailService;

    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setFirstName(request.getFirstName());
        user.setMiddleName(request.getMiddleName());
        user.setLastName(request.getLastName());
        user.setGender(Gender.valueOf(request.getGender().name()));
        user.setDob(request.getDob());
        user.setProvince(request.getProvince());
        user.setDistrict(request.getDistrict());
        user.setWard(request.getWard());
        user.setDetailedAddress(request.getDetailedAddress());
        user.setIdentityNumber(aesEncryptUtil.encrypt(request.getIdentityNumber()));
        user.setIdentityIssueDate(request.getIdentityIssueDate());
        user.setIdentityIssuePlace(request.getIdentityIssuePlace());
        user.setBankAccountNumber(request.getBankAccountNumber());
        user.setBankName(request.getBankName());
        user.setBankAccountHolder(request.getBankAccountHolder());
        user.setAccountType(request.getAccountType());

        user.setVerified(false);
        user.setStatus(UserStatus.ACTIVE);

        if (request.getAccountType() == AccountType.PERSONAL) {
            user.setRole(UserRole.BIDDER);
        } else {
            user.setRole(UserRole.ORGANIZER);
        }

        userRepository.save(user);

        return "Đăng ký tài khoản thành công";
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Sai thông tin đăng nhập"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai thông tin đăng nhập");
        }
        if (user.getStatus() == UserStatus.BANNED) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }
        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new RuntimeException("Tài khoản đang bị tạm khóa");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole().name());
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(86400);

        String fullName = String.format("%s %s %s",
                user.getFirstName() != null ? user.getFirstName() : "",
                user.getMiddleName() != null ? user.getMiddleName() : "",
                user.getLastName() != null ? user.getLastName() : "").trim();

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(), user.getUsername(), user.getRole().name(), user.getStatus().name(), fullName);

        return new LoginResponse(token, "Bearer", expiresAt, userInfo);
    }

    public boolean validateUser(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(false);
    }

    @Transactional
    public String sendOtpForForgetPassword(String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            String trimmedEmail = email.trim();

            User user = userRepository.findByEmail(trimmedEmail)
                    .orElseThrow(() -> new RuntimeException("Email not found"));

            String otp = String.format("%06d", new Random().nextInt(999999));
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);

            emailService.sendOtpEmail(trimmedEmail, otp);

            return "OTP has been sent to your email";
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP: " + e.getMessage());
        }
    }

    @Transactional
    public String requestIdentityVerify(String email, String reason) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            String trimmedEmail = email.trim();

            User user = userRepository.findByEmail(trimmedEmail)
                    .orElseThrow(() -> new RuntimeException("Email not found"));

            user.setVerified(false); // Đặt lại trạng thái xác minh
            user.setRejectedReason(reason); // Ghi lý do từ chối
            userRepository.save(user);

            emailService.sendIdentityVerifyRequest(trimmedEmail, reason);

            return "Request for identity verification has been submitted successfully";
        } catch (Exception e) {
            throw new RuntimeException("Failed to request identity verification: " + e.getMessage());
        }
    }
}