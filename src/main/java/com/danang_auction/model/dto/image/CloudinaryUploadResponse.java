package com.danang_auction.model.dto.image;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CloudinaryUploadResponse {
    private String message;
    private String userId;
    private String fileName;
    private String url;
    private String publicId;
    private String mimetype;
    private long size;
}
