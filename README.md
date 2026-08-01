# 🚀 VibeCoder & AI Engineer Portfolio

Персональное портфолио: ИИ-агенты, парсеры Telegram-топиков, C/QMK прошивки клавиатур, калькулятор типографии и сервисы.

---

## 📌 Инструкция для ИИ-агентов и Разработчиков (AI Memory & Rules)

> [!IMPORTANT]
> **ПРАВИЛО РАЗРАБОТКИ**:
> Не редактируйте `index.html` напрямую! Проект использует модульную структуру.

### 🛠️ Архитектура и структура файлов

```
vibe_portfolio/
├── src/
│   ├── template.html              # Основной HTML-каркас (head, layout, markers)
│   └── sections/                  # Модульные секции (ИХ РЕДАКТИРУЕМ!)
│       ├── version-banner.html    # Плашка версии и коммита
│       ├── navbar.html            # Шапка и навигация
│       ├── hero.html              # Секция визитки VibeCoder
│       ├── tg-content.html        # Симулятор Telegram-топиков
│       ├── ai-influencer.html     # AI Influencer Inspector
│       ├── obsidian.html          # Obsidian & RAG Showcase
│       ├── firmware.html          # Редактор C/QMK прошивок
│       ├── devops.html            # Docker & DevOps стенд
│       ├── modals.html            # Модальные окна
│       └── footer.html            # Подвал
├── css/                           # Стили (variables.css, components/, sections/, responsive.css)
├── js/                            # Модули логики (ai-assistant.js, firmware-editor.js и др.)
├── calc/                          # Печатный калькулятор
├── api/                           # Cloudflare Worker (worker.js)
├── build.js                       # Скрипт сборщика (node build.js)
├── package.json                   # Скрипты (npm run build)
└── index.html                     # Сгенерированный итоговый файл (НЕ РЕДАКТИРОВАТЬ НАПРЯМУЮ!)
```

---

## ⚙️ Порядок работы и сборки

1. **Редактирование компонентов**:
   Все изменения в верстку вносятся исключительно в файлы подпапки `src/sections/*.html`.

2. **Сборка проекта**:
   После внесения изменений запустите сборку:
   ```bash
   npm run build
   # или
   node build.js
   ```
   Сборщик автоматически:
   - Обновит `version-banner.html` актуальным хэшем Git-коммита и датой.
   - Скомпонует все файлы из `src/sections/` в `src/template.html`.
   - Запишет итоговый результат в `index.html`.

3. **Деплой на GitHub Pages**:
   Деплой выполняется изолированно из папки проекта:
   ```bash
   git add .
   git commit -m "feat/fix: краткое описание на русском языке"
   git push origin main
   ```
   *GitHub Actions автоматически задеплоит обновленный проект на GitHub Pages.*
