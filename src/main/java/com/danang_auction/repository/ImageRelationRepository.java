package com.danang_auction.repository;

import com.danang_auction.model.entity.ImageRelation;
import com.danang_auction.model.entity.ImageRelationId;
import com.danang_auction.model.enums.ImageRelationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRelationRepository extends JpaRepository<ImageRelation, ImageRelationId> {
}
