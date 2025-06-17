package com.danang_auction.service;

import com.danang_auction.exception.ResourceNotFoundException;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.model.enums.ImageRelationType;
import com.danang_auction.repository.AuctionDocumentRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import com.danang_auction.repository.ImageRelationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssetService {
    private final AuctionDocumentRepository documentRepo;
    private final ImageRelationRepository imageRelationRepo;
    private final AuctionSessionRepository sessionRepo;

    @Transactional
    public void deleteAsset(Long assetId, Long userId) {
        AuctionDocument doc = documentRepo.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản không tồn tại"));

        if (!doc.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Không có quyền xoá tài sản này");
        }

        if (doc.getStatus().equals(AuctionDocumentStatus.UPCOMING) || doc.getStatus().equals(AuctionDocumentStatus.ACTIVE) || doc.getStatus().equals(AuctionDocumentStatus.COMPLETED)) {
            throw new AccessDeniedException("Tài sản đã được duyệt, không thể xoá");
        }

        // Xoá image_relation
        imageRelationRepo.deleteByImageFkIdAndType(assetId, ImageRelationType.ASSET);

        // Nếu tài sản có session chưa được duyệt thì xoá session
        AuctionSession session = doc.getSession();
        if (session != null && session.getStatus().equals(AuctionSessionStatus.DRAFT)) {
            sessionRepo.delete(session);
        }

        // Xoá tài sản
        documentRepo.delete(doc);
    }
}
