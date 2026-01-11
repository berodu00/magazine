package com.koreazinc.sabosystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "newsletters", indexes = {
        @Index(name = "idx_newsletters_sent", columnList = "sent_at")
})
public class Newsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "newsletter_id")
    private Long newsletterId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String subject;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "recipient_count")
    @ColumnDefault("0")
    private Integer recipientCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "newsletter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NewsletterArticle> articles = new ArrayList<>();

    public void addArticle(Article article, int displayOrder) {
        NewsletterArticle newsletterArticle = new NewsletterArticle(this, article, displayOrder);
        this.articles.add(newsletterArticle);
    }
}
