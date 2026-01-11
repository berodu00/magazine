package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.EventDto;
import com.koreazinc.sabosystem.dto.EventParticipationRequestDto;
import com.koreazinc.sabosystem.entity.Event;
import com.koreazinc.sabosystem.entity.EventParticipant;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.exception.ResourceNotFoundException;
import com.koreazinc.sabosystem.repository.EventParticipantRepository;
import com.koreazinc.sabosystem.repository.EventRepository;
import com.koreazinc.sabosystem.repository.UserRepository;
import com.koreazinc.sabosystem.util.HtmlSanitizerUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final EventParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final HtmlSanitizerUtil htmlSanitizerUtil;

    public Page<EventDto.ListDto> getEvents(Pageable pageable, Long userId) {
        Page<Event> events = eventRepository.findActiveEvents(LocalDateTime.now(), pageable);
        return events.map(event -> {
            boolean isParticipated = userId != null
                    && participantRepository.existsByEvent_EventIdAndUser_UserId(event.getEventId(), userId);
            return EventDto.ListDto.from(event, isParticipated);
        });
    }

    public Page<EventDto.ListDto> getAllEventsForAdmin(Pageable pageable) {
        return eventRepository.findAll(pageable)
                .map(event -> EventDto.ListDto.from(event, null));
    }

    public EventDto.DetailDto getEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("이벤트를 찾을 수 없습니다."));

        boolean isParticipated = userId != null
                && participantRepository.existsByEvent_EventIdAndUser_UserId(eventId, userId);
        return EventDto.DetailDto.from(event, isParticipated);
    }

    @Transactional
    public EventDto.DetailDto createEvent(EventDto.RequestDto dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        Event event = Event.builder()
                .title(dto.getTitle())
                .content(htmlSanitizerUtil.sanitize(dto.getContent()))
                .thumbnailUrl(dto.getThumbnailUrl())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .winnerCount(dto.getWinnerCount())
                .location(dto.getLocation())
                .createdBy(user)
                .build();

        eventRepository.save(event);
        return EventDto.DetailDto.from(event, false);
    }

    @Transactional
    public EventDto.DetailDto updateEvent(Long eventId, EventDto.RequestDto dto) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("이벤트를 찾을 수 없습니다."));

        event.update(
                dto.getTitle(),
                htmlSanitizerUtil.sanitize(dto.getContent()),
                dto.getThumbnailUrl(),
                dto.getStartDate(),
                dto.getEndDate(),
                dto.getWinnerCount(),
                dto.getLocation(),
                dto.getIsActive());

        return EventDto.DetailDto.from(event, null); // participation irrelevant for admin update
    }

    @Transactional
    public void deleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("이벤트를 찾을 수 없습니다."));
        // Need to delete participants first if not cascading? JPA usually handles it if
        // cascade set,
        // but let's assume we might need to handle it or let DB constraints work.
        // For now, simple delete.
        eventRepository.delete(event);
    }

    @Transactional
    public void participate(Long eventId, Long userId, EventParticipationRequestDto dto) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("이벤트를 찾을 수 없습니다."));

        if (!event.getIsActive()) {
            throw new IllegalStateException("진행 중인 이벤트가 아닙니다.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(event.getStartDate()) || now.isAfter(event.getEndDate())) {
            throw new IllegalStateException("이벤트 참여 기간이 아닙니다.");
        }

        if (participantRepository.existsByEvent_EventIdAndUser_UserId(eventId, userId)) {
            throw new IllegalStateException("이미 참여한 이벤트입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        EventParticipant participant = EventParticipant.builder()
                .event(event)
                .user(user)
                .comment(dto.getComment())
                .build();

        participantRepository.save(participant);
    }

    @Transactional
    public List<EventDto.ParticipantDto> drawWinners(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("이벤트를 찾을 수 없습니다."));

        if (event.getWinnersAnnounced()) {
            throw new IllegalStateException("이미 당첨자가 발표된 이벤트입니다.");
        }

        List<EventParticipant> participants = participantRepository.findByEvent_EventId(eventId);
        if (participants.isEmpty()) {
            throw new IllegalStateException("참여자가 없습니다.");
        }

        int winnerCount = event.getWinnerCount();
        if (participants.size() > winnerCount) {
            Collections.shuffle(participants);
            participants = participants.subList(0, winnerCount);
        }

        // Reset previous winners if any (though usually draw happens once)
        // For simplicity and safety, we assume draw can be re-run before announcement
        // Ideally we might want to clear previous winners for this event first if
        // re-draw is allowed
        // But for MVP, let's keep it simple or strictly strictly add new winners?
        // Let's go with: Re-drawing is allowed before announcement.
        participantRepository.resetWinnersByEventId(eventId);

        for (EventParticipant p : participants) {
            p.setWinner(true);
        }

        // Save changes (JPA dirty checking or explicit save)
        participantRepository.saveAll(participants); // Explicitly saving the winners

        return participants.stream()
                .map(EventDto.ParticipantDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void announceWinners(Long eventId, String announcement) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("이벤트를 찾을 수 없습니다."));

        event.announceWinners(htmlSanitizerUtil.sanitize(announcement));
    }

    @Transactional(readOnly = true)
    public List<EventDto.ParticipantDto> getParticipants(Long eventId) {
        return participantRepository.findByEvent_EventId(eventId).stream()
                .map(EventDto.ParticipantDto::from)
                .collect(Collectors.toList());
    }
}
