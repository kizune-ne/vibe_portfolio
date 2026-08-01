/* ==========================================================================
   CASE STUDIES DATA - STAR METHODOLOGY CASE DATA FOR EMPLOYERS
   ========================================================================== */

export const CASES_DATA = {
  'docker-ai': {
    id: 'docker-ai',
    badge: '07 // INFRASTRUCTURE & CONTAINER ORCHESTRATION',
    title: 'Автономный AI Server & DevContainer Инфраструктура',
    subtitle: 'Изолированная среда локальных LLM (Qwen 3.5 / Qwen 3.6 Coder), проброс GPU CUDA, безопасные Bind Mounts и автоматизация DevContainer.',
    role: 'DevOps / AI Infrastructure Engineer',
    metrics: [
      { value: 'TTFT < 250ms', label: 'Задержка первого токена' },
      { value: '45+ tok/s', label: 'Скорость Qwen 3.5 CUDA' },
      { value: '16 GB', label: 'VRAM RTX 4070 Ti SUPER' },
      { value: '100%', label: 'Изоляция секретов (_keys/)' }
    ],
    problem: `При разработке и запуске нескольких ИИ-сервисов (Ollama, Qwen 3.5 Coder, Open-WebUI, Telegram-боты) возникали риски:
• Конфликты системных пакетов Python и внешних зависимостей между ОС и контейнерами.
• Риск попадания приватных API-ключей и токенов в публичные Git-репозитории.
• Необходимость проброса GPU CUDA в изолированную рабочую среду без снижения пропускной способности.`,
    solution: `Спроектирована и развернута гибкая микросервисная архитектура на базе Docker Compose:
1. **NVIDIA Container Toolkit Integration**: Настроен проброс видеокарты RTX 4070 Ti SUPER (16GB VRAM) в контейнер \`ollama\` с поддержкой моделей Qwen 3.5 / 3.6 Coder и опцией удержания в памяти (\`OLLAMA_KEEP_ALIVE: 10m\`).
2. **VS Code DevContainer Workspace**: Вынесение виртуального окружения Python (\`.venv\`) и \`node_modules\` во внешние монтируемые тома. Хост-ОС Windows остается чистой.
3. **Безопасность Секретов**: Использование \`Bind Mounts\` для директории \`_keys/\`, содержащей .env и SSH-ключи. Все секреты изолированы от контейнеров и закрыты в \`.gitignore\`.
4. **Фоновый Патчер Расширений**: Стартовый скрипт \`docker-entrypoint.sh\` автоматически копирует встроенный ИИ (Antigravity) во внешнюю папку и подчищает дубликаты, сохраняя Workspace-режим сессии без конфликтов с Git.`,
    results: `• Развернута 100% стабильная, масштабируемая среда для разработки локальных ИИ-агентов.
• Время поднятия готовой среды с нуля сокращено до 1 команды (\`docker compose up -d\`).
• Исключена вероятность утечки секретов и случайной деградации хост-системы.`,
    architecture: {
      title: 'Архитектура AI Server & GPU-Контейнеризация',
      desc: 'Спроектирована двухуровневая среда на базе Docker Compose с пробросом аппаратных ускорителей хоста и безопасной изоляцией конфиденциальных файлов.',
      highlights: [
        { icon: 'cpu', title: 'NVIDIA CUDA Passthrough', desc: 'Интеграция NVIDIA Container Toolkit для прямого использования 16GB VRAM RTX 4070 Ti SUPER в контейнере ollama.' },
        { icon: 'hard-drive', title: 'DevContainer Volume Isolation', desc: 'Вынос виртуальных окружений Python (.venv) и зависимостей во внешние тома без загрязнения ОС Windows.' },
        { icon: 'shield-check', title: 'Entrypoint Extension Patcher', desc: 'Фоновый стартовый скрипт docker-entrypoint.sh, монтирующий расширение встроенного ИИ (Antigravity) и очищающий дубликаты.' }
      ]
    },
    techStack: [
      { name: 'Docker / Compose', icon: 'container' },
      { name: 'NVIDIA CUDA Toolkit', icon: 'cpu' },
      { name: 'Ollama / Qwen 3.5 / 3.6 Coder', icon: 'bot' },
      { name: 'VS Code DevContainers', icon: 'terminal' },
      { name: 'Linux / Bash Scripting', icon: 'hard-drive' }
    ],
    links: [
      { label: 'Схема Топологии на Сайте', targetId: 'infrastructure', icon: 'network' }
    ]
  },

  'tg-automation': {
    id: 'tg-automation',
    badge: '01 // PYTHON & TELEGRAM AUTOMATION',
    title: 'Потоковый Telegram-Парсер с топик-роутингом & Deduplication',
    subtitle: 'Асинхронная обработка потоков сообщений из 50+ Telegram-каналов, фильтрация рекламы, защита БД от дубликатов и суммаризация через Qwen 3.5.',
    role: 'Python / Telegram Automation Developer',
    metrics: [
      { value: '10,000+', label: 'Сообщений / день' },
      { value: '< 2 sec', label: 'Скорость роутинга' },
      { value: '0 дублей', label: 'Защита БД от повторов' },
      { value: '24/7', label: 'Асинхронный скрапинг' }
    ],
    problem: `При постоянном мониторинге десятков профильных Telegram-каналов возникают сложности:
• Высокая зашумленность рекламными сообщениями и репостами одного и того же события из разных источников.
• Риск повторной записи одинаковых постов в базу данных и дублирования публикаций в целевых группах.
• Риски блокировки аккаунтов/сессий Telegram при частых высоконагруженных запросах.`,
    solution: `Создана асинхронная высокопроизводительная система парсинга и дедупликации:
1. **Асинхронное Ядро (Telethon / Pyrogram)**: Реализована защита от банов с использованием пула прокси-серверов с ротацией и экспоненциальными задержками (backoff).
2. **Deduplication & DB Engine**: Алгоритм хэширования текстовых фрагментов и MD5-сигнатур медиафайлов. При обнаружении повтора одной новости из разных каналов запись в БД не дублируется.
3. **Topic Routing Manager**: Интеграция с Telegram Bot API для авто-создания и маршрутизации входящих постов по тематическим топикам супергруппы.
4. **Суммаризация через Qwen 3.5**: Подключение локальной модели Qwen 3.5 для авто-составления сжатых выжимок из длинных лонгридов.`,
    results: `• Автоматизирован сбор новостей и сигналов без участия человека и без дублирования контента.
• Экономия более 15 часов рабочего времени в неделю на ручной сортировке новостных лент.
• База данных очищена от спама, рекламы и повторяющихся публикаций.`,
    architecture: {
      title: 'Архитектура Потокового Парсинга & Дедупликации',
      desc: 'Асинхронный многопоточный пайплайн для обработки сотен сообщений в минуту без риска блокировки сессий.',
      highlights: [
        { icon: 'refresh-cw', title: 'Async Telethon Engine & Proxy Pool', desc: 'Асинхронное ядро с ротацией прокси-серверов и экспоненциальными задержками для защиты Telegram-сессий.' },
        { icon: 'database', title: 'Deduplication & Hash Engine', desc: 'Проверка MD5-хэшей изображений/видео и хэширование фрагментов текста для предотвращения повторных записей в БД.' },
        { icon: 'message-square', title: 'Topic Routing & Qwen Summarizer', desc: 'Автоматическая раскладка входящего потока по топикам супергруппы с ИИ-суммаризацией постов через Qwen 3.5.' }
      ]
    },
    techStack: [
      { name: 'Python 3.13 (Asyncio)', icon: 'code' },
      { name: 'Telethon / Pyrogram', icon: 'send' },
      { name: 'Telegram Bot API', icon: 'message-square' },
      { name: 'Qwen 3.5 LLM Engine', icon: 'sparkles' },
      { name: 'Proxy Rotation & Hash Engine', icon: 'shield-check' }
    ],
    links: [
      { label: 'Симулятор TG Бота на Сайте', targetId: 'telegram', icon: 'message-square' }
    ]
  },

  'ai-assistant': {
    id: 'ai-assistant',
    badge: '00 // FULLSTACK & SERVERLESS AI',
    title: 'Serverless ИИ-Ассистент (Cascade Routing: Gemini 3.5 & Gemma 4)',
    subtitle: 'Безопасная интеграция Google AI Studio в портфолио: каскадный роутинг между 4 моделями (Gemini 3.5 Flash Lite / Gemma 4), защита секретов на Cloudflare Worker и обход лимитов.',
    role: 'Fullstack AI Web Developer',
    metrics: [
      { value: '100% Free', label: 'Serverless Хостинг' },
      { value: '< 400ms', label: 'Отклик Multi-Model API' },
      { value: '0 Keys', label: 'Утечек в клиентском коде' },
      { value: '4 Models', label: 'Каскадное переключение' }
    ],
    problem: `При вызове LLM напрямую с фронтенда веб-сайта портфолио проявляются фундаментальные уязвимости:
• Приватный API-ключ Gemini / Google AI Studio оказывается открыт в сетевых запросах браузера.
• Превышение лимитов запросов (Rate Limit) посетителями может заблокировать работу ассистента.
• При отсутствии сети или сбое API ассистент перестает отвечать.`,
    solution: `Разработана трехслойная защищенная архитектура ИИ-чата:
1. **Cloudflare Worker Proxy (Serverless)**: Создан промежуточный микросервис на Cloudflare Workers, где сохранен секретный массив ключей \`GEMINI_API_KEYS\`.
2. **CORS & Rate Limiting Guard**: Настройка заголовков безопасности, позволяющих вызывать API только с официального домена портфолио.
3. **Smart LLM Routing Engine**: Интеллектуальный каскадный перебор моделей (Gemini 3.5 Flash / Gemma 4) и ключей при достижении Rate Limit.`,
    results: `• Полностью безопасная интеграция ИИ-чата в портфолио без риска компрометации API-ключей.
• Высокая скорость ответов и 100% аптайм благодаря роутингу моделей и пулу ключей.`,
    architecture: {
      title: 'Схема Защищенного Вызова ИИ в Браузере',
      desc: 'Безопасный прокси-слой между клиентским JavaScript и Google AI Studio API.',
      highlights: [
        { icon: 'shield-check', title: 'Cloudflare Worker Security Proxy', desc: 'Шифрование API-ключей и проверка домена источника запроса (CORS Guard).' },
        { icon: 'zap', title: 'Smart LLM Cascade Routing', desc: 'Динамический перебор пула ключей и моделей (Gemini 3.5 / Gemma 4) для защиты от Rate Limit.' },
        { icon: 'cpu', title: 'Response Sanitizer Engine', desc: 'Автоматическая очистка ответов от тегов <think> и мыслей (Thought Process) перед отдачей в чат.' }
      ]
    },
    techStack: [
      { name: 'JavaScript ES6 Modules', icon: 'code' },
      { name: 'Cloudflare Workers (Edge)', icon: 'cloud' },
      { name: 'Gemini 3.5 / Gemma 4 API', icon: 'sparkles' },
      { name: 'Fetch API / Async JSON', icon: 'refresh-cw' },
      { name: 'Lucide SVG Icons', icon: 'layout' }
    ],
    links: [
      { label: 'Чат с ИИ-Ассистентом на Сайте', targetId: 'ai-assistant', icon: 'bot' }
    ]
  },

  'firmware-editor': {
    id: 'firmware-editor',
    badge: '06 // HARDWARE INTEGRATION & VIAL PORTING',
    title: 'Кастомная C-Прошивка Клавиатуры M1 V5 (QMK / Vial)',
    subtitle: 'Низкоуровневая C-прошивка микроконтроллера клавиатуры с поддержкой нескольких слоев (Layers), Tap-Dance, макросов и динамической конфигурации через Vial.',
    role: 'Embedded C / Firmware Developer',
    metrics: [
      { value: '< 1ms', label: 'Задержка ввода (Latency)' },
      { value: '4 Layers', label: 'Функциональных слоя' },
      { value: 'Tap-Dance', label: 'Двойные действия клавиш' },
      { value: 'Vial Direct', label: 'Настройка без перепрошивки' }
    ],
    problem: `При активной разработке кода и работе на кастомной механической клавиатуре стандартные раскладки неудобны:
• Требуются частые тяготения к стрелкам, клавишам Esc, F1-F12, что снижает скорость печатного набора.
• Отсутствует быстрая возможность вызова спецсимволов для кодинга (\`{\`, \`}\`, \`[\`, \`]\`, \`=>\`, \`->\`).
• Стандартная прошивка требует полного компилирования при каждом изменении назначений клавиш.`,
    solution: `Скомпилирована и настроена специализированная низкоуровневая C-прошивка QMK с модулем Vial:
1. **Слой Навигации & Кодинга**: Создан слой 1 для моментального доступа к стрелкам и блоку управления через зажатый CapsLock (Nav Layer).
2. **C-Макросы & Tap-Dance**: Функция Tap-Dance (одиночное нажатие — обычная буква, удержание — спецсимвол кодинга).
3. **Vial Dynamic EEPROM**: Подключение динамической памяти EEPROM для переназначения клавиш "на лету" без пересборки C-файлов.`,
    results: `• Увеличена скорость кодинга за счет быстрой навигации без отрыва рук от домашнего ряда (Home Row).
• Устранена рутина при перепрошивке микроконтроллера.`,
    architecture: {
      title: 'Архитектурная Схема QMK C-Прошивки',
      desc: 'Двухуровневая архитектура с обработкой клавишных матриц на C и Vial EEPROM слоем.',
      highlights: [
        { icon: 'cpu', title: 'QMK Firmware Engine (C)', desc: 'Низкоуровневый C-код обработки матриц клавиш и прерываний микроконтроллера.' },
        { icon: 'layers', title: 'Multi-Layer Layout (Nav/Media)', desc: 'Многослойная структура для ускоренной навигации по коду и управлению звуком/окнами.' },
        { icon: 'settings', title: 'Vial Dynamic EEPROM Protocol', desc: 'Протокол онлайн-настройки клавиш через GUI без компиляции файлов.' }
      ]
    },
    techStack: [
      { name: 'C Language (GCC Microcontroller)', icon: 'code' },
      { name: 'QMK Firmware Framework', icon: 'cpu' },
      { name: 'Vial Interactive Protocol', icon: 'settings' },
      { name: 'Git / QMK MSYS Build System', icon: 'terminal' }
    ],
    links: [
      { label: 'Интерактивный Редактор на Сайте', targetId: 'firmware', icon: 'cpu' }
    ]
  },

  'printing-calc': {
    id: 'printing-calc',
    badge: '04 // WEB CALCULATOR & BUSINESS LOGIC',
    title: 'Калькулятор Расчета Полиграфии, Плотности & Стикерпаков',
    subtitle: 'Специализированный онлайн-калькулятор с точным расчетом стоимости печати, расхода бумаги, тиражей и плотности изделий.',
    role: 'Frontend & Business Logic Developer',
    metrics: [
      { value: '100% Exact', label: 'Точность формул расхода' },
      { value: 'Instant', label: 'Мгновенный перерасчет' },
      { value: 'Responsive', label: 'Полная мобильная адаптация' }
    ],
    problem: `При заказе и расчете стоимости полиграфической продукции (визитки, наклейки, чертежи, листовой плоттер):
• Ручной расчет требует сложных математических формул с учетом плотности бумаги (г/м²), площади листа, раскладки и ламинации.
• Высокая вероятность ошибки менеджера при составлении коммерческого предложения.`,
    solution: `Разработан лаконичный интерактивный веб-калькулятор:
1. **Формульный Движок Math Layout**: Точные алгоритмы оптимального раскроя изделий на печатном листе.
2. **Динамический Интерфейс**: Мгновенное обновление итоговой цены при изменении любого параметра (тираж, плотность, высечка).
3. **Модульность**: Выделенные скрипты расчетов под стикерпаки, плотные буклеты и чертежи.`,
    results: `• Автоматизирован расчет сложных полиграфических заказов за доли секунды.
• Исключены ошибки человеческого фактора при расчете смет.`,
    architecture: {
      title: 'Логическая Схема Формульного Движка',
      desc: 'Математический модуль раскроя печатных листов и калькуляции расхода материалов.',
      highlights: [
        { icon: 'calculator', title: 'Optimal Cut Engine', desc: 'Алгоритм расчета максимального количества карточек на стандартном листе SRA3.' },
        { icon: 'sliders', title: 'Dynamic Param Calculator', desc: 'Автоматический перерасчет стоимости при выборе плотности и ламинации.' }
      ]
    },
    techStack: [
      { name: 'JavaScript Vanilla ES6', icon: 'code' },
      { name: 'HTML5 / CSS3 Responsive Grid', icon: 'layout' },
      { name: 'Math Layout Algorithms', icon: 'calculator' }
    ],
    links: [
      { label: 'Открыть Калькулятор на Сайте', targetId: 'calc-card', icon: 'calculator' }
    ]
  },

  'ai-influencer': {
    id: 'ai-influencer',
    badge: '05 // AI GENERATION & LORA PIPELINE',
    title: 'AI Influencer Pipeline & Dataset LoRA Training',
    subtitle: 'Полный пайплайн создания виртуальных AI-персонажей: от подготовки очищенных датасетов до обучения персональных LoRA-моделей в Flux / SDXL.',
    role: 'AI Generative Artist & ML Pipeline Developer',
    metrics: [
      { value: '100% Identity', label: 'Сохранение лица (Face Consistency)' },
      { value: '50+ Photo', label: 'Подготовленный датасет' },
      { value: '4K Render', label: 'Высокая детализация кожи' }
    ],
    problem: `При генерации изображений виртуальных моделей (AI Influencers) стандартными промптами возникают проблемы:
• Невозможность сохранить 100% идентичность одного и того же лица в разных локациях и ракурсах.
• Появление ИИ-артефактов, размытия деталей и нереалистичных текстур кожи.`,
    solution: `Создан профессиональный пайплайн обучения и генерации:
1. **Подготовка Датасета (Dataset Curation)**: Отбор 50+ снимков высокой четкости с разбивкой по ракурсам и освещению. Кадрирование, удаление шумов и создание детальных описаний (Captioning).
2. **Обучение LoRA (Kohya_ss / AI-Toolkit)**: Тренировка весов LoRA-модели на базе Flux / SDXL с высокой точностью запоминания черт лица.
3. **ComfyUI Workflow**: Построение нодовых пайплайнов с Denoising, ControlNet для поз и Upscale-сэмплингом.`,
    results: `• Создана персональная LoRA-модель, обеспечивающая 100% узкую узнаваемость персонажа во всех генерациях.
• Достигнуто фотореалистичное качество генераций без артефактов.`,
    architecture: {
      title: 'Пайплайн Подготовки Датасета & Обучения LoRA',
      desc: 'Последовательный процесс от обработки исходных кадров до инференса в ComfyUI.',
      highlights: [
        { icon: 'image', title: 'Dataset Curation & Captioning', desc: 'Авто-подготовка подписей к фото и цветокоррекция датасета.' },
        { icon: 'cpu', title: 'Kohya / AI-Toolkit LoRA Training', desc: 'Обучение низкоранговых адаптеров LoRA для Flux.1 / SDXL.' },
        { icon: 'layers', title: 'ComfyUI ControlNet Workflow', desc: 'Нодовая генерация с контролем позы и Face Detailer финишингом.' }
      ]
    },
    techStack: [
      { name: 'ComfyUI / Stable Diffusion', icon: 'image' },
      { name: 'Flux.1 / SDXL LoRA Training', icon: 'cpu' },
      { name: 'AI-Toolkit / Kohya_ss', icon: 'settings' },
      { name: 'ControlNet / FaceDetailer', icon: 'sparkles' }
    ],
    links: [
      { label: 'Смотреть Стенд AI Lab на Сайте', targetId: 'creative-lab', icon: 'image' }
    ]
  },

  'tg-content': {
    id: 'tg-content',
    badge: '06 // CONTENT PIPELINE & MARKETING AUTOMATION',
    title: 'Автоматизированный TG Контент-Пайплайн & Автопостинг',
    subtitle: 'Система автоматического создания, форматирования и публикации постов в Telegram-каналы с ИИ-генерацией и модерацией.',
    role: 'Automation & Content Systems Engineer',
    metrics: [
      { value: '1-2 hrs/week', label: 'Время на контент-план' },
      { value: '100% On-Time', label: 'Точность автопостинга' },
      { value: 'A/B Test', label: 'Тестирование постов' }
    ],
    problem: `При ручном ведении нескольких тематических Telegram-каналов (iGaming, Крипто-сигналы, Трейдинг, Технологии) возникают проблемы:
• Необходимость постоянного поиска свежих инфоповодов и написания завлекающих постов без срыва контент-плана.
• Сложность выдерживания уникального стиля (Tone-of-Voice) для разных аудиторий и ниш.
• Рутинная потеря времени на оформление разметки Markdown, подбор эмодзи, вставку инлайн-кнопок и публикации вручную в нужный час.`,
    solution: `Спроектирован автоматизированный контент-пайплайн для менеджера и редактора:
1. **Контент-Матрица & AI-Копирайтинг**: Создание структур контент-плана с разбивкой по рубрикам (аналитика, инсайты, обучающие посты, офферы). Использование нейросетевых промптов для генерации уникальных текстов с адаптацией стиля (iGaming / Крипта / IT).
2. **Система Автопостинга (Telegram Bot API)**: Планировщик отложенной публикации постов с автоматическим форматированием (Bold/Italic/Code), прикреплением медиафайлов и созданием инлайн-кнопок с CTA-ссылками.
3. **Редакторский Контроль & А/Б Тесты**: Получение черновиков постов в закрытый модерационный канал для проверки человеком перед уходом в публичный эфир.
4. **Аналитика Вовлеченности**: Мониторинг динамики просмотров (Views), кликов по кнопкам (CTR) и реакций аудитории для оптимизации времени публикации.`,
    results: `• Сокращение времени создания недельного контент-плана с 12 часов до 1-2 часов.
• 100% соблюдение графика публикаций без пропусков за счет отложенной автоматической отправки.
• Повышение уровня вовлеченности (ER) и CTR переходов по рекламным ссылкам.`,
    architecture: {
      title: 'Архитектура Контент-Пайплайна & Автопостинга',
      desc: 'Связка AI-генератора постов, модерационного канала и асинхронного бота-публикатора с планировщиком.',
      highlights: [
        { icon: 'sparkles', title: 'AI Copywriter Engine', desc: 'Генерация постов под нужный Tone-of-Voice (iGaming, Crypto, Tech) с форматированием и эмодзи.' },
        { icon: 'clock', title: 'Scheduled Bot Publisher', desc: 'Автопостинг в Telegram по точному хронометражу с поддержкой MarkdownV2 и инлайн-кнопок.' },
        { icon: 'shield-check', title: 'Human-in-the-Loop Moderation', desc: 'Предварительный вывод черновиков в приватный канал админа для проверки перед публикацией.' }
      ]
    },
    techStack: [
      { name: 'Python 3.13 / Asyncio', icon: 'code' },
      { name: 'Telegram Bot API (Aiogram)', icon: 'send' },
      { name: 'Qwen 3.5 / Open-WebUI', icon: 'bot' },
      { name: 'MarkdownV2 & Inline Buttons', icon: 'layout' },
      { name: 'APScheduler Cron', icon: 'clock' }
    ],
    links: [
      { label: 'Перейти к Блоку Контента на Сайте', targetId: 'cardTgContent', icon: 'file-edit' }
    ]
  },

  'obsidian-rag': {
    id: 'obsidian-rag',
    badge: '07 // KNOWLEDGE & AI MEMORY',
    title: 'Единая База Знаний Obsidian & ИИ-Память Проекта',
    subtitle: 'Централизованное хранилище шпаргалок, архитектурных решений, консольных команд и скриптов в формате заметок Obsidian с умным ИИ-поиском по смыслу (RAG).',
    role: 'AI Infrastructure & Knowledge Engineer',
    metrics: [
      { value: '1,000+', label: 'Заметок и шпаргалок' },
      { value: '< 2 sec', label: 'Поиск любой команды' },
      { value: '0 Потерь', label: 'Сохранение архитектуры' },
      { value: '100% Offline', label: 'Локальное хранение' }
    ],
    problem: `При активной разработке параллельных проектов (Telegram-боты, Docker-серверы, скрипты, AI-модели) постоянно возникают неудобства:
• Фрагменты кода, важные команды и настройки серверов теряются в чатах, файлах и истории терминала.
• При написании нового кода или обращении к ИИ приходится каждый раз заново искать нужные конфигурации и заново объяснять контекст проекта.
• Обычный поиск по файлам не находит нужный ответ, если команда или правило написаны другими словами.`,
    solution: `Создана прозрачная локальная система знаний на базе Obsidian с подключением ИИ-поиска:
1. **База Знаний в Obsidian**: Систематизация всех шпаргалок, конфигураций Docker, консольных команд и шаблонов промптов в формате Markdown-файлов. Все темы связаны между собой перекрестными ссылками (\`[[ссылка]]\`).
2. **Умный ИИ-Поиск (RAG)**: Подключение локальной нейросети, которая понимает смысл вопроса, а не просто ищет буквы. Задаешь вопрос обычным языком («как пробросить видеокарту в Docker?») — и система мгновенно выдает нужную заметку.
3. **Память для ИИ-Разработчиков**: ИИ-помощник берет точные правила и примеры кода прямо из базы знаний, генерируя код с 100% соблюдением стандартов проекта без галлюцинаций.`,
    results: `• Вся база инженерных знаний и команд собрана в одном месте с доступом за 2 секунды.
• Полностью исключена потеря архитектурных идей, секретов и инструкций при длительной разработке.
• ИИ-ассистент пишет код с опорой на реальные прошлые решения и правила проекта.`,
    architecture: {
      title: 'Устройство Базы Знаний & ИИ-Поиска',
      desc: 'Простая и надежная связка локального хранилища заметок Obsidian с моделью умного поиска по смыслу.',
      highlights: [
        { icon: 'book-open', title: 'Obsidian Markdown Vault', desc: 'Структурированная база файлов с тегами, перекрестными ссылками [[заметка]] и поддержкой разметки.' },
        { icon: 'search', title: 'Smart Semantic RAG Search', desc: 'Модель поиска по смыслу — находит точные инструкции и готовые команды по свободному вопросу.' },
        { icon: 'bot', title: 'AI Assistant Context Memory', desc: 'Автоматическая подтяжка проверенных правил и инструкций в контекст ИИ перед началом кодинга.' }
      ]
    },
    techStack: [
      { name: 'Obsidian / Markdown Vault', icon: 'book-open' },
      { name: 'Semantic RAG Search Engine', icon: 'search' },
      { name: 'Python ChromaDB Embeddings', icon: 'database' },
      { name: 'Cross-Note Links [[...]]', icon: 'git-commit' },
      { name: 'Qwen 3.5 Agent Integration', icon: 'bot' }
    ],
    links: [
      { label: 'Перейти к Блоку Базы Знаний на Сайте', targetId: 'cardObsidianRag', icon: 'book-open' }
    ]
  }
};

// Case ID Aliases for Double Redundancy & Legacy Support
CASES_DATA['print-calc'] = CASES_DATA['printing-calc'];
CASES_DATA['qmk-firmware'] = CASES_DATA['firmware-editor'];
