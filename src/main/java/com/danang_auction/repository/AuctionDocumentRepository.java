package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuctionDocumentRepository extends JpaRepository<AuctionDocument, Integer> {
    Optional<AuctionDocument> findByIdAndStatusNotIn(Integer id, String... statuses);
}