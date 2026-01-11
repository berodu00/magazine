package com.koreazinc.sabosystem.dto;

import com.koreazinc.sabosystem.entity.SocialContent;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class SocialContentDto {
    private Long contentId;
    private String platform;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String linkUrl;
    private LocalDateTime publishedAt;

    public SocialContentDto(SocialContent entity) {
        this.contentId = entity.getContentId();
        this.platform = entity.getPlatform();
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.thumbnailUrl = entity.getThumbnailUrl();
        this.linkUrl = entity.getLinkUrl();
        this.publishedAt = entity.getPublishedAt();
    }
}
