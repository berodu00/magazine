package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.BannerDto;
import com.koreazinc.sabosystem.security.CustomUserDetails;
import com.koreazinc.sabosystem.service.BannerService;
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
@RequestMapping("/api/banners")
@RequiredArgsConstructor
@Tag(name = "Banner", description = "배너 관리 API")
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/active")
    @Operation(summary = "활성 배너 조회 (메인 페이지용)")
    public ResponseEntity<List<BannerDto.ResponseDto>> getActiveBanners() {
        return ResponseEntity.ok(bannerService.getActiveBanners());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "전체 배너 목록 조회 (관리자용)")
    public ResponseEntity<Page<BannerDto.ResponseDto>> getAllBanners(
            @PageableDefault(size = 10, sort = "displayOrder", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(bannerService.getAllBanners(pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "배너 생성 (관리자용)")
    public ResponseEntity<BannerDto.ResponseDto> createBanner(
            @RequestBody BannerDto.RequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bannerService.createBanner(request, userDetails.getUserId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "배너 수정 (관리자용)")
    public ResponseEntity<BannerDto.ResponseDto> updateBanner(
            @PathVariable Long id,
            @RequestBody BannerDto.RequestDto request) {
        return ResponseEntity.ok(bannerService.updateBanner(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "배너 삭제 (관리자용)")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.ok().build();
    }
}
