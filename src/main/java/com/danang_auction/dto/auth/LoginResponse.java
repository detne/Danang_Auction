package com.danang_auction.model.dto.auth;

import com.danang_auction.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private LocalDateTime expiresAt;
    private UserInfo user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String role;
        private String status;
        private String fullName;

        public UserInfo(Integer id, String username, UserRole role, String status, String fullName) {
            this.id = id != null ? id.longValue() : null;
            this.username = username;
            this.role = role != null ? role.name() : null;
            this.status = status;
            this.fullName = fullName;
        }
    }
}
