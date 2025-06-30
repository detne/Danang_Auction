package com.danang_auction.model.dto.user;

import com.danang_auction.model.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserShortDto {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;

    public UserShortDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
    }
}
