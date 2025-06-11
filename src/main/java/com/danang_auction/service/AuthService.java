package com.danang_auction.service;

import com.danang_auction.model.dto.auth.LoginRequest;
import com.danang_auction.model.dto.auth.LoginResponse;
import com.danang_auction.model.dto.auth.RegisterRequest;
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
        // Kiểm tra username và email đã tồn tại
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // Tạo user mới
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

        // Mã hóa số CMND/CCCD
        user.setIdentityNumber(aesEncryptUtil.encrypt(request.getIdentityNumber()));
        user.setIdentityIssueDate(request.getIdentityIssueDate());
        user.setIdentityIssuePlace(request.getIdentityIssuePlace());

        user.setBankAccountNumber(request.getBankAccountNumber());
        user.setBankName(request.getBankName());
        user.setBankAccountHolder(request.getBankAccountHolder());
        user.setAccountType(request.getAccountType());

        // Thiết lập giá trị mặc định
        user.setVerified(false);
        user.setStatus(Status.ACTIVE);

        // Phân quyền theo account_type
        if (request.getAccountType() == AccountType.PERSONAL) {
            user.setRole("participant");
        } else {
            user.setRole("organizer");
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
        if (user.getStatus() == Status.BANNED) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        if (user.getStatus() == Status.SUSPENDED) {
            throw new RuntimeException("Tài khoản đang bị tạm khóa");
        }

        // Tạo JWT token
        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole());
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(86400); // 24 hours

        // Tạo thông tin user để trả về
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
}