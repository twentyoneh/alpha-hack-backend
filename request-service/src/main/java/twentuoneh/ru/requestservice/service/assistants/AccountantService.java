package twentuoneh.ru.requestservice.service.assistants;

import org.springframework.stereotype.Service;
import twentuoneh.ru.requestservice.dto.ChatMessage;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;
import twentuoneh.ru.requestservice.enums.Assistant;
import twentuoneh.ru.requestservice.service.llm.LlmClient;

@Service("ACCOUNTANT")
public class AccountantService implements AssistantService {
    private final LlmClient llm;

    public AccountantService(LlmClient llm) {
        this.llm = llm;
    }

    @Override
    public MessageResponse handle(MessageRequest request) {
        var assistant = request.getAssistant().assistantName();
//        var chatMessage = new ChatMessage(Assistant.CONSULTANT.assistantName(), );
        //TODO: Переписать
        String result = llm.generate(assistant, , request.getMessage());
        return new MessageResponse(result);
    }
}
