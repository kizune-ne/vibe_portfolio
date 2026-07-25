/* ==========================================================================
   CASE INSPECTOR MODULE - STAR METHODOLOGY CASE STUDIES FOR EMPLOYERS
   ========================================================================== */

export const CASES_DATA = {
  'docker-ai': {
    id: 'docker-ai',
    badge: '02 // INFRASTRUCTURE & DEVOPS',
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
    title: 'Serverless ИИ-Ассистент на Gemma 4 + Cloudflare Worker Proxy',
    subtitle: 'Безопасная интеграция нейросети Google AI Studio в портфолио с выносом секретов на Cloudflare Worker и фолбэком.',
    role: 'Fullstack AI / Cloud Developer',
    metrics: [
      { value: '100%', label: 'Защита API-ключа' },
      { value: '~800ms', label: 'Время ответа API' },
      { value: '100k', label: 'Бесплатных запросов/день' },
      { value: '0ms', label: 'Fallback при офлайне' }
    ],
    problem: `При внедрении ИИ-консультанта на статический фронтенд (GitHub Pages / HTML+JS) возникает угроза безопасности:
Прямой вызов API Google AI Studio из браузерного JS раскрывает секретный \`GEMINI_API_KEY\` в DevTools (Network tab), что приводит к компрометации ключа.`,
    solution: `Спроектирован изолированный Serverless Proxy слой:
1. **Cloudflare Worker Backend (\`api/worker.js\`)**: Прокси-сервер принимает сообщения клиента, считывает API-ключ из зашифрованных переменных Cloudflare Secrets и обращается к модели Gemma 4.
2. **Thought Stream Filter**: Парсер фильтрации внутренних размышлений (\`<thought>...</thought>\`) модели Gemma 4, отдающий пользователю чистый готовый ответ.
3. **Smart Client Fallback (\`js/ai-assistant.js\`)**: Если прокси недоступен или отсутствует интернет, клиентский чат переключается на встроенный база-знаний граф.
4. **CORS & Security**: Защищенные заголовки доступа только для целевого домена.`,
    results: `• Публичный ИИ-ассистент работает 24/7 без риска утечки учетных данных.
• Нулевая стоимость инфраструктуры за счет работы в рамках бесплатного лимита Cloudflare Workers.
• Интерактивный чат сохраняет работоспособность даже при сбое внешнего API.`,
    architecture: {
      title: 'Архитектура Serverless Proxy & Изоляции Ключей',
      desc: 'Безопасный прокси-слой на Cloudflare Workers, скрывающий API-ключ Gemini от клиентского JS и фильтрующий поток генерации.',
      highlights: [
        { icon: 'shield-check', title: 'Cloudflare Secrets Isolation', desc: 'Вынос GEMINI_API_KEY на Cloudflare Worker, исключающий утечку ключа в Network Tab браузера.' },
        { icon: 'sparkles', title: 'Thought Stream Token Stripping', desc: 'Автоматическая фильтрация служебных блоков генерации размышлений (<thought>...</thought>) модели Gemma 4.' },
        { icon: 'zap', title: 'Smart Offline Knowledge Fallback', desc: 'Мгновенный клиентский переключатель на локальную базу знаний при отсутствии связи с API.' }
      ]
    },
    techStack: [
      { name: 'Cloudflare Workers (JS)', icon: 'cloud' },
      { name: 'Google AI Studio (Gemma 4)', icon: 'sparkles' },
      { name: 'Vanilla JavaScript ES6+', icon: 'code' },
      { name: 'CORS & Security Secrets', icon: 'lock' }
    ],
    links: [
      { label: 'Чат ИИ-Ассистента на Сайте', targetId: 'cardAiAssistant', icon: 'bot' }
    ]
  },

  'print-calc': {
    id: 'print-calc',
    badge: '04 // FRONTEND & WEB TOOLS',
    title: 'Веб-Калькулятор Расчета Полиграфии & Геометрии Раскроя',
    subtitle: 'Специализированный сервисный инструмент для менеджеров: автоматический расчет стоимости изделий и укладка на печатные листы SRA3 / A3+.',
    role: 'Frontend / Tooling Developer',
    metrics: [
      { value: '~30 sec', label: 'Оформление заказа менеджером' },
      { value: '< 5 ms', label: 'Расчет математики на JS' },
      { value: 'SRA3 / A3+', label: 'Форматы печатных листов' },
      { value: '0ms', label: 'Серверная задержка (Pure JS)' }
    ],
    problem: `В полиграфии расчет нестандартных тиражей (визитки, стикеры с контурной резкой, чертежи, брошюры) вручную занимает много времени у менеджера:
• Ошибки в подсчетах плотности бумаги, стоимости ламинации, плоттерной резки и скругления углов по таблицам Excel.
• Сложность правильной геометрической раскладки изделий на печатном листе SRA3 без лишних отходов.`,
    solution: `Разработано интерактивное веб-приложение (SPA):
1. **Модуль Геометрического Раскроя**: Алгоритм укладки прямоугольных и фигурных элементов на лист SRA3 с учетом технологических вылетов под обрез (Prepress Bleeds).
2. **Динамический Калькулятор**: Мгновенный перерасчет стоимости бумаги, работы оборудования и постпечатной обработки при смене любых опций в форме.
3. **Автономный Модульный UI**: Возможность автономного использования калькулятора менеджером и встраивания через iframe на внешние ресурсы.`,
    results: `• Время формирования точного расчета менеджером сокращено с 10-15 минут Excel-подсчетов до ~30 секунд ввода параметров.
• Мгновенный вынос математики на клиентскую сторону (вычисления за < 5 миллисекунд).
• Исключение человеческих ошибок при расчете расхода печатных листов и ламинации.`,
    architecture: {
      title: 'Архитектура Геометрического Модуля & Клиентской Математики',
      desc: 'Полностью автономное клиентское SPA-приложение, исключающее серверные задержки и выполняющее сложные полиграфические вычисления за < 5ms.',
      highlights: [
        { icon: 'ruler', title: 'Prepress Bleed Geometry Engine', desc: 'Алгоритмы укладки прямоугольных и фигурных элементов на печатный лист (SRA3 / A3+) с вылетами под обрез.' },
        { icon: 'cpu', title: 'Dynamic Price Calculation', desc: 'Мгновенный перерасчет стоимости материалов, работы оборудования и постпечатной обработки при изменении параметров.' },
        { icon: 'maximize', title: 'Modular Standalone UI', desc: 'Вынос калькулятора в автономный виджет с возможностью интеграции через iframe и запуска в полноэкранном режиме.' }
      ]
    },
    techStack: [
      { name: 'HTML5 & Vanilla CSS3', icon: 'layout' },
      { name: 'Modular JavaScript Engine', icon: 'cpu' },
      { name: 'SVG Geometry Math', icon: 'ruler' },
      { name: 'Responsive Iframe Modal', icon: 'maximize' }
    ],
    links: [
      { label: 'Запустить Калькулятор', targetId: 'cardCalculator', icon: 'calculator' },
      { label: 'Репозиторий на GitHub', url: 'https://github.com/kizune-ne/printing_calculator', external: true, icon: 'github' }
    ]
  },

  'qmk-firmware': {
    id: 'qmk-firmware',
    badge: '03 // HARDWARE & EMBEDDED C',
    title: 'Кастомная QMK / Vial Прошивка для Клавиатуры MonsGeek M1 V5',
    subtitle: 'Портирование динамической конфигурации Vial GUI, исправление ошибок линковщика GCC ARM и оптимизация 2.4GHz / Bluetooth 5.0 контроллера.',
    role: 'Embedded C Developer / Hardware Tinkerer',
    metrics: [
      { value: 'Vial GUI', label: 'Настройка в браузере' },
      { value: 'Tri-Mode', label: 'USB-C / 2.4G / BT 5.0' },
      { value: 'Embedded C', label: 'Язык микроконтроллера' },
      { value: '0 Errors', label: 'Чистая компиляция GCC ARM' }
    ],
    problem: `Штатная заводская прошивка беспроводной механической клавиатуры MonsGeek M1 V5 имеет ограничения:
• Отсутствие поддержки протокола Vial для переназначения клавиш, слоев и макросов «на лету» без перепрошивки микроконтроллера.
• Ошибки дублирования символов линковщика при компиляции оригинальных исходников QMK под три режима связи.`,
    solution: `Проведена сборка кастомного микрокода на Си:
1. **Портирование Vial**: Настройка матрицы клавиш, энкодера и EEPROM-структуры под требования Vial ID.
2. **Патчинг Make / LDFLAGS**: Устранены конфликты линковщика GCC ARM (\`gcc-arm-none-eabi\`) при сборке бинарника прошивки.
3. **Оптимизация кеймапов**: Кастомная настройка слоев, Tap-Hold функций и макросов с сохранением энергоэффективности беспроводного чипа.`,
    results: `• 100% стабильная прошивка с мгновенным изменением раскладки и макросов через браузерный интерфейс Vial.
• Открытый репозиторий с подробной документацией и проводником исходного кода на сайте.`,
    architecture: {
      title: 'Архитектура Прошивки Микроконтроллера & Сборщика QMK',
      desc: 'Кастомный микрокод на Си под 3 режима связи с динамической таблицей EEPROM под веб-протокол Vial.',
      highlights: [
        { icon: 'sliders', title: 'Vial EEPROM Matrix Mapping', desc: 'Конфигурация матричных слоев клавиш, энкодеров и макросов под динамический протокол Vial ID.' },
        { icon: 'terminal', title: 'GCC ARM Linker Patching', desc: 'Устранение ошибок дублирования символов линковщика (LDFLAGS) при компиляции библиотек QMK.' },
        { icon: 'cpu', title: 'Tri-Mode Wireless Optimization', desc: 'Сохранение энергоэффективности беспроводного чипа (2.4GHz / Bluetooth 5.0 / USB-C).' }
      ]
    },
    techStack: [
      { name: 'C Language (Embedded)', icon: 'code' },
      { name: 'QMK Firmware Core', icon: 'cpu' },
      { name: 'Vial GUI Protocol', icon: 'sliders' },
      { name: 'GCC ARM Toolchain', icon: 'terminal' },
      { name: 'Make & Linker Scripts', icon: 'file-text' }
    ],
    links: [
      { label: 'Проводник Исходников на Сайте', targetId: 'cardCodeViewer', icon: 'folder-tree' },
      { label: 'Репозиторий на GitHub', url: 'https://github.com/kizune-ne/monsgeek_m1_v5_qmk-vial', external: true, icon: 'github' }
    ]
  },

  'ai-influencer': {
    id: 'ai-influencer',
    badge: '05 // AI INFLUENCERS & GENERATIVE MEDIA',
    title: 'Производство Виртуального AI-Инфлюенсера & Тренировка LoRA',
    subtitle: 'Полный пайплайн разработки персонажа: генерация референсов (Nanobanano 2), кадрирование и капшенинг датасета (Wan 2.2 / Flux), локальный тренинг LoRA на RTX 4070 Ti SUPER в AI-Toolkit и сэмплинг в ComfyUI.',
    role: 'Generative AI Specialist / Synthetic Media Developer',
    metrics: [
      { value: 'High Retention', label: 'Сохранение черт аватара' },
      { value: '16 GB VRAM', label: 'RTX 4070 Ti SUPER' },
      { value: 'Wan 2.2 / Flux', label: 'Целевые модели LoRA' },
      { value: 'AI-Toolkit', label: 'Локальный пайплайн' }
    ],
    problem: `При банальной генерации медиаконтента с помощью нейросетей по обычным текстовым промптам возникают фундаментальные сложности:
• Потеря индивидуальности аватара от кадра к кадру (Character Drift / изменение геометрии лица и черт).
• Лимиты и высокие затраты при использовании внешних облачных генераторов без возможности точной тонкой настройки (fine-tuning).`,
    solution: `Разработан 4-этапный автономный производственный пайплайн:
1. **Концепт и Референсы**: Создание каноничных кадров модели через Nanobanano 2, ComfyUI воркфлоу и ИИ-чаты с последующим ручным отбором идеальных фото лица.
2. **Датасет & Капшенинг**: Кадрирование высокого разрешения и формирование текстовых описаний (captioning) с адаптацией под модели Wan 2.2 и Flux.
3. **Локальная Тренировка LoRA (AI-Toolkit)**: Запуск обучения кастомных весов LoRA на локальном железе (AMD Ryzen 7 9700X + NVIDIA GeForce RTX 4070 Ti SUPER 16GB VRAM) в AI-Toolkit с проверкой промежуточных эпох.
4. **Сэмплирование в ComfyUI**: Подключение обученной LoRA к нодовым воркфлоу ComfyUI для генерации сюжетных сетов с высоким сохранением узнаваемости персонажа.`,
    results: `• Полная независимость от сторонних сервис-подписок благодаря локальному обучению моделей.
• Достижение высокой стабильности сохранения внешности аватара во всех сюжетных локациях и ракурсах.
• Готовый воспроизводимый технологический процесс производства виртуального контента.`,
    architecture: {
      title: 'Архитектура Пайплайна Тренировки & Сэмплирования LoRA',
      desc: 'Локальный 4-этапный производственный комплекс для создания синтетического контента с сохранением уникальных черт аватара.',
      highlights: [
        { icon: 'file-text', title: 'Dataset Curation & Captioning', desc: 'Кадрирование высокого разрешения и формирование текстовых описаний под Wan 2.2 и Flux.' },
        { icon: 'cpu', title: 'AI-Toolkit LoRA Training', desc: 'Обучение кастомных весов LoRA локально на железе Ryzen 7 9700X + RTX 4070 Ti SUPER 16GB с анализом чекпоинтов.' },
        { icon: 'sliders', title: 'ComfyUI Custom Node Graph', desc: 'Сборка нодовых воркфлоу в ComfyUI для генерации сюжетных сетов с высоким сохранением узнаваемости аватара.' }
      ]
    },
    techStack: [
      { name: 'AI-Toolkit (Local LoRA)', icon: 'cpu' },
      { name: 'NVIDIA RTX 4070 Ti SUPER 16GB', icon: 'zap' },
      { name: 'ComfyUI Workflow Engine', icon: 'sliders' },
      { name: 'Wan 2.2 / Flux Datasets', icon: 'file-text' },
      { name: 'Nanobanano 2 & AI Prompting', icon: 'sparkles' }
    ],
    links: [
      { label: 'Схема Пайплайна на Сайте', targetId: 'creative-lab', icon: 'git-branch' }
    ]
  },

  'tg-content': {
    id: 'tg-content',
    badge: '06 // TG CONTENT & AUTOMATED PUBLISHING',
    title: 'Автоматизированный Telegram Контент-Менеджмент & SMM',
    subtitle: 'Пайплайн создания контент-стратегий, генерация постов через AI Copywriter, автопостинг по расписанию, вариативный Tone-of-Voice (iGaming, Крипта, Трейдинг, IT) и аналитика ER.',
    role: 'Telegram Content Manager / AI Copywriter Specialist',
    metrics: [
      { value: '30+ / нед', label: 'Готовых постов в контент-плане' },
      { value: '< 1 min', label: 'Генерация поста через AI' },
      { value: '4 Ниши', label: 'Tone-of-Voice адаптация' },
      { value: '24/7', label: 'Автопостинг по расписанию' }
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
    badge: '07 // KNOWLEDGE ENGINEERING & RAG',
    title: 'База Знаний Obsidian & Семантический RAG Поиск',
    subtitle: 'Единый цифровой мозг: двунаправленные связки Markdown-заметок, векторный эмбеддинг-индекс, авто-категоризация RAG и прямое подключение ИИ-агентов.',
    role: 'Knowledge Engineer / AI Systems Architect',
    metrics: [
      { value: '1,000+', label: 'Связанных Markdown заметок' },
      { value: '< 10ms', label: 'Поиск по локальному RAG' },
      { value: 'Zettelkasten', label: 'Метод структуры знаний' },
      { value: '100% Offline', label: 'Локальное хранение данных' }
    ],
    problem: `При активной разработке сложных проектов, исследовании статей и накоплении документации возникают риски:
• Фрагментация знаний: важные архитектурные решения, фрагменты кода и конфигурации теряются в чатах и файлах.
• Контекстное голодание ИИ: при передаче задачи ИИ-агенту приходится заново объяснять стек и контекст репозитория.
• Сложность классического текстового поиска при накоплении тысяч заметок.`,
    solution: `Спроектирована и развернута персональная база знаний на базе Obsidian с ИИ-RAG интеграцией:
1. **Obsidian Vault & Zettelkasten**: Структурирование информации в формате Markdown с использованием двухсторонних связей (\`[[note_name]]\`), тегов, стандартов YAML Frontmatter и хроник исследований.
2. **Vector Index & RAG Search**: Разбивка заметок на чанки, построение векторных эмбеддингов и семантический поиск — ответ вытягивается по смыслу, а не только по точным совпадениям слов.
3. **Прямая Связка с ИИ-Агентами**: Локальные субагенты (Hermes Researcher, Qwen 3.5 Coder) обращаются к хранилищу заметок напрямую, считывая готовый архитектурный контекст перед кодингом и автоматически сохраняя созданные отчеты в Vault.
4. **100% Локальное Хранение**: Все данные остаются на физическом диске без зависимости от облачных ноушенов и сторонних провайдеров.`,
    results: `• Создана единая централизованная «вторая память» (Second Brain) для инженера и ИИ-команды.
• Мгновенный поиск любых архитектурных решений, консольных команд и исследовательской аналитики.
• ИИ-агенты пишут код с учетом всех ранее зафиксированных корпоративных правил и архитектурных стандартов.`,
    architecture: {
      title: 'Архитектура Базы Знаний & RAG Поиска',
      desc: 'Интеграция Obsidian Markdown Vault, векторного индексатора и прямой шины взаимодействия с локальными LLM.',
      highlights: [
        { icon: 'book-open', title: 'Obsidian Markdown Vault Engine', desc: 'Двунаправленная граф-сеть заметок с YAML метаданными, тегами и методом Zettelkasten.' },
        { icon: 'search', title: 'Vector Embeddings & Semantic Search', desc: 'Локальный RAG-поиск по смысловым векторам с поиском фрагментов за < 10 миллисекунд.' },
        { icon: 'bot', title: 'Agent Memory Interface', desc: 'Прямой API/CLI интерфейс для автономного чтения и записи отчетов ИИ-агентами без посредников.' }
      ]
    },
    techStack: [
      { name: 'Obsidian / Markdown Vault', icon: 'book-open' },
      { name: 'Vector Embeddings (RAG)', icon: 'cpu' },
      { name: 'Python ChromaDB / FAISS', icon: 'database' },
      { name: 'Zettelkasten Methodology', icon: 'layers' },
      { name: 'Qwen 3.5 / Hermes Agents', icon: 'bot' }
    ],
    links: [
      { label: 'Перейти к Блоку Базы Знаний на Сайте', targetId: 'cardObsidianRag', icon: 'book-open' }
    ]
  }
};

/* ==========================================================================
   CASE INSPECTOR CONTROLLER CLASS
   ========================================================================== */

export function initCaseInspector() {
  const modalOverlay = document.getElementById('caseInspectorModal');
  if (!modalOverlay) return;

  const btnClose = document.getElementById('btnCloseCaseInspector');
  const tabsNav = document.getElementById('caseInspectorTabs');
  const inspectButtons = document.querySelectorAll('.btn-case-inspect');

  let activeCase = null;
  let activeTab = 'overview'; // 'overview' | 'architecture' | 'tech'

  // Open modal with specific case ID
  function openCaseModal(caseId) {
    const caseData = CASES_DATA[caseId];
    if (!caseData) return;

    activeCase = caseData;
    activeTab = 'overview';

    renderModalHeader();
    renderTabs();
    renderTabContent();

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Re-initialize icons inside modal
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Close modal
  function closeCaseModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Render modal header info
  function renderModalHeader() {
    if (!activeCase) return;

    document.getElementById('modalCaseBadge').textContent = activeCase.badge;
    document.getElementById('modalCaseTitle').textContent = activeCase.title;
    document.getElementById('modalCaseSubtitle').textContent = activeCase.subtitle;
    document.getElementById('modalCaseRole').textContent = `Роль: ${activeCase.role}`;
  }

  // Render navigation tabs
  function renderTabs() {
    if (!tabsNav) return;
    tabsNav.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === activeTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Render tab body content
  function renderTabContent() {
    const bodyContainer = document.getElementById('caseModalBodyContent');
    if (!bodyContainer || !activeCase) return;

    if (activeTab === 'overview') {
      bodyContainer.innerHTML = `
        <!-- Metrics Grid -->
        <div class="modal-metrics-grid">
          ${activeCase.metrics.map(m => `
            <div class="modal-metric-card">
              <span class="modal-metric-val">${m.value}</span>
              <span class="modal-metric-lbl">${m.label}</span>
            </div>
          `).join('')}
        </div>

        <!-- STAR Sections -->
        <div class="star-section-block">
          <div class="star-header">
            <span class="star-badge badge-problem"><i data-lucide="alert-circle"></i> S & T // Проблема и Задача</span>
          </div>
          <div class="star-content">
            ${formatParagraphs(activeCase.problem)}
          </div>
        </div>

        <div class="star-section-block">
          <div class="star-header">
            <span class="star-badge badge-solution"><i data-lucide="wrench"></i> A // Инженерное Решение</span>
          </div>
          <div class="star-content">
            ${formatParagraphs(activeCase.solution)}
          </div>
        </div>

        <div class="star-section-block">
          <div class="star-header">
            <span class="star-badge badge-result"><i data-lucide="check-circle-2"></i> R // Результат и Выгода</span>
          </div>
          <div class="star-content">
            ${formatParagraphs(activeCase.results)}
          </div>
        </div>
      `;
    } else if (activeTab === 'architecture') {
      const arch = activeCase.architecture || {
        title: 'Архитектурный подход и роли компонентов',
        desc: 'Данный кейс спроектирован с учетом требований высокой отказоустойчивости, модульности и безопасного разделения ответственности.',
        highlights: [
          { icon: 'shield-check', title: 'Безопасность & Изоляция', desc: 'Все конфиденциальные данные вынесены за пределы клиентского кода.' },
          { icon: 'zap', title: 'Производительность & Оптимизация', desc: 'Минимизация задержек за счет асинхронной обработки ресурсов.' },
          { icon: 'refresh-cw', title: 'Надежность & Fallback', desc: 'Предусмотрены сценарии сохранения работоспособности.' }
        ]
      };

      bodyContainer.innerHTML = `
        <div class="architecture-tab-wrap">
          <h4><i data-lucide="layers"></i> ${arch.title}</h4>
          <p class="arch-desc">${arch.desc}</p>
          
          <div class="arch-highlights-list">
            ${arch.highlights.map(h => `
              <div class="arch-item">
                <div class="arch-icon"><i data-lucide="${h.icon}"></i></div>
                <div>
                  <strong>${h.title}</strong>
                  <p>${h.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (activeTab === 'tech') {
      bodyContainer.innerHTML = `
        <div class="tech-tab-wrap">
          <h4><i data-lucide="cpu"></i> Технологический стек и инструменты</h4>
          <div class="tech-badges-grid">
            ${activeCase.techStack.map(t => `
              <div class="tech-badge-card">
                <i data-lucide="${t.icon}"></i>
                <span>${t.name}</span>
              </div>
            `).join('')}
          </div>

          <h4 style="margin-top: 24px;"><i data-lucide="link"></i> Быстрые ссылки и Демо</h4>
          <div class="case-links-group">
            ${activeCase.links.map(l => {
              if (l.external) {
                return `
                  <a href="${l.url}" target="_blank" class="btn btn-secondary btn-sm">
                    <i data-lucide="${l.icon}"></i> ${l.label} ↗
                  </a>
                `;
              } else {
                return `
                  <button class="btn btn-secondary btn-sm btn-nav-target" data-target-id="${l.targetId}">
                    <i data-lucide="${l.icon}"></i> ${l.label}
                  </button>
                `;
              }
            }).join('')}
          </div>
        </div>
      `;

      // Bind in-page navigation target buttons
      bodyContainer.querySelectorAll('.btn-nav-target').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.dataset.targetId;
          closeCaseModal();
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Format text paragraphs with markdown bold/bullets
  function formatParagraphs(text) {
    if (!text) return '';
    return text.split('\n\n').map(p => {
      let formatted = p
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/• (.*)/g, '<li class="star-bullet">$1</li>');

      if (formatted.includes('<li class=')) {
        return `<ul class="star-ul">${formatted}</ul>`;
      }
      return `<p class="star-p">${formatted}</p>`;
    }).join('');
  }

  // Event Listeners
  inspectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const caseId = btn.dataset.caseId;
      openCaseModal(caseId);
    });
  });

  if (btnClose) {
    btnClose.addEventListener('click', closeCaseModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeCaseModal();
      }
    });
  }

  if (tabsNav) {
    tabsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (btn && btn.dataset.tab) {
        activeTab = btn.dataset.tab;
        renderTabs();
        renderTabContent();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeCaseModal();
    }
  });
}
