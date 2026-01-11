package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.ReactionRequestDto;
import com.koreazinc.sabosystem.dto.ReactionSummaryDto;
import com.koreazinc.sabosystem.security.CustomUserDetails;
import com.koreazinc.sabosystem.service.ReactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    /**
     * 반응 추가 또는 변경
     * POST /api/articles/{id}/reactions
     */
    @PostMapping("/{articleId}/reactions")
    public ResponseEntity<ReactionSummaryDto> addOrUpdateReaction(
            @PathVariable Long articleId,
            @RequestBody @Valid ReactionRequestDto requestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        ReactionSummaryDto summary = reactionService.addOrUpdateReaction(articleId, requestDto.getReactionType(),
                userDetails);
        return ResponseEntity.ok(summary);
    }

    /**
     * 반응 취소
     * DELETE /api/articles/{id}/reactions
     */
    @DeleteMapping("/{articleId}/reactions")
    public ResponseEntity<ReactionSummaryDto> removeReaction(
            @PathVariable Long articleId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        ReactionSummaryDto summary = reactionService.removeReaction(articleId, userDetails);
        return ResponseEntity.ok(summary);
    }
}
