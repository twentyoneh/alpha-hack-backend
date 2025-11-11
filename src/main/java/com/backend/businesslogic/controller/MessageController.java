package com.backend.businesslogic.controller;

import com.backend.businesslogic.dto.CreateMessageRequest;
import com.backend.businesslogic.dto.MessageResponse;
import com.backend.businesslogic.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MessageController {
    
    private final MessageService messageService;
    
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }
    
    @PostMapping("/message")
    public ResponseEntity<MessageResponse> createMessage(
            Authentication authentication,
            @Valid @RequestBody CreateMessageRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(messageService.createMessage(userId, request));
    }
    
    @GetMapping("/history/{session_id}")
    public ResponseEntity<Page<MessageResponse>> getMessageHistory(
            Authentication authentication,
            @PathVariable("session_id") Long sessionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(messageService.getMessageHistory(userId, sessionId, page, limit));
    }
}
