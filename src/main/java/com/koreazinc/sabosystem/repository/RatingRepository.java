package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByArticle_ArticleIdAndUser_UserId(Long articleId, Long userId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.article.articleId = :articleId")
    Double getAverageRatingByArticleId(Long articleId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.article.articleId = :articleId")
    Long countByArticle_ArticleId(Long articleId);
}
