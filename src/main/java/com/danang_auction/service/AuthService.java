package com.danang_auction.service;

import com.danang_auction.model.dto.auth.LoginRequest;
import com.danang_auction.model.dto.auth.LoginResponse;
import com.danang_auction.model.dto.auth.RegisterRequest;
import com.danang_auction.model.dto.auth.ResetPasswordRequest;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.AccountType;
import com.danang_auction.model.enums.Status;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.security.JwtTokenProvider;
import com.danang_auction.util.AesEncryptUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AesEncryptUtil aesEncryptUtil;

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
        user.setGender(request.getGender());
        user.setDob(request.getDob());
        user.setProvince(request.getProvince());
        user.setDistrict(request.getDistrict());
        user.setWard(request.getWard());
        user.setDetailedAddress(request.getDetailedAddress());

        try {
            user.setIdentityNumber(aesEncryptUtil.encrypt(request.getIdentityNumber()));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi mã hóa identityNumber: " + e.getMessage());
        }
        user.setIdentityIssueDate(request.getIdentityIssueDate());
        user.setIdentityIssuePlace(request.getIdentityIssuePlace());
        user.setBankAccountNumber(request.getBankAccountNumber());
        user.setBankName(request.getBankName());
        user.setBankAccountHolder(request.getBankAccountHolder());
        user.setAccountType(request.getAccountType());
        user.setVerified(false);
        user.setStatus(Status.ACTIVE);

        if (request.getAccountType() == AccountType.PERSONAL) {
            user.setRole("participant");
        } else {
            user.setRole("organizer");
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

        if (user.getStatus() == Status.BANNED) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        if (user.getStatus() == Status.SUSPENDED) {
            throw new RuntimeException("Tài khoản đang bị tạm khóa");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole());
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(86400);

        String fullName = String.format("%s %s %s",
                user.getFirstName() != null ? user.getFirstName() : "",
                user.getMiddleName() != null ? user.getMiddleName() : "",
                user.getLastName() != null ? user.getLastName() : "").trim();

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getStatus().name(),
                fullName
        );

        return new LoginResponse(token, "Bearer", expiresAt, userInfo);
    }

    public boolean validateUser(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(false);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy email người dùng"));

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp");
        }
        if (!isStrongPassword(request.getNewPassword())) {
            throw new IllegalArgumentException("Mật khẩu mới không đủ mạnh");
        }
        if (request.getOtp().length() != 6) {
            throw new IllegalArgumentException("Mã OTP phải đủ 6 ký tự");
        }

        if (user.getResetToken() == null || user.getResetTokenExpiry() == null) {
            throw new IllegalArgumentException("Mã OTP không tồn tại hoặc đã được sử dụng");
        }
        if (!user.getResetToken().equals(request.getOtp()) || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Mã OTP không đúng hoặc đã hết hạn");
        }

        String hashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(hashedPassword);
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }


    private boolean isStrongPassword(String password) {
        return password.length() >= 8 &&
                password.matches(".*[A-Z].*") &&
                password.matches(".*[a-z].*") &&
                password.matches(".*[0-9].*") &&
                password.matches(".*[!@#$%^&*].*");
    }
}