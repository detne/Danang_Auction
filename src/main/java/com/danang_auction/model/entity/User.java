package com.danang_auction.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "gender")
    private String gender;

    @Column(name = "dob")
    private LocalDateTime dob;

    @Column(name = "province")
    private String province;

    @Column(name = "district")
    private String district;

    @Column(name = "ward")
    private String ward;

    @Column(name = "detailed_address")
    private String detailedAddress;

    @Column(name = "identity_number")
    private String identityNumber;

    @Column(name = "identity_issue_date")
    private LocalDateTime identityIssueDate;

    @Column(name = "identity_issue_place")
    private String identityIssuePlace;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_account_holder")
    private String bankAccountHolder;

    @Column(name = "account_type")
    private String accountType;

    @Column(name = "role")
    private String role;

    @Column(name = "verified")
    private Boolean verified;

    @Column(name = "status")
    private String status;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "reset_token_expiry_datetime")
    private LocalDateTime resetTokenExpiryDatetime;
}