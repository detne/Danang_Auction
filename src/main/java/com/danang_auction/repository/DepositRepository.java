package com.danang_auction.repository;

import com.danang_auction.model.dto.auction.DepositDto;
import com.danang_auction.model.entity.AuctionSessionParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepositRepository extends JpaRepository<AuctionSessionParticipant, Long> {

    @Query("SELECT new com.danang_auction.model.dto.auction.DepositDto(" +
            "a.sessionCode, a.title, p.user.id, p.user.username, " +
            "p.depositStatus, p.registeredAt) " +  // Dùng các trường trong AuctionSessionParticipant
            "FROM AuctionSessionParticipant p " +  // Chuyển qua bảng AuctionSessionParticipant
            "JOIN p.auctionSession a " +
            "WHERE p.depositStatus = 'PAID'")  // Kiểm tra depositStatus của người tham gia
    List<DepositDto> findDepositsForRefund();
}
