package com.koreazinc.sabosystem.entity;

import java.io.Serializable;
import java.util.Objects;

public class NewsletterArticleId implements Serializable {
    private Long newsletter;
    private Long article;

    public NewsletterArticleId() {
    }

    public NewsletterArticleId(Long newsletter, Long article) {
        this.newsletter = newsletter;
        this.article = article;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        NewsletterArticleId that = (NewsletterArticleId) o;
        return Objects.equals(newsletter, that.newsletter) && Objects.equals(article, that.article);
    }

    @Override
    public int hashCode() {
        return Objects.hash(newsletter, article);
    }
}
