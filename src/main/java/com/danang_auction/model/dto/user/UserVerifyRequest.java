package com.danang_auction.model.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserVerifyRequest {
    @NotBlank(message = "Trạng thái xác minh không được để trống")
    private String status; // "verified" hoặc "rejected"

    private String reason; // chỉ required nếu status = "rejected"
}