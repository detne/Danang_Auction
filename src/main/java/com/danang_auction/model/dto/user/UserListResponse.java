package com.danang_auction.model.dto.user;

import lombok.Data;

@Data
public class UserListResponse {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;
    private boolean verified;
    private String status;
}