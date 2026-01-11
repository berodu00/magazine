package com.koreazinc.sabosystem.scheduler;

import com.koreazinc.sabosystem.entity.SocialContent;
import com.koreazinc.sabosystem.repository.SocialContentRepository;
import com.koreazinc.sabosystem.service.social.SocialApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SocialContentScheduler {

    private final List<SocialApiService> socialServices;
    private final SocialContentRepository socialContentRepository;

    // Run every day at 2 AM
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void fetchSocialContent() {
        log.info("Starting Social Content Fetch Task...");

        for (SocialApiService service : socialServices) {
            try {
                System.out.println("Scheduler: Fetching content for " + service.getPlatform());
                log.info("Fetching content for platform: {}", service.getPlatform());
                List<SocialContent> contents = service.fetchLatestContent();
                System.out.println("Scheduler: Fetched " + contents.size() + " items");

                int savedCount = 0;
                for (SocialContent content : contents) {
                    if (!socialContentRepository.existsByPlatformAndExternalId(content.getPlatform(),
                            content.getExternalId())) {
                        socialContentRepository.save(content);
                        savedCount++;
                    }
                }
                log.info("Saved {} new items for {}", savedCount, service.getPlatform());
            } catch (Exception e) {
                log.error("Failed to fetch content for {}", service.getPlatform(), e);
            }
        }

        log.info("Social Content Fetch Task Completed.");
    }

    // Manual trigger for testing
    @Transactional
    public void forceFetch() {
        fetchSocialContent();
    }
}
