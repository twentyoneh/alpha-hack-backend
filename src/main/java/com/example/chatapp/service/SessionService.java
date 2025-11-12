package com.example.chatapp.service;

import com.example.chatapp.entity.Session;
import com.example.chatapp.repository.SessionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionService {
    
    private final SessionRepository sessionRepository;
    
    @Transactional(readOnly = true)
    public List<Session> getAllSessions() {
        var sessions = sessionRepository.findAll();
        log.info("Found {} sessions", sessions.size());
        return sessions;
    }
    
    @Transactional(readOnly = true)
    public Session getSessionById(Integer id) {
        var session = sessionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Session with id %s wasn't found", id)));
        log.info("Session found = {}", session);
        return session;
    }
    
    @Transactional(readOnly = true)
    public List<Session> getSessionsByUserId(Integer userId) {
        var sessions = sessionRepository.findByUserIdOrderByTimestampDesc(userId);
        log.info("Found {} sessions for user id = {}", sessions.size(), userId);
        return sessions;
    }
    
    @Transactional(readOnly = true)
    public Session getSessionWithMessages(Integer id) {
        var session = sessionRepository.findByIdWithMessages(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Session with id %s wasn't found", id)));
        log.info("Session with messages found = {}", session);
        return session;
    }
    
    @Transactional
    public Session createSession(Session session) {
        var savedSession = sessionRepository.save(session);
        log.info("Session created = {}", savedSession);
        return savedSession;
    }
    
    @Transactional
    public void deleteSession(Integer id) {
        var session = getSessionById(id);
        sessionRepository.deleteById(id);
        log.info("Session deleted with id = {}", id);
    }
}
