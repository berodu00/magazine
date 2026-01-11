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
@Table(name = "popups", indexes = {
        @Index(name = "idx_popups_active", columnList = "is_active, start_date, end_date")
})
public class Popup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "popup_id")
    private Long popupId;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "popup_type", nullable = false, length = 20)
    private PopupType popupType;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

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
    public Popup(String title, PopupType popupType, String imageUrl, String content, String linkUrl,
            Integer displayOrder, Boolean isActive, LocalDateTime startDate, LocalDateTime endDate, User createdBy) {
        this.title = title;
        this.popupType = popupType;
        this.imageUrl = imageUrl;
        this.content = content;
        this.linkUrl = linkUrl;
        this.displayOrder = displayOrder != null ? displayOrder : 0;
        this.isActive = isActive != null ? isActive : true;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdBy = createdBy;
    }

    public void update(String title, PopupType popupType, String imageUrl, String content, String linkUrl,
            Integer displayOrder, Boolean isActive, LocalDateTime startDate, LocalDateTime endDate) {
        this.title = title;
        this.popupType = popupType;
        this.imageUrl = imageUrl;
        this.content = content;
        this.linkUrl = linkUrl;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
