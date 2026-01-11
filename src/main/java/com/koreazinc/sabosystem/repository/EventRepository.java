package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find active events where current time is between start and end date
    @Query("SELECT e FROM Event e WHERE e.isActive = true AND :now BETWEEN e.startDate AND e.endDate")
    Page<Event> findActiveEvents(LocalDateTime now, Pageable pageable);

    // Find all events (admin) or filtered by status
    Page<Event> findByIsActive(Boolean isActive, Pageable pageable);
}
