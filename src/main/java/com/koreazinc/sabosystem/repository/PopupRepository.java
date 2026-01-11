package com.koreazinc.sabosystem.repository;

import com.koreazinc.sabosystem.entity.Popup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PopupRepository extends JpaRepository<Popup, Long> {

    @Query("SELECT p FROM Popup p WHERE p.isActive = true AND :now BETWEEN p.startDate AND p.endDate ORDER BY p.displayOrder ASC")
    List<Popup> findActivePopups(@Param("now") LocalDateTime now);
}
