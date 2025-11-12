package com.example.chatapp.repository;

import com.example.chatapp.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    
    List<Message> findBySessionIdOrderByTimestampAsc(Integer sessionId);
    
    Page<Message> findBySessionId(Integer sessionId, Pageable pageable);
    
    List<Message> findByRole(String role);
    
    List<Message> findBySessionIdAndRole(Integer sessionId, String role);
    
    @Query("SELECT m FROM Message m WHERE LOWER(m.text) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    List<Message> searchByText(@Param("searchText") String searchText);
    
    @Query("SELECT m FROM Message m WHERE m.sessionId = :sessionId ORDER BY m.timestamp DESC LIMIT :limit")
    List<Message> findRecentMessagesBySessionId(@Param("sessionId") Integer sessionId, @Param("limit") int limit);
    
    long countBySessionId(Integer sessionId);
    
    List<Message> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    void deleteBySessionId(Integer sessionId);
    
    @Query("SELECT m FROM Message m WHERE m.sessionId = :sessionId ORDER BY m.timestamp DESC LIMIT 1")
    Message findLastMessageBySessionId(@Param("sessionId") Integer sessionId);
}
