# Аудит связности экранов post-order flow (Kircraft)

## 1. Экраны post-order flow

| ID экрана | Название (отображение) | Роль |
|-----------|------------------------|------|
| `post-order-demo` | Post-order flow (демо-навигация) | Служебный (демо) |
| `post-order-new` | Новый заказ у мастера | Мастер |
| `post-order-confirmed` | Заказ подтверждён | Клиент |
| `post-order-clarification` | Требуется уточнение | Клиент |
| `post-order-in-progress` | Заказ в работе | Клиент |
| `post-order-shipped` | Заказ отправлен | Клиент |
| `post-order-rejected` | Заказ отклонён | Клиент |
| `post-order-payment-received` | Оплата получена | Клиент |
| `master-order-paid` | Заказ #ID (Оплаченный заказ) | Мастер |
| `master-order-in-production` | Заказ в работе (мастер) | Мастер |
| `order-cancelled-auto` | Заказ #1024 отменён | Клиент |
| `order-cancel-confirm` | Подтверждение отмены заказа | Клиент |
| `order-detail` | Карточка заказа | Клиент |
| main-menu (кнопка «Мои заказы») | — | Клиент (вход в order-detail) |

---

## 2. Таблица экранов: входы, кнопки, переходы

| Экран | Вход (откуда можно попасть) | Кнопки | Переход |
|-------|-----------------------------|--------|---------|
| **post-order-demo** | main-menu (через меню «⋯» → Post-order flow) | Заказ подтверждён | post-order-confirmed |
| | | Требуется уточнение | post-order-clarification |
| | | Заказ в работе | post-order-in-progress |
| | | Заказ отправлен | post-order-shipped |
| | | Заказ отклонён | post-order-rejected |
| | | Оплата получена | post-order-payment-received |
| | | Заказ отменён автоматически | order-cancelled-auto |
| | | Новый заказ у мастера | post-order-new |
| | | Оплаченный заказ | master-order-paid |
| | | Главное меню | main-menu |
| **post-order-new** (Новый заказ у мастера) | post-order-demo | Подтвердить заказ | post-order-confirmed |
| | | Запросить уточнение | post-order-clarification |
| | | Отклонить | post-order-rejected |
| | | Назад | post-order-demo |
| **post-order-confirmed** (Заказ подтверждён) | post-order-demo, post-order-new | Перейти к оплате | post-order-payment-received |
| | | Отменить заказ | order-cancel-confirm |
| **order-cancel-confirm** | post-order-confirmed | Отменить заказ | main-menu (и activeOrder = null) |
| | | Вернуться | post-order-confirmed |
| **post-order-payment-received** (Оплата получена) | post-order-demo, post-order-confirmed (после оплаты) | Посмотреть заказ | order-detail |
| | | Главное меню | main-menu |
| **order-detail** (Карточка заказа) | post-order-payment-received, main-menu (Мои заказы) | Написать мастеру | — (нет перехода) |
| | | Главное меню | main-menu |
| **order-cancelled-auto** (Заказ отменён) | post-order-demo | Повторить заказ | main-menu |
| | | Написать мастеру | — (нет перехода) |
| | | Главное меню | main-menu |
| **post-order-clarification** | post-order-demo, post-order-new | Связаться с мастером | main-menu |
| | | Главное меню | main-menu |
| **post-order-in-progress** | post-order-demo | Главное меню | main-menu |
| **post-order-shipped** | post-order-demo | Главное меню | main-menu |
| **post-order-rejected** | post-order-demo, post-order-new | Связаться с мастером | main-menu |
| | | Главное меню | main-menu |
| **master-order-paid** (Оплаченный заказ) | post-order-demo | Взять в работу | master-order-in-production |
| | | Назад к заказам | post-order-demo |
| **master-order-in-production** | master-order-paid | Отправить заказ | post-order-demo |
| | | Назад | master-order-paid |

---

## 3. Проверка связности

### 3.1 Входы на экраны

| Экран | Есть хотя бы один вход? | Комментарий |
|-------|--------------------------|-------------|
| post-order-demo | ✅ Да | main-menu (выпадающее меню) |
| post-order-new | ✅ Да | post-order-demo |
| post-order-confirmed | ✅ Да | post-order-demo, post-order-new |
| post-order-clarification | ✅ Да | post-order-demo, post-order-new |
| post-order-in-progress | ✅ Да | post-order-demo |
| post-order-shipped | ✅ Да | post-order-demo |
| post-order-rejected | ✅ Да | post-order-demo, post-order-new |
| post-order-payment-received | ✅ Да | post-order-demo, post-order-confirmed |
| master-order-paid | ✅ Да | post-order-demo |
| master-order-in-production | ✅ Да | master-order-paid |
| order-cancelled-auto | ✅ Да | post-order-demo |
| order-cancel-confirm | ✅ Да | post-order-confirmed |
| order-detail | ✅ Да | post-order-payment-received, main-menu (Мои заказы) |

**Вывод:** «висячих» экранов без входа нет.

### 3.2 Кнопки без перехода внутри приложения

| Экран | Кнопка | Переход | Проблема? |
|-------|--------|---------|-----------|
| order-detail | Написать мастеру | Нет (нет onClick с setScreen) | ⚠️ Кнопка не ведёт на экран; ожидаемо — внешнее действие (Telegram/ссылка) |
| order-cancelled-auto | Написать мастеру | Нет | ⚠️ То же |
| main-menu | Написать мастеру | Нет | ⚠️ То же (глобальное меню) |

