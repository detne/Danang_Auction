package com.danang_auction.service;

import com.danang_auction.exception.NotFoundException;
import com.danang_auction.model.dto.user.UserListResponse;
import com.danang_auction.model.dto.user.UserProfileResponse;
import com.danang_auction.model.dto.user.UserVerifyRequest;
import com.danang_auction.model.entity.User;
import com.danang_auction.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    // Lấy danh sách tất cả người dùng
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng với ID: " + id));
    }

    // Xác minh người dùng
    @Transactional
    public void verifyUser(Long id, UserVerifyRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        // Nếu user đã được xác minh thì không cho xác minh lại
        if (user.isVerified()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User đã xác minh");
        }

        String status = request.getStatus().toLowerCase();

        switch (status) {
            case "verified": // ✅ Thành công
                user.setVerified(true);
                user.setVerifiedAt(LocalDateTime.now());
                user.setRejectedReason(null);

                // Gửi mail thông báo xác minh thành công
                emailService.sendUserVerificationSuccess(user.getEmail());
                break;

            case "rejected": // ❌ Thất bại
                if (request.getReason() == null || request.getReason().isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phải nhập lý do từ chối");
                }
                user.setVerified(false);
                user.setVerifiedAt(null);
                user.setRejectedReason(request.getReason());

                // Gửi mail thông báo xác minh thất bại
                emailService.sendUserRejectionNotice(user.getEmail(), request.getReason());
                break;

            case "update-cccd": // 📝 Yêu cầu cập nhật lại CCCD
                if (request.getReason() == null || request.getReason().isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phải nhập lý do yêu cầu cập nhật CCCD");
                }
                user.setVerified(false);
                user.setVerifiedAt(null);
                user.setRejectedReason(request.getReason());

                // Gửi mail yêu cầu người dùng cập nhật CCCD
                emailService.sendIdentityVerifyRequest(user.getEmail(), request.getReason());
                break;

            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Trạng thái không hợp lệ (verified, rejected, update-cccd)");
        }

        userRepository.save(user);
    }

    // Lấy danh sách người dùng theo trạng thái xác minh
    public List<UserListResponse> getUsersByVerificationStatus(String status) {
        List<User> users;

        // Lấy danh sách user theo trạng thái
        switch (status.toLowerCase()) {
            case "pending":
                users = userRepository.findPendingUsers();
                break;
            case "approved":
                users = userRepository.findApprovedUsers();
                break;
            case "rejected":
                users = userRepository.findRejectedUsers();
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ");
        }

        // Map sang DTO UserListResponse để trả về thông tin cơ bản
        return users.stream().map(user -> {
            UserListResponse dto = new UserListResponse();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setPhoneNumber(user.getPhoneNumber());
            dto.setRole(user.getRole() != null ? user.getRole().toString() : null);
            dto.setVerified(user.isVerified());
            dto.setStatus(user.getStatus() != null ? user.getStatus().toString() : null);
            return dto;
        }).toList();
    }

    // Lấy thông tin người dùng theo ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));
    }

    // Chuyển đổi User sang UserProfileResponse DTO
    private UserProfileResponse mapToUserProfileResponse(User user) {
        UserProfileResponse dto = new UserProfileResponse();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setFirstName(user.getFirstName());
        dto.setMiddleName(user.getMiddleName());
        dto.setLastName(user.getLastName());
        dto.setGender(user.getGender() != null ? user.getGender().toString() : null);
        dto.setDob(user.getDob() != null ? user.getDob().toString() : null);

        dto.setProvince(user.getProvince());
        dto.setDistrict(user.getDistrict());
        dto.setWard(user.getWard());
        dto.setDetailedAddress(user.getDetailedAddress());

        dto.setIdentityNumber(user.getIdentityNumber());
        dto.setIdentityIssueDate(user.getIdentityIssueDate() != null ? user.getIdentityIssueDate().toString() : null);
        dto.setIdentityIssuePlace(user.getIdentityIssuePlace());

        dto.setBankAccountNumber(user.getBankAccountNumber());
        dto.setBankName(user.getBankName());
        dto.setBankAccountHolder(user.getBankAccountHolder());

        dto.setAccountType(user.getAccountType() != null ? user.getAccountType().toString() : null);
        dto.setRole(user.getRole() != null ? user.getRole().toString() : null);
        dto.setVerified(user.isVerified());
        dto.setRejectedReason(user.getRejectedReason());
        dto.setStatus(user.getStatus() != null ? user.getStatus().toString() : null);

        // Ảnh CCCD
        dto.setIdentityFrontUrl(user.getIdentityFrontUrl());
        dto.setIdentityBackUrl(user.getIdentityBackUrl());

        return dto;
    }

    public UserProfileResponse getUserProfileById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));
        return mapToUserProfileResponse(user);
    }

}