package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.entity.Hashtag;
import com.koreazinc.sabosystem.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hashtags")
@RequiredArgsConstructor
public class HashtagController {

    private final HashtagRepository hashtagRepository;

    @GetMapping
    public ResponseEntity<Map<String, List<Hashtag>>> getPopularHashtags(@RequestParam(defaultValue = "20") int limit) {
        // limit is currently ignored as we use Top20 method directly.
        // For strict implementation we could use Pageable but Top20 is sufficient for
        // MVP.
        List<Hashtag> hashtags = hashtagRepository.findTop20ByOrderByUsageCountDesc();
        return ResponseEntity.ok(Map.of("hashtags", hashtags));
    }
}
