package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.ArticleListDto;
import com.koreazinc.sabosystem.dto.DashboardStatsDto;
import com.koreazinc.sabosystem.repository.ArticleRepository;
import com.koreazinc.sabosystem.repository.EventRepository;
import com.koreazinc.sabosystem.repository.SocialContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.koreazinc.sabosystem.dto.IdeaDto;
import com.koreazinc.sabosystem.entity.IdeaStatus;
import com.koreazinc.sabosystem.repository.IdeaRepository;
import com.koreazinc.sabosystem.repository.ReactionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final ArticleRepository articleRepository;
    private final EventRepository eventRepository;
    private final SocialContentRepository socialContentRepository;
    private final IdeaRepository ideaRepository;
    private final ReactionRepository reactionRepository;

    public DashboardStatsDto getDashboardStats() {
        // Fetch Category Distribution
        List<Object[]> categoryCounts = articleRepository.countByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] result : categoryCounts) {
            categoryMap.put((String) result[0], (Long) result[1]);
        }

        // Fetch Recent Ideas
        List<IdeaDto.ListDto> recentIdeas = ideaRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent().stream()
                .map(IdeaDto.ListDto::new).collect(Collectors.toList());

        // Calculate Totals
        long totalReactions = reactionRepository.count();
        long totalIdeas = ideaRepository.count();
        // Assuming comments are participants with comments in Event, but for now we use
        // Reactions as proxy for participation
        // or we could add EventParticipants count. Let's use Reactions + Ideas as
        // "Engagement Actions"
        long participationScore = totalReactions + totalIdeas;

        return DashboardStatsDto.builder()
                .totalArticles(articleRepository.count())
                .totalEvents(eventRepository.count())
                .totalIdeas(totalIdeas)
                .totalSocialContent(socialContentRepository.count())
                .totalViews(articleRepository.getSumViewCount() != null ? articleRepository.getSumViewCount() : 0)
                .participationRate(participationScore)
                .pendingIdeas(ideaRepository.countByStatus(IdeaStatus.PENDING))
                .topArticles(getTopArticles())
                .recentIdeas(recentIdeas)
                .visitorTrend(getMockVisitorTrend()) // Keeping mock for now as per plan
                .categoryDistribution(categoryMap)
                .build();
    }

    private List<ArticleListDto> getTopArticles() {
        return articleRepository.findTop5ByIsPublishedTrueOrderByViewCountDesc().stream()
                .map(article -> new ArticleListDto(article, 0L, 0.0))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getMockVisitorTrend() {
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", today.minusDays(i).toString());
            point.put("count", (int) (Math.random() * 100 + 50)); // Random 50-150
            trend.add(point);
        }
        return trend;
    }
}
