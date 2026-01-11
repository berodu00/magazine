package com.koreazinc.sabosystem.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDto {
    private long totalArticles;
    private long totalEvents;
    private long totalIdeas;
    private long totalSocialContent;

    // New Engagement Metrics
    private long totalViews;
    private long participationRate; // Total Reactions + Comments
    private long pendingIdeas;

    private List<ArticleListDto> topArticles;
    private List<Map<String, Object>> visitorTrend; // [{ date: '2024-01-01', count: 120 }, ...]
    private Map<String, Long> categoryDistribution;

    // New: Recent Ideas
    private List<IdeaDto.ListDto> recentIdeas;
}
