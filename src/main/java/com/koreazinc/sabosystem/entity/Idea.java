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

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "ideas", indexes = {
        @Index(name = "idx_ideas_status", columnList = "status"),
        @Index(name = "idx_ideas_user", columnList = "user_id")
})
public class Idea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idea_id")
    private Long ideaId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IdeaStatus status = IdeaStatus.PENDING;

    @Column(columnDefinition = "TEXT", name = "admin_comment")
    private String adminReply;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public Idea(String title, String content, User author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.status = IdeaStatus.PENDING;
    }

    public void updateStatus(IdeaStatus status, String adminReply) {
        this.status = status;
        this.adminReply = adminReply;
    }
}
