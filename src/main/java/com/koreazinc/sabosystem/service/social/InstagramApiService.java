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
public class InstagramApiService implements SocialApiService {

    @Value("${app.mock.enabled}")
    private boolean mockEnabled;

    @Value("${social.instagram.token}")
    private String accessToken;

    @Override
    public List<SocialContent> fetchLatestContent() {
        System.out.println("InstagramApiService: fetchLatestContent called. mockEnabled=" + mockEnabled);
        if (mockEnabled) {
            return generateMockData();
        }

        // Real API implementation would go here
        log.warn("Real Instagram API integration not implemented yet. Use mock mode.");
        return new ArrayList<>();
    }

    @Override
    public String getPlatform() {
        return "INSTAGRAM";
    }

    private List<SocialContent> generateMockData() {
        List<SocialContent> mockData = new ArrayList<>();

        // 1. Safety Culture
        SocialContent item1 = new SocialContent();
        item1.setPlatform("INSTAGRAM");
        item1.setExternalId("IG_MOCK_" + UUID.randomUUID());
        item1.setTitle("고려아연 안전 문화 캠페인");
        item1.setDescription("안전은 우리의 최우선 가치입니다. #KoreaZinc #SafetyFirst #SafetyCulture");
        item1.setThumbnailUrl("https://picsum.photos/seed/kz_ig_1/400/400"); // Square
        item1.setLinkUrl("https://www.instagram.com/koreazinc_official/");
        item1.setPublishedAt(LocalDateTime.now().minusDays(1));
        mockData.add(item1);

        // 2. Employee Event
        SocialContent item2 = new SocialContent();
        item2.setPlatform("INSTAGRAM");
        item2.setExternalId("IG_MOCK_" + UUID.randomUUID());
        item2.setTitle("2024 신입사원 환영회 현장");
        item2.setDescription("열정 가득한 신입사원들의 모습을 공개합니다! 👏 #NewJoiner #Welcome");
        item2.setThumbnailUrl("https://picsum.photos/seed/kz_ig_2/400/400");
        item2.setLinkUrl("https://www.instagram.com/koreazinc_official/");
        item2.setPublishedAt(LocalDateTime.now().minusDays(3));
        mockData.add(item2);

        // 3. Eco-friendly Tech
        SocialContent item3 = new SocialContent();
        item3.setPlatform("INSTAGRAM");
        item3.setExternalId("IG_MOCK_" + UUID.randomUUID());
        item3.setTitle("지속가능한 미래를 위한 기술");
        item3.setDescription("친환경 제련 기술로 더 나은 내일을 만듭니다. #EcoFriendly #GreenTech");
        item3.setThumbnailUrl("https://picsum.photos/seed/kz_ig_3/400/400");
        item3.setLinkUrl("https://www.instagram.com/koreazinc_official/");
        item3.setPublishedAt(LocalDateTime.now().minusDays(5));
        mockData.add(item3);

        // 4. Daily Life
        SocialContent item4 = new SocialContent();
        item4.setPlatform("INSTAGRAM");
        item4.setExternalId("IG_MOCK_" + UUID.randomUUID());
        item4.setTitle("온산제련소의 하루");
        item4.setDescription("오늘도 힘차게 돌아가는 온산제련소의 풍경 🏭 #Onsan #DailyLife");
        item4.setThumbnailUrl("https://picsum.photos/seed/kz_ig_4/400/400");
        item4.setLinkUrl("https://www.instagram.com/koreazinc_official/");
        item4.setPublishedAt(LocalDateTime.now().minusDays(7));
        mockData.add(item4);

        log.info("Generated {} mock Instagram items", mockData.size());
        return mockData;
    }
}
