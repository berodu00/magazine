package com.koreazinc.sabosystem.dto;

import com.koreazinc.sabosystem.entity.Article;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ArticleDetailDto {
    private Long articleId;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String content; // HTML content
    private String summary;
    private String thumbnailUrl;
    private Long authorId;
    private String authorName;
    private Integer viewCount;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private java.util.Map<String, Long> reactions;
    private String userReaction;

    private Double averageRating; // 2.3.3
    private Long totalRatings; // 2.3.3
    private Integer userRating; // 2.3.3

    @Builder
    public ArticleDetailDto(Article article, java.util.Map<String, Long> reactions, String userReaction,
            Double averageRating, Long totalRatings, Integer userRating) {
        this.articleId = article.getArticleId();
        this.categoryId = article.getCategory().getCategoryId();
        this.categoryName = article.getCategory().getName();
        this.title = article.getTitle();
        this.content = article.getContent();
        this.summary = article.getSummary();
        this.thumbnailUrl = article.getThumbnailUrl();
        this.authorId = article.getAuthor().getUserId();
        this.authorName = article.getAuthor().getName();
        this.viewCount = article.getViewCount();
        this.publishedAt = article.getPublishedAt();
        this.createdAt = article.getCreatedAt();
        this.updatedAt = article.getUpdatedAt();
        this.reactions = reactions;
        this.userReaction = userReaction;
        this.averageRating = averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0;
        this.totalRatings = totalRatings != null ? totalRatings : 0L;
        this.userRating = userRating;
    }

    public static ArticleDetailDto from(Article article, java.util.Map<String, Long> reactions, String userReaction,
            Double averageRating, Long totalRatings, Integer userRating) {
        return new ArticleDetailDto(article, reactions, userReaction, averageRating, totalRatings, userRating);
    }
}
