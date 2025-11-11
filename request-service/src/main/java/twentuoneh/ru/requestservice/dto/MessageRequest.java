package twentuoneh.ru.requestservice.entity;

import lombok.Data;
import twentuoneh.ru.requestservice.enums.Assistant;

@Data
public class MessageRequest {
    String message;
    Assistant assistant;
}
