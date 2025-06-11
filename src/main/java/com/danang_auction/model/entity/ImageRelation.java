package com.danang_auction.model.entity;

import com.danang_auction.model.enums.ImageRelationType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "image_relation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ImageRelationId.class)
public class ImageRelation {
    @Id
    private Long imageId;

    @Id
    private Long imageFkId;

    @Enumerated(EnumType.STRING)
    private ImageRelationType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id", insertable = false, updatable = false)
    @MapsId("imageId") //ánh xạ đúng với field khoá chính
    private Image image;
}
