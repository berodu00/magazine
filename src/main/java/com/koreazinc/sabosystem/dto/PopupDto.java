package com.koreazinc.sabosystem.dto;

import com.koreazinc.sabosystem.entity.Popup;
import com.koreazinc.sabosystem.entity.PopupType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class PopupDto {

    @Getter
    @NoArgsConstructor
    public static class RequestDto {
        private String title;
        private PopupType popupType;
        private String imageUrl;
        private String content;
        private String linkUrl;
        private Integer displayOrder;
        private Boolean isActive;
        private LocalDateTime startDate;
        private LocalDateTime endDate;

        @Builder
        public RequestDto(String title, PopupType popupType, String imageUrl, String content, String linkUrl,
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

    @Getter
    @NoArgsConstructor
    public static class ResponseDto {
        private Long popupId;
        private String title;
        private PopupType popupType;
        private String description;
        private String imageUrl;
        private String content;
        private String linkUrl;
        private Integer displayOrder;
        private Boolean isActive;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        @Builder
        public ResponseDto(Popup popup) {
            this.popupId = popup.getPopupId();
            this.title = popup.getTitle();
            this.popupType = popup.getPopupType();
            this.description = popup.getPopupType().getDescription();
            this.imageUrl = popup.getImageUrl();
            this.content = popup.getContent();
            this.linkUrl = popup.getLinkUrl();
            this.displayOrder = popup.getDisplayOrder();
            this.isActive = popup.getIsActive();
            this.startDate = popup.getStartDate();
            this.endDate = popup.getEndDate();
            this.createdAt = popup.getCreatedAt();
            this.updatedAt = popup.getUpdatedAt();
        }

        public static ResponseDto from(Popup popup) {
            return new ResponseDto(popup);
        }
    }
}
