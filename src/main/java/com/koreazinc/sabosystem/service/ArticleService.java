package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.ArticleDetailDto;
import com.koreazinc.sabosystem.dto.ArticleListDto;
import com.koreazinc.sabosystem.dto.ArticleRequestDto;
import com.koreazinc.sabosystem.entity.Article;
import com.koreazinc.sabosystem.entity.Category;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.repository.ArticleRepository;
import com.koreazinc.sabosystem.repository.CategoryRepository;
import com.koreazinc.sabosystem.repository.UserRepository;
import com.koreazinc.sabosystem.exception.ResourceNotFoundException;
import com.koreazinc.sabosystem.util.HtmlSanitizerUtil;
import com.koreazinc.sabosystem.entity.Hashtag;
import com.koreazinc.sabosystem.repository.HashtagRepository;
import com.koreazinc.sabosystem.repository.ReactionRepository;
import com.koreazinc.sabosystem.service.RatingService; // Added
import com.koreazinc.sabosystem.dto.RatingResponseDto; // Added
import com.koreazinc.sabosystem.repository.RatingRepository; // Added
import lombok.RequiredArgsConstructor;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleService {

        private final ArticleRepository articleRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;
        private final HashtagRepository hashtagRepository;
        private final HtmlSanitizerUtil htmlSanitizerUtil;
        private final ReactionRepository reactionRepository;
        private final ReactionService reactionService;
        private final RatingRepository ratingRepository;
        private final RatingService ratingService;

        public Page<ArticleListDto> getArticles(Pageable pageable, Long categoryId, String hashtag) {
                Page<Article> articles;
                if (hashtag != null && !hashtag.isBlank()) {
                        articles = articleRepository.findAllByHashtags_TagNameAndIsPublishedTrue(hashtag, pageable);
                } else {
                        articles = articleRepository.findPublishedArticles(categoryId, pageable);
                }
                return articles.map(article -> ArticleListDto.from(article,
                                reactionRepository.countByArticle_ArticleId(article.getArticleId()),
                                ratingRepository.getAverageRatingByArticleId(article.getArticleId())));
        }

        public ArticleDetailDto getArticle(Long articleId, Long userId) {
                Article article = articleRepository.findById(articleId)
                                .orElseThrow(() -> new ResourceNotFoundException("해당 게시물을 찾을 수 없습니다. id=" + articleId));

                var summary = reactionService.getReactionSummary(articleId, userId);
                RatingResponseDto ratingSummary = ratingService.getRatingSummary(articleId, userId);

                return ArticleDetailDto.from(
                                article,
                                summary.getReactions(),
                                summary.getUserReaction(),
                                ratingSummary.getAverageRating(),
                                ratingSummary.getTotalRatings(),
                                ratingSummary.getUserRating());
        }

        @Transactional
        public ArticleDetailDto createArticle(ArticleRequestDto dto, String email) {
                Category category = categoryRepository.findById(dto.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "해당 카테고리를 찾을 수 없습니다. id=" + dto.getCategoryId()));

                User author = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("해당 사용자를 찾을 수 없습니다. email=" + email));

                String sanitizedContent = htmlSanitizerUtil.sanitize(dto.getContent());

                Article article = Article.builder()
                                .category(category)
                                .author(author)
                                .title(dto.getTitle())
                                .content(sanitizedContent)
                                .summary(dto.getSummary())
                                .thumbnailUrl(dto.getThumbnailUrl())
                                .isPublished(dto.getIsPublished() != null ? dto.getIsPublished() : false)
                                .build();

                Set<Hashtag> hashtags = processHashtags(dto.getHashtags());
                article.setHashtags(hashtags);

                articleRepository.save(article);
                return ArticleDetailDto.from(
                                article,
                                null,
                                null,
                                0.0,
                                0L,
                                null);
        }

        @Transactional
        public ArticleDetailDto updateArticle(Long articleId, ArticleRequestDto dto) {
                Article article = articleRepository.findById(articleId)
                                .orElseThrow(() -> new ResourceNotFoundException("해당 게시물을 찾을 수 없습니다. id=" + articleId));

                Category category = categoryRepository.findById(dto.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "해당 카테고리를 찾을 수 없습니다. id=" + dto.getCategoryId()));

                String sanitizedContent = htmlSanitizerUtil.sanitize(dto.getContent());

                article.update(
                                category,
                                dto.getTitle(),
                                sanitizedContent,
                                dto.getSummary(),
                                dto.getThumbnailUrl(),
                                dto.getIsPublished() != null ? dto.getIsPublished() : false,
                                processHashtags(dto.getHashtags()));

                var summary = reactionService.getReactionSummary(articleId, null);
                RatingResponseDto ratingSummary = ratingService.getRatingSummary(articleId, null);

                return ArticleDetailDto.from(
                                article,
                                summary.getReactions(),
                                summary.getUserReaction(),
                                ratingSummary.getAverageRating(),
                                ratingSummary.getTotalRatings(),
                                ratingSummary.getUserRating());
        }

        @Transactional
        public void deleteArticle(Long articleId) {
                Article article = articleRepository.findById(articleId)
                                .orElseThrow(() -> new ResourceNotFoundException("해당 게시물을 찾을 수 없습니다. id=" + articleId));
                articleRepository.delete(article);
        }

        private Set<Hashtag> processHashtags(List<String> tagNames) {
                if (tagNames == null || tagNames.isEmpty()) {
                        return new HashSet<>();
                }

                Set<Hashtag> result = new HashSet<>();
                for (String name : tagNames) {
                        String tagName = name.trim();
                        if (tagName.isEmpty())
                                continue;

                        Hashtag hashtag = hashtagRepository.findByTagName(tagName)
                                        .orElseGet(() -> hashtagRepository.save(new Hashtag(tagName)));

                        hashtag.incrementUsageCount();
                        result.add(hashtag);
                }
                return result;
        }
}
