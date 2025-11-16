package twentuoneh.ru.requestservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import twentuoneh.ru.requestservice.dto.MessageRequest;
import twentuoneh.ru.requestservice.dto.MessageResponse;
import twentuoneh.ru.requestservice.service.RequestService;

@RestController
@Tag(name = "Request", description = "API для отправки сообщений AI-ассистентам")
public class RequestController {

    @Autowired
    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @Operation(
            summary = "Отправить сообщение ассистенту",
            description = "Отправляет сообщение выбранному AI-ассистенту и получает ответ. " +
                    "Если sessionId не указан, создается новая сессия. " +
                    "Если userId не указан, создается новый пользователь."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Успешный ответ от ассистента",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "response": "Здравствуйте! Я бухгалтер-ассистент. Чем могу помочь?",
                                              "sessionId": 12345
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Некорректный запрос"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Внутренняя ошибка сервера"
            )
    })
    @PostMapping("/request")
    public ResponseEntity<MessageResponse> sendMessage(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Запрос с сообщением для ассистента",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "Новая сессия с бухгалтером",
                                            value = """
                                                    {
                                                      "sessionId": 12345,
                                                      "message": "Как правильно оформить счет-фактуру?",
                                                      "assistant": "ACCOUNTANT",
                                                      "userId": 1,
                                                      "userName": "Иван Иванов"
                                                    }
                                                    """
                                    ),
                                    @ExampleObject(
                                            name = "Продолжение существующей сессии",
                                            value = """
                                                    {
                                                      "sessionId": 12345,
                                                      "message": "А какие документы нужны для этого?",
                                                      "assistant": "ACCOUNTANT",
                                                      "userId": 1,
                                                      "userName": "Иван Иванов"
                                                    }
                                                    """
                                    ),
                                    @ExampleObject(
                                            name = "Запрос к юристу",
                                            value = """
                                                    {
                                                      "sessionId": 12345,
                                                      "message": "Какие права у работника при увольнении?",
                                                      "assistant": "LAWYER",
                                                      "userId": 2,
                                                      "userName": "Петр Петров"
                                                    }
                                                    """
                                    )
                            }
                    )
            )
            @RequestBody MessageRequest message
    ) {
        MessageResponse response = requestService.sendMessage(message);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
