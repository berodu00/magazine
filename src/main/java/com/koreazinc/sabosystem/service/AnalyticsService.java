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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final ArticleRepository articleRepository;
    private final EventRepository eventRepository;
    private final SocialContentRepository socialContentRepository;
    // IdeaRepository will be added when needed

    public DashboardStatsDto getDashboardStats() {
        return DashboardStatsDto.builder()
                .totalArticles(articleRepository.count())
                .totalEvents(eventRepository.count())
                .totalIdeas(0) // Pending IdeaRepository integration
                .totalSocialContent(socialContentRepository.count())
                .topArticles(getTopArticles())
                .visitorTrend(getMockVisitorTrend())
                .categoryDistribution(new HashMap<>()) // Placeholder
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
