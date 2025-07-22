package com.danang_auction.service;

import com.danang_auction.exception.ForbiddenException;
import com.danang_auction.exception.NotFoundException;
import com.danang_auction.exception.ResourceNotFoundException;
import com.danang_auction.model.dto.document.AuctionDocumentDTO;
import com.danang_auction.model.dto.document.AuctionDocumentDetailDTO;
import com.danang_auction.model.dto.document.CreateAuctionDocumentDTO;
import com.danang_auction.model.dto.document.UpdateAuctionDocumentDTO;
import com.danang_auction.model.dto.image.CloudinaryUploadResponse;
import com.danang_auction.model.dto.image.ImageDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import com.danang_auction.model.entity.*;
import com.danang_auction.model.enums.*;
import com.danang_auction.repository.*;
import com.danang_auction.security.CustomUserDetails;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuctionDocumentService {

    private final AuctionDocumentRepository auctionDocumentRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final ImageRelationRepository imageRelationRepository;
    private final AuctionSessionRepository sessionRepository;
    private final AuctionSessionService auctionSessionService;
    private final ImageService imageService;
    private final EmailService emailService;

    @Transactional
    public void deleteAsset(Long assetId, Long userId) {
        AuctionDocument doc = auctionDocumentRepository.findById(assetId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản không tồn tại"));

        if (!doc.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Không có quyền xoá tài sản này");
        }

        if (doc.getStatus() == AuctionDocumentStatus.APPROVED) {
            throw new IllegalStateException("Tài sản đã duyệt không thể xoá");
        }

        imageRelationRepository.deleteByImageFkIdAndType(assetId, ImageRelationType.ASSET);

        AuctionSession session = doc.getSession();
        if (session != null && session.getStatus() == AuctionSessionStatus.UPCOMING) {
            sessionRepository.delete(session);
        }

        auctionDocumentRepository.delete(doc);
    }

    public Page<AuctionDocument> searchAssets(String keyword, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return auctionDocumentRepository.findApprovedAssets(AuctionDocumentStatus.APPROVED, keyword, pageable);
    }

    public AuctionDocumentDetailDTO getAssetById(Integer id, User currentUser) {
        AuctionDocument asset = auctionDocumentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found"));

        // Nếu chưa được duyệt → chỉ chủ sở hữu hoặc admin mới được xem
        if (asset.getStatus() != AuctionDocumentStatus.APPROVED) {
            if (currentUser == null)
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");

            boolean isOwner = asset.getUser().getId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;

            if (!isOwner && !isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }

        List<Image> images = imageRelationRepository.findImagesByFkIdAndType(id, ImageRelationType.ASSET);
        List<ImageDTO> imageDTOs = images.stream().map(image -> {
            ImageDTO dto = new ImageDTO();
            dto.setUrl(image.getUrl());
            dto.setPublicId(image.getPublicId());
            dto.setType(image.getType());
            return dto;
        }).toList();

        AuctionSession session = asset.getSession();
        AuctionSessionSummaryDTO sessionDTO = null;
        if (session != null) {
            sessionDTO = new AuctionSessionSummaryDTO();
            sessionDTO.setId(session.getId());
            sessionDTO.setTitle(session.getTitle());
            sessionDTO.setSessionCode(session.getSessionCode());
            sessionDTO.setStartTime(session.getStartTime());
            sessionDTO.setEndTime(session.getEndTime());
            sessionDTO.setStatus(session.getStatus().name());
        }

        AuctionDocumentDetailDTO dto = new AuctionDocumentDetailDTO();
        dto.setId(asset.getId());
        dto.setDocumentCode(asset.getDocumentCode());
        dto.setDescription(asset.getDescription());
        dto.setStartingPrice(asset.getStartingPrice());
        dto.setStepPrice(asset.getStepPrice());
        dto.setImages(imageDTOs);
        dto.setSession(sessionDTO);

        return dto;
    }

    public AuctionSessionSummaryDTO reviewAsset(Long id, String action, String reason) {
        AuctionDocument asset = auctionDocumentRepository.findByIdWithUser(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tài sản không tồn tại"));

        if ("approve".equals(action)) {
            if (asset.getStartTime() == null || asset.getEndTime() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Thời gian bắt đầu và kết thúc không được để trống");
            }

            if (asset.getSession() != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Tài sản này đã được gắn với một phiên đấu giá.");
            }

            validateAuctionTime(asset.getStartTime(), asset.getEndTime());

            asset.setStatus(AuctionDocumentStatus.APPROVED);
            auctionDocumentRepository.save(asset);

            AuctionSession session = auctionSessionService.createSessionFromApprovedAsset(asset);
            asset.setSession(session);
            auctionDocumentRepository.save(asset); // cập nhật lại tài sản với session

            String thumbnailUrl = null;
            if (asset.getImageRelations() != null && !asset.getImageRelations().isEmpty()) {
                // Lấy image đầu tiên
                thumbnailUrl = asset.getImageRelations().get(0).getImage().getUrl();
            }
            // Gửi email
            String email = asset.getUser().getEmail();
            if (email != null && !email.isBlank()) {
                try {
                    emailService.sendUserVerificationSuccess(email);
                } catch (Exception e) {
                    System.err.println("❌ Gửi email xác nhận thất bại: " + e.getMessage());
                }
            }

            return new AuctionSessionSummaryDTO(session, thumbnailUrl); // ✅ Trả về thông tin phiên đấu giá
        }

        if ("reject".equals(action)) {
            asset.setStatus(AuctionDocumentStatus.REJECTED);
            asset.setRejectedReason(reason != null ? reason : "Không rõ lý do");
            auctionDocumentRepository.save(asset);

            // Gửi email
            String email = asset.getUser().getEmail();
            if (email != null && !email.isBlank()) {
                try {
                    emailService.sendUserRejectionNotice(email, asset.getRejectedReason());
                } catch (Exception e) {
                    System.err.println("❌ Gửi email từ chối thất bại: " + e.getMessage());
                }
            }

            return null; // ✅ Có thể trả về null hoặc ném exception nếu reject không cần trả dữ liệu gì
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hành động không hợp lệ.");
    }

    public List<AuctionDocument> getAssetsByStatus(String status) {
        return auctionDocumentRepository.findByStatus(AuctionDocumentStatus.valueOf(status.toUpperCase()));
    }

    public AuctionDocument createAsset(CreateAuctionDocumentDTO dto, Long userId, String role) {
        try {
            validateAuctionType(dto.getAuctionType(), role);
            AuctionDocument doc = new AuctionDocument();
            doc.setDocumentCode("DOC-" + System.currentTimeMillis());
            doc.setDepositAmount(dto.getDepositAmount());
            doc.setIsDepositRequired(dto.getIsDepositRequired() != null ? dto.getIsDepositRequired() : true);
            doc.setStatus(AuctionDocumentStatus.PENDING_CREATE);
            doc.setAuctionType(UserRole.ORGANIZER.name().equalsIgnoreCase(role)
                    ? (dto.getAuctionType() != null ? dto.getAuctionType() : AuctionType.PUBLIC)
                    : AuctionType.PUBLIC);
            doc.setStartingPrice(dto.getStartingPrice());
            doc.setStepPrice(dto.getStepPrice());
            doc.setRegisteredAt(LocalDateTime.now());
            doc.setStartTime(dto.getStartTime());
            doc.setEndTime(dto.getEndTime());
            doc.setDescription(dto.getDescription());

            doc.setUser(userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại")));

            doc.setCategory(categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại")));

            return auctionDocumentRepository.save(doc);
        } catch (Exception e) {
            e.printStackTrace(); // In ra lỗi rõ ràng hơn trong console
            throw new RuntimeException("Lỗi khi tạo tài sản: " + e.getMessage());
        }
    }

    public Map<String, Object> uploadAssetImages(Integer assetId, List<MultipartFile> files, Long userId, String role) {
        AuctionDocument asset = auctionDocumentRepository.findById(assetId)
                .orElseThrow(() -> new NotFoundException("Tài sản không tồn tại"));

        if (!UserRole.ADMIN.name().equalsIgnoreCase(role) && !asset.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền upload ảnh cho tài sản này");
        }

        List<Map<String, Object>> responses = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                // ✅ Upload ảnh theo dạng: asset/{userId}/{assetId}/
                CloudinaryUploadResponse uploaded = imageService.storeAssetImage(
                        asset.getUser().getId(),
                        asset.getId().longValue(),
                        file);

                Image image = new Image();
                image.setUrl(uploaded.getUrl());
                image.setPublicId(uploaded.getPublicId());
                image.setType(file.getContentType());
                image.setSize(Math.toIntExact(file.getSize()));

                Image savedImage = imageRepository.save(image);

                ImageRelation relation = new ImageRelation(savedImage, asset, ImageRelationType.ASSET);
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

    public List<AuctionDocumentDTO> getOwnedAssets(Long userId) {
        List<AuctionDocument> assets = auctionDocumentRepository.findByUserId(userId);

        return assets.stream()
                .map(doc -> {
                    AuctionDocumentDTO dto = new AuctionDocumentDTO(doc);
                    // bổ sung nếu cần categoryName ngoài DTO con
                    if (doc.getCategory() != null) {
                        dto.setCategoryName(doc.getCategory().getName());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Map<String, String> deleteAssetImage(Long imageId, User user) {
        Optional<Image> optionalImage = imageRepository.findById(imageId.intValue());
        if (optionalImage.isEmpty()) {
            // Nếu ảnh không còn thì xem như đã xóa xong rồi
            return Map.of("message", "Ảnh đã được xóa hoặc không tồn tại");
        }

        Image image = optionalImage.get();

        Optional<ImageRelation> optionalRelation = imageRelationRepository.findByImageId(image.getId());
        if (optionalRelation.isEmpty()) {
            return Map.of("message", "Quan hệ ảnh đã được xóa hoặc không tồn tại");
        }

        ImageRelation relation = optionalRelation.get();

        AuctionDocument asset = auctionDocumentRepository.findById(relation.getDocument().getId().intValue())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tài sản liên kết không tồn tại"));

        if (!user.getRole().equals(UserRole.ADMIN) && !user.getId().equals(asset.getUser().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xóa ảnh này");
        }

        // Xóa Cloudinary và DB nếu còn
        imageService.deleteFromCloudinary(image.getPublicId());
        imageRelationRepository.delete(relation);
        imageRepository.delete(image);

        return Map.of("message", "Xóa ảnh thành công");
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Thời gian bắt đầu và kết thúc không được để trống");
        }

        LocalDateTime now = LocalDateTime.now();
        if (!startTime.isAfter(now)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian bắt đầu phải sau thời gian hiện tại");
        }

        if (!endTime.isAfter(startTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian kết thúc phải sau thời gian bắt đầu");
        }
    }

    public AuctionDocument updateAsset(Long id, UpdateAuctionDocumentDTO dto, CustomUserDetails user) {
        AuctionDocument existing = auctionDocumentRepository.findById(id.intValue())
                .orElseThrow(() -> new NotFoundException("Tài sản không tồn tại"));

        validateAuctionType(dto.getAuctionType(), user.getRole().name());

        // ❌ Không cho phép sửa mã tài sản
        // ❌ Không cho phép sửa registeredAt

        if (dto.getDepositAmount() != null)
            existing.setDepositAmount(dto.getDepositAmount());

        if (dto.getIsDepositRequired() != null)
            existing.setIsDepositRequired(dto.getIsDepositRequired());

        if (dto.getStatus() != null)
            existing.setStatus(AuctionDocumentStatus.valueOf(dto.getStatus().toUpperCase()));

        if (dto.getAuctionType() != null)
            existing.setAuctionType(dto.getAuctionType());

        if (dto.getStartingPrice() != null)
            existing.setStartingPrice(dto.getStartingPrice());

        if (dto.getStepPrice() != null)
            existing.setStepPrice(dto.getStepPrice());

        if (dto.getStartTime() != null)
            existing.setStartTime(dto.getStartTime());

        if (dto.getEndTime() != null)
            existing.setEndTime(dto.getEndTime());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Danh mục không tồn tại"));
            existing.setCategory(category);
        }

        if (dto.getDescription() != null)
            existing.setDescription(dto.getDescription());

        return auctionDocumentRepository.save(existing);
    }

    public List<AuctionDocumentDTO> getAssetsByStatusAndKeyword(AuctionDocumentStatus status, String keyword) {
        List<AuctionDocument> docs;

        if (keyword != null && !keyword.trim().isEmpty()) {
            docs = auctionDocumentRepository.searchByStatusAndKeyword(status, "%" + keyword.toLowerCase() + "%");
        } else {
            docs = auctionDocumentRepository.findByStatus(status);
        }

        return docs.stream()
                .map(doc -> {
                    AuctionDocumentDTO dto = new AuctionDocumentDTO(doc);
                    if (doc.getCategory() != null) {
                        dto.setCategoryName(doc.getCategory().getName());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<AuctionDocument> getAllAssets() {
        return auctionDocumentRepository.findAll();
    }
}