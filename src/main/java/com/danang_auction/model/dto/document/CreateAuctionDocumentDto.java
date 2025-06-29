package com.danang_auction.model.dto.document;

import com.danang_auction.model.enums.AuctionType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateAuctionDocumentDto {

    @NotBlank(message = "Mã hồ sơ không được để trống")
    @JsonProperty("document_code")
    private String documentCode;

    @JsonProperty("is_deposit_required")
    private Boolean isDepositRequired = true;

    @NotNull(message = "Giá khởi điểm không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá khởi điểm phải lớn hơn 0")
    @JsonProperty("starting_price")
    private Double startingPrice;

    @NotNull(message = "Bước giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Bước giá phải lớn hơn 0")
    @JsonProperty("step_price")
    private Double stepPrice;

    @JsonProperty("deposit_amount")
    private Double depositAmount;

    @JsonProperty("registered_at")
    private LocalDateTime registeredAt;

    @JsonProperty("start_time")
    private LocalDateTime startTime;

    @JsonProperty("end_time")
    private LocalDateTime endTime;

    @NotNull(message = "Danh mục không được để trống")
    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty("session_id")
    private Long sessionId;

    @NotNull(message = "Loại đấu giá không được để trống")
    @JsonProperty("auction_type")
    private AuctionType auctionType;

    private String description;
}
