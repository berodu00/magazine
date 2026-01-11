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
@Table(name = "events", indexes = {
        @Index(name = "idx_events_dates", columnList = "start_date, end_date"),
        @Index(name = "idx_events_active", columnList = "is_active")
})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "location")
    private String location;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "winner_count")
    private Integer winnerCount = 0;

    @Column(name = "winners_announced")
    private Boolean winnersAnnounced = false;

    @Column(name = "winner_announcement", columnDefinition = "TEXT")
    private String winnerAnnouncement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public Event(String title, String content, String thumbnailUrl, LocalDateTime startDate, LocalDateTime endDate,
            Integer winnerCount, String location, User createdBy) {
        this.title = title;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.winnerCount = winnerCount != null ? winnerCount : 0;
        this.location = location;
        this.createdBy = createdBy;
        this.isActive = true;
        this.winnersAnnounced = false;
    }

    public void update(String title, String content, String thumbnailUrl, LocalDateTime startDate,
            LocalDateTime endDate,
            Integer winnerCount, String location, Boolean isActive) {
        this.title = title;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.winnerCount = winnerCount;
        this.location = location;
        this.isActive = isActive;
    }

    public void announceWinners(String announcement) {
        this.winnerAnnouncement = announcement;
        this.winnersAnnounced = true;
    }
}
