package com.koreazinc.sabosystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "reactions", uniqueConstraints = {
        @UniqueConstraint(name = "uk_reaction_article_user", columnNames = { "article_id", "user_id" })
}, indexes = {
        @Index(name = "idx_reactions_article", columnList = "article_id"),
        @Index(name = "idx_reactions_user", columnList = "user_id")
})
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reaction_id")
    private Long reactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "reaction_type", nullable = false, length = 20)
    private String reactionType; // 'LIKE', 'SAD', 'ANGRY', 'FUNNY'

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Reaction(Article article, User user, String reactionType) {
        this.article = article;
        this.user = user;
        this.reactionType = reactionType;
    }

    public void updateReactionType(String reactionType) {
        this.reactionType = reactionType;
    }
}
