package com.example.chatapp.service;

import com.example.chatapp.entity.Message;
import com.example.chatapp.repository.MessageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    
    @Transactional(readOnly = true)
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Message getMessageById(Integer id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Message with id %s wasn't found", id)));
    }
    
    @Transactional(readOnly = true)
    public List<Message> getMessagesBySessionId(Integer sessionId) {
        return messageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }
    
    @Transactional(readOnly = true)
    public List<Message> searchMessages(String searchText) {
        return messageRepository.searchByText(searchText);
    }
    
    @Transactional
    public Message createMessage(Message message) {
        return messageRepository.save(message);
    }
    
    @Transactional
    public void deleteMessage(Integer id) {
        getMessageById(id);
        messageRepository.deleteById(id);
    }
}
