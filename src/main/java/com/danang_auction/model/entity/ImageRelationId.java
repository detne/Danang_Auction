package com.danang_auction.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@NoArgsConstructor
public class ImageRelationId implements Serializable {

    @Column(name = "image_id")
    private Integer imageId;

    @Column(name = "image_fk_id")
    private Long imageFkId;

    public ImageRelationId(Integer imageId, Long imageFkId) {
        this.imageId = imageId;
        this.imageFkId = imageFkId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ImageRelationId that)) return false;
        return Objects.equals(imageId, that.imageId) &&
                Objects.equals(imageFkId, that.imageFkId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(imageId, imageFkId);
    }
}
