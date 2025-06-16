package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Integer> {

    @Query("SELECT a FROM AuctionSession a WHERE a.status = 'ACTIVE' AND a.endTime <= :currentTime")
    List<AuctionSession> findAuctionSessionsToEnd(@Param("currentTime") LocalDateTime currentTime);
}