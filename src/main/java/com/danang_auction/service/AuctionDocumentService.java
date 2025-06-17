package com.danang_auction.service;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.enums.AccountType;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.model.enums.AuctionType;
import com.danang_auction.model.dto.asset.CreateAuctionDocumentDto;
import com.danang_auction.repository.AuctionDocumentRepository;
import com.danang_auction.repository.CategoryRepository;
import com.danang_auction.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.danang_auction.model.enums.UserRole;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuctionDocumentService {

    private final AuctionDocumentRepository auctionDocumentRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public AuctionDocument create(CreateAuctionDocumentDto dto, Long userId, String role) {
        // Kiểm tra quyền nếu cần
        validateAuctionType(dto.getAuctionType(), role);

        AuctionDocument doc = new AuctionDocument();
        doc.setDocumentCode(dto.getDocumentCode());
        doc.setDepositAmount(dto.getDepositAmount());
        doc.setIsDepositRequired(dto.getIsDepositRequired() != null ? dto.getIsDepositRequired() : true);
        doc.setStatus(AuctionDocumentStatus.PENDING_CREATE);
        doc.setAuctionType(
                AccountType.ORGANIZATION.equals(role) ?
                        (dto.getAuctionType() != null ? dto.getAuctionType() : AuctionType.PUBLIC) :
                        AuctionType.PUBLIC
        );
        doc.setStartingPrice(dto.getStartingPrice());
        doc.setStepPrice(dto.getStepPrice());
        doc.setRegisteredAt(dto.getRegisteredAt());
        doc.setStartTime(dto.getStartTime());
        doc.setEndTime(dto.getEndTime());
        doc.setDescription(dto.getDescription());

        doc.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại")));

        doc.setCategory(categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại")));

        return auctionDocumentRepository.save(doc);
    }

    private void validateAuctionType(AuctionType type, String role) {
        if (role == null || role.isBlank()) {
            throw new RuntimeException("Vai trò người dùng không hợp lệ (null hoặc trống)");
        }

        UserRole userRole = UserRole.valueOf(role.toUpperCase()); // nếu bạn dùng Enum viết hoa
        if (userRole != UserRole.ORGANIZER && type == AuctionType.PRIVATE) {
            throw new RuntimeException("Người dùng không có quyền tạo đấu giá private.");
        }
    }
}
