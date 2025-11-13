package com.example.chatapp.repository;

import com.example.chatapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByNameContainingIgnoreCase(String name);
    
    List<User> findByCreatedAtAfter(LocalDateTime date);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.sessions WHERE u.id = :userId")
    Optional<User> findByIdWithSessions(@Param("userId") Integer userId);
    
    @Query("SELECT COUNT(u) FROM User u")
    long countAllUsers();
}
