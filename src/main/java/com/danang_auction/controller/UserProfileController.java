package com.danang_auction.controller;

import com.danang_auction.service.UserProfileService;
import com.danang_auction.util.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class UserProfileController {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserProfileService userProfileService;

    public UserProfileController(JwtTokenProvider jwtTokenProvider, UserProfileService userProfileService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userProfileService = userProfileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(token);

        return userProfileService.getUserProfile(userId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }

}
