package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    Optional<Hashtag> findByTagName(String tagName);

    List<Hashtag> findTop20ByOrderByUsageCountDesc();
}
