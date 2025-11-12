package twentuoneh.ru.requestservice.repository;

import twentuoneh.ru.requestservice.entity.Message;

import java.util.List;

public interface MessageRepositoryCustom {
    List<Message> findActiveByExternalId(Long externalSessionId);
}
