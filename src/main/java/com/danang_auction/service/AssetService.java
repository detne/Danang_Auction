package com.danang_auction.service;

import com.danang_auction.exception.ResourceNotFoundException;
import com.danang_auction.model.dto.auction.AuctionDocumentDto;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.entityDTO.AssetResponseDTO;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.model.enums.ImageRelationType;
import com.danang_auction.repository.AuctionDocumentRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import com.danang_auction.repository.ImageRelationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AuctionDocumentRepository documentRepo;
    private final ImageRelationRepository imageRelationRepo;
    private final AuctionSessionRepository sessionRepo;

    // ✅ 1. Xoá tài sản
    @Transactional
    public void deleteAsset(Long assetId, Long userId) {
        AuctionDocument doc = documentRepo.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản không tồn tại"));

        if (!doc.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Không có quyền xoá tài sản này");
        }

        if (!doc.getStatus().equals(AuctionDocumentStatus.PENDING_CREATE)) {
            throw new AccessDeniedException("Tài sản không ở trạng thái khởi tạo, không thể xoá");
        }

        imageRelationRepo.deleteByImageFkIdAndType(assetId, ImageRelationType.ASSET);

        AuctionSession session = doc.getSession();
        if (session != null && session.getStatus().equals(AuctionSessionStatus.DRAFT)) {
            sessionRepo.delete(session);
        }

        documentRepo.delete(doc);
    }

    // ✅ 2. Tìm kiếm tài sản phân trang
    public Page<AuctionDocument> searchAssets(String q, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return documentRepo.findApprovedAssets(q, AuctionDocumentStatus.APPROVED, pageable);
    }

    // ✅ 3. Lấy tài sản theo ID
    public AssetResponseDTO getAssetById(Long id, User user) {
        AuctionDocument doc = documentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản không tồn tại với ID: " + id));
        return new AssetResponseDTO(doc, user);
    }

    // ✅ 4. Phê duyệt tài sản
    @Transactional
    public void approveAsset(Long id) {
        AuctionDocument doc = documentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài sản có ID = " + id));

        if (doc.getStatus() != AuctionDocumentStatus.PENDING_CREATE) {
            throw new IllegalStateException("Chỉ có thể duyệt tài sản ở trạng thái PENDING_CREATE");
        }

        doc.setStatus(AuctionDocumentStatus.APPROVED);
        documentRepo.save(doc);
    }
}
