package com.danang_auction.service;

import com.danang_auction.exception.ForbiddenException;
import com.danang_auction.exception.NotFoundException;
import com.danang_auction.model.dto.asset.CreateAuctionDocumentDto;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.Image;
import com.danang_auction.model.entity.ImageRelation;
import com.danang_auction.model.enums.*;
import com.danang_auction.repository.AuctionDocumentRepository;
import com.danang_auction.repository.CategoryRepository;
import com.danang_auction.repository.ImageRelationRepository;
import com.danang_auction.repository.ImageRepository;
import com.danang_auction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuctionDocumentService {

    private final AuctionDocumentRepository auctionDocumentRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final ImageRelationRepository imageRelationRepository;
    private final ImageService imageService;

    /**
     * Tạo mới tài sản đấu giá
     */
    @Transactional
    public AuctionDocument create(CreateAuctionDocumentDto dto, Long userId, String role) {
        validateAuctionType(dto.getAuctionType(), role);

        AuctionDocument doc = new AuctionDocument();
        doc.setDocumentCode(dto.getDocumentCode());
        doc.setDepositAmount(dto.getDepositAmount());
        doc.setIsDepositRequired(dto.getIsDepositRequired() != null ? dto.getIsDepositRequired() : true);
        doc.setStatus(AuctionDocumentStatus.PENDING_CREATE);
        doc.setAuctionType(
                AccountType.ORGANIZATION.name().equalsIgnoreCase(role)
                        ? (dto.getAuctionType() != null ? dto.getAuctionType() : AuctionType.PUBLIC)
                        : AuctionType.PUBLIC
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

    /**
     * Upload nhiều ảnh cho tài sản đấu giá
     */
    @Transactional
    public Map<String, Object> uploadAssetImages(Long assetId, List<MultipartFile> files, Long userId, String role) {
        AuctionDocument asset = auctionDocumentRepository.findById(assetId)
                .orElseThrow(() -> new NotFoundException("Tài sản không tồn tại"));

        if (!UserRole.ADMIN.name().equalsIgnoreCase(role) && !asset.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền upload ảnh cho tài sản này");
        }

        List<Map<String, Object>> responses = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String folder = "asset/" + asset.getUser().getId();
                Map<String, Object> uploadResult = imageService.upload(file, folder);

                Image image = new Image();
                image.setUrl((String) uploadResult.get("secure_url"));
                image.setPublicId((String) uploadResult.get("public_id"));
                image.setType(file.getContentType());
                image.setSize((int) file.getSize());

                Image savedImage = imageRepository.save(image);

                ImageRelation relation = new ImageRelation(savedImage, assetId, ImageRelationType.ASSET);
                imageRelationRepository.save(relation);

                Map<String, Object> res = new HashMap<>();
                res.put("id", savedImage.getId());
                res.put("url", savedImage.getUrl());
                res.put("publicId", savedImage.getPublicId());

                responses.add(res);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi upload ảnh: " + e.getMessage(), e);
            }
        }

        // Nếu tài sản ở trạng thái khởi tạo → chuyển sang chờ duyệt
        if (asset.getStatus() == AuctionDocumentStatus.PENDING_CREATE) {
            asset.setStatus(AuctionDocumentStatus.PENDING_APPROVAL);
            auctionDocumentRepository.save(asset);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Upload thành công");
        result.put("total", responses.size());
        result.put("images", responses);

        return result;
    }

    /**
     * Kiểm tra quyền tạo loại đấu giá
     */
    private void validateAuctionType(AuctionType type, String role) {
        if (role == null || role.isBlank()) {
            throw new RuntimeException("Vai trò người dùng không hợp lệ (null hoặc trống)");
        }

        UserRole userRole = UserRole.valueOf(role.toUpperCase());
        if (userRole != UserRole.ORGANIZER && type == AuctionType.PRIVATE) {
            throw new RuntimeException("Người dùng không có quyền tạo đấu giá private.");
        }
    }
}
