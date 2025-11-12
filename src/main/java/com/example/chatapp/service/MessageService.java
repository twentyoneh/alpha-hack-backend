package com.example.chatapp.service;

import com.example.chatapp.entity.Message;
import com.example.chatapp.repository.MessageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    
    @Transactional(readOnly = true)
    public List<Message> getAllMessages() {
        var messages = messageRepository.findAll();
        log.info("Found {} messages", messages.size());
        return messages;
    }
    
    @Transactional(readOnly = true)
    public Message getMessageById(Integer id) {
        var message = messageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Message with id %s wasn't found", id)));
        log.info("Message found = {}", message);
        return message;
    }
    
    @Transactional(readOnly = true)
    public List<Message> getMessagesBySessionId(Integer sessionId) {
        var messages = messageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        log.info("Found {} messages for session id = {}", messages.size(), sessionId);
        return messages;
    }
    
    @Transactional(readOnly = true)
    public List<Message> searchMessages(String searchText) {
        var messages = messageRepository.searchByText(searchText);
        log.info("Found {} messages for search text = {}", messages.size(), searchText);
        return messages;
    }
    
    @Transactional
    public Message createMessage(Message message) {
        var savedMessage = messageRepository.save(message);
        log.info("Message created = {}", savedMessage);
        return savedMessage;
    }
    
    @Transactional
    public void deleteMessage(Integer id) {
        var message = getMessageById(id);
        messageRepository.deleteById(id);
        log.info("Message deleted with id = {}", id);
    }
}
