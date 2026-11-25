# Quulay eshik romlari — Mobile Landing Page

Мобильный лендинг для **Quulay eshik romlari** (оригинальные ПВХ-окна, двери и балконные системы **Ekopen** + подоконники **Pimaş**).

🌐 **Живая ссылка (Cloudflare, 24/7):**
https://quulay-eshik-romlari.iqboliddintoirov0333.workers.dev

## Основные разделы
- **Первый экран (mobile-first):** логотип `Quulay eshik romlari`, номер call-центра, оффер `BEPUL ZAMER + NARX JOYIDA HISOBLAB BERILADI`, 3D-витрина моделей на светящемся подиуме и плашки преимуществ.
- **6-шаговый фильтр записи на бесплатный замер:**
  1. `Nima o'rnatmoqchisiz?` (Oyna / Eshik / Balkon / Hammasi)
  2. `Obyekt turi:` (Yangi uy / Ta'mirlanayotgan / Almashtirish)
  3. `Qaysi tumanda?` (проверка рабочих районов + отдельный экран *«Bu hududga hozircha xizmat ko'rsatmaymiz»*)
  4. `Qachon o'rnatmoqchisiz?` (Shu oyda / 1-3 oy ichida / Hozircha narx bilmoqchiman)
  5. `Ism`
  6. `Telefon raqam` → `Bepul zamerga yozilish`
- **Материалы послойно (3D):** послойный 3D-разрез профиля с 5 интерактивными точками + интерактивный 3D-ползунок разделения слоёв.
- **Наши работы (3D):** 3D-визуализации реальных объектов по районам (Асака, Избоскан, Ботакора, Пахтаобод) с опциональным просмотром видео монтажа.

## Настройка (`config.js`)
В файле `config.js` можно быстро изменить:
- `phoneDisplay` / `phoneHref` — номер call-центра;
- `serviceDistricts` — список обслуживаемых районов;
- `showRealVideos` — показывать/скрывать кнопки реальных видео монтажа (`true` / `false`);
- `telegramBotToken` и `telegramChatId` — отправка заявок напрямую в Telegram.
