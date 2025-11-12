package twentuoneh.ru.requestservice.repository;

import twentuoneh.ru.requestservice.entity.Message;

import java.util.List;

public class MessageRepositoryImpl implements MessageRepositoryCustom {
    @Override
    public List<Message> findActiveByExternalId(Long externalSessionId) {
        return null;
    }
}
