package com.koreazinc.sabosystem.dto;

import com.koreazinc.sabosystem.entity.Article;
import com.koreazinc.sabosystem.entity.Hashtag;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.Set;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ArticleListDto {
    private Long articleId;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private String authorName;
    private Integer viewCount;
    private LocalDateTime publishedAt;
    private Set<Hashtag> hashtags;

    private Long reactionCount;
    private Double averageRating; // 2.3.3 Added field

    @Builder
    public ArticleListDto(Article article, Long reactionCount, Double averageRating) {
        this.articleId = article.getArticleId();
        this.categoryId = article.getCategory().getCategoryId();
        this.categoryName = article.getCategory().getName();
        this.title = article.getTitle();
        this.summary = article.getSummary();
        this.thumbnailUrl = article.getThumbnailUrl();
        this.authorName = article.getAuthor().getName();
        this.viewCount = article.getViewCount();
        this.publishedAt = article.getPublishedAt();
        this.hashtags = article.getHashtags();
        this.reactionCount = reactionCount != null ? reactionCount : 0L;
        this.averageRating = averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0;
    }

    public static ArticleListDto from(Article article, Long reactionCount, Double averageRating) {
        return new ArticleListDto(article, reactionCount, averageRating);
    }
}
