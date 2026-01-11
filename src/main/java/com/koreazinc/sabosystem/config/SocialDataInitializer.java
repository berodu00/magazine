package com.koreazinc.sabosystem.config;

import com.koreazinc.sabosystem.scheduler.SocialContentScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SocialDataInitializer {

    private final SocialContentScheduler socialContentScheduler;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("Application Ready: Triggering initial social content fetch...");
        socialContentScheduler.fetchSocialContent();
    }
}
