package com.example.chatapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "\"Session\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "userid", nullable = false)
    private Integer userId;
    
    @Column(name = "assistantrole", nullable = false)
    private String assistantRole;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @CreationTimestamp
    @Column(name = "createdat", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;
    
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<Message> messages;
}
