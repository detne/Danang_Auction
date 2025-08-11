package com.danang_auction.model.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {
    // Thông tin cá nhân cơ bản
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "First name is required")
    private String firstName;

    private String middleName;
    private String lastName;
    
    // Tên đầy đủ (kết hợp firstName, middleName, lastName)
    private String fullName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Date of birth is required")
    private String dob;

    // Địa chỉ
    private String province;
    private String district;
    private String ward;

    @NotBlank(message = "Detailed address is required")
    private String detailedAddress;
    
    // Địa chỉ đầy đủ (kết hợp tất cả)
    private String fullAddress;

    // Thông tin CCCD/CMND
    private String identityNumber; // Số CCCD/CMND (đã mã hóa)
    private String identityIssuePlace;
    private String identityIssueDate;
    private String identityFrontUrl; // Ảnh mặt trước CCCD
    private String identityBackUrl;  // Ảnh mặt sau CCCD

    // Thông tin ngân hàng
    private String bankName;
    private String bankAccountNumber;
    private String bankAccountHolder;

    // Thông tin tài khoản
    private String accountType;
    private String role;
    private Boolean verified;
    private String status;
    private Long balance;
    
    // Trạng thái xác thực
    private Boolean emailVerified;
    private Boolean phoneVerified;
    
    // Thời gian
    private String createdAt;
    private String updatedAt;
    private String verifiedAt;

    // Getters và Setters (đã được sinh bởi Lombok)
}