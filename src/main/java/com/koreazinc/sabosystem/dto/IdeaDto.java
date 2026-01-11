package com.koreazinc.sabosystem.dto;

import com.koreazinc.sabosystem.entity.Idea;
import com.koreazinc.sabosystem.entity.IdeaStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class IdeaDto {

    @Getter
    @NoArgsConstructor
    public static class RequestDto {
        private String title;
        private String content;

        @Builder
        public RequestDto(String title, String content) {
            this.title = title;
            this.content = content;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class ResponseDto {
        private Long ideaId;
        private String title;
        private String content;
        private String authorName;
        private IdeaStatus status;
        private String statusDescription;
        private String adminReply;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        @Builder
        public ResponseDto(Idea idea) {
            this.ideaId = idea.getIdeaId();
            this.title = idea.getTitle();
            this.content = idea.getContent();
            this.authorName = idea.getAuthor().getName();
            this.status = idea.getStatus();
            this.statusDescription = idea.getStatus().getDescription();
            this.adminReply = idea.getAdminReply();
            this.createdAt = idea.getCreatedAt();
            this.updatedAt = idea.getUpdatedAt();
        }

        public static ResponseDto from(Idea idea) {
            return new ResponseDto(idea);
        }
    }

    @Getter
    @NoArgsConstructor
    public static class StatusUpdateDto {
        private IdeaStatus status;
        private String adminReply;
    }

    @Getter
    @NoArgsConstructor
    public static class ListDto {
        private Long ideaId;
        private String title;
        private String authorName;
        private IdeaStatus status;
        private String statusDescription;
        private LocalDateTime createdAt;

        public ListDto(Idea idea) {
            this.ideaId = idea.getIdeaId();
            this.title = idea.getTitle();
            this.authorName = idea.getAuthor().getName();
            this.status = idea.getStatus();
            this.statusDescription = idea.getStatus().getDescription();
            this.createdAt = idea.getCreatedAt();
        }
    }
}
