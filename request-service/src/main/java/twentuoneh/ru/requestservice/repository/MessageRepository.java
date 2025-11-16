package twentuoneh.ru.requestservice.repository;

import org.springframework.data.domain.Sort;
import twentuoneh.ru.requestservice.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySession_IdOrderByTimestampAsc(Long sessionId);
    List<Message> findBySession_Id(Long sessionId, Sort sort);
}
