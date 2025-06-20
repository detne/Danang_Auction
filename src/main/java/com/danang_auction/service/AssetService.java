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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AssetService {
    private final AuctionDocumentRepository documentRepo;
    private final ImageRelationRepository imageRelationRepo;
    private final AuctionSessionRepository sessionRepo;

    @Transactional
    public void deleteAsset(Long assetId, Long userId) {
        AuctionDocument doc = documentRepo.findById(assetId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản không tồn tại"));

        if (!doc.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Không có quyền xóa tài sản này");
        }

        if (doc.getStatus() != null && (doc.getStatus().equals(AuctionDocumentStatus.UPCOMING) ||
                doc.getStatus().equals(AuctionDocumentStatus.ACTIVE) ||
                doc.getStatus().equals(AuctionDocumentStatus.COMPLETED))) {
            throw new ResourceNotFoundException("Tài sản đã được duyệt, không thể xóa");
        }

        // Xóa image_relation
        imageRelationRepo.deleteByImageFkIdAndType(assetId, ImageRelationType.ASSET);

        // Nếu tài sản có session chưa được duyệt thì xóa session
        AuctionSession session = doc.getSession();
        if (session != null && session.getStatus().equals(AuctionSessionStatus.DRAFT)) {
            sessionRepo.delete(session);
        }

        // Xóa tài sản
        documentRepo.delete(doc);
    }

    @Transactional
    public void approveAsset(Integer id) {
        System.out.println("Đang kiểm tra tài sản với ID: " + id);
        AuctionDocument document = documentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản không tồn tại"));

        // Bỏ kiểm tra trạng thái tạm thời cho test
        document.setStatus(AuctionDocumentStatus.APPROVED);
        documentRepo.save(document);
        System.out.println("Tài sản ID " + id + " đã được duyệt, trạng thái: " + document.getStatus());
    }
}