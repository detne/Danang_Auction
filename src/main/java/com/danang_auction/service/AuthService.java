package com.danang_auction.service;

import com.danang_auction.dto.auth.LoginRequest;
import com.danang_auction.dto.auth.LoginResponse;
import com.danang_auction.dto.auth.RegisterRequest;
import com.danang_auction.model.entity.User;
import com.danang_auction.repository.UserRepository;
import com.danang_auction.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole() != null ? user.getRole() : "USER");

        // Tạo UserInfo
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getRole() != null ? user.getRole() : "USER",
                user.getStatus() != null ? user.getStatus() : "active",
                buildFullName(user)
        );

        // Tạo LoginResponse với constructor đúng
        LoginResponse response = new LoginResponse();
        response.setAccessToken(token);
        response.setTokenType("Bearer");
        response.setExpiresAt(LocalDateTime.now().plusHours(1));
        response.setUser(userInfo);

        return response;
    }

    public String register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setFirstName(registerRequest.getFirstName());
        user.setMiddleName(registerRequest.getMiddleName());
        user.setLastName(registerRequest.getLastName());
        user.setGender(registerRequest.getGender());
        user.setDob(registerRequest.getDob());
        user.setProvince(registerRequest.getProvince());
        user.setDistrict(registerRequest.getDistrict());
        user.setWard(registerRequest.getWard());
        user.setDetailedAddress(registerRequest.getDetailedAddress());
        user.setIdentityNumber(registerRequest.getIdentityNumber());
        user.setIdentityIssueDate(registerRequest.getIdentityIssueDate());
        user.setIdentityIssuePlace(registerRequest.getIdentityIssuePlace());
        user.setBankAccountNumber(registerRequest.getBankAccountNumber());
        user.setBankName(registerRequest.getBankName());
        user.setBankAccountHolder(registerRequest.getBankAccountHolder());
        user.setAccountType(registerRequest.getAccountType());
        user.setRole("USER");
        user.setVerified(false);
        user.setStatus("active");
        user.setFullName(buildFullName(user)); // Set fullName

        userRepository.save(user);
        return "Đăng ký thành công";
    }

    private String buildFullName(User user) {
        StringBuilder fullName = new StringBuilder();
        if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) {
            fullName.append(user.getFirstName().trim());
        }
        if (user.getMiddleName() != null && !user.getMiddleName().trim().isEmpty()) {
            if (fullName.length() > 0) fullName.append(" ");
            fullName.append(user.getMiddleName().trim());
        }
        if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) {
            if (fullName.length() > 0) fullName.append(" ");
            fullName.append(user.getLastName().trim());
        }
        return fullName.toString().trim();
    }
}