package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByIsActiveTrueOrderByDisplayOrderAsc();

    boolean existsByName(String name);
}
