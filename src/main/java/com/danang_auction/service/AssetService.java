package com.danang_auction.service;

import com.danang_auction.exception.ForbiddenException;
import com.danang_auction.exception.NotFoundException;
import com.danang_auction.exception.ResourceNotFoundException;
import com.danang_auction.model.dto.asset.CreateAuctionDocumentDto;
import com.danang_auction.model.entity.*;
import com.danang_auction.model.entityDTO.AssetResponseDTO;
import com.danang_auction.model.entityDTO.AuctionSessionDTO;
import com.danang_auction.model.entityDTO.ImageDTO;
import com.danang_auction.model.enums.*;
import com.danang_auction.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AuctionDocumentRepository auctionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final ImageRelationRepository imageRelationRepo;
    private final AuctionSessionRepository auctionSessionRepository;
    private final AuctionSessionRepository sessionRepo;
    private final AuctionSessionService auctionSessionService;
    private final ImageService imageService;
    private final EmailService emailService;

    @Transactional
    public void deleteAsset(Long assetId, Long userId) {
        AuctionDocument doc = auctionRepository.findById(assetId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản không tồn tại"));

        if (!doc.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Không có quyền xoá tài sản này");
        }

        if (doc.getStatus() == AuctionDocumentStatus.APPROVED) {
            throw new AccessDeniedException("Tài sản đã được duyệt, không thể xoá");
        }

        imageRelationRepo.deleteByImageFkIdAndType(assetId, ImageRelationType.ASSET);

        AuctionSession session = doc.getSession();
        if (session != null && session.getStatus() == AuctionSessionStatus.UPCOMING) {
            sessionRepo.delete(session);
        }

        auctionRepository.delete(doc);
    }

    public Page<AuctionDocument> searchAssets(String keyword, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return auctionRepository.findApprovedAssets(keyword, AuctionDocumentStatus.APPROVED, pageable);
    }

    public AssetResponseDTO getAssetById(Integer id, User currentUser) {
        AuctionDocument asset = auctionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found"));

        if (asset.getStatus() != AuctionDocumentStatus.APPROVED) {
            if (currentUser == null) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }

            boolean isOwner = asset.getUser().getId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;

            if (!isOwner && !isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }

        List<Image> images = imageRelationRepo.findImagesByFkIdAndType(id.longValue(), ImageRelationType.ASSET);
        List<ImageDTO> imageDTOs = images.stream().map(image -> {
            ImageDTO dto = new ImageDTO();
            dto.setUrl(image.getUrl());
            dto.setPublicId(image.getPublicId());
            dto.setType(image.getType());
            return dto;
        }).toList();

        AuctionSession session = asset.getSession();
        AuctionSessionDTO sessionDTO = null;
        if (session != null) {
            sessionDTO = new AuctionSessionDTO();
            sessionDTO.setId(session.getId());
            sessionDTO.setTitle(session.getTitle());
            sessionDTO.setSessionCode(session.getSessionCode());
            sessionDTO.setStartTime(session.getStartTime());
            sessionDTO.setEndTime(session.getEndTime());
            sessionDTO.setStatus(session.getStatus().name());
        }

        AssetResponseDTO dto = new AssetResponseDTO();
        dto.setId(asset.getId());
        dto.setDocumentCode(asset.getDocumentCode());
        dto.setDescription(asset.getDescription());
        dto.setStartingPrice(asset.getStartingPrice());
        dto.setStepPrice(asset.getStepPrice());
        dto.setImages(imageDTOs);
        dto.setSession(sessionDTO);

        return dto;
    }

    public List<AuctionSession> reviewAsset(Long id, String action, String reason) {
        AuctionDocument asset = auctionRepository.findByIdWithUser(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tài sản không tồn tại"));

        if ("approve".equals(action)) {
            if (asset.getStartTime() == null || asset.getEndTime() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian bắt đầu và kết thúc không được để trống");
            }

            if (asset.getSession() != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tài sản này đã được gắn với một phiên đấu giá.");
            }

            validateAuctionTime(asset.getStartTime(), asset.getEndTime());

            asset.setStatus(AuctionDocumentStatus.APPROVED);
            auctionRepository.save(asset);

            AuctionSession session = auctionSessionService.createSessionFromApprovedAsset(asset);
            asset.setSession(session);
            auctionRepository.save(asset);

            emailService.sendUserVerificationSuccess(asset.getUser().getEmail());

            return auctionSessionRepository.findByStatusOrderByStartTimeAsc(AuctionSessionStatus.UPCOMING);
        }

        if ("reject".equals(action)) {
            asset.setStatus(AuctionDocumentStatus.REJECTED);
            asset.setRejectedReason(reason != null ? reason : "Không rõ lý do");
            auctionRepository.save(asset);

            emailService.sendUserRejectionNotice(
                    asset.getUser().getEmail(),
                    asset.getRejectedReason()
            );

            return Collections.emptyList();
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hành động không hợp lệ.");
    }

    public List<AuctionDocument> getAssetsByStatus(String status) {
        return auctionRepository.findByStatus(AuctionDocumentStatus.valueOf(status.toUpperCase()));
    }

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

        return auctionRepository.save(doc);
    }

    public Map<String, Object> uploadAssetImages(Integer assetId, List<MultipartFile> files, Long userId, String role) {
        AuctionDocument asset = auctionRepository.findById(assetId)
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
                image.setSize(Math.toIntExact(file.getSize()));

                Image savedImage = imageRepository.save(image);

                ImageRelation relation = new ImageRelation(savedImage, assetId.longValue(), ImageRelationType.ASSET);
                imageRelationRepo.save(relation);

                Map<String, Object> res = new HashMap<>();
                res.put("id", savedImage.getId());
                res.put("url", savedImage.getUrl());
                res.put("publicId", savedImage.getPublicId());

                responses.add(res);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi upload ảnh: " + e.getMessage(), e);
            }
        }

        if (asset.getStatus() == AuctionDocumentStatus.PENDING_CREATE) {
            asset.setStatus(AuctionDocumentStatus.PENDING_APPROVAL);
            auctionRepository.save(asset);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Upload thành công");
        result.put("total", responses.size());
        result.put("images", responses);

        return result;
    }

    private void validateAuctionType(AuctionType type, String role) {
        if (role == null || role.isBlank()) {
            throw new RuntimeException("Vai trò người dùng không hợp lệ (null hoặc trống)");
        }

        UserRole userRole = UserRole.valueOf(role.toUpperCase());
        if (userRole != UserRole.ORGANIZER && type == AuctionType.PRIVATE) {
            throw new RuntimeException("Người dùng không có quyền tạo đấu giá private.");
        }
    }

    private void validateAuctionTime(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian bắt đầu và kết thúc không được để trống");
        }

        LocalDateTime now = LocalDateTime.now();
        if (!startTime.isAfter(now)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian bắt đầu phải sau thời gian hiện tại");
        }

        if (!endTime.isAfter(startTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian kết thúc phải sau thời gian bắt đầu");
        }
    }
}
