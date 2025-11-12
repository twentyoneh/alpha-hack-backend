package com.example.chatapp.service;

import com.example.chatapp.entity.Session;
import com.example.chatapp.repository.SessionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {
    
    private final SessionRepository sessionRepository;
    
    @Transactional(readOnly = true)
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Session getSessionById(Integer id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Session with id %s wasn't found", id)));
    }
    
    @Transactional(readOnly = true)
    public List<Session> getSessionsByUserId(Integer userId) {
        return sessionRepository.findByUserIdOrderByTimestampDesc(userId);
    }
    
    @Transactional(readOnly = true)
    public Session getSessionWithMessages(Integer id) {
        return sessionRepository.findByIdWithMessages(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Session with id %s wasn't found", id)));
    }
    
    @Transactional
    public Session createSession(Session session) {
        return sessionRepository.save(session);
    }
    
    @Transactional
    public void deleteSession(Integer id) {
        getSessionById(id);
        sessionRepository.deleteById(id);
    }
}
