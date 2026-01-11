package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.NewsletterRequestDto;
import com.koreazinc.sabosystem.dto.NewsletterResponseDto;
import com.koreazinc.sabosystem.entity.Newsletter;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.repository.UserRepository;
import com.koreazinc.sabosystem.security.CustomUserDetails;
import com.koreazinc.sabosystem.service.NewsletterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/newsletters")
@RequiredArgsConstructor
@Tag(name = "Newsletter", description = "뉴스레터 API")
public class NewsletterController {

        private final NewsletterService newsletterService;
        private final UserRepository userRepository;

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "뉴스레터 발송", description = "선택한 게시물로 뉴스레터를 생성하고 발송합니다.")
        public ResponseEntity<NewsletterResponseDto> sendNewsletter(
                        @RequestBody NewsletterRequestDto requestDto,
                        @AuthenticationPrincipal CustomUserDetails userDetails) {
                // userDetails.getUser() might return the User entity if implemented, or we
                // fetch by ID/Email.
                // Assuming CustomUserDetails has getUsername() (email).
                User user = userRepository.findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                Newsletter newsletter = newsletterService.createNewsletter(
                                requestDto.getSubject(),
                                requestDto.getArticleIds(),
                                user);

                newsletterService.sendNewsletter(newsletter.getNewsletterId());

                NewsletterResponseDto response = new NewsletterResponseDto(
                                newsletter.getNewsletterId(),
                                newsletter.getRecipientCount(),
                                newsletter.getSentAt(),
                                "뉴스레터가 " + newsletter.getRecipientCount() + "명에게 발송되었습니다.");

                return ResponseEntity.ok(response);
        }
}
