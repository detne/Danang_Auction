package com.danang_auction.model.entity;

import com.danang_auction.model.enums.ImageRelationType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "image_relation")
@Data
@NoArgsConstructor
public class ImageRelation {

    @EmbeddedId
    private ImageRelationId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("imageId")
    @JoinColumn(name = "image_id")
    private Image image;

    @Column(name = "image_fk_id", insertable = false, updatable = false)
    private Long imageFkId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ImageRelationType type;

    // Constructor đầy đủ
    public ImageRelation(ImageRelationId id, Image image, Long imageFkId, ImageRelationType type) {
        this.id = id;
        this.image = image;
        this.imageFkId = imageFkId;
        this.type = type;
    }

    // ✅ Constructor tiện lợi dùng trong DataSeeder
    public ImageRelation(Image image, Long imageFkId, ImageRelationType type) {
        this.image = image;
        this.imageFkId = imageFkId;
        this.type = type;
        this.id = new ImageRelationId(image.getId(), imageFkId);
    }
}
