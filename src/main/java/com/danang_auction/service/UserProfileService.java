package com.danang_auction.service;

import com.danang_auction.model.dto.auth.UserProfileResponse;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.enums.Gender;
import com.danang_auction.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public UserProfileResponse updateProfile(Integer userId, UserProfileResponse userProfileRequest) {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Cập nhật các trường từ request
        user.setEmail(userProfileRequest.getEmail());
        user.setPhoneNumber(userProfileRequest.getPhoneNumber());
        user.setFirstName(userProfileRequest.getFirstName());
        user.setMiddleName(userProfileRequest.getMiddleName());
        user.setLastName(userProfileRequest.getLastName());
        if (userProfileRequest.getGender() != null) {
            user.setGender(Gender.valueOf(userProfileRequest.getGender()));
        }
        if (userProfileRequest.getDob() != null) {
            user.setDob(LocalDate.parse(userProfileRequest.getDob()));
        }
        user.setProvince(userProfileRequest.getProvince());
        user.setDistrict(userProfileRequest.getDistrict());
        user.setWard(userProfileRequest.getWard());
        user.setDetailedAddress(userProfileRequest.getDetailedAddress());
        user.setIdentityIssuePlace(userProfileRequest.getIdentityIssuePlace());
        if (userProfileRequest.getIdentityIssueDate() != null) {
            user.setIdentityIssueDate(LocalDate.parse(userProfileRequest.getIdentityIssueDate()));
        }

        // Lưu và ánh xạ lại thành DTO
        User updatedUser = userRepository.save(user);
        return mapToUserProfileResponse(updatedUser);
    }

    private UserProfileResponse mapToUserProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setFirstName(user.getFirstName());
        response.setMiddleName(user.getMiddleName());
        response.setLastName(user.getLastName());
        response.setGender(String.valueOf(user.getGender()));
        response.setDob(user.getDob() != null ? user.getDob().toString() : null);

        response.setProvince(user.getProvince());
        response.setDistrict(user.getDistrict());
        response.setWard(user.getWard());
        response.setDetailedAddress(user.getDetailedAddress());

        response.setIdentityIssuePlace(user.getIdentityIssuePlace());
        response.setIdentityIssueDate(user.getIdentityIssueDate() != null ? user.getIdentityIssueDate().toString() : null);

        response.setAccountType(String.valueOf(user.getAccountType()));
        response.setRole(String.valueOf(user.getRole()));
        response.setVerified(user.getVerified());
        response.setStatus(String.valueOf(user.getStatus()));
        return response;
    }
}