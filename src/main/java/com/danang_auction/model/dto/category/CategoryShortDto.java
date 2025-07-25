package com.danang_auction.model.dto.category;

import com.danang_auction.model.entity.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryShortDto {
    private Integer id;
    private String name;

    public CategoryShortDto(Category category) {
        this.id = category.getId();
        this.name = category.getName();
    }
}