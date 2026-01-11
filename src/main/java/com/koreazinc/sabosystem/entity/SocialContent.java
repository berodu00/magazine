package com.koreazinc.sabosystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_contents", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "platform", "external_id" })
}, indexes = {
        @Index(name = "idx_social_contents_platform", columnList = "platform"),
        @Index(name = "idx_social_contents_published", columnList = "published_at")
})
@Getter
@Setter
@NoArgsConstructor
public class SocialContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Long contentId;

    @Column(nullable = false, length = 20)
    private String platform; // "YOUTUBE", "INSTAGRAM", "HOMEPAGE"

    @Column(name = "external_id", nullable = false)
    private String externalId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "link_url", nullable = false, length = 500)
    private String linkUrl;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "fetched_at")
    private LocalDateTime fetchedAt;

    @PrePersist
    public void prePersist() {
        this.fetchedAt = LocalDateTime.now();
    }
}
