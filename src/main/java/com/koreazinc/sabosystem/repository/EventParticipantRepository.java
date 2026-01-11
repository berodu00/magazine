package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.EventParticipant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {

    boolean existsByEvent_EventIdAndUser_UserId(Long eventId, Long userId);

    Long countByEvent_EventId(Long eventId);

    Page<EventParticipant> findByEvent_EventId(Long eventId, Pageable pageable);

    // For winner selection
    // For winner selection
    List<EventParticipant> findByEvent_EventId(Long eventId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE EventParticipant ep SET ep.isWinner = false WHERE ep.event.eventId = :eventId")
    void resetWinnersByEventId(@org.springframework.data.repository.query.Param("eventId") Long eventId);
}
