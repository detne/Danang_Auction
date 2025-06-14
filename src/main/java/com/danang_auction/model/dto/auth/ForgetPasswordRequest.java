package com.danang_auction.model.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgetPasswordRequest {
    private String email;
}
