package com.danang_auction.service;

import com.danang_auction.exception.ForbiddenException;
import com.danang_auction.exception.NotFoundException;
import com.danang_auction.exception.ResourceNotFoundException;
import com.danang_auction.model.dto.document.AuctionDocumentDetailDTO;
import com.danang_auction.model.dto.document.CreateAuctionDocumentDTO;
import com.danang_auction.model.dto.document.UpdateAuctionDocumentDTO;
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

        if (!doc.getUser().getId().equals(userId))
            throw new AccessDeniedException("Không có quyền xoá tài sản này");

        if (doc.getStatus() == AuctionDocumentStatus.APPROVED)
            throw new AccessDeniedException("Tài sản đã được duyệt, không thể xoá");

        imageRelationRepository.deleteByImageFkIdAndType(assetId, ImageRelationType.ASSET);

        AuctionSession session = doc.getSession();
        if (session != null && session.getStatus() == AuctionSessionStatus.UPCOMING)
            sessionRepository.delete(session);

        auctionDocumentRepository.delete(doc);
    }

    public Page<AuctionDocument> searchAssets(String keyword, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return auctionDocumentRepository.findApprovedAssets(keyword, AuctionDocumentStatus.APPROVED, pageable);
    }

    public AuctionDocumentDetailDTO getAssetById(Integer id, User currentUser) {
        AuctionDocument asset = auctionDocumentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found"));

        if (asset.getStatus() != AuctionDocumentStatus.APPROVED) {
            if (currentUser == null ||
                    (!asset.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != UserRole.ADMIN)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }

        return convertToDetailDTO(asset);
    }

    private AuctionDocumentDetailDTO convertToDetailDTO(AuctionDocument asset) {
        List<Image> images = imageRelationRepository.findImagesByFkIdAndType(asset.getId(), ImageRelationType.ASSET);
        List<ImageDTO> imageDTOs = images.stream().map(img -> new ImageDTO(
                img.getUrl(), img.getPublicId(), img.getType())).toList();

        AuctionSession session = asset.getSession();
        AuctionSessionSummaryDTO sessionDTO = null;
        if (session != null) {
            sessionDTO = new AuctionSessionSummaryDTO(
                    session.getId(),
                    session.getTitle(),
                    session.getSessionCode(),
                    session.getStartTime(),
                    session.getEndTime(),
                    session.getStatus().name()
            );
        }

        return new AuctionDocumentDetailDTO(
                asset.getId(),
                asset.getDocumentCode(),
                asset.getDescription(),
                asset.getStartingPrice(),
                asset.getStepPrice(),
                imageDTOs,
                sessionDTO
        );
    }

    public List<AuctionSession> reviewAsset(Long id, String action, String reason) {
        AuctionDocument asset = auctionDocumentRepository.findByIdWithUser(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tài sản không tồn tại"));

        if ("approve".equalsIgnoreCase(action)) {
            if (asset.getStartTime() == null || asset.getEndTime() == null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu thời gian bắt đầu/kết thúc");

            if (asset.getSession() != null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tài sản đã gắn phiên đấu giá");

            validateAuctionTime(asset.getStartTime(), asset.getEndTime());

            asset.setStatus(AuctionDocumentStatus.APPROVED);
            AuctionSession session = auctionSessionService.createSessionFromApprovedAsset(asset);
            asset.setSession(session);
            auctionDocumentRepository.save(asset);

            sendApprovalEmail(asset.getUser().getEmail());

            return sessionRepository.findByStatusOrderByStartTimeAsc(AuctionSessionStatus.UPCOMING);
        }

        if ("reject".equalsIgnoreCase(action)) {
            asset.setStatus(AuctionDocumentStatus.REJECTED);
            asset.setRejectedReason(reason != null ? reason : "Không rõ lý do");
            auctionDocumentRepository.save(asset);

            sendRejectionEmail(asset.getUser().getEmail(), asset.getRejectedReason());
            return Collections.emptyList();
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hành động không hợp lệ.");
    }

    public List<AuctionDocument> getAssetsByStatus(String status) {
        return auctionDocumentRepository.findByStatus(AuctionDocumentStatus.valueOf(status.toUpperCase()));
    }

    public AuctionDocument create(CreateAuctionDocumentDTO dto, Long userId, String role) {
        validateAuctionType(dto.getAuctionType(), role);

        AuctionDocument doc = new AuctionDocument();
        doc.setDocumentCode(dto.getDocumentCode());
        doc.setDepositAmount(dto.getDepositAmount());
        doc.setIsDepositRequired(Optional.ofNullable(dto.getIsDepositRequired()).orElse(true));
        doc.setStatus(AuctionDocumentStatus.PENDING_CREATE);
        doc.setAuctionType(AccountType.ORGANIZATION.name().equalsIgnoreCase(role)
                ? Optional.ofNullable(dto.getAuctionType()).orElse(AuctionType.PUBLIC)
                : AuctionType.PUBLIC);
        doc.setStartingPrice(dto.getStartingPrice());
        doc.setStepPrice(dto.getStepPrice());
        doc.setRegisteredAt(dto.getRegisteredAt());
        doc.setStartTime(dto.getStartTime());
        doc.setEndTime(dto.getEndTime());
        doc.setDescription(dto.getDescription());
        doc.setUser(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User không tồn tại")));
        doc.setCategory(categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại")));

        return auctionDocumentRepository.save(doc);
    }

    public Map<String, Object> uploadAssetImages(Integer assetId, List<MultipartFile> files, Long userId, String role) {
        AuctionDocument asset = auctionDocumentRepository.findById(assetId)
                .orElseThrow(() -> new NotFoundException("Tài sản không tồn tại"));

        if (!UserRole.ADMIN.name().equalsIgnoreCase(role) && !asset.getUser().getId().equals(userId))
            throw new ForbiddenException("Không có quyền upload ảnh");

        List<Map<String, Object>> responses = new ArrayList<>();

        for (MultipartFile file : files) {
            String folder = "asset/" + asset.getUser().getId();
            Map<String, Object> uploadResult = imageService.upload(file, folder);
            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            if (url == null || publicId == null)
                throw new RuntimeException("Upload thất bại – thiếu URL");

            Image image = imageRepository.save(new Image(url, publicId, file.getContentType(), (int) file.getSize()));
            imageRelationRepository.save(new ImageRelation(image, assetId.longValue(), ImageRelationType.ASSET));

            responses.add(Map.of(
                    "id", image.getId(),
                    "url", image.getUrl(),
                    "publicId", image.getPublicId()
            ));
        }

        if (asset.getStatus() == AuctionDocumentStatus.PENDING_CREATE) {
            asset.setStatus(AuctionDocumentStatus.PENDING_APPROVAL);
            auctionDocumentRepository.save(asset);
        }

        return Map.of(
                "message", "Upload thành công",
                "total", responses.size(),
                "images", responses
        );
    }

    public Map<String, String> deleteAssetImage(Long imageId, User user) {
        Image image = imageRepository.findById(imageId.intValue())
                .orElse(null);

        if (image == null) return Map.of("message", "Ảnh đã được xóa hoặc không tồn tại");

        ImageRelation relation = imageRelationRepository.findByImageId(image.getId())
                .orElse(null);

        if (relation == null) return Map.of("message", "Quan hệ ảnh không tồn tại");

        AuctionDocument asset = auctionDocumentRepository.findById(relation.getImageFkId().intValue())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tài sản không tồn tại"));

        if (!user.getRole().equals(UserRole.ADMIN) && !user.getId().equals(asset.getUser().getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền");

        imageService.deleteFromCloudinary(image.getPublicId());
        imageRelationRepository.delete(relation);
        imageRepository.delete(image);

        return Map.of("message", "Xóa ảnh thành công");
    }

    public AuctionDocument updateAsset(Long id, UpdateAuctionDocumentDTO dto, CustomUserDetails user) {
        AuctionDocument existing = auctionDocumentRepository.findById(id.intValue())
                .orElseThrow(() -> new NotFoundException("Tài sản không tồn tại"));

        validateAuctionType(dto.getAuctionType(), user.getRole().name());

        if (dto.getDocumentCode() != null) existing.setDocumentCode(dto.getDocumentCode());
        if (dto.getDepositAmount() != null) existing.setDepositAmount(dto.getDepositAmount());
        if (dto.getIsDepositRequired() != null) existing.setIsDepositRequired(dto.getIsDepositRequired());
        if (dto.getStatus() != null) existing.setStatus(AuctionDocumentStatus.valueOf(dto.getStatus().toUpperCase()));
        if (dto.getAuctionType() != null) existing.setAuctionType(dto.getAuctionType());
        if (dto.getStartingPrice() != null) existing.setStartingPrice(dto.getStartingPrice());
        if (dto.getStepPrice() != null) existing.setStepPrice(dto.getStepPrice());
        if (dto.getStartTime() != null) existing.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) existing.setEndTime(dto.getEndTime());
        if (dto.getRegisteredAt() != null) existing.setRegisteredAt(dto.getRegisteredAt());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(Long.valueOf(dto.getCategoryId()))
                    .orElseThrow(() -> new NotFoundException("Danh mục không tồn tại"));
            existing.setCategory(category);
        }

        return auctionDocumentRepository.save(existing);
    }

    private void validateAuctionType(AuctionType type, String role) {
        if (role == null || role.isBlank())
            throw new RuntimeException("Vai trò không hợp lệ");

        if (!UserRole.ORGANIZER.name().equalsIgnoreCase(role) && type == AuctionType.PRIVATE)
            throw new RuntimeException("Bạn không được tạo đấu giá private");
    }

    private void validateAuctionTime(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu thời gian bắt đầu/kết thúc");
        if (!start.isAfter(LocalDateTime.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian bắt đầu phải sau hiện tại");
        if (!end.isAfter(start))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian kết thúc phải sau bắt đầu");
    }

    private void sendApprovalEmail(String email) {
        if (email != null && !email.isBlank()) {
            try {
                emailService.sendUserVerificationSuccess(email);
            } catch (Exception e) {
                System.err.println("❌ Gửi email xác nhận thất bại: " + e.getMessage());
            }
        }
    }

    private void sendRejectionEmail(String email, String reason) {
        if (email != null && !email.isBlank()) {
            try {
                emailService.sendUserRejectionNotice(email, reason);
            } catch (Exception e) {
                System.err.println("❌ Gửi email từ chối thất bại: " + e.getMessage());
            }
        }
    }
}
