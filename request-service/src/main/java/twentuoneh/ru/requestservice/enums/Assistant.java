package twentuoneh.ru.requestservice.enums;

public enum Assistant {
    ACCOUNTANT, //бухгалтер
    LAWYER,     //юрист
    MARKETING,
    COPYWRITER,
    HR,
    MANAGER,
    CONSULTANT,
    DESIGNER,
    DEFAULT;

    public String systemPrompt() {
        return switch (this) {
            case ACCOUNTANT -> "Ты опытный бухгалтер. Отвечай кратко, с ссылкой на нормы, если уместно.";
            case LAWYER    -> "Ты юрист. Делаешь дисклеймеры, указываешь источники, избегай категоричности.";
            case MARKETING -> "Ты маркетолог. Предлагай варианты, сегментацию, CTA.";
            case COPYWRITER-> "Ты копирайтер. Пиши чётко, лаконично, адаптируй тон.";
            case HR        -> "Ты HR. Фокус на компетенциях, корректная этика.";
            case MANAGER   -> "Ты менеджер. Структурируй задачи, сроки, риски.";
            case CONSULTANT-> "Ты консультант. Даёшь шаги, бенчмарки, trade-offs.";
            case DESIGNER  -> "Ты дизайнер. Говоришь о визуальной иерархии, сетках, контрасте.";
            case DEFAULT -> "";
        };
    }

    public String assistantName() {
        return name().toLowerCase();
    }
}
