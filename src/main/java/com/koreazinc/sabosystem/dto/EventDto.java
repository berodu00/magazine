package com.koreazinc.sabosystem.dto;

import com.koreazinc.sabosystem.entity.Event;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class EventDto {

    @Getter
    @NoArgsConstructor
    public static class ListDto {
        private Long eventId;
        private String title;
        private String thumbnailUrl;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Boolean isActive;
        private Boolean isParticipated; // Helper for frontend
        private String location;

        @Builder
        public ListDto(Event event, Boolean isParticipated) {
            this.eventId = event.getEventId();
            this.title = event.getTitle();
            this.thumbnailUrl = event.getThumbnailUrl();
            this.startDate = event.getStartDate();
            this.endDate = event.getEndDate();
            this.isActive = event.getIsActive();
            this.isParticipated = isParticipated;
            this.location = event.getLocation();
        }

        public static ListDto from(Event event, Boolean isParticipated) {
            return new ListDto(event, isParticipated);
        }
    }

    @Getter
    @NoArgsConstructor
    public static class DetailDto {
        private Long eventId;
        private String title;
        private String content;
        private String thumbnailUrl;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Boolean isActive;
        private Integer winnerCount;
        private Boolean winnersAnnounced;
        private String winnerAnnouncement;
        private Boolean isParticipated; // Current user
        private String location;

        @Builder
        public DetailDto(Event event, Boolean isParticipated) {
            this.eventId = event.getEventId();
            this.title = event.getTitle();
            this.content = event.getContent();
            this.thumbnailUrl = event.getThumbnailUrl();
            this.startDate = event.getStartDate();
            this.endDate = event.getEndDate();
            this.isActive = event.getIsActive();
            this.winnerCount = event.getWinnerCount();
            this.winnersAnnounced = event.getWinnersAnnounced();
            this.winnerAnnouncement = event.getWinnerAnnouncement();
            this.isParticipated = isParticipated;
            this.location = event.getLocation();
        }

        public static DetailDto from(Event event, Boolean isParticipated) {
            return new DetailDto(event, isParticipated);
        }
    }

    @Getter
    @NoArgsConstructor
    public static class RequestDto {
        private String title;
        private String content;
        private String thumbnailUrl;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Integer winnerCount;
        private String location;
        private Boolean isActive;
    }

    @Getter
    @NoArgsConstructor
    public static class ParticipantDto {
        private Long participantId;
        private Long userId;
        private String userName;
        private String department;
        private Boolean isWinner;

        @Builder
        public ParticipantDto(com.koreazinc.sabosystem.entity.EventParticipant participant) {
            this.participantId = participant.getParticipantId();
            this.userId = participant.getUser().getUserId();
            this.userName = participant.getUser().getName(); // Assuming User has getName
            this.department = participant.getUser().getDepartment(); // Assuming User has getDepartment
            this.isWinner = participant.getIsWinner();
        }

        public static ParticipantDto from(com.koreazinc.sabosystem.entity.EventParticipant participant) {
            return new ParticipantDto(participant);
        }
    }

    @Getter
    @NoArgsConstructor
    public static class WinnerAnnouncementRequestDto {
        private String announcement;
    }
}
