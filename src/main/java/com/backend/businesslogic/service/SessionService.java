package com.backend.businesslogic.service;

import com.backend.businesslogic.dto.CreateSessionRequest;
import com.backend.businesslogic.dto.SessionResponse;
import com.backend.businesslogic.entity.Session;
import com.backend.businesslogic.entity.User;
import com.backend.businesslogic.exception.ResourceNotFoundException;
import com.backend.businesslogic.exception.UnauthorizedException;
import com.backend.businesslogic.repository.SessionRepository;
import com.backend.businesslogic.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {
    
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    
    public SessionService(SessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public SessionResponse createSession(Long userId, CreateSessionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Session session = new Session();
        session.setUser(user);
        session.setTitle(request.getTitle());
        
        session = sessionRepository.save(session);
        
        return toResponse(session);
    }
    
    public Page<SessionResponse> getUserSessions(Long userId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        return sessionRepository.findByUserIdOrderByUpdatedAtDesc(userId, pageable)
                .map(this::toResponse);
    }
    
    @Transactional
    public void deleteSession(Long userId, Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        
        if (!session.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }
        
        sessionRepository.delete(session);
    }
    
    private SessionResponse toResponse(Session session) {
        return new SessionResponse(
                session.getId(),
                session.getUser().getId(),
                session.getTitle(),
                session.getCreatedAt(),
                session.getUpdatedAt()
        );
    }
}
