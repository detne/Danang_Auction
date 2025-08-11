package com.danang_auction.model.dto.user;

// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    // Thông tin cá nhân cơ bản
    private String username;

    private String email;

    private String phoneNumber;

    private String firstName;

    private String middleName;
    private String lastName;

    // Tên đầy đủ (kết hợp firstName, middleName, lastName)
    private String fullName;

    private String gender;

    private String dob;

    // Địa chỉ
    private String province;
    private String district;
    private String ward;

    private String detailedAddress;

    // Địa chỉ đầy đủ (kết hợp tất cả)
    private String fullAddress;

    // Thông tin CCCD/CMND
    private String identityNumber; // Số CCCD/CMND (đã mã hóa)
    private String identityIssuePlace;
    private String identityIssueDate;
    private String identityFrontUrl; // Ảnh mặt trước CCCD
    private String identityBackUrl; // Ảnh mặt sau CCCD

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

    // Nếu Lombok không hoạt động, thêm những getter/setter này vào
    // UserProfileResponse class:

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFullAddress() {
        return fullAddress;
    }

    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }

    // Hoặc thêm tất cả getter/setter cho các field khác nếu cần
    public String getIdentityNumber() {
        return identityNumber;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public String getIdentityFrontUrl() {
        return identityFrontUrl;
    }

    public void setIdentityFrontUrl(String identityFrontUrl) {
        this.identityFrontUrl = identityFrontUrl;
    }

    public String getIdentityBackUrl() {
        return identityBackUrl;
    }

    public void setIdentityBackUrl(String identityBackUrl) {
        this.identityBackUrl = identityBackUrl;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankAccountHolder() {
        return bankAccountHolder;
    }

    public void setBankAccountHolder(String bankAccountHolder) {
        this.bankAccountHolder = bankAccountHolder;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Boolean getPhoneVerified() {
        return phoneVerified;
    }

    public void setPhoneVerified(Boolean phoneVerified) {
        this.phoneVerified = phoneVerified;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(String verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}