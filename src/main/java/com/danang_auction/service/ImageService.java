package com.danang_auction.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.danang_auction.model.dto.image.CloudinaryUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final Cloudinary cloudinary;

    public CloudinaryUploadResponse storeCloudinaryImageTemp(
            String userId,
            MultipartFile file,
            String side // "front" hoặc "back"
    ) {
        String folder = "cccd/" + userId;
        String publicId = side + "_" + new Date().getTime();

        Map uploadResult = uploadToCloudinary(file, folder, publicId);

        return CloudinaryUploadResponse.builder()
                .message("Tải ảnh mặt " + ("front".equals(side) ? "trước" : "sau") + " thành công")
                .userId(userId)
                .fileName(file.getOriginalFilename())
                .url(uploadResult.get("secure_url").toString())
                .publicId(uploadResult.get("public_id").toString())
                .mimetype(file.getContentType())
                .size(file.getSize())
                .build();
    }

    public Map uploadToCloudinary(MultipartFile file, String folder, String publicId) {
        try {
            return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    "resource_type", "auto"
            ));
        } catch (IOException e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

    public Map<String, Object> upload(MultipartFile file, String folder) {
        try {
            return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder",folder,
                    "resource_type", "auto"
            ));
        } catch (IOException e) {
            throw new RuntimeException("Upload failed: " + e.getMessage(), e);
        }
    }


    public void deleteFromCloudinary(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Delete failed: " + e.getMessage());
        }
    }
}
