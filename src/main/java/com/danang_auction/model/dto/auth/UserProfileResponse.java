package com.danang_auction.model.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {
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

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Date of birth is required")
    private String dob;

    private String province;
    private String district;
    private String ward;

    @NotBlank(message = "Detailed address is required")
    private String detailedAddress;

    private String identityIssuePlace;
    private String identityIssueDate;

    private String accountType;
    private String role;
    private Boolean verified;
    private String status;

    // Getters và Setters (đã được sinh bởi Lombok)
}