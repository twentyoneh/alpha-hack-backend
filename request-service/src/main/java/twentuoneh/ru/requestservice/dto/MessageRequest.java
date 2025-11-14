package twentuoneh.ru.requestservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import twentuoneh.ru.requestservice.enums.Assistant;

@Data
@Schema(description = "Запрос на отправку сообщения AI-ассистенту")
public class MessageRequest {
    
    @Schema(
            description = "ID существующей сессии (опционально). Если не указан, создается новая сессия",
            example = "12345"
    )
    Long sessionId;
    
    @Schema(
            description = "Текст сообщения для ассистента",
            example = "Как правильно оформить счет-фактуру?",
            required = true
    )
    String message;
    
    @Schema(
            description = "Тип ассистента",
            example = "ACCOUNTANT",
            required = true,
            allowableValues = {"ACCOUNTANT", "LAWYER", "MARKETING", "COPYWRITER", "HR", "MANAGER", "CONSULTANT", "DESIGNER", "DEFAULT"}
    )
    Assistant assistant;

    @Schema(
            description = "ID пользователя (опционально). Если не указан, создается новый пользователь",
            example = "1"
    )
    Long userId;
    
    @Schema(
            description = "Email пользователя",
            example = "user@example.com"
    )
    String userEmail;
    
    @Schema(
            description = "Имя пользователя",
            example = "Иван Иванов"
    )
    String userName;
}
