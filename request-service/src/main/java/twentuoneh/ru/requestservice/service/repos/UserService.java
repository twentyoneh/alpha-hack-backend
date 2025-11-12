package twentuoneh.ru.requestservice.service.repos;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import twentuoneh.ru.requestservice.entity.User;
import twentuoneh.ru.requestservice.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        var users = userRepository.findAll();
        log.info("Found {} users", users.size());
        return users;
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("User with id %s wasn't found", id)));
        log.info("User found = {}", user);
        return Optional.ofNullable(user);
    }

//    @Transactional(readOnly = true)
//    public User getUserByEmail(String email) {
//        var user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new EntityNotFoundException(String.format("User with email %s wasn't found", email)));
//        log.info("User found = {}", user);
//        return user;
//    }

    @Transactional
    public User createUser(User user) {
        var savedUser = userRepository.save(user);
        log.info("User created = {}", savedUser);
        return savedUser;
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        var user = getUserById(id).orElseThrow(() -> new EntityNotFoundException(String.format("User with id %s wasn't found", id)));
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setUpdatedAt(LocalDateTime.now());
        var updatedUser = userRepository.save(user);
        log.info("User updated = {}", updatedUser);
        return updatedUser;
    }

    @Transactional
    public void deleteUser(Long id) {
        var user = getUserById(id);
        userRepository.deleteById(id);
        log.info("User deleted with id = {}", id);
    }

}

