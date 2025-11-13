package twentuoneh.ru.requestservice.service.llm;

import twentuoneh.ru.requestservice.dto.ChatMessage;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.enums.Assistant;

import java.util.List;

public interface LlmClient {
    String generate(String assistant, List<ChatMessage> history, MessageRequest userMessage);
}
