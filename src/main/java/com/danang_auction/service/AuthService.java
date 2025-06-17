package com.danang_auction.service;

import com.danang_auction.model.dto.auth.ForgetPasswordRequest;
import com.danang_auction.model.dto.auth.LoginRequest;
import com.danang_auction.model.dto.auth.LoginResponse;
import com.danang_auction.model.dto.auth.RegisterRequest;
import com.danang_auction.model.dto.auth.ResetPasswordRequest;
import com.danang_auction.model.dto.image.CloudinaryUploadResponse;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.AccountType;
import com.danang_auction.model.enums.Gender;
import com.danang_auction.model.enums.UserRole;
import com.danang_auction.model.enums.UserStatus;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.util.JwtTokenProvider;
import com.danang_auction.util.AesEncryptUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AesEncryptUtil aesEncryptUtil;
    private final EmailService emailService;
    private final ImageService imageService;

    @Transactional
    public String register(RegisterRequest dto, List<MultipartFile> files) {
        // Kiểm tra username và email đã tồn tại
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // Tạo user mới
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

        // Mã hóa số CMND/CCCD
        user.setIdentityNumber(aesEncryptUtil.encrypt(dto.getIdentityNumber()));
        user.setIdentityIssueDate(dto.getIdentityIssueDate());
        user.setIdentityIssuePlace(dto.getIdentityIssuePlace());

        user.setBankAccountNumber(dto.getBankAccountNumber());
        user.setBankName(dto.getBankName());
        user.setBankAccountHolder(dto.getBankAccountHolder());
        user.setAccountType(dto.getAccountType());

        // Thiết lập giá trị mặc định
        user.setVerified(false);
        user.setStatus(UserStatus.ACTIVE);

        // Phân quyền theo account_type
        if (dto.getAccountType() == AccountType.PERSONAL) {
            user.setRole(UserRole.BIDDER);
        } else {
            user.setRole(UserRole.ORGANIZER);
        }

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
        // Tìm user theo username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Sai thông tin đăng nhập"));

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai thông tin đăng nhập");
        }

        // Kiểm tra trạng thái tài khoản
        if (user.getStatus() == UserStatus.BANNED) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new RuntimeException("Tài khoản đang bị tạm khóa");
        }

        // Tạo JWT token
        String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );

        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(86400);


        // Tạo thông tin user để trả về
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

    public boolean validateUser(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(false);
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

            // Gửi email OTP
            emailService.sendOtpEmail(user.getEmail(), otp);
        }

        // Luôn trả về OK – không tiết lộ email tồn tại hay không
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

    public Long extractUserIdFromToken(String token) {
        String jwt = token.replace("Bearer ", "");
        Claims claims = Jwts.parser()
                .setSigningKey("SECRET_KEY") // dùng key thực tế của bạn
                .parseClaimsJws(jwt)
                .getBody();
        return Long.parseLong(claims.getSubject()); // giả sử subject = userId
    }
}