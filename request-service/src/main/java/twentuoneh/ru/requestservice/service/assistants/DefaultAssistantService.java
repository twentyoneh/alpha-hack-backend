package twentuoneh.ru.requestservice.service.assistants;

import org.springframework.stereotype.Service;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;
import twentuoneh.ru.requestservice.service.llm.LlmClient;

@Service("ACCOUNTANT")
public class DefaultAssistantService implements AssistantService {
    private final LlmClient llm;

    public DefaultAssistantService(LlmClient llm) {
        this.llm = llm;
    }

    @Override
    public MessageResponse handle(MessageRequest request) {
        var assistant = request.getAssistant().assistantName();

//        User user = new User().builder().


//        Session session = new Session().builder().
//        userId(request.getUserId()).
//        assistantRole(request.getAssistant().assistantName()).
//                build();


//
//        Message message = new Message();
//        message.setSessionId(sessionId);
//        message.setRole("user"); // для пользовательских сообщений
//        message.setText(request.getMessage());

//        var chatMessage = new ChatMessage(Assistant.CONSULTANT.assistantName(), );
        //TODO: Переписать
        //String result = llm.generate(assistant, , request.getMessage());
//        return new MessageResponse(result);
        return null;
    }
}
