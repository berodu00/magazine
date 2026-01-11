package com.koreazinc.sabosystem.dto;

import com.koreazinc.sabosystem.entity.Category;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDto {
    private Long categoryId;
    private String name;
    private Integer displayOrder;
    private Boolean isActive;

    public static CategoryDto from(Category category) {
        return CategoryDto.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .displayOrder(category.getDisplayOrder())
                .isActive(category.getIsActive())
                .build();
    }
}
