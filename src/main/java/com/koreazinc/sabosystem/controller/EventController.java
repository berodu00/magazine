package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.EventDto;
import com.koreazinc.sabosystem.dto.EventParticipationRequestDto;
import com.koreazinc.sabosystem.security.CustomUserDetails;
import com.koreazinc.sabosystem.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Event", description = "이벤트 API")
public class EventController {

    private final EventService eventService;

    @GetMapping
    @Operation(summary = "진행 중인 이벤트 목록 조회")
    public ResponseEntity<Page<EventDto.ListDto>> getEvents(
            @PageableDefault(size = 10, sort = "endDate", direction = Sort.Direction.ASC) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails != null ? userDetails.getUserId() : null;
        return ResponseEntity.ok(eventService.getEvents(pageable, userId));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "전체 이벤트 목록 조회 (관리자용)")
    public ResponseEntity<Page<EventDto.ListDto>> getAllEvents(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(eventService.getAllEventsForAdmin(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "이벤트 상세 조회")
    public ResponseEntity<EventDto.DetailDto> getEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails != null ? userDetails.getUserId() : null;
        return ResponseEntity.ok(eventService.getEvent(id, userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "이벤트 생성")
    public ResponseEntity<EventDto.DetailDto> createEvent(
            @RequestBody EventDto.RequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request, userDetails.getUserId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "이벤트 수정")
    public ResponseEntity<EventDto.DetailDto> updateEvent(
            @PathVariable Long id,
            @RequestBody EventDto.RequestDto request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "이벤트 삭제")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/participate")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "이벤트 참여")
    public ResponseEntity<Void> participate(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody EventParticipationRequestDto request) {
        eventService.participate(id, userDetails.getUserId(), request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/draw-winners")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "당첨자 추첨")
    public ResponseEntity<java.util.List<EventDto.ParticipantDto>> drawWinners(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.drawWinners(id));
    }

    @PostMapping("/{id}/announce-winners")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "당첨자 발표")
    public ResponseEntity<Void> announceWinners(
            @PathVariable Long id,
            @RequestBody EventDto.WinnerAnnouncementRequestDto request) {
        eventService.announceWinners(id, request.getAnnouncement());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/participants")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "참여자 목록 조회 (관리자용)")
    public ResponseEntity<java.util.List<EventDto.ParticipantDto>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getParticipants(id));
    }
}
