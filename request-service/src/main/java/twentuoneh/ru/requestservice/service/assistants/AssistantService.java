package twentuoneh.ru.requestservice.service.assistants;

import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;

//TODO: надо подумать нужно ли мне так много сервисов
public interface AssistantService {
    MessageResponse handle(MessageRequest request);
}
