package com.koreazinc.sabosystem.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "event_participants", uniqueConstraints = {
        @UniqueConstraint(name = "uk_participant_event_user", columnNames = { "event_id", "user_id" })
}, indexes = {
        @Index(name = "idx_event_participants_event", columnList = "event_id"),
        @Index(name = "idx_event_participants_user", columnList = "user_id"),
        @Index(name = "idx_event_participants_winner", columnList = "is_winner")
})
public class EventParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long participantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_winner")
    private Boolean isWinner = false;

    @CreatedDate
    @Column(name = "participated_at", updatable = false)
    private LocalDateTime participatedAt;

    @Builder
    public EventParticipant(Event event, User user, String comment) {
        this.event = event;
        this.user = user;
        this.comment = comment;
        this.isWinner = false;
    }

    public void setWinner(Boolean winner) {
        isWinner = winner;
    }
}
