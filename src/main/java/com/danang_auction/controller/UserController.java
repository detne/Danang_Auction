package com.danang_auction.controller;

import com.danang_auction.dto.ProfileResponseDTO;
import com.danang_auction.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/profile/{username}")
    public ProfileResponseDTO getProfile(@PathVariable String username) {
        return userService.getUserProfile(username);
    }
}