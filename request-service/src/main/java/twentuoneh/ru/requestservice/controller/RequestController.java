package twentuoneh.ru.requestservice.controller;

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
public class RequestController {

    @Autowired
    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping("/request")
    private ResponseEntity<MessageResponse> getEmployeeDetails(@RequestBody MessageRequest message) {
        MessageResponse employee = requestService.sendMessage(message);
        return ResponseEntity.status(HttpStatus.OK).body(employee);
    }
}
