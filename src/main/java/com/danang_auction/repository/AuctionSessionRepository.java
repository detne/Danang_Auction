package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.entity.User;
import com.danang_auction.model.entity.Category;
import com.danang_auction.model.enums.AuctionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {

    List<AuctionSession> findByStatus(AuctionStatus status);

    List<AuctionSession> findByOrganizer(User organizer);

    List<AuctionSession> findByCategory(Category category);

    Page<AuctionSession> findByStatus(AuctionStatus status, Pageable pageable);

    Page<AuctionSession> findByCategory(Category category, Pageable pageable);

    Page<AuctionSession> findByOrganizer(User organizer, Pageable pageable);

    @Query("SELECT a FROM AuctionSession a WHERE a.title LIKE %:keyword% OR a.description LIKE %:keyword%")
    Page<AuctionSession> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT a FROM AuctionSession a WHERE a.status = :status AND a.endTime < :currentTime")
    List<AuctionSession> findExpiredAuctionSessions(@Param("status") AuctionStatus status, @Param("currentTime") LocalDateTime currentTime);

    @Query("SELECT a FROM AuctionSession a WHERE a.status = 'SCHEDULED' AND a.startTime <= :currentTime")
    List<AuctionSession> findAuctionSessionsToStart(@Param("currentTime") LocalDateTime currentTime);

    @Query("SELECT a FROM AuctionSession a WHERE a.status = 'ACTIVE' AND a.endTime <= :currentTime")
    List<AuctionSession> findAuctionSessionsToEnd(@Param("currentTime") LocalDateTime currentTime);

    @Query("SELECT COUNT(a) FROM AuctionSession a WHERE a.organizer = :organizer")
    long countByOrganizer(@Param("organizer") User organizer);

    @Query("SELECT COUNT(a) FROM AuctionSession a WHERE a.status = :status")
    long countByStatus(@Param("status") AuctionStatus status);

    @Query("SELECT a FROM AuctionSession a WHERE a.startTime BETWEEN :startDate AND :endDate")
    List<AuctionSession> findAuctionSessionsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
