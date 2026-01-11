package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.ArticleDetailDto;
import com.koreazinc.sabosystem.dto.ArticleListDto;
import com.koreazinc.sabosystem.service.ArticleService;
import com.koreazinc.sabosystem.service.ArticleViewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import com.koreazinc.sabosystem.dto.ArticleRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.koreazinc.sabosystem.security.CustomUserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
@Tag(name = "Article", description = "사보 게시물 API")
public class ArticleController {

    private final ArticleService articleService;
    private final ArticleViewService articleViewService;

    @Operation(summary = "게시물 목록 조회", description = "공개된 게시물 목록을 조회합니다. 카테고리 필터링이 가능합니다.")
    @GetMapping
    public ResponseEntity<Page<ArticleListDto>> getArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String hashtag) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<ArticleListDto> articles = articleService.getArticles(pageable, categoryId, hashtag);
        return ResponseEntity.ok(articles);
    }

    @Operation(summary = "게시물 상세 조회", description = "게시물 상세 내용을 조회합니다. 조회수가 증가합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<ArticleDetailDto> getArticle(
            @PathVariable Long id,
            HttpServletRequest request,
            HttpServletResponse response,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 조회수 증가 로직 (세션/쿠키 기반 중복 방지)
        articleViewService.increaseViewCount(id, request, response);

        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        ArticleDetailDto article = articleService.getArticle(id, userId);
        return ResponseEntity.ok(article);
    }

    @Operation(summary = "게시물 작성", description = "관리자 전용: 새로운 게시물을 작성합니다.")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticleDetailDto> createArticle(
            @Valid @RequestBody ArticleRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        ArticleDetailDto createdArticle = articleService.createArticle(dto, userDetails.getUsername());
        return ResponseEntity.created(URI.create("/api/articles/" + createdArticle.getArticleId()))
                .body(createdArticle);
    }

    @Operation(summary = "게시물 수정", description = "관리자 전용: 기존 게시물을 수정합니다.")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticleDetailDto> updateArticle(
            @PathVariable Long id,
            @Valid @RequestBody ArticleRequestDto dto) {
        ArticleDetailDto updatedArticle = articleService.updateArticle(id, dto);
        return ResponseEntity.ok(updatedArticle);
    }

    @Operation(summary = "게시물 삭제", description = "관리자 전용: 게시물을 삭제합니다.")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
