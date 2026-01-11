package com.koreazinc.sabosystem.dto;

import com.koreazinc.sabosystem.entity.Banner;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class BannerDto {

    @Getter
    @NoArgsConstructor
    public static class RequestDto {
        private String title;
        private String imageUrl;
        private String linkUrl;
        private Integer displayOrder;
        private Boolean isActive;

        @Builder
        public RequestDto(String title, String imageUrl, String linkUrl, Integer displayOrder, Boolean isActive) {
            this.title = title;
            this.imageUrl = imageUrl;
            this.linkUrl = linkUrl;
            this.displayOrder = displayOrder;
            this.isActive = isActive;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class ResponseDto {
        private Long bannerId;
        private String title;
        private String imageUrl;
        private String linkUrl;
        private Integer displayOrder;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        @Builder
        public ResponseDto(Banner banner) {
            this.bannerId = banner.getBannerId();
            this.title = banner.getTitle();
            this.imageUrl = banner.getImageUrl();
            this.linkUrl = banner.getLinkUrl();
            this.displayOrder = banner.getDisplayOrder();
            this.isActive = banner.getIsActive();
            this.createdAt = banner.getCreatedAt();
            this.updatedAt = banner.getUpdatedAt();
        }

        public static ResponseDto from(Banner banner) {
            return new ResponseDto(banner);
        }
    }
}
