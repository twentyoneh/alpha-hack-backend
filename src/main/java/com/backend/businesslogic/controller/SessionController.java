package com.backend.businesslogic.controller;

import com.backend.businesslogic.dto.CreateSessionRequest;
import com.backend.businesslogic.dto.SessionResponse;
import com.backend.businesslogic.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SessionController {
    
    private final SessionService sessionService;
    
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }
    
    @PostMapping("/session")
    public ResponseEntity<SessionResponse> createSession(
            Authentication authentication,
            @Valid @RequestBody CreateSessionRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(sessionService.createSession(userId, request));
    }
    
    @GetMapping("/sessions")
    public ResponseEntity<Page<SessionResponse>> getUserSessions(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(sessionService.getUserSessions(userId, page, limit));
    }
    
    @DeleteMapping("/session/{id}")
    public ResponseEntity<Void> deleteSession(
            Authentication authentication,
            @PathVariable Long id) {
        Long userId = (Long) authentication.getPrincipal();
        sessionService.deleteSession(userId, id);
        return ResponseEntity.noContent().build();
    }
}
