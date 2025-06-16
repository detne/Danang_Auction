package com.danang_auction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
}