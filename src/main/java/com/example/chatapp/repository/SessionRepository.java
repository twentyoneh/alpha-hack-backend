package com.example.chatapp.repository;

import com.example.chatapp.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Integer> {
    
    List<Session> findByUserId(Integer userId);
    
    List<Session> findByUserIdOrderByTimestampDesc(Integer userId);
    
    List<Session> findByAssistantRole(String assistantRole);
    
    List<Session> findByCreatedAtAfter(LocalDateTime date);
    
    @Query("SELECT s FROM Session s LEFT JOIN FETCH s.messages WHERE s.id = :sessionId")
    Optional<Session> findByIdWithMessages(@Param("sessionId") Integer sessionId);
    
    @Query("SELECT s FROM Session s WHERE s.userId = :userId ORDER BY s.timestamp DESC LIMIT :limit")
    List<Session> findRecentSessionsByUserId(@Param("userId") Integer userId, @Param("limit") int limit);
    
    long countByUserId(Integer userId);
    
    void deleteByCreatedAtBefore(LocalDateTime date);
}
