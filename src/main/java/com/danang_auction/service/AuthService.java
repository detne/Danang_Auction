package com.danang_auction.service;

import com.danang_auction.model.dto.auth.LoginRequest;
import com.danang_auction.model.dto.auth.LoginResponse;
import com.danang_auction.model.dto.auth.RegisterRequest;
import com.danang_auction.model.dto.image.CloudinaryUploadResponse;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.AccountType;
import com.danang_auction.model.enums.UserRole;
import com.danang_auction.model.enums.UserStatus;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.security.JwtTokenProvider;
import com.danang_auction.util.AesEncryptUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AesEncryptUtil aesEncryptUtil;
    private final ImageService imageService;

    @Transactional
    public String register(RegisterRequest request, List<MultipartFile> files) {
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
        user.setIdentityNumber(aesEncryptUtil.encrypt(request.getIdentityNumber()));
        user.setIdentityIssueDate(request.getIdentityIssueDate());
        user.setIdentityIssuePlace(request.getIdentityIssuePlace());
        user.setBankAccountNumber(request.getBankAccountNumber());
        user.setBankName(request.getBankName());
        user.setBankAccountHolder(request.getBankAccountHolder());
        user.setAccountType(request.getAccountType());
        user.setVerified(false);
        user.setStatus(UserStatus.ACTIVE);
        user.setRole(request.getAccountType() == AccountType.PERSONAL ? UserRole.BIDDER : UserRole.ORGANIZER);

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
                user.getId(), user.getUsername(), user.getRole().name()
        );

        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(86400);

        String fullName = String.format("%s %s %s",
                user.getFirstName() != null ? user.getFirstName() : "",
                user.getMiddleName() != null ? user.getMiddleName() : "",
                user.getLastName() != null ? user.getLastName() : "").trim();

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(), user.getUsername(),
                user.getRole().name(), user.getStatus().name(), fullName
        );

        return new LoginResponse(token, "Bearer", expiresAt, userInfo);
    }

    public boolean validateUser(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(false);
    }
}
