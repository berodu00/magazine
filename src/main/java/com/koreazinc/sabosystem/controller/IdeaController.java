package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.IdeaDto;
import com.koreazinc.sabosystem.entity.IdeaStatus;
import com.koreazinc.sabosystem.security.CustomUserDetails;
import com.koreazinc.sabosystem.service.IdeaService;
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
@RequestMapping("/api/ideas")
@RequiredArgsConstructor
@Tag(name = "Idea", description = "아이디어 제안 API")
public class IdeaController {

    private final IdeaService ideaService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "아이디어 제안하기")
    public ResponseEntity<IdeaDto.ResponseDto> createIdea(
            @RequestBody IdeaDto.RequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ideaService.createIdea(request, userDetails.getUserId()));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "전체 아이디어 목록 조회 (관리자용)")
    public ResponseEntity<Page<IdeaDto.ResponseDto>> getAllIdeas(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) IdeaStatus status) {
        return ResponseEntity.ok(ideaService.getIdeas(pageable, status));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "내 아이디어 목록 조회")
    public ResponseEntity<Page<IdeaDto.ResponseDto>> getMyIdeas(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ideaService.getMyIdeas(pageable, userDetails.getUserId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "아이디어 상태 변경 (관리자용)")
    public ResponseEntity<IdeaDto.ResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody IdeaDto.StatusUpdateDto request) {
        return ResponseEntity.ok(ideaService.updateIdeaStatus(id, request));
    }
}
