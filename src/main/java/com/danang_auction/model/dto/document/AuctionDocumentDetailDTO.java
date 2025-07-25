package com.danang_auction.model.dto.document;

import com.danang_auction.model.dto.image.ImageDTO;
import com.danang_auction.model.dto.session.AuctionSessionSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDocumentDetailDTO {
    private Long id;
    private String documentCode;
    private String description;
    private Double startingPrice;
    private Double stepPrice;
    private Double depositAmount; // Thêm: tiền đặt trước (map từ depositAmount)
    private Boolean isDepositRequired; // Thêm: có yêu cầu đặt cọc
    private Double registrationFee; // Thêm: phí đăng ký (có thể = depositAmount hoặc 0 nếu không có)
    private LocalDateTime publicTime; // Thêm: thời gian mở đăng ký (map từ registeredAt)
    private LocalDateTime auctionStartTime; // Thêm: thời gian bắt đầu (map từ session.startTime nếu cần)
    private LocalDateTime auctionEndTime; // Thêm: thời gian kết thúc (map từ session.endTime)

    private List<ImageDTO> images;
    private AuctionSessionSummaryDTO session;
}