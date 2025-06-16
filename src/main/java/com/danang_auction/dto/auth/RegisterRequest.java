package com.danang_auction.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String middleName;
    private String lastName;
    private String gender;
    private LocalDateTime dob;
    private String province;
    private String district;
    private String ward;
    private String detailedAddress;
    private String identityNumber;
    private LocalDateTime identityIssueDate;
    private String identityIssuePlace;
    private String bankAccountNumber;
    private String bankName;
    private String bankAccountHolder;
    private String accountType;
}