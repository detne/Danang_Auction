package com.danang_auction.model.dto.auth;

import com.danang_auction.model.enums.AccountType;
import com.danang_auction.model.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    // Thông tin đăng nhập
    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 50, message = "Username phải từ 3-50 ký tự")
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password phải ít nhất 6 ký tự")
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    // Thông tin cá nhân
    @Pattern(regexp = "^[0-9+\\-\\s()]+$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @NotBlank(message = "Họ không được để trống")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Tên không được để trống")
    private String lastName;

    private Gender gender;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private LocalDate dob;

    // Địa chỉ
    private String province;
    private String district;
    private String ward;
    private String detailedAddress;

    // CMND/CCCD
    @NotBlank(message = "Số CMND/CCCD không được để trống")
    @Pattern(regexp = "^[0-9]{9,12}$", message = "Số CMND/CCCD không hợp lệ")
    private String identityNumber;

    @Past(message = "Ngày cấp CMND/CCCD phải là ngày trong quá khứ")
    private LocalDate identityIssueDate;

    private String identityIssuePlace;

    // Tài khoản ngân hàng
    private String bankAccountNumber;
    private String bankName;
    private String bankAccountHolder;

    // Loại tài khoản
    @NotNull(message = "Loại tài khoản không được để trống")
    private AccountType accountType;
}