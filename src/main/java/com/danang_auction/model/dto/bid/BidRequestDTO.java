package com.danang_auction.model.dto.bid;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidRequestDTO {

    @NotNull(message = "Số tiền đấu giá không được để trống")
    @Positive(message = "Số tiền đấu giá phải lớn hơn 0")
    private Double price;
}