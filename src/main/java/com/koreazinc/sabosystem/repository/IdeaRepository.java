package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.Idea;
import com.koreazinc.sabosystem.entity.IdeaStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdeaRepository extends JpaRepository<Idea, Long> {

    // Find ideas by status
    Page<Idea> findByStatus(IdeaStatus status, Pageable pageable);

    // Find ideas by user
    Page<Idea> findByAuthor_UserId(Long userId, Pageable pageable);
}
