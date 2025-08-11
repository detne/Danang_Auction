package com.danang_auction.controller;

import com.danang_auction.model.dto.auth.*;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse loginResponse = authService.login(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đăng nhập thành công");
            response.put("data", loginResponse);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(
            @Valid @ModelAttribute RegisterRequest dto,
            @RequestPart("files") List<MultipartFile> files) {
        try {
            String message = authService.register(dto, files);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", message);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/forget-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgetPasswordRequest request) {
        authService.processForgotPassword(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Nếu email hợp lệ, mã OTP sẽ được gửi trong vài phút"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đặt lại mật khẩu thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            authService.changePassword(userDetails.getId(), request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đổi mật khẩu thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PutMapping("/identity/verify")
    public ResponseEntity<?> requestIdentityVerify(@Valid @RequestBody IdentityVerifyRequest request) {
        try {
            String message = authService.requestIdentityVerify(request.getEmail(), request.getReason());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", message);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            // Lấy userId trực tiếp từ SecurityContext
            Long userId = userDetails.getId();

            Optional<UserProfileResponse> profileOpt = authService.getUserProfile(userId);

            if (profileOpt.isPresent()) {
                UserProfileResponse profile = profileOpt.get();

                // Tạo response với thông tin chi tiết
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Lấy thông tin thành công");

                // Tổ chức dữ liệu theo các tab như trong giao diện
                Map<String, Object> data = new HashMap<>();

                // Tab: Thông tin cá nhân
                Map<String, Object> personalInfo = new HashMap<>();
                personalInfo.put("fullName", profile.getFullName());
                personalInfo.put("username", profile.getUsername());
                personalInfo.put("email", profile.getEmail());
                personalInfo.put("phoneNumber", profile.getPhoneNumber());
                personalInfo.put("gender", profile.getGender());
                personalInfo.put("dob", profile.getDob());
                personalInfo.put("fullAddress", profile.getFullAddress());
                personalInfo.put("province", profile.getProvince());
                personalInfo.put("district", profile.getDistrict());
                personalInfo.put("ward", profile.getWard());
                personalInfo.put("detailedAddress", profile.getDetailedAddress());
                personalInfo.put("emailVerified", profile.getEmailVerified());
                personalInfo.put("phoneVerified", profile.getPhoneVerified());

                // Tab: Thông tin nhà phân đăng ký (CCCD/CMND)
                Map<String, Object> identityInfo = new HashMap<>();
                identityInfo.put("identityNumber", profile.getIdentityNumber());
                identityInfo.put("identityIssuePlace", profile.getIdentityIssuePlace());
                identityInfo.put("identityIssueDate", profile.getIdentityIssueDate());
                identityInfo.put("identityFrontUrl", profile.getIdentityFrontUrl());
                identityInfo.put("identityBackUrl", profile.getIdentityBackUrl());

                // Tab: Tài khoản ngân hàng
                Map<String, Object> bankInfo = new HashMap<>();
                bankInfo.put("bankName", profile.getBankName());
                bankInfo.put("bankAccountNumber", profile.getBankAccountNumber());
                bankInfo.put("bankAccountHolder", profile.getBankAccountHolder());
                bankInfo.put("balance", profile.getBalance());

                // Tab: Đổi mật khẩu (chỉ trả về trạng thái)
                Map<String, Object> securityInfo = new HashMap<>();
                securityInfo.put("canChangePassword", true);
                securityInfo.put("lastPasswordChange", null); // Có thể thêm field này vào User entity

                // Thông tin tài khoản tổng quản
                Map<String, Object> accountInfo = new HashMap<>();
                accountInfo.put("accountType", profile.getAccountType());
                accountInfo.put("role", profile.getRole());
                accountInfo.put("verified", profile.getVerified());
                accountInfo.put("status", profile.getStatus());
                accountInfo.put("createdAt", profile.getCreatedAt());
                accountInfo.put("updatedAt", profile.getUpdatedAt());
                accountInfo.put("verifiedAt", profile.getVerifiedAt());

                // Gom tất cả vào data
                data.put("personalInfo", personalInfo);
                data.put("identityInfo", identityInfo);
                data.put("bankInfo", bankInfo);
                data.put("securityInfo", securityInfo);
                data.put("accountInfo", accountInfo);

                // Cũng giữ lại format cũ để tương thích
                data.put("profile", profile);

                response.put("data", data);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                        "success", false,
                        "message", "Không tìm thấy thông tin người dùng"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Lỗi xác thực: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> fieldErrors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Dữ liệu không hợp lệ",
                "errors", fieldErrors));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authorization header không hợp lệ"));
        }
        String token = authHeader.replace("Bearer ", "").trim();
        try {
            authService.logout(token);
            return ResponseEntity.ok(Map.of("success", true, "message", "Đăng xuất thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}