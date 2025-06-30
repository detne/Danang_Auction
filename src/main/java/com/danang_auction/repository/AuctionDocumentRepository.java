package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionDocument;
import com.danang_auction.model.entityDTO.UpcomingAuctionDTO;
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

    @Query("SELECT a FROM AuctionDocument a WHERE a.status = :status AND " +
           "(:q IS NULL OR a.documentCode LIKE %:q% OR a.description LIKE %:q%)")
    Page<AuctionDocument> findApprovedAssets(@Param("q") @org.springframework.lang.NonNull String keyword, 
                                            @Param("status") AuctionDocumentStatus status, 
                                            @Param("pageable") Pageable pageable);

    Optional<AuctionDocument> findById(Integer id);

    @Query("SELECT new com.danang_auction.model.entityDTO.UpcomingAuctionDTO(" +
            "d.id, d.documentCode, d.category.name, d.startingPrice, " +
            "s.id, d.startTime, d.auctionType, s.status) " +
            "FROM AuctionDocument d " +
            "JOIN d.session s " +
            "WHERE s.status = 'UPCOMING' AND d.startTime > CURRENT_TIMESTAMP")
    Page<UpcomingAuctionDTO> findUpcomingAuctionAssets(Pageable pageable);
}