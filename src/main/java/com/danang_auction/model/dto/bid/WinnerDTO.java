package com.danang_auction.model.dto.bid;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class WinnerDTO {
    private Long userId;
    private String fullName;
    private Double price;
    private LocalDateTime timestamp;
}
