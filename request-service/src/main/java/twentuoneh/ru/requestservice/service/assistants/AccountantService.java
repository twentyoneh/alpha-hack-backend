package twentuoneh.ru.requestservice.service.assistants;

import org.springframework.stereotype.Service;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;
import twentuoneh.ru.requestservice.service.llm.LlmClient;

@Service("ACCOUNTANT")
public class AccountantService implements AssistantService {
    private final LlmClient llm;

    public AccountantService(LlmClient llm) {
        this.llm = llm;
    }

    @Override
    public MessageResponse handle(MessageRequest request) {
        String prompt = buildPrompt(request);
        String result = llm.generate(prompt);
        return new MessageResponse(result);
    }

    //TODO: доработать формирование запроса
    private String buildPrompt(MessageRequest req) {
        // формируем запрос под бухгалтера
        return "Accountant: " + req.getMessage();
    }
}
