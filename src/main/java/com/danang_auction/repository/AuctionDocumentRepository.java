package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entity.AuctionSession;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionDocumentRepository extends JpaRepository<AuctionDocument, Integer> {

    // Tìm tài sản được duyệt theo từ khóa
    @Query("SELECT a FROM AuctionDocument a WHERE a.status = :status AND " +
            "(:keyword IS NULL OR LOWER(a.documentCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<AuctionDocument> findApprovedAssets(
            @Param("status") AuctionDocumentStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    // Tìm theo ID
    Optional<AuctionDocument> findById(Integer id);

    // Tìm theo ID + load user luôn (fetch join)
    @Query("SELECT a FROM AuctionDocument a JOIN FETCH a.user WHERE a.id = :id")
    Optional<AuctionDocument> findByIdWithUser(@Param("id") Long id);

    // Tìm theo trạng thái
    List<AuctionDocument> findByStatus(AuctionDocumentStatus status);

    // Tìm tất cả tài sản theo userId + load category + session
    @Query("SELECT a FROM AuctionDocument a " +
            "LEFT JOIN FETCH a.category " +
            "LEFT JOIN FETCH a.session " +
            "WHERE a.user.id = :userId")
    List<AuctionDocument> findByUserId(@Param("userId") Long userId);

    // Tìm theo trạng thái + từ khóa
    @Query("SELECT d FROM AuctionDocument d " +
            "WHERE d.status = :status AND " +
            "(LOWER(d.documentCode) LIKE LOWER(:keyword) OR LOWER(d.description) LIKE LOWER(:keyword))")
    List<AuctionDocument> searchByStatusAndKeyword(
            @Param("status") AuctionDocumentStatus status,
            @Param("keyword") String keyword
    );

    // Tìm bằng sessionId (truy vấn kiểu Long id)
    @Query("SELECT a FROM AuctionDocument a WHERE a.session.id = :sessionId")
    Optional<AuctionDocument> findBySessionId(@Param("sessionId") Long sessionId);

    // ✅ Thêm mới: Tìm bằng đối tượng AuctionSession (dùng trong updateSessionVisibility)
    Optional<AuctionDocument> findBySession(AuctionSession session);
}
