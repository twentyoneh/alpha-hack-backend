package twentuoneh.ru.requestservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Ответ от AI-ассистента")
public class MessageResponse {
    
    @Schema(
            description = "Текст ответа от ассистента",
            example = "Счет-фактура оформляется согласно статье 169 НК РФ. Обязательные реквизиты: порядковый номер, дата составления, наименование продавца и покупателя, ИНН/КПП, адреса сторон..."
    )
    String response;
    
    @Schema(
            description = "ID сессии для продолжения диалога",
            example = "550e8400-e29b-41d4-a716-446655440000"
    )
    UUID sessionId;
}
