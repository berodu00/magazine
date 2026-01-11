package com.koreazinc.sabosystem.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "articles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "article_id")
    private Long articleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "is_published")
    private Boolean isPublished = false;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "article_hashtags", joinColumns = @JoinColumn(name = "article_id"), inverseJoinColumns = @JoinColumn(name = "hashtag_id"))
    private Set<Hashtag> hashtags = new HashSet<>();

    @Builder
    public Article(Category category, String title, String content, String summary, String thumbnailUrl, User author,
            Boolean isPublished) {
        this.category = category;
        this.title = title;
        this.content = content;
        this.summary = summary;
        this.thumbnailUrl = thumbnailUrl;
        this.author = author;
        this.viewCount = 0;
        this.isPublished = isPublished != null ? isPublished : false;
        if (Boolean.TRUE.equals(this.isPublished)) {
            this.publishedAt = LocalDateTime.now();
        }
    }

    public void update(Category category, String title, String content, String summary, String thumbnailUrl,
            Boolean isPublished, Set<Hashtag> hashtags) {
        this.category = category;
        this.title = title;
        this.content = content;
        this.summary = summary;
        this.thumbnailUrl = thumbnailUrl;

        // 발행 상태가 false -> true로 변경될 때만 publishedAt 업데이트
        if (Boolean.TRUE.equals(isPublished) && !Boolean.TRUE.equals(this.isPublished)) {
            this.publishedAt = LocalDateTime.now();
        }
        this.isPublished = isPublished;
        this.hashtags = hashtags;
    }

    public void setHashtags(Set<Hashtag> hashtags) {
        this.hashtags = hashtags;
    }

    public void incrementViewCount() {
        this.viewCount++;
    }
}
