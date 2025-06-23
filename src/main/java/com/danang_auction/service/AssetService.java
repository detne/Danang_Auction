package com.danang_auction.service;

import com.danang_auction.exception.ResourceNotFoundException;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.Image;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.entityDTO.AssetResponseDTO;
import com.danang_auction.model.entityDTO.AuctionSessionDTO;
import com.danang_auction.model.entityDTO.ImageDTO;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.model.enums.ImageRelationType;
import com.danang_auction.model.enums.UserRole;
import com.danang_auction.repository.AuctionDocumentRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import com.danang_auction.repository.ImageRelationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AuctionDocumentRepository documentRepo;
    private final ImageRelationRepository imageRelationRepo;
    private final AuctionSessionRepository sessionRepo;
    private final AuctionDocumentRepository auctionDocumentRepository;

    @Transactional
    public void deleteAsset(Long assetId, Long userId) {
        AuctionDocument doc = documentRepo.findById(assetId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản không tồn tại"));

        if (!doc.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Không có quyền xoá tài sản này");
        }

        if (doc.getStatus() == AuctionDocumentStatus.APPROVED) {
            throw new AccessDeniedException("Tài sản đã được duyệt, không thể xoá");
        }

        // Xoá image_relation
        imageRelationRepo.deleteByImageFkIdAndType(assetId, ImageRelationType.ASSET);

        // Nếu tài sản có session chưa bắt đầu (UPCOMING) thì có thể xoá luôn session
        AuctionSession session = doc.getSession();
        if (session != null && session.getStatus() == AuctionSessionStatus.UPCOMING) {
            sessionRepo.delete(session);
        }

        // Xoá tài sản
        documentRepo.delete(doc);
    }

    public Page<AuctionDocument> searchAssets(String keyword, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit); // page bắt đầu từ 0
        return auctionDocumentRepository.findApprovedAssets(keyword, AuctionDocumentStatus.APPROVED, pageable);
    }

    //view asset
    public AssetResponseDTO getAssetById(Integer id, User currentUser) {
        AuctionDocument asset = auctionDocumentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found"));

        // Nếu chưa được duyệt → chỉ chủ sở hữu hoặc admin mới được xem
        if (asset.getStatus() != AuctionDocumentStatus.APPROVED) {
            if (currentUser == null) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");

            boolean isOwner = asset.getUser().getId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;

            if (!isOwner && !isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }

        // Lấy ảnh liên quan
        List<Image> images = imageRelationRepo.findImagesByFkIdAndType(id.longValue(), ImageRelationType.ASSET);
        List<ImageDTO> imageDTOs = images.stream().map(image -> {
            ImageDTO dto = new ImageDTO();
            dto.setUrl(image.getUrl());
            dto.setPublicId(image.getPublicId());
            dto.setType(image.getType());
            return dto;
        }).toList();


        // Thông tin phiên (nếu có)
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

        // Tạo DTO trả về
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
}