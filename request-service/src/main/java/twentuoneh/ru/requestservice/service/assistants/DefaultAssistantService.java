package twentuoneh.ru.requestservice.service.assistants;

import twentuoneh.ru.requestservice.entity.Message;
import twentuoneh.ru.requestservice.entity.Session;
import twentuoneh.ru.requestservice.entity.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import twentuoneh.ru.requestservice.dto.ChatMessage;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;
import twentuoneh.ru.requestservice.service.llm.LlmClient;
import twentuoneh.ru.requestservice.service.repos.MessageService;
import twentuoneh.ru.requestservice.service.repos.SessionService;
import twentuoneh.ru.requestservice.service.repos.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service(value = "DEFAULT")
@Qualifier("chatService")
public class DefaultAssistantService implements AssistantService {
    private final LlmClient llm;
    private final MessageService messageService;
    private final SessionService sessionService;
    private final UserService userService;
    

    public DefaultAssistantService(LlmClient llm, UserService userService, SessionService sessionService, MessageService messageService) {
        this.llm = llm;
        this.userService = userService;
        this.sessionService = sessionService;
        this.messageService = messageService;
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

    private User findOrCreateUser(MessageRequest request) {
        if (request.getUserId() != null) {
            return userService.getUserById(request.getUserId())
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
        return userService.createUser(user);
    }

    private Session findOrCreateSession(MessageRequest request, User user) {
        if (request.getSessionId() != null) {
            return sessionService.getSessionById(request.getSessionId())
                    .orElseThrow(() -> new RuntimeException("Session not found"));
        }

        Session session = Session.builder().
            user(user).
            assistantRole(request.getAssistant().assistantName()).
            build();
        return sessionService.createSession(session);
    }

    private Message saveMessage(Session session, String role, String text) {
        Message message = Message.builder().
                session(session).
                role(role).
                text(text).
                build();
        return messageService.createMessage(message);
    }

    private String generateAssistantResponse(Session session, String userMessage) {
        List<Message> history = messageService.findBySessionIdOrderByTimestampAsc(session.getId());
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
