package com.danang_auction.model.dto.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}