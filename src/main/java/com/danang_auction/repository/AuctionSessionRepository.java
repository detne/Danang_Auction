package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {

    // ✅ Thêm method này
    List<AuctionSession> findByStatusOrderByStartTimeAsc(AuctionSessionStatus status);
}
