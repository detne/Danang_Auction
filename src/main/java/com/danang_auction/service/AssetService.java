package com.danang_auction.service;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.repository.AuctionDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AuctionDocumentRepository auctionDocumentRepository;

    public Page<AuctionDocument> searchAssets(String keyword, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit); // page bắt đầu từ 0
        return auctionDocumentRepository.findApprovedAssets(keyword, AuctionDocumentStatus.APPROVED, pageable);
    }
}