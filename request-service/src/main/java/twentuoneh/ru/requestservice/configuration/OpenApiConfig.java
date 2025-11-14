package twentuoneh.ru.requestservice.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI requestServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Request Service API")
                        .description("API для работы с AI-ассистентами различных специализаций")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("21H Team")
                                .url("https://twentuoneh.ru")));
    }
}
