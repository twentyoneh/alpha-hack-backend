package twentuoneh.ru.requestservice.service.assistants;

import org.springframework.stereotype.Component;
import twentuoneh.ru.requestservice.enums.Assistant;

import java.util.Map;

@Component
public class AssistantServiceFactory {
    private final Map<String, AssistantService> customServices;
    private final DefaultAssistantService defaultService;

    public AssistantServiceFactory(
            Map<String, AssistantService> customServices,
            DefaultAssistantService defaultService) {
        this.customServices = customServices;
        this.defaultService = defaultService;
    }

    public AssistantService getService(Assistant assistant) {
        String assistantName = assistant.name();

        AssistantService customService = customServices.get(assistantName);
        if (customService != null) {
            return customService;
        }
        return defaultService;
    }
}
