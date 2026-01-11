package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    // 공개된 게시물 목록 조회 (카테고리 필터링)
    @Query("SELECT DISTINCT a FROM Article a LEFT JOIN FETCH a.hashtags WHERE a.isPublished = true AND (:categoryId IS NULL OR a.category.categoryId = :categoryId)")
    Page<Article> findPublishedArticles(@Param("categoryId") Long categoryId, Pageable pageable);

    // 새로운 메서드 추가: 특정 해시태그를 가진 공개된 게시물 목록 조회
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "hashtags")
    Page<Article> findAllByHashtags_TagNameAndIsPublishedTrue(String tagName, Pageable pageable);

    // 전체 게시물 목록 조회 (관리자용, 카테고리 필터링/검색)
    @Query("SELECT a FROM Article a WHERE (:categoryId IS NULL OR a.category.categoryId = :categoryId) AND (:searchKeyword IS NULL OR a.title LIKE %:searchKeyword%)")
    Page<Article> findArticlesForAdmin(@Param("categoryId") Long categoryId,
            @Param("searchKeyword") String searchKeyword, Pageable pageable);

    // 조회수 상위 5개 게시물
    List<Article> findTop5ByIsPublishedTrueOrderByViewCountDesc();

    // 총 조회수 합계
    @Query("SELECT SUM(a.viewCount) FROM Article a")
    Long getSumViewCount();

    // 카테고리별 게시물 수
    @Query("SELECT a.category.name, COUNT(a) FROM Article a GROUP BY a.category.name")
    List<Object[]> countByCategory();
}
