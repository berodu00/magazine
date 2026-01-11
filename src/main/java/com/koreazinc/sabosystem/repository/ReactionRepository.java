package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    // Check if user has already reacted to an article
    boolean existsByArticle_ArticleIdAndUser_UserId(Long articleId, Long userId);

    // Find a specific reaction by user and article
    Optional<Reaction> findByArticle_ArticleIdAndUser_UserId(Long articleId, Long userId);

    // Count reactions by type for an article (Optional, for future use)
    long countByArticle_ArticleIdAndReactionType(Long articleId, String reactionType);

    // Count all reactions for an article
    long countByArticle_ArticleId(Long articleId);
}
