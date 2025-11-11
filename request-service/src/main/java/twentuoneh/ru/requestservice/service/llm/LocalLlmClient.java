package twentuoneh.ru.requestservice.service.llm;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class LocalLlmClient implements LlmClient {

    private final WebClient webClient;

    public LocalLlmClient(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public String generate(String prompt) {
        var body = Map.of(
                "model", "local",
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "stream", false
        );



        // В простом варианте возвращаем сырое тело ответа как строку.
        // При необходимости распарсить JSON и взять конкретное поле (choices[0].message.content) — добавить ObjectMapper.
        return webClient.post()
                .uri("/v1/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .onErrorResume(e -> Mono.just("LLM error: " + e.getMessage()))
                .block();
    }
}