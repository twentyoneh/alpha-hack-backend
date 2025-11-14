# Swagger API Documentation

## Доступ к документации

После запуска приложения Swagger UI доступен по адресу:

```
http://localhost:8081/swagger-ui.html
```

OpenAPI спецификация в JSON формате:
```
http://localhost:8081/api-docs
```

## Описание API

### POST /request

Отправляет сообщение выбранному AI-ассистенту и получает ответ.

**Доступные типы ассистентов:**
- `ACCOUNTANT` - Бухгалтер
- `LAWYER` - Юрист
- `MARKETING` - Маркетолог
- `COPYWRITER` - Копирайтер
- `HR` - HR-специалист
- `MANAGER` - Менеджер
- `CONSULTANT` - Консультант
- `DESIGNER` - Дизайнер
- `DEFAULT` - Базовый ассистент

**Примеры запросов:**

1. Новая сессия с бухгалтером:
```json
{
  "message": "Как правильно оформить счет-фактуру?",
  "assistant": "ACCOUNTANT",
  "userId": 1,
  "userEmail": "user@example.com",
  "userName": "Иван Иванов"
}
```

2. Продолжение существующей сессии:
```json
{
  "sessionId": 12345,
  "message": "А какие документы нужны для этого?",
  "assistant": "ACCOUNTANT",
  "userId": 1,
  "userEmail": "user@example.com",
  "userName": "Иван Иванов"
}
```

3. Запрос к юристу:
```json
{
  "message": "Какие права у работника при увольнении?",
  "assistant": "LAWYER",
  "userId": 2,
  "userEmail": "lawyer@example.com",
  "userName": "Петр Петров"
}
```

**Пример ответа:**
```json
{
  "response": "Здравствуйте! Я бухгалтер-ассистент. Чем могу помочь?",
  "sessionId": 12345
}
```

## Тестирование через Swagger UI

1. Откройте http://localhost:8081/swagger-ui.html
2. Найдите эндпоинт POST /request
3. Нажмите "Try it out"
4. Выберите один из примеров или введите свой JSON
5. Нажмите "Execute"
6. Посмотрите ответ в разделе "Response"
