package com.danang_auction.controller;


import com.danang_auction.model.dto.document.AuctionDocumentDTO;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import com.danang_auction.service.AuctionDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/assets")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAssetController {

    private final AuctionDocumentService auctionDocumentService;

    @GetMapping
    public ResponseEntity<?> getAssetsByStatusAndKeyword(
            @RequestParam(defaultValue = "PENDING_APPROVAL") String status,
            @RequestParam(required = false) String q
    ) {
        AuctionDocumentStatus enumStatus = AuctionDocumentStatus.valueOf(status.toUpperCase());
        List<AuctionDocumentDTO> result = auctionDocumentService.getAssetsByStatusAndKeyword(enumStatus, q);
        return ResponseEntity.ok(result);
    }
}