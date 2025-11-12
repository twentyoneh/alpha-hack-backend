package twentuoneh.ru.requestservice.dto;

import lombok.Data;
import org.springframework.boot.autoconfigure.jackson.JacksonProperties;
import twentuoneh.ru.requestservice.enums.Assistant;

@Data
public class MessageRequest {
    String sessionId;
    String message;
    Assistant assistant;

    Long userId;
    String userEmail;
    String userName;
}
