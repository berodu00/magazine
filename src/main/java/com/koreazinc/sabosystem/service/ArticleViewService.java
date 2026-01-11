package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.entity.Article;
import com.koreazinc.sabosystem.repository.ArticleRepository;
import com.koreazinc.sabosystem.exception.ResourceNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleViewService {

    private final ArticleRepository articleRepository;
    private static final String VIEW_COOKIE_NAME = "viewed_articles";

    @Transactional
    public void increaseViewCount(Long articleId, HttpServletRequest request, HttpServletResponse response) {
        // 쿠키 확인
        Cookie[] cookies = request.getCookies();
        Set<String> viewedArticles = new HashSet<>();
        Cookie viewCookie = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (VIEW_COOKIE_NAME.equals(cookie.getName())) {
                    viewCookie = cookie;
                    String[] ids = cookie.getValue().split("/");
                    viewedArticles.addAll(Arrays.asList(ids));
                    break;
                }
            }
        }

        // 이미 본 게시물이 아니면 조회수 증가
        if (!viewedArticles.contains(String.valueOf(articleId))) {
            Article article = articleRepository.findById(articleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Article not found"));
            article.incrementViewCount();

            // 쿠키 업데이트
            viewedArticles.add(String.valueOf(articleId));
            String newValue = String.join("/", viewedArticles);

            if (viewCookie == null) {
                viewCookie = new Cookie(VIEW_COOKIE_NAME, newValue);
            } else {
                viewCookie.setValue(newValue);
            }

            viewCookie.setPath("/");
            viewCookie.setMaxAge(60 * 60 * 24); // 24시간 유지
            viewCookie.setHttpOnly(true); // JavaScript 접근 방지 (보안)
            response.addCookie(viewCookie);
        }
    }
}
