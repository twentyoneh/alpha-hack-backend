package com.backend.businesslogic.service;

import com.backend.businesslogic.dto.CreateMessageRequest;
import com.backend.businesslogic.dto.MessageResponse;
import com.backend.businesslogic.entity.Message;
import com.backend.businesslogic.entity.Session;
import com.backend.businesslogic.exception.ResourceNotFoundException;
import com.backend.businesslogic.exception.UnauthorizedException;
import com.backend.businesslogic.repository.MessageRepository;
import com.backend.businesslogic.repository.SessionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final SessionRepository sessionRepository;
    
    public MessageService(MessageRepository messageRepository, SessionRepository sessionRepository) {
        this.messageRepository = messageRepository;
        this.sessionRepository = sessionRepository;
    }
    
    @Transactional
    public MessageResponse createMessage(Long userId, CreateMessageRequest request) {
        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        
        if (!session.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }
        
        Message message = new Message();
        message.setSession(session);
        message.setRole(request.getRole());
        message.setContent(request.getContent());
        
        message = messageRepository.save(message);
        
        return toResponse(message);
    }
    
    public Page<MessageResponse> getMessageHistory(Long userId, Long sessionId, int page, int limit) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        
        if (!session.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }
        
        Pageable pageable = PageRequest.of(page, limit);
        return messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId, pageable)
                .map(this::toResponse);
    }
    
    private MessageResponse toResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getSession().getId(),
                message.getRole(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
