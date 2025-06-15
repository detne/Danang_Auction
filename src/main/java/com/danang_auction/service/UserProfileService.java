package com.danang_auction.service;

import com.danang_auction.model.dto.auth.UserProfileResponse;
import com.danang_auction.model.entity.User;
import com.danang_auction.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {

    private final UserRepository userRepository;

    public UserProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<UserProfileResponse> getUserProfile(Integer userId) {
        Optional<User> userOpt = userRepository.findById(Long.valueOf(userId));
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        User user = userOpt.get();

        UserProfileResponse dto = new UserProfileResponse();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setFirstName(user.getFirstName());
        dto.setMiddleName(user.getMiddleName());
        dto.setLastName(user.getLastName());
        dto.setGender(String.valueOf(user.getGender()));
        dto.setDob(user.getDob() != null ? user.getDob().toString() : null);

        dto.setProvince(user.getProvince());
        dto.setDistrict(user.getDistrict());
        dto.setWard(user.getWard());
        dto.setDetailedAddress(user.getDetailedAddress());

        dto.setIdentityIssuePlace(user.getIdentityIssuePlace());
        dto.setIdentityIssueDate(user.getIdentityIssueDate() != null ? user.getIdentityIssueDate().toString() : null);

        dto.setAccountType(String.valueOf(user.getAccountType()));
        dto.setRole(String.valueOf(user.getRole()));
        dto.setVerified(user.getVerified());
        dto.setStatus(String.valueOf(user.getStatus()));

        return Optional.of(dto);
    }
}
