package twentuoneh.ru.requestservice.service.llm;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import twentuoneh.ru.requestservice.dto.ChatMessage;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.enums.Assistant;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LocalLlmClient implements LlmClient {

    private static final String MODEL = "llama-3.2-1b-instruct:q4_k_m";
    private static final int MAX_MESSAGES = 20;

    private final WebClient webClient;

    public LocalLlmClient(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public String generate(String assistant, List<ChatMessage> history, MessageRequest userMessage) {
        Map<String, Object> body = Map.of(
                "model", MODEL,
                "messages", convertToMessages(assistant, history, userMessage.getMessage()),
                "instruction", userMessage.getAssistant().systemPrompt(),
                "stream", false,
                "temperature", 0.7
        );

        return webClient.post()
                .uri("/v1/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .map(LocalLlmClient::extractContent)
                .onErrorResume(e -> Mono.just("LLM error: " + e.getMessage()))
                .block();
    }

    private List<Map<String, String>> convertToMessages(String assistant, List<ChatMessage> history, String userMessage) {
        List<Map<String, String>> messages = new ArrayList<>();

        // Конвертируем историю
        for (ChatMessage chatMessage : history) {
            messages.add(Map.of(
                    "role", chatMessage.role(),
                    "content", chatMessage.content()
            ));
        }

        // Добавляем текущее сообщение
        messages.add(Map.of("role", assistant, "content", userMessage));

        return messages;
    }

    @SuppressWarnings("unchecked")
    private static String extractContent(Map<?, ?> response) {
        try {
            var choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) return "LLM: empty choices";
            var first = choices.get(0);
            var message = (Map<String, Object>) first.get("message");
            if (message == null) return "LLM: missing message";
            var content = (String) message.get("content");
            return content != null ? content : "LLM: empty content";
        } catch (Exception ex) {
            return "LLM parse error: " + ex.getMessage();
        }
    }
}