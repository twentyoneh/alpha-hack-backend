package twentuoneh.ru.requestservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;
import twentuoneh.ru.requestservice.enums.Assistant;
import twentuoneh.ru.requestservice.service.assistants.AssistantService;
import twentuoneh.ru.requestservice.service.assistants.AssistantServiceFactory;
import twentuoneh.ru.requestservice.service.assistants.DefaultAssistantService;

import java.util.Map;

@Slf4j
@Service
public class RequestService {
    private final AssistantServiceFactory assistantServiceFactory;

    public RequestService(AssistantServiceFactory assistantServiceFactory) {
        this.assistantServiceFactory = assistantServiceFactory;
    }

    public MessageResponse sendMessage(MessageRequest message) {
        AssistantService assistant = assistantServiceFactory.getService(message.getAssistant());
        return assistant.handle(message);
    }
}
