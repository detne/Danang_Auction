package com.danang_auction.model.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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

    private String identityIssuePlace;
    private String identityIssueDate;

    private String accountType;
    private String role;
    private Boolean verified;
    private String status;

    // Getters và Setters
}
