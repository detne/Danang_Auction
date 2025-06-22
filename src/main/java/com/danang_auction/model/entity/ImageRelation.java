package com.danang_auction.model.entity;

import com.danang_auction.model.enums.ImageRelationType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "image_relations")
@Data
@NoArgsConstructor
public class ImageRelation {

    @EmbeddedId
    private ImageRelationId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("imageId")
    @JoinColumn(name = "image_id")
    private Image image;

    @Column(name = "document_id", insertable = false, updatable = false)
    private Long documentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "relation_type", nullable = false)
    private ImageRelationType type;

    // Constructor tiện lợi dùng trong DataSeeder
    public ImageRelation(Image image, Long documentId, ImageRelationType type) {
        this.image = image;
        this.documentId = documentId;
        this.type = type;
        this.id = new ImageRelationId(image.getId(), documentId);
    }
}