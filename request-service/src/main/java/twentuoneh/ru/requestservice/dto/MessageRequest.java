package twentuoneh.ru.requestservice.dto;

import lombok.Data;
import twentuoneh.ru.requestservice.enums.Assistant;

@Data
public class MessageRequest {
    String sessionId;
    String message;
    Assistant assistant;
}
