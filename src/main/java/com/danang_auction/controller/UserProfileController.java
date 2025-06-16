package com.danang_auction.controller;

import com.danang_auction.service.UserProfileService;
import com.danang_auction.util.JwtTokenProvider;
import com.danang_auction.model.dto.auth.UserProfileResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserProfileController {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserProfileService userProfileService;

    public UserProfileController(JwtTokenProvider jwtTokenProvider, UserProfileService userProfileService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userProfileService = userProfileService;
    }

    private Integer getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        return jwtTokenProvider.getUserIdFromToken(token).intValue();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        try {
            Integer userId = getUserIdFromRequest(request);
            return userProfileService.getUserProfile(userId)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UserProfileResponse userProfileRequest,
            HttpServletRequest request) {
        try {
            Integer userId = getUserIdFromRequest(request);
            UserProfileResponse updatedProfile = userProfileService.updateProfile(userId, userProfileRequest);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}