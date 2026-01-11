package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.SocialContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialContentRepository extends JpaRepository<SocialContent, Long> {
    boolean existsByPlatformAndExternalId(String platform, String externalId);

    Page<SocialContent> findByPlatformOrderByPublishedAtDesc(String platform, Pageable pageable);
}
