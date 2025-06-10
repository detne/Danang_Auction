package com.danang_auction.repository;

import com.danang_auction.model.entity.AuctionDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionDocumentRepository extends JpaRepository<AuctionDocument, Long> {

    List<AuctionDocument> findByAuctionId(Long auctionId);

    Optional<AuctionDocument> findByFileName(String fileName);

    List<AuctionDocument> findByFileType(String fileType);

    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.auctionId = :auctionId ORDER BY ad.uploadedAt DESC")
    List<AuctionDocument> findByAuctionIdOrderByUploadedAtDesc(@Param("auctionId") Long auctionId);

    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.filePath LIKE %:path%")
    List<AuctionDocument> findByFilePathContaining(@Param("path") String path);

    @Query("SELECT ad FROM AuctionDocument ad WHERE ad.fileSize > :minSize AND ad.fileSize < :maxSize")
    List<AuctionDocument> findByFileSizeBetween(@Param("minSize") Long minSize, @Param("maxSize") Long maxSize);

    boolean existsByFileName(String fileName);

    @Query("SELECT COUNT(ad) FROM AuctionDocument ad WHERE ad.auctionId = :auctionId")
    long countByAuctionId(@Param("auctionId") Long auctionId);
}