package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.enums.AuctionDocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AuctionDocumentRepository extends JpaRepository<AuctionDocument, Long> {

    @Query("SELECT a FROM AuctionDocument a WHERE a.status = :status AND " +
            "(:q IS NULL OR a.documentCode LIKE %:q% OR a.description LIKE %:q%)")
    Page<AuctionDocument> findApprovedAssets(@Param("q") String keyword,
                                             @Param("status") AuctionDocumentStatus status,
                                             Pageable pageable);

    Optional<AuctionDocument> findById(Long id);
}
