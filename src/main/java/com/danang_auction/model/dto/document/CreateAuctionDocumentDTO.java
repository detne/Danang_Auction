package com.danang_auction.model.dto.document;

import com.danang_auction.model.enums.AuctionType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateAuctionDocumentDTO {

    // ❌ Không cần nhập mã tài sản – server sẽ tự sinh
    @JsonIgnore
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

    // ❌ Không cho phép nhập – server sẽ tự gán khi tạo tài sản
    @JsonIgnore
    private LocalDateTime registeredAt;

    @JsonProperty("start_time")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;

    @JsonProperty("end_time")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;

    @NotNull(message = "Danh mục không được để trống")
    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty("session_id")
    private Long sessionId;

    @NotNull(message = "Loại đấu giá không được để trống")
    @JsonProperty("auction_type")
    private AuctionType auctionType;

    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự")
    private String description;
}