package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.ReactionSummaryDto;
import com.koreazinc.sabosystem.entity.Article;
import com.koreazinc.sabosystem.entity.Reaction;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.repository.ArticleRepository;
import com.koreazinc.sabosystem.repository.ReactionRepository;
import com.koreazinc.sabosystem.repository.UserRepository;
import com.koreazinc.sabosystem.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    /**
     * 배응 추가 또는 변경 (Toggle or Upsert logic)
     * plan.md: 기존 반응 자동 변경
     */
    @Transactional
    public ReactionSummaryDto addOrUpdateReaction(Long articleId, String reactionType, CustomUserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

        Optional<Reaction> existingReaction = reactionRepository.findByArticle_ArticleIdAndUser_UserId(articleId,
                user.getUserId());

        if (existingReaction.isPresent()) {
            // Update existing reaction
            existingReaction.get().updateReactionType(reactionType);
        } else {
            // Create new reaction
            Reaction reaction = new Reaction(article, user, reactionType);
            reactionRepository.save(reaction);
        }

        return getReactionSummary(articleId, user.getUserId());
    }

    /**
     * 반응 삭제
     */
    @Transactional
    public ReactionSummaryDto removeReaction(Long articleId, CustomUserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Optional<Reaction> existingReaction = reactionRepository.findByArticle_ArticleIdAndUser_UserId(articleId,
                user.getUserId());

        existingReaction.ifPresent(reactionRepository::delete);

        return getReactionSummary(articleId, user.getUserId());
    }

    /**
     * 게시물의 반응 집계 조회
     */
    public ReactionSummaryDto getReactionSummary(Long articleId, Long userId) {
        // This is a naive implementation. For performance, use JPQL count query
        // grouping by type.
        // Given constraint: countByArticle_ArticleIdAndReactionType exists in Repo but
        // easier to exact list for small scale.
        // Better: Fetch all reactions for article and aggregate in memory or use custom
        // query.
        // Let's implement a custom query method in Repository for aggregation later if
        // needed.
        // For now, let's use what we have or add a simple list fetch.

        // Let's add a method to Repo to get all reactions for an article
        // strictly speaking we should use the methods defined in repo or add new ones.
        // Assuming we can add findByArticle_ArticleId

        // Let's assume we maintain the repository clean.
        // We will calculate counts one by one for defined types OR specific query.
        Map<String, Long> reactionCounts = new HashMap<>();
        reactionCounts.put("LIKE", reactionRepository.countByArticle_ArticleIdAndReactionType(articleId, "LIKE"));
        reactionCounts.put("SAD", reactionRepository.countByArticle_ArticleIdAndReactionType(articleId, "SAD"));
        reactionCounts.put("ANGRY", reactionRepository.countByArticle_ArticleIdAndReactionType(articleId, "ANGRY"));
        reactionCounts.put("FUNNY", reactionRepository.countByArticle_ArticleIdAndReactionType(articleId, "FUNNY"));

        String userReaction = null;
        if (userId != null) {
            Optional<Reaction> myReaction = reactionRepository.findByArticle_ArticleIdAndUser_UserId(articleId, userId);
            if (myReaction.isPresent()) {
                userReaction = myReaction.get().getReactionType();
            }
        }

        return ReactionSummaryDto.builder()
                .reactions(reactionCounts)
                .userReaction(userReaction)
                .build();
    }
}
