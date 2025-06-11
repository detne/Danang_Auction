package com.danang_auction.model.entity;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageRelationId implements Serializable {
    private Long imageId;
    private Long imageFkId;

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
