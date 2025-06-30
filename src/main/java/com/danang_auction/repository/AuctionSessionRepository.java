package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {

    List<AuctionSession> findByStatusOrderByStartTimeAsc(AuctionSessionStatus status);

    // ✅ Thêm method này để lấy phiên theo tài sản (document) ID
    @Query("SELECT s FROM AuctionSession s JOIN AuctionDocument d ON s.id = d.session.id WHERE d.id = :documentId")
    List<AuctionSession> findSessionsByDocumentId(@Param("documentId") Integer documentId);
}

