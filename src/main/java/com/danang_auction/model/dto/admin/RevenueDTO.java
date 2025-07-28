package com.danang_auction.model.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueDTO {
    private Integer month;
    private Integer year;
    private Double total;
}