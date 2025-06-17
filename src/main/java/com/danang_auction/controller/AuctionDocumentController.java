package com.danang_auction.controller;

import com.danang_auction.model.dto.asset.CreateAuctionDocumentDto;
import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.security.CustomUserDetails;
import com.danang_auction.service.AuctionDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuctionDocumentController {

    private final AuctionDocumentService auctionDocumentService;

    @PostMapping("/assets")
    public ResponseEntity<?> createAuctionDocument(
            @Valid @RequestBody CreateAuctionDocumentDto dto,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        AuctionDocument doc = auctionDocumentService.create(dto, user.getId(), user.getRole().name());
        return ResponseEntity.ok().body(doc);
    }
}

