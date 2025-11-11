package twentuoneh.ru.requestservice.service;

import org.springframework.stereotype.Service;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;
import twentuoneh.ru.requestservice.service.assistants.AssistantService;

import java.util.Map;

@Service
public class RequestService {

    private final Map<String, AssistantService> assistants;

    public RequestService(Map<String, AssistantService> assistants) {
        this.assistants = assistants;
    }


    public MessageResponse sendMessage(MessageRequest message) {
        AssistantService svc = assistants.get(message.getAssistant().name());
        if (svc == null) {
            throw new IllegalArgumentException("Unsupported assistant type: " + message.getAssistant());
        }
        return svc.handle(message);
    }
}
