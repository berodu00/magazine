package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.PopupDto;
import com.koreazinc.sabosystem.security.CustomUserDetails;
import com.koreazinc.sabosystem.service.PopupService;
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

import java.util.List;

@RestController
@RequestMapping("/api/popups")
@RequiredArgsConstructor
@Tag(name = "Popup", description = "팝업 관리 API")
public class PopupController {

    private final PopupService popupService;

    @GetMapping("/active")
    @Operation(summary = "활성 팝업 조회 (메인 페이지용)")
    public ResponseEntity<List<PopupDto.ResponseDto>> getActivePopups() {
        return ResponseEntity.ok(popupService.getActivePopups());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "전체 팝업 목록 조회 (관리자용)")
    public ResponseEntity<Page<PopupDto.ResponseDto>> getAllPopups(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(popupService.getAllPopups(pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "팝업 생성 (관리자용)")
    public ResponseEntity<PopupDto.ResponseDto> createPopup(
            @RequestBody PopupDto.RequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(popupService.createPopup(request, userDetails.getUserId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "팝업 수정 (관리자용)")
    public ResponseEntity<PopupDto.ResponseDto> updatePopup(
            @PathVariable Long id,
            @RequestBody PopupDto.RequestDto request) {
        return ResponseEntity.ok(popupService.updatePopup(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "팝업 삭제 (관리자용)")
    public ResponseEntity<Void> deletePopup(@PathVariable Long id) {
        popupService.deletePopup(id);
        return ResponseEntity.ok().build();
    }
}
