package twentuoneh.ru.requestservice.service.assistants;

import twentuoneh.ru.requestservice.entity.Message;
import twentuoneh.ru.requestservice.entity.Session;
import twentuoneh.ru.requestservice.entity.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import twentuoneh.ru.requestservice.dto.ChatMessage;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;
import twentuoneh.ru.requestservice.repository.MessageRepository;
import twentuoneh.ru.requestservice.repository.SessionRepository;
import twentuoneh.ru.requestservice.repository.UserRepository;
import twentuoneh.ru.requestservice.service.llm.LlmClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service(value = "DEFAULT")
@Qualifier("chatService")
public class DefaultAssistantService implements AssistantService {
    private final LlmClient llm;
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final MessageRepository messageRepository;

    public DefaultAssistantService(LlmClient llm, UserRepository userRepository, SessionRepository sessionRepository, MessageRepository messageRepository) {
        this.llm = llm;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
    }

    @Override
    public MessageResponse handle(MessageRequest request) {
        var assistant = request.getAssistant().assistantName();
        var text = request.getMessage();

        User user = findOrCreateUser(request);
        Session session = findOrCreateSession(request, user);
        Message userMessage = saveMessage(session, assistant, text);

        String assistantResponse = generateAssistantResponse(session, request.getMessage());
        Message assistantMessage = saveMessage(session, assistant, assistantResponse);
        return new MessageResponse(assistantResponse, session.getId());
    }

//TODO:переписать
    private User findOrCreateUser(MessageRequest request) {
        if (request.getUserId() != null) {
            return userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        return createUser(request);
    }

    private User createUser(MessageRequest request) {
        User user = User.builder().
                name(request.getUserName()).
                email(request.getUserEmail()).
                createdAt(LocalDateTime.now()).
                build();
        return userRepository.save(user);
    }

    private Session findOrCreateSession(MessageRequest request, User user) {
        if (request.getSessionId() != null) {
            return sessionRepository.findById(request.getSessionId())
                    .orElseThrow(() -> new RuntimeException("Session not found"));
        }

        Session session = Session.builder().
            user(user).
            assistantRole(request.getAssistant().assistantName()).
            build();
        return sessionRepository.save(session);
    }

    private Message saveMessage(Session session, String role, String text) {
        Message message = Message.builder().
                session(session).
                role(role).
                text(text).
                build();
        return messageRepository.save(message);
    }

    private String generateAssistantResponse(Session session, String userMessage) {
        List<Message> history = messageRepository.findBySessionIdOrderByTimestampAsc(session.getId());
        List<ChatMessage> chatHistory = history.stream()
                .map(msg -> new ChatMessage(msg.getRole(), msg.getText()))
                .collect(Collectors.toList());

        return llm.generate(
                session.getAssistantRole(),
                chatHistory,
                userMessage
        );
    }
}
