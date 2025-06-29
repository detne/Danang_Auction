package com.danang_auction.model.dto.document;

import lombok.Data;

@Data
public class ReviewRequest {
    private String action; // "approve" hoặc "reject"
    private String reason; // optional
}