package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.SocialContentDto;
import com.koreazinc.sabosystem.repository.SocialContentRepository;
import com.koreazinc.sabosystem.scheduler.SocialContentScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialContentController {

        private final SocialContentRepository socialContentRepository;
        private final SocialContentScheduler socialContentScheduler;

        @GetMapping("/youtube")
        public ResponseEntity<Page<SocialContentDto>> getYouTubeContent(
                        @PageableDefault(size = 9, sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable) {
                return ResponseEntity.ok(
                                socialContentRepository.findByPlatformOrderByPublishedAtDesc("YOUTUBE", pageable)
                                                .map(SocialContentDto::new));
        }

        @GetMapping("/instagram")
        public ResponseEntity<Page<SocialContentDto>> getInstagramContent(
                        @PageableDefault(size = 9, sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable) {
                return ResponseEntity.ok(
                                socialContentRepository.findByPlatformOrderByPublishedAtDesc("INSTAGRAM", pageable)
                                                .map(SocialContentDto::new));
        }

        @GetMapping("/homepage")
        public ResponseEntity<Page<SocialContentDto>> getHomepageContent(
                        @PageableDefault(size = 9, sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable) {
                return ResponseEntity.ok(
                                socialContentRepository.findByPlatformOrderByPublishedAtDesc("HOMEPAGE", pageable)
                                                .map(SocialContentDto::new));
        }

        @GetMapping("/{id}")
        public ResponseEntity<SocialContentDto> getSocialContentDetail(@PathVariable("id") Long id) {
                return socialContentRepository.findById(id)
                                .map(SocialContentDto::new)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @PostMapping("/fetch")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<String> forceFetch() {
                socialContentScheduler.forceFetch();
                return ResponseEntity.ok("Social content fetch triggered successfully.");
        }
}
