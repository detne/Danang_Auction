package com.danang_auction.repository;

import com.danang_auction.model.entity.Image;
import com.danang_auction.model.entity.ImageRelation;
import com.danang_auction.model.entity.ImageRelationId;
import com.danang_auction.model.enums.ImageRelationType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRelationRepository extends JpaRepository<ImageRelation, ImageRelationId> {

    @Modifying
    @Transactional
    @Query("DELETE FROM ImageRelation ir WHERE ir.id.imageFkId = :imageFkId AND ir.type = :type")
    void deleteByImageFkIdAndType(@Param("imageFkId") Long imageFkId, @Param("type") ImageRelationType type);

    @Query("SELECT ir.image FROM ImageRelation ir WHERE ir.id.imageFkId = :fkId AND ir.type = :type")
    List<Image> findImagesByFkIdAndType(@Param("fkId") Integer fkId, @Param("type") ImageRelationType type);

    @Query("SELECT ir FROM ImageRelation ir WHERE ir.image.id = :imageId")
    Optional<ImageRelation> findByImageId(@Param("imageId") Integer imageId);
}