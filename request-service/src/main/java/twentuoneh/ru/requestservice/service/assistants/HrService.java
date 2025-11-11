package twentuoneh.ru.requestservice.service.assistants;

import org.springframework.stereotype.Service;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;

@Service
public class HrService implements AssistantService {
    @Override
    public MessageResponse handle(MessageRequest request) {
        return null;
    }
}
