package twentuoneh.ru.requestservice.service.llm;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class LocalLlmClient implements LlmClient {

    // Если поднимали через: `run llama-3.2-1b-instruct:q4_k_m`
    // то имя модели в API, как правило, "llama-3.2-1b-instruct".
    // Если клали файл .gguf руками — укажите точное имя файла без расширения.
    private static final String MODEL = "llama-3.2-1b-instruct:q4_k_m";

    private final WebClient webClient;

    public LocalLlmClient(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public String generate(String prompt) {
        Map<String, Object> body = Map.of(
                "model", MODEL,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "stream", false,
                // При желании — тюнинги:
                "temperature", 0.7
                // "max_tokens", 512
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