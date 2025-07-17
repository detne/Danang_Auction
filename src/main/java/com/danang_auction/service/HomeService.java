package com.danang_auction.service;

import com.danang_auction.model.entity.AuctionBid;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.model.enums.AuctionSessionStatus;
import com.danang_auction.model.enums.ImageRelationType;
import com.danang_auction.repository.AuctionBidRepository;
import com.danang_auction.repository.AuctionDocumentRepository;
import com.danang_auction.repository.AuctionSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final AuctionDocumentRepository auctionDocumentRepository;
    private final AuctionSessionRepository auctionSessionRepository;
    private final AuctionBidRepository auctionBidRepository;

    /**
     * Lấy danh sách tài sản sắp đấu giá
     */
    public List<Map<String, Object>> getUpcomingAssets() {
        LocalDateTime now = LocalDateTime.now();

        return auctionDocumentRepository.findByStatus(AuctionDocumentStatus.APPROVED)
                .stream()
                .filter(doc -> {
                    AuctionSession session = doc.getSession();
                    if (session == null || session.getStartTime() == null || session.getEndTime() == null)
                        return false;

                    return session.getStartTime().isAfter(LocalDateTime.now())
                            && session.getStatus() == AuctionSessionStatus.APPROVED;
                })
                .sorted(Comparator.comparing(doc -> doc.getSession().getStartTime()))
                .limit(6)
                .map(this::convertDocumentToMap)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách phiên đấu giá đang diễn ra
     */
    public List<Map<String, Object>> getOngoingAuctions() {
        LocalDateTime now = LocalDateTime.now();

        return auctionSessionRepository.findActiveSessions(now)
                .stream()
                .limit(6)
                .map(this::convertSessionToMap)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách phiên đấu giá đã kết thúc
     */
    public List<Map<String, Object>> getPastAuctions() {
        LocalDateTime now = LocalDateTime.now();

        return auctionSessionRepository.findEndedSessions(now)
                .stream()
                .sorted((a, b) -> b.getEndTime().compareTo(a.getEndTime()))
                .limit(6)
                .map(this::convertSessionToMap)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách tài sản nổi bật
     */
    public List<Map<String, Object>> getFeaturedProducts() {
        return auctionDocumentRepository.findByStatus(AuctionDocumentStatus.APPROVED)
                .stream()
                .filter(doc -> doc.getStartingPrice() != null && doc.getStartingPrice() > 0)
                .sorted((a, b) -> Double.compare(b.getStartingPrice(), a.getStartingPrice()))
                .limit(4)
                .map(this::convertDocumentToMap)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thống kê tổng quan
     */
    public Map<String, Object> getStatistics() {
        LocalDateTime now = LocalDateTime.now();

        long totalApprovedAssets = auctionDocumentRepository.findByStatus(AuctionDocumentStatus.APPROVED).size();
        long ongoingAuctions = auctionSessionRepository.findActiveSessions(now).size();
        long completedAuctions = auctionSessionRepository.findEndedSessions(now).size();
        long totalBids = auctionBidRepository.count();

        return Map.of(
                "totalApprovedAssets", totalApprovedAssets,
                "ongoingAuctions", ongoingAuctions,
                "completedAuctions", completedAuctions,
                "totalBids", totalBids);
    }

    /**
     * Chuyển đổi AuctionDocument thành Map
     */
    private Map<String, Object> convertDocumentToMap(AuctionDocument doc) {
        Map<String, Object> map = new LinkedHashMap<>();
        AuctionSession session = doc.getSession(); // hoặc doc.getAuctionSession() tùy theo field
        LocalDateTime now = LocalDateTime.now();

        // 1. Thông tin cơ bản
        map.put("id", doc.getId());
        map.put("title", (session != null && session.getTitle() != null) ? session.getTitle()
                : "Tài sản #" + doc.getDocumentCode());
        map.put("description", doc.getDescription());
        map.put("documentCode", doc.getDocumentCode());
        map.put("startingPrice", doc.getStartingPrice());
        map.put("stepPrice", doc.getStepPrice());
        map.put("depositAmount", doc.getDepositAmount());

        // 2. Thông tin phiên đấu giá (nếu có)
        if (session != null) {
            map.put("openTime", session.getStartTime());
            map.put("closeTime", session.getEndTime());
            map.put("startTime", session.getStartTime()); // alias
            map.put("endTime", session.getEndTime()); // alias

            // auctionType từ phiên đấu giá
            map.put("type",
                    session.getAuctionType() != null ? session.getAuctionType().name().toLowerCase() : "unknown");

            // 3. Trạng thái xác định theo thời gian + trạng thái trong DB
            AuctionSessionStatus computedStatus = session.getStatus(); // mặc định lấy từ DB

            if (session.getStatus() != AuctionSessionStatus.CANCELLED) {
                if (session.getEndTime() != null && session.getEndTime().isBefore(now)) {
                    computedStatus = AuctionSessionStatus.FINISHED;
                } else if (session.getStartTime() != null && session.getStartTime().isAfter(now)) {
                    computedStatus = AuctionSessionStatus.UPCOMING;
                } else if (session.getStartTime() != null && session.getEndTime() != null
                        && session.getStartTime().isBefore(now) && session.getEndTime().isAfter(now)) {
                    computedStatus = AuctionSessionStatus.ACTIVE;
                }
            }
            map.put("status", computedStatus.name());

        } else {
            map.put("openTime", null);
            map.put("closeTime", null);
            map.put("startTime", null);
            map.put("endTime", null);
            map.put("type", "unknown");
            map.put("status", "NO_SESSION");
        }

        // 4. Hình ảnh đầu tiên có type = ASSET
        String imageUrl = "/images/asset-default.jpg";
        if (doc.getImageRelations() != null && !doc.getImageRelations().isEmpty()) {
            imageUrl = doc.getImageRelations().stream()
                    .filter(rel -> rel.getType() == ImageRelationType.ASSET)
                    .map(rel -> rel.getImage().getUrl())
                    .findFirst()
                    .orElse(imageUrl);
        }
        map.put("image", imageUrl);

        return map;
    }

    /**
     * Chuyển đổi AuctionSession thành Map
     */
    private Map<String, Object> convertSessionToMap(AuctionSession session) {
        Map<String, Object> auction = new java.util.HashMap<>();
        LocalDateTime now = LocalDateTime.now();

        // Các thông tin cơ bản
        auction.put("id", session.getId());
        auction.put("title",
                session.getTitle() != null ? session.getTitle() : "Phiên đấu giá #" + session.getSessionCode());
        auction.put("sessionCode", session.getSessionCode());

        // Thời gian
        auction.put("startTime", session.getStartTime() != null ? session.getStartTime().toString() : null);
        auction.put("endTime", session.getEndTime() != null ? session.getEndTime().toString() : null);
        auction.put("openTime", session.getStartTime() != null ? session.getStartTime().toString() : null);
        auction.put("closeTime", session.getEndTime() != null ? session.getEndTime().toString() : null);

        // Giá cao nhất (final)
        Optional<AuctionBid> highestBid = auctionBidRepository.findTopBySessionIdOrderByPriceDesc(session.getId());
        auction.put("currentPrice", highestBid.map(AuctionBid::getPrice).orElse(0.0));
        auction.put("finalPrice", highestBid.map(AuctionBid::getPrice).orElse(0.0));

        // Người thắng (nếu kết thúc)
        if (highestBid.isPresent() && session.getEndTime() != null && session.getEndTime().isBefore(now)) {
            auction.put("winner", highestBid.get().getUser() != null
                    ? highestBid.get().getUser().getFirstName() + " " + highestBid.get().getUser().getLastName()
                    : "Ẩn danh");
        }

        // Trạng thái hiển thị
        String statusText = "Không xác định";
        if (session.getStartTime() != null && session.getEndTime() != null) {
            if (session.getEndTime().isBefore(now)) {
                statusText = "Đã kết thúc";
            } else if (session.getStartTime().isAfter(now)) {
                statusText = "Chưa diễn ra";
            } else {
                statusText = "Đang diễn ra";
            }
        }
        auction.put("status", statusText);

        // Mô tả và giá khởi điểm từ tài sản
        if (session.getAuctionDocument() != null) {
            AuctionDocument doc = session.getAuctionDocument();
            auction.put("assetDescription", doc.getDescription());
            auction.put("startingPrice", doc.getStartingPrice());

            // Ảnh từ tài sản (ưu tiên ảnh đầu tiên)
            String imageUrl = "/images/past-auction-default.jpg";
            if (doc.getImageRelations() != null && !doc.getImageRelations().isEmpty()) {
                imageUrl = doc.getImageRelations().get(0).getImage().getUrl();
            }
            auction.put("imageUrl", imageUrl);
        } else {
            auction.put("imageUrl", "/images/past-auction-default.jpg");
        }

        return auction;
    }
}