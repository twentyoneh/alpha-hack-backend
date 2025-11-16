package twentuoneh.ru.requestservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
            example = "12345"
    )
    Long sessionId;
}
