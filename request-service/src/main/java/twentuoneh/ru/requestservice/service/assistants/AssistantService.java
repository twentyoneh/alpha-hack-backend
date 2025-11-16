package twentuoneh.ru.requestservice.service.assistants;

import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;

public interface AssistantService {
    MessageResponse handle(MessageRequest request);
}
