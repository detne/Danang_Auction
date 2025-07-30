package com.danang_auction.model.dto.user;

import lombok.Data;

@Data
public class UserProfileResponse {
    private String username;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String middleName;
    private String lastName;
    private String gender;
    private String dob;

    private String province;
    private String district;
    private String ward;
    private String detailedAddress;

    private String identityNumber;
    private String identityIssueDate;
    private String identityIssuePlace;

    private String bankAccountNumber;
    private String bankName;
    private String bankAccountHolder;

    private String accountType;
    private String role;
    private boolean verified;
    private String rejectedReason;
    private String status;

    // Ảnh CCCD
    private String identityFrontUrl;
    private String identityBackUrl;
}