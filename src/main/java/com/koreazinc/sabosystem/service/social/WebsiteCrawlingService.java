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

@Slf4j
@Service
@RequiredArgsConstructor
public class WebsiteCrawlingService implements SocialApiService {

    @Value("${app.mock.enabled:false}")
    private boolean mockEnabled;

    @Override
    public List<SocialContent> fetchLatestContent() {
        if (mockEnabled) {
            return getMockContent();
        }
        // Jsoup implementation will go here in future steps
        return new ArrayList<>();
    }

    @Override
    public String getPlatform() {
        return "HOMEPAGE";
    }

    private List<SocialContent> getMockContent() {
        log.info("Generating Mock Homepage Content (Press Release)");
        List<SocialContent> contentList = new ArrayList<>();

        // Mock Item 1
        contentList.add(createMockContent(
                "PR_2024_001",
                "고려아연, 2024년 안전보건 경영선포식 개최",
                "고려아연은 지난 4일 온산제련소 사내체육관에서 '2024년 안전보건 경영선포식'을 개최하고 안전을 최우선 가치로 삼겠다는 의지를 다졌습니다.",
                "https://www.koreazinc.co.kr/pr/press/view.do?no=123",
                LocalDateTime.now().minusDays(1)));

        // Mock Item 2
        contentList.add(createMockContent(
                "PR_2024_002",
                "고려아연, 지역사회와 함께하는 '따뜻한 겨울나기' 봉사활동",
                "임직원 50여 명이 참여하여 지역 소외계층을 위한 연탄 나눔 봉사활동을 진행했습니다.",
                "https://www.koreazinc.co.kr/pr/press/view.do?no=124",
                LocalDateTime.now().minusDays(3)));

        // Mock Item 3
        contentList.add(createMockContent(
                "PR_2024_003",
                "신재생에너지 사업 확대... 호주 풍력발전소 착공",
                "자회사 아크에너지를 통해 호주 퀸즐랜드주에 대규모 풍력발전 단지를 조성합니다. Troika Drive의 일환으로...",
                "https://www.koreazinc.co.kr/pr/press/view.do?no=125",
                LocalDateTime.now().minusDays(5)));

        // Mock Item 4
        contentList.add(createMockContent(
                "PR_2024_004",
                "제4회 대학생 공모전 시상식 성료",
                "미래 인재들의 창의적인 아이디어가 돋보였던 제4회 대학생 공모전 시상식이 본사에서 열렸습니다.",
                "https://www.koreazinc.co.kr/pr/press/view.do?no=126",
                LocalDateTime.now().minusDays(7)));

        return contentList;
    }

    private SocialContent createMockContent(String externalId, String title, String description, String linkUrl,
            LocalDateTime publishedAt) {
        SocialContent content = new SocialContent();
        content.setPlatform(getPlatform());
        content.setExternalId(externalId);
        content.setTitle(title);
        content.setDescription(description);
        content.setLinkUrl(linkUrl);
        content.setThumbnailUrl("https://via.placeholder.com/600x400?text=Press+Release"); // Placeholder for now
        content.setPublishedAt(publishedAt);
        return content;
    }
}
