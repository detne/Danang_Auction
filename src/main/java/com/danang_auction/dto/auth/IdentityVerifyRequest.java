package com.danang_auction.model.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IdentityVerifyRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Reason is required")
    private String reason; // Lý do yêu cầu xác minh lại (ví dụ: "Ảnh không rõ", "Không đúng định dạng")
}