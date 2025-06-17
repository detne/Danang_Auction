package com.danang_auction.service;

import com.danang_auction.dto.ProfileResponseDTO;
import com.danang_auction.model.entity.User;
import com.danang_auction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public ProfileResponseDTO getUserProfile(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        return new ProfileResponseDTO(
                user.getId(),
                user.getUsername(),
                buildFullName(user),
                user.getEmail(),
                user.getPhoneNumber()
        );
    }

    private String buildFullName(User user) {
        StringBuilder fullName = new StringBuilder();
        if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) {
            fullName.append(user.getFirstName().trim());
        }
        if (user.getMiddleName() != null && !user.getMiddleName().trim().isEmpty()) {
            if (fullName.length() > 0) fullName.append(" ");
            fullName.append(user.getMiddleName().trim());
        }
        if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) {
            if (fullName.length() > 0) fullName.append(" ");
            fullName.append(user.getLastName().trim());
        }
        return fullName.toString().trim();
    }
}