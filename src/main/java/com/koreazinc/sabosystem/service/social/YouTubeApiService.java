package com.koreazinc.sabosystem.service.social;

import com.koreazinc.sabosystem.entity.SocialContent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class YouTubeApiService implements SocialApiService {

    @Value("${app.mock.enabled:false}")
    private boolean mockEnabled;

    @Value("${social.youtube.key}")
    private String apiKey;

    @Value("${social.youtube.channel-id}")
    private String channelId;

    @Override
    public List<SocialContent> fetchLatestContent() {
        System.out.println("YouTubeApiService: fetchLatestContent called. mockEnabled=" + mockEnabled);
        if (mockEnabled) {
            return generateMockData();
        }

        // Real API implementation would go here (omitted for now as per plan)
        log.info("Fetching from real YouTube API (Not implemented yet, returning empty)");
        return new ArrayList<>();
    }

    @Override
    public String getPlatform() {
        return "YOUTUBE";
    }

    private List<SocialContent> generateMockData() {
        log.info("Generating Mock YouTube Data");
        List<SocialContent> items = new ArrayList<>();

        // Item 1
        items.add(createMockItem(
                "yt_mock_1",
                "2024년 고려아연 지속가능경영보고서 발간",
                "고려아연의 2024년 지속가능경영보고서가 발간되었습니다. ESG 경영 성과와 미래 비전을 영상으로 확인해보세요.",
                "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", // Placeholder image (Rick Roll ID but works
                                                                            // for thumb)
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                LocalDateTime.now().minusDays(1)));

        // Item 2
        items.add(createMockItem(
                "yt_mock_2",
                "[Onsan Report] 온산제련소 안전 다짐 대회 현장",
                "안전한 사업장을 만들기 위한 우리들의 약속! 온산제련소 안전 다짐 대회 현장을 생생하게 담았습니다.",
                "https://img.youtube.com/vi/j5a0jTc9S10/maxresdefault.jpg",
                "https://www.youtube.com/watch?v=j5a0jTc9S10",
                LocalDateTime.now().minusDays(3)));

        // Item 3
        items.add(createMockItem(
                "yt_mock_3",
                "Troika Drive: 미래를 향한 도약",
                "신재생에너지, 자원순환, 2차전지 소재. 고려아연의 새로운 성장 동력 Troika Drive를 소개합니다.",
                "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg", // Gangnam Style ID
                "https://www.youtube.com/watch?v=9bZkp7q19f0",
                LocalDateTime.now().minusDays(7)));

        // Item 4
        items.add(createMockItem(
                "yt_mock_4",
                "KZ Family Day: 2025 가족 초청 행사",
                "임직원 가족과 함께한 뜻깊은 시간! 웃음과 감동이 가득했던 패밀리 데이 하이라이트.",
                "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg",
                "https://www.youtube.com/watch?v=M7lc1UVf-VE",
                LocalDateTime.now().minusDays(10)));

        return items;
    }

    private SocialContent createMockItem(String externalId, String title, String description, String thumb, String link,
            LocalDateTime publishedAt) {
        SocialContent content = new SocialContent();
        content.setPlatform("YOUTUBE");
        content.setExternalId(externalId);
        content.setTitle(title);
        content.setDescription(description);
        content.setThumbnailUrl(thumb);
        content.setLinkUrl(link);
        content.setPublishedAt(publishedAt);
        return content;
    }
}
