package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.RatingResponseDto;
import com.koreazinc.sabosystem.entity.Article;
import com.koreazinc.sabosystem.entity.Rating;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.repository.ArticleRepository;
import com.koreazinc.sabosystem.repository.RatingRepository;
import com.koreazinc.sabosystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingResponseDto addOrUpdateRating(Long articleId, Long userId, Integer score) {
        if (score < 1 || score > 5) {
            throw new IllegalArgumentException("Rating score must be between 1 and 5");
        }

        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("Article not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Rating rating = ratingRepository.findByArticle_ArticleIdAndUser_UserId(articleId, userId)
                .orElse(null);

        if (rating == null) {
            rating = Rating.builder()
                    .article(article)
                    .user(user)
                    .score(score)
                    .build();
            ratingRepository.save(rating);
        } else {
            rating.updateScore(score);
        }

        return getRatingSummary(articleId, userId);
    }

    public RatingResponseDto getRatingSummary(Long articleId, Long userId) {
        Double averageRating = ratingRepository.getAverageRatingByArticleId(articleId);
        Long totalRatings = ratingRepository.countByArticle_ArticleId(articleId);

        Integer userRating = null;
        if (userId != null) {
            userRating = ratingRepository.findByArticle_ArticleIdAndUser_UserId(articleId, userId)
                    .map(Rating::getScore)
                    .orElse(null);
        }

        return RatingResponseDto.builder()
                .averageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0)
                .totalRatings(totalRatings != null ? totalRatings : 0L)
                .userRating(userRating)
                .build();
    }
}
