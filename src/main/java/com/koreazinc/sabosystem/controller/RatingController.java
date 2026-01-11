package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.RatingRequestDto;
import com.koreazinc.sabosystem.dto.RatingResponseDto;
import com.koreazinc.sabosystem.security.CustomUserDetails;
import com.koreazinc.sabosystem.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
@Tag(name = "Rating", description = "별점 API")
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/{articleId}/ratings")
    @Operation(summary = "별점 추가/변경")
    public ResponseEntity<RatingResponseDto> addOrUpdateRating(
            @PathVariable Long articleId,
            @RequestBody RatingRequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        RatingResponseDto response = ratingService.addOrUpdateRating(articleId, userDetails.getUserId(),
                request.getScore());
        return ResponseEntity.ok(response);
    }
}
