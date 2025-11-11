package com.backend.businesslogic.repository;

import com.backend.businesslogic.entity.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Page<Session> findByUserIdOrderByUpdatedAtDesc(Long userId, Pageable pageable);
}
