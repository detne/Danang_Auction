package com.danang_auction.model.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class ResetPasswordRequest {

    public ResetPasswordRequest() {
        // Bắt buộc để Spring binding JSON → object
    }

    @NotBlank(message = "Email không được để trống")
    @JsonProperty("email")
    private String email;

    @NotBlank(message = "OTP không được để trống")
    @JsonProperty("otp")
    private String otp;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @JsonProperty("newPassword")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    @JsonProperty("confirmPassword")
    private String confirmPassword;

    // Getter & Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}