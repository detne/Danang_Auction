package com.danang_auction.service;

import com.danang_auction.model.dto.auth.*;
import com.danang_auction.model.dto.image.CloudinaryUploadResponse;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.*;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.util.AesEncryptUtil;
import com.danang_auction.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AesEncryptUtil aesEncryptUtil;
    private final EmailService emailService;
    private final ImageService imageService;

    // ==== Auth Logic ====

    @Transactional
    public String register(RegisterRequest dto, List<MultipartFile> files) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setFirstName(dto.getFirstName());
        user.setMiddleName(dto.getMiddleName());
        user.setLastName(dto.getLastName());
        user.setGender(Gender.valueOf(dto.getGender().name()));
        user.setDob(dto.getDob());
        user.setProvince(dto.getProvince());
        user.setDistrict(dto.getDistrict());
        user.setWard(dto.getWard());
        user.setDetailedAddress(dto.getDetailedAddress());

        user.setIdentityNumber(aesEncryptUtil.encrypt(dto.getIdentityNumber()));
        user.setIdentityIssueDate(dto.getIdentityIssueDate());
        user.setIdentityIssuePlace(dto.getIdentityIssuePlace());

        user.setBankAccountNumber(dto.getBankAccountNumber());
        user.setBankName(dto.getBankName());
        user.setBankAccountHolder(dto.getBankAccountHolder());
        user.setAccountType(dto.getAccountType());

        user.setVerified(false);
        user.setStatus(UserStatus.ACTIVE);
        user.setRole(dto.getAccountType() == AccountType.PERSONAL ? UserRole.BIDDER : UserRole.ORGANIZER);

        userRepository.save(user);

        if (files != null && files.size() > 0 && !files.get(0).isEmpty()) {
            CloudinaryUploadResponse front = imageService.storeCloudinaryImageTemp(
                    String.valueOf(user.getId()), files.get(0), "front"
            );
            user.setIdentityFrontUrl(front.getUrl());
        }

        if (files.size() > 1 && !files.get(1).isEmpty()) {
            CloudinaryUploadResponse back = imageService.storeCloudinaryImageTemp(
                    String.valueOf(user.getId()), files.get(1), "back"
            );
            user.setIdentityBackUrl(back.getUrl());
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

        String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );

        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(86400);

        String fullName = String.format("%s %s %s",
                user.getFirstName() != null ? user.getFirstName() : "",
                user.getMiddleName() != null ? user.getMiddleName() : "",
                user.getLastName() != null ? user.getLastName() : "").trim();

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                user.getStatus().name(),
                fullName
        );

        return new LoginResponse(token, "Bearer", expiresAt, userInfo);
    }

    public void processForgotPassword(ForgetPasswordRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            String otp = String.format("%06d", new Random().nextInt(999999));
            LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

            user.setResetToken(otp);
            user.setResetTokenExpiry(expiry);
            userRepository.save(user);

            emailService.sendOtpEmail(user.getEmail(), otp);
        }
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

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
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

    @Transactional
    public String requestIdentityVerify(String email, String reason) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        String trimmedEmail = email.trim();

        User user = userRepository.findByEmail(trimmedEmail)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        user.setVerified(false);
        user.setRejectedReason(reason);
        userRepository.save(user);

        emailService.sendIdentityVerifyRequest(trimmedEmail, reason);

        return "Request for identity verification has been submitted successfully";
    }

    // ==== Gộp từ UserProfileService ====

    public Optional<UserProfileResponse> getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .map(this::mapToUserProfileResponse);
    }

    public UserProfileResponse updateProfile(Integer userId, UserProfileResponse userProfileRequest) {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(userProfileRequest.getEmail());
        user.setPhoneNumber(userProfileRequest.getPhoneNumber());
        user.setFirstName(userProfileRequest.getFirstName());
        user.setMiddleName(userProfileRequest.getMiddleName());
        user.setLastName(userProfileRequest.getLastName());

        if (userProfileRequest.getGender() != null) {
            user.setGender(Gender.valueOf(userProfileRequest.getGender()));
        }
        if (userProfileRequest.getDob() != null) {
            user.setDob(LocalDate.parse(userProfileRequest.getDob()));
        }

        user.setProvince(userProfileRequest.getProvince());
        user.setDistrict(userProfileRequest.getDistrict());
        user.setWard(userProfileRequest.getWard());
        user.setDetailedAddress(userProfileRequest.getDetailedAddress());
        user.setIdentityIssuePlace(userProfileRequest.getIdentityIssuePlace());

        if (userProfileRequest.getIdentityIssueDate() != null) {
            user.setIdentityIssueDate(LocalDate.parse(userProfileRequest.getIdentityIssueDate()));
        }

        User updatedUser = userRepository.save(user);
        return mapToUserProfileResponse(updatedUser);
    }

    private UserProfileResponse mapToUserProfileResponse(User user) {
        UserProfileResponse dto = new UserProfileResponse();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setFirstName(user.getFirstName());
        dto.setMiddleName(user.getMiddleName());
        dto.setLastName(user.getLastName());
        dto.setGender(String.valueOf(user.getGender()));
        dto.setDob(user.getDob() != null ? user.getDob().toString() : null);

        dto.setProvince(user.getProvince());
        dto.setDistrict(user.getDistrict());
        dto.setWard(user.getWard());
        dto.setDetailedAddress(user.getDetailedAddress());

        dto.setIdentityIssuePlace(user.getIdentityIssuePlace());
        dto.setIdentityIssueDate(user.getIdentityIssueDate() != null ? user.getIdentityIssueDate().toString() : null);

        dto.setAccountType(String.valueOf(user.getAccountType()));
        dto.setRole(String.valueOf(user.getRole()));
        dto.setVerified(user.getVerified());
        dto.setStatus(String.valueOf(user.getStatus()));
        return dto;
    }
}
