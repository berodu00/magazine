package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.CategoryDto;
import com.koreazinc.sabosystem.entity.Category;
import com.koreazinc.sabosystem.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll(Sort.by("displayOrder").ascending())
                .stream()
                .map(CategoryDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("이미 존재하는 카테고리 이름입니다.");
        }

        Category category = Category.builder()
                .name(dto.getName())
                .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0)
                .build();

        categoryRepository.save(category);
        return CategoryDto.from(category);
    }
}
