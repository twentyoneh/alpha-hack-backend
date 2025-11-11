package twentuoneh.ru.requestservice.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
@Configuration
public class RequestConfig {

    @Bean
    public WebClient llmWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl("http://localhost:8080")
                .build();
    }
}
