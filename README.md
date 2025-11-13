# Chat Application - Spring Boot + PostgreSQL

## Структура БД

- **User** - пользователи (id, name, email, createdAt, updatedAt)
- **Session** - сессии чата (id, userId, assistantRole, timestamp, createdAt)
- **Message** - сообщения в сессиях (id, sessionId, role, text, timestamp)

## Технологии

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Hibernate
- PostgreSQL
- Flyway (миграции БД)
- Lombok

## Запуск через Docker

### Быстрый старт:
```bash
docker-compose up -d
```

Приложение будет доступно на http://localhost:8080

### Остановка:
```bash
docker-compose down
```

### Пересборка:
```bash
docker-compose up -d --build
```

## Локальный запуск

### 1. Установите PostgreSQL 17
Скачайте и установите PostgreSQL 17 с официального сайта: https://www.postgresql.org/download/

### 2. Создайте БД:
```bash
psql -U postgres -f database-setup.sql
```

### 3. Запустите приложение:
```bash
mvn clean install
mvn spring-boot:run
```

Flyway автоматически выполнит миграции и создаст таблицы с тестовыми данными.

### Учетные данные БД:
- **Database:** copilotChat
- **User:** admin
- **Password:** xxXX1234
- **Host:** localhost
- **Port:** 5432

## Миграции БД

Миграции находятся в `src/main/resources/db/migration/`:
- `V1__create_initial_schema.sql` - создание таблиц и индексов
- `V2__add_sample_data.sql` - тестовые данные

## Репозитории

### UserRepository
- `findByEmail()` - поиск по email
- `existsByEmail()` - проверка существования email
- `findByNameContainingIgnoreCase()` - поиск по имени
- `findByIdWithSessions()` - загрузка пользователя с сессиями

### SessionRepository
- `findByUserId()` - все сессии пользователя
- `findByUserIdOrderByTimestampDesc()` - сессии с сортировкой
- `findByIdWithMessages()` - сессия с сообщениями
- `findRecentSessionsByUserId()` - последние N сессий
- `countByUserId()` - количество сессий

### MessageRepository
- `findBySessionIdOrderByTimestampAsc()` - сообщения сессии
- `searchByText()` - поиск по тексту
- `findRecentMessagesBySessionId()` - последние N сообщений
- `findLastMessageBySessionId()` - последнее сообщение
- `countBySessionId()` - количество сообщений

## Сервисы

- `UserService` - работа с пользователями
- `SessionService` - работа с сессиями
- `MessageService` - работа с сообщениями
