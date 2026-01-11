package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.entity.Article;
import com.koreazinc.sabosystem.entity.Newsletter;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.repository.ArticleRepository;
import com.koreazinc.sabosystem.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NewsletterService {

    private final NewsletterRepository newsletterRepository;
    private final ArticleRepository articleRepository;
    private final EmailService emailService;

    @Transactional
    public Newsletter createNewsletter(String subject, List<Long> articleIds, User creator) {
        List<Article> articles = articleRepository.findAllById(articleIds);
        if (articles.size() != articleIds.size()) {
            throw new IllegalArgumentException("One or more articles not found");
        }

        // Sort articles based on input order ? OR just add them.
        // Assuming input list order is display order.

        Newsletter newsletter = new Newsletter();
        newsletter.setTitle(subject); // Using subject as title for now
        newsletter.setSubject(subject);
        newsletter.setCreatedBy(creator);

        for (int i = 0; i < articleIds.size(); i++) {
            Long id = articleIds.get(i);
            Article article = articles.stream().filter(a -> a.getArticleId().equals(id)).findFirst().orElseThrow();
            newsletter.addArticle(article, i + 1);
        }

        return newsletterRepository.save(newsletter);
    }

    @Transactional
    public void sendNewsletter(Long newsletterId) {
        Newsletter newsletter = newsletterRepository.findById(newsletterId)
                .orElseThrow(() -> new IllegalArgumentException("Newsletter not found"));

        String htmlContent = generateHtml(newsletter);

        // Mock sending to all users
        // In reality, fetch all users and send loop, or use BCC
        // For MVP/Dev, just send to one mock address or the creator
        String recipient = "all_employees@koreazinc.com";

        emailService.sendSimpleMessage(recipient, newsletter.getSubject(), htmlContent);

        newsletter.setSentAt(java.time.LocalDateTime.now());
        newsletter.setRecipientCount(1500); // Mock count
    }

    private String generateHtml(Newsletter newsletter) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append("<div style='max-width: 800px; margin: 0 auto; font-family: sans-serif;'>");
        sb.append("<h1 style='color: #0066CC; text-align: center;'>").append(newsletter.getSubject()).append("</h1>");
        sb.append("<div style='display: grid; grid-template-columns: 1fr 1fr; gap: 20px;'>");

        newsletter.getArticles().stream()
                .sorted((a, b) -> a.getDisplayOrder().compareTo(b.getDisplayOrder()))
                .forEach(na -> {
                    Article a = na.getArticle();
                    String thumb = a.getThumbnailUrl() != null ? "http://localhost:8080" + a.getThumbnailUrl()
                            : "http://localhost:8080/logo.png";

                    sb.append("<div style='border: 1px solid #ddd; padding: 15px; border-radius: 8px;'>");
                    sb.append("<img src='").append(thumb)
                            .append("' style='width: 100%; height: 200px; object-fit: cover; border-radius: 4px;'/>");
                    sb.append("<h3 style='margin: 10px 0;'>").append(a.getTitle()).append("</h3>");
                    sb.append("<p style='color: #666;'>").append(a.getSummary()).append("</p>");
                    sb.append("<a href='http://localhost:5173/articles/").append(a.getArticleId()).append(
                            "' style='display: block; margin-top: 10px; color: #0066CC; text-decoration: none;'>자세히 보기 &rarr;</a>");
                    sb.append("</div>");
                });

        sb.append("</div>"); // Grid end
        sb.append("<div style='margin-top: 30px; text-align: center; color: #999; font-size: 12px;'>");
        sb.append("<p>© 2026 Korea Zinc. All rights reserved.</p>");
        sb.append("</div>");
        sb.append("</div>"); // Container end
        sb.append("</body></html>");

        return sb.toString();
    }
}