**Вывод:** Кнопки «Написать мастеру» / «Связаться с мастером» не меняют экран — в прототипе это допустимо (заглушка под будущую ссылку/действие). Для аудита «переходов по экранам» считаем: у каждой кнопки либо есть переход на экран, либо явное внешнее действие.

### 3.3 Роли (клиент / мастер)

- **Клиентские экраны** доступны из post-order-demo (демо-меню) и по сценарию: подтверждён → оплата → карточка; отмена через order-cancel-confirm. Карточка заказа и «Мои заказы» — только для клиента.
- **Мастерские экраны** (post-order-new, master-order-paid, master-order-in-production) доступны только из post-order-demo по кнопкам «Новый заказ у мастера» и «Оплаченный заказ». Отдельного входа «для клиента» на экраны мастера нет.

**Вывод:** Разделение ролей соблюдено: мастерские экраны не показываются в клиентском сценарии (оформление → подтверждение → оплата → карточка / Мои заказы).

---

## 4. Потенциальные проблемы

### 4.1 Кнопки без перехода внутри приложения

1. **«Написать мастеру»** на экранах order-detail, order-cancelled-auto, main-menu — без `onClick` с навигацией. В продакшене обычно ведут в Telegram или на контакт.  
   **Рекомендация:** оставить как есть для прототипа или добавить заглушку (например, `window.open` или переход на отдельный экран «Связаться с мастером»).

### 4.2 Нет прямого входа на post-order-demo из основного потока

2. **post-order-demo** открывается только из главного меню через выпадающее меню (⋯). Пользователь может не найти демо.  
   **Рекомендация:** не обязательно менять, если демо предназначено только для тестов; при необходимости добавить явную кнопку «Демо: сценарии заказа» на main-menu.

### 4.3 Дублирование по смыслу

3. **«Заказ в работе»** есть в двух вариантах: клиентский (`post-order-in-progress`) и мастерский (`master-order-in-production`). Разные экраны и роли — дублирования сценария нет, но названия похожи.  
   **Рекомендация:** в UI можно уточнять: «Заказ в работе (клиент)» / «Заказ в работе (мастер)» в демо-меню, если нужно различать.

### 4.4 Выход только в главное меню

4. У экранов **post-order-in-progress**, **post-order-shipped** только одна кнопка — «Главное меню». Нет перехода «Посмотреть заказ» (в карточку).  
   **Рекомендация:** для связности можно добавить кнопку «Посмотреть заказ» → order-detail на этих экранах (как на «Оплата получена»), чтобы клиент мог перейти в карточку из любого состояния.

### 4.5 order-detail при отсутствии заказа

5. При открытии **order-detail** без `activeOrder` показывается «Нет данных о заказе» и кнопка «Главное меню». Вход возможен с «Оплата получена» (где activeOrder задаётся) и с «Мои заказы» (тоже при наличии activeOrder). Случай «пустой» карточки возможен только при сбросе состояния или прямом вызове.  
   **Рекомендация:** оставить текущее поведение; при необходимости логировать такие переходы для отладки.

---

## 5. Итоговые таблицы и выводы

### 5.1 Сводная таблица переходов (куда ведёт каждый экран)

| Из экрана | Возможные переходы |
|-----------|---------------------|
| post-order-demo | post-order-confirmed, post-order-clarification, post-order-in-progress, post-order-shipped, post-order-rejected, post-order-payment-received, order-cancelled-auto, post-order-new, master-order-paid, main-menu |
| post-order-new | post-order-confirmed, post-order-clarification, post-order-rejected, post-order-demo |
| post-order-confirmed | post-order-payment-received, order-cancel-confirm |
| order-cancel-confirm | main-menu, post-order-confirmed |
| post-order-payment-received | order-detail, main-menu |
| order-detail | main-menu (Написать мастеру — без перехода) |
| order-cancelled-auto | main-menu (Написать мастеру — без перехода) |
| post-order-clarification | main-menu |
| post-order-in-progress | main-menu |
| post-order-shipped | main-menu |
| post-order-rejected | main-menu |
| master-order-paid | master-order-in-production, post-order-demo |
| master-order-in-production | post-order-demo, master-order-paid |

### 5.2 Список найденных проблем

1. **Кнопки «Написать мастеру» / «Связаться с мастером»** на order-detail, order-cancelled-auto и main-menu не выполняют перехода по экранам (в прототипе допустимо).
2. **post-order-in-progress** и **post-order-shipped** не имеют кнопки «Посмотреть заказ» — клиент не может из демо перейти в карточку заказа с этих экранов.
3. **post-order-demo** доступен только через выпадающее меню главного экрана — для демо приёмлемо.

### 5.3 Рекомендации по исправлению

1. **Написать мастеру:** оставить как есть или добавить единое действие (например, открытие t.me/… или экран «Чат с мастером») для всех кнопок «Написать мастеру» / «Связаться с мастером».
2. **Единообразие клиентских экранов:** на «Заказ в работе» и «Заказ отправлен» добавить кнопку «Посмотреть заказ» → order-detail, чтобы поток совпадал с экраном «Оплата получена».
3. **Демо-меню:** при необходимости сделать вход в post-order-demo более заметным (отдельная кнопка на main-menu или подпись в меню ⋯).
4. Остальные экраны имеют входы и корректные переходы; разделение клиент/мастер соблюдено.
