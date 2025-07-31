package com.danang_auction.model.enums;

public enum ParticipantStatus {
    WAITING_START,   // Đã đặt cọc xong, chờ phiên bắt đầu
    ONGOING,         // Đang tham gia phiên đấu giá
    WINNER,          // Đã thắng phiên đấu giá
    LOSER            // Đã thua phiên đấu giá
}
