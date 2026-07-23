/* ==========================================================================
   CASE INSPECTOR MODULE - STAR METHODOLOGY CASE STUDIES FOR EMPLOYERS
   ========================================================================== */

export const CASES_DATA = {
  'docker-ai': {
    id: 'docker-ai',
    badge: '02 // INFRASTRUCTURE & DEVOPS',
    title: 'Автономный AI Server & DevContainer Инфраструктура',
    subtitle: 'Изолированная среда локальных LLM (14B/31B), проброс GPU CUDA, безопасные Bind Mounts и автоматизация DevContainer.',
    role: 'DevOps / AI Infrastructure Engineer',
    metrics: [
      { value: '99.9%', label: 'Uptime контейнеров' },
      { value: '< 500ms', label: 'Задержка CUDA LLM' },
      { value: '16 GB', label: 'VRAM RTX 4070 Ti SUPER' },
      { value: '100%', label: 'Изоляция секретов (_keys/)' }
    ],
    problem: `При разработке и запуске нескольких ИИ-сервисов (Ollama, Qwen 2.5 Coder, Open-WebUI, Telegram-боты) возникали риски:
• Конфликты системных пакетов Python и системных библиотек в Windows/Linux.
• Риск случайного попадания приватных API-ключей и токенов в публичные Git-репозитории.
• Сложность прямой проброски ресурсов графического процессора (GPU CUDA) в изолированную рабочую среду без падения производительности.`,
    solution: `Спроектирована и развернута гибкая микросервисная архитектура на базе Docker Compose:
1. **NVIDIA Container Toolkit Integration**: Настроен проброс видеокарты RTX 4070 Ti SUPER (16GB VRAM) в контейнер \`ollama\` с авто-поддержанием модели в памяти (\`OLLAMA_KEEP_ALIVE: 10m\`).
2. **VS Code DevContainer Workspace**: Вынесение виртуального окружения Python во внешний том \`ai-server-venv\`. Хост-ОС остается полностью чистой.
3. **Безопасность Секретов**: Использование технологии \`Bind Mounts\` для директории \`_keys/\`, содержащей .env и SSH-ключи. Все секреты защищены через \`.gitignore\` и изолированы от контейнеров.
4. **Фоновый Патчер Расширений**: Написан стартовый скрипт \`docker-entrypoint.sh\` для автоматической инициализации расширений встроенного ИИ в удаленной Linux-сессии.`,
    results: `• Развернута 100% стабильная, масштабируемая среда для исследований и локальной разработки ИИ-агентов.
• Время поднятия нового окружения сокращено до 1 команды (\`docker compose up -d\`).
• Исключена вероятность утечки секретов и API-ключей.`,
    techStack: [
      { name: 'Docker / Compose', icon: 'container' },
      { name: 'NVIDIA CUDA Toolkit', icon: 'cpu' },
      { name: 'Ollama / Qwen 2.5', icon: 'bot' },
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
    subtitle: 'Асинхронная обработка потоков сообщений из 50+ Telegram-каналов, автоматическая фильтрация рекламы и дедупликация.',
    role: 'Python / Telegram Automation Developer',
    metrics: [
      { value: '10,000+', label: 'Сообщений / день' },
      { value: '< 2 sec', label: 'Скорость роутинга' },
      { value: '0%', label: 'Дубликатов в топиках' },
      { value: '24/7', label: 'Асинхронный скрапинг' }
    ],
    problem: `Оперативный мониторинг десятков профильных Telegram-каналов вручную невозможен:
• Высокая зашумленность рекламными и повторными постами.
• Отсутствие структурированного разделения по тегам/тематикам.
• Риски бана сессий Telegram при частых высоконагруженных запросах.`,
    solution: `Создана асинхронная высокопроизводительная система парсинга и агрегации контента:
1. **Асинхронное Ядро (Telethon / Pyrogram)**: Реализована защита от бана через пул прокси-серверов с динамической ротацией и экспоненциальными задержками (backoff).
2. **Deduplication Engine**: Внедрен алгоритм хэширования текстовых блоков и медиафайлов. Повторяющиеся новости или репосты отсекаются за < 5 миллисекунд.
3. **Topic Routing Manager**: Интеграция с Telegram Bot API для автоматического создания и маршрутизации входящих постов по тематическим топикам закрытого супергруппового чата.
4. **LLM Filtration (Опционально)**: Подключение локальной нейросети Qwen для автоматической суммаризации длинных постов в 3-4 ключевых тезиса.`,
    results: `• Полная автоматизация сбора новостей и вакансий без участия человека.
• Экономия более 15 часов рабочего времени в неделю на ручном скроллинге ленты.
• Очистка входящего потока от спама и повторов на 98%.`,
    techStack: [
      { name: 'Python 3.13 (Asyncio)', icon: 'code' },
      { name: 'Telethon / Pyrogram', icon: 'send' },
      { name: 'Telegram Bot API', icon: 'message-square' },
      { name: 'APScheduler / Redis', icon: 'layers' },
      { name: 'Proxy Rotation', icon: 'shield-check' }
    ],
    links: [
      { label: 'Симулятор TG Бота на Сайте', targetId: 'telegram', icon: 'message-square' }
    ]
  },

  'ai-assistant': {
    id: 'ai-assistant',
    badge: '00 // FULLSTACK & SERVERLESS AI',
    title: 'Serverless ИИ-Ассистент на Gemma 4 + Cloudflare Worker',
    subtitle: 'Безопасная интеграция нейросети Google AI Studio в веб-интерфейс портфолио с защитой API-ключа и локальным фолбэком.',
    role: 'Fullstack AI / Cloud Developer',
    metrics: [
      { value: '100%', label: 'Защита API-ключа' },
      { value: '~800ms', label: 'Время ответа API' },
      { value: '100k', label: 'Бесплатных запросов/день' },
      { value: '0ms', label: 'Fallback при офлайне' }
    ],
    problem: `При добавлении ИИ-консультанта на статический сайт (GitHub Pages / HTML+JS) возникает критическая проблема безопасности:
Прямой вызов API Google AI Studio из браузерного JavaScript раскрывает ваш секретный \`GEMINI_API_KEY\` в DevTools (F12 -> Network), что ведет к утечке и аннулированию ключа.`,
    solution: `Спроектирован легкий и надежный Serverless Proxy слой:
1. **Cloudflare Worker Backend (\`api/worker.js\`)**: Прокси-сервер принимает сообщения от фронтенда, считывает API-ключ из зашифрованных переменной окружения Cloudflare Secrets и обращается к API Google AI Studio (\`gemma-4-31b-it\`).
2. **Thought Stream Filter**: Алгоритм фильтрации служебных блоков генерации размышлений (\`thought\`) модели Gemma 4, возвращающий пользователю готовый чистый ответ.
3. **Smart Client Fallback (\`js/ai-assistant.js\`)**: Если прокси недоступен или отсутствует подключение к сети, клиентский модуль моментально переключается на встроенный графовый алгоритм поиска ответов по локальной базе знаний о портфолио.
4. **CORS & Rate Limiting**: Настроены строгие заголовки доступа только с вашего домена.`,
    results: `• Безопасный публичный ИИ-ассистент, доступный пользователям портфолио 24/7.
• Нулевые затраты на хостинг благодаря попаданию в бесплатный лимит Cloudflare Workers.
• Высокая отказоустойчивость: чат работает даже при обрыве интернет-соединения с моделью.`,
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
    title: 'Промышленный Веб-Калькулятор Расчета Печати Типографии',
    subtitle: 'Специализированный сервисный инструмент для автоматического расчета стоимости продукции и оптимизации полиграфического раскроя.',
    role: 'Frontend / Tooling Developer',
    metrics: [
      { value: '3 sec', label: 'Время полного расчета' },
      { value: 'SRA3 / A4', label: 'Алгоритм раскроя' },
      { value: '5+', label: 'Типов продукции' },
      { value: '100%', label: 'Клиентская математика' }
    ],
    problem: `В полиграфическом производстве расчет стоимости нестандартных тиражей (визитки, стикеры с контурной резкой, чертежи, брошюры) вручную требует много времени и подвержен ошибкам:
• Необходимость учитывать плотность бумаги, ламинацию, скругление углов и резку.
• Сложность оптимального геометрического раскроя мелких изделий на печатных листах формата SRA3 / A3+ без лишних обрезков.`,
    solution: `Разработано высокопроизводительное одностраничное веб-приложение (SPA):
1. **Геометрический модуль раскроя**: Написаны алгоритмы укладки прямоугольных и фигурных элементов на печатный лист с учетом технологических вылетов под обрез (Prepress Bleeds).
2. **Динамическая калькуляция прайса**: Мгновенный перерасчет стоимости материалов, работы печатного оборудования и постобработки при изменении любых параметров формы.
3. **Изолированный модульный UI**: Вынос калькулятора в автономный виджет с возможностью интеграции через iframe и запуска в полноэкранном режиме.`,
    results: `• Ускорение процесса расчета стоимости заказа менеджером с 15 минут до нескольких секунд.
• Исключение человеческого фактора при расчете расхода расходных материалов.
• Опубликован репозиторий с открытым исходным кодом.`,
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
    subtitle: 'Портирование динамической конфигурации Vial GUI, исправление линкера LDFLAGS и оптимизация 2.4GHz / Bluetooth 5.0 контроллера.',
    role: 'Embedded C Developer / Hardware Tinkerer',
    metrics: [
      { value: 'Vial GUI', label: 'Настройка на лету' },
      { value: '3 Mode', label: 'USB / 2.4G / BT 5.0' },
      { value: 'C (QMK)', label: 'Язык прошивки' },
      { value: '0 Conflict', label: 'Оптимизация LDFLAGS' }
    ],
    problem: `Штатная заводская прошивка беспроводной механической клавиатуры MonsGeek M1 V5 обладает ограничениями:
• Отсутствие поддержки динамического переназначения клавиш через удобный веб-интерфейс Vial без перепрошивки микроконтроллера.
• Конфликты дубликатов символов при линковке библиотек связи 2.4GHz/Bluetooth в исходниках QMK.`,
    solution: `Проведена глубокая работа по доработке и сборке кастомного микрокода:
1. **Портирование структуры Vial**: Конфигурация матричных слоев, энкодеров и макросов под спецификацию Vial ID.
2. **Патчинг сборщика Make / LDFLAGS**: Устранены ошибки дублирования символов линковщика при компиляции бинарных файлов прошивки pod gcc-arm-none-eabi.
3. **Оптимизация слоев кеймапа**: Настройка логики многофункциональных клавиш (Tap-Hold, Комбо, Медиа-клавиши) с сохранением энергоэффективности беспроводного чипа.`,
    results: `• Получена 100% стабильная прошивка с возможностью менять раскладку, подсветку и макросы в браузере за 1 секунду.
• Проект оформлен в аккуратный открытый репозиторий с подробным Readme и файловым проводником прошивки.`,
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
      bodyContainer.innerHTML = `
        <div class="architecture-tab-wrap">
          <h4><i data-lucide="layers"></i> Архитектурный подход и роли компонентов</h4>
          <p class="arch-desc">Данный кейс спроектирован с учетом требований высокой отказоустойчивости, модульности и безопасного разделения ответственности (Separation of Concerns).</p>
          
          <div class="arch-highlights-list">
            <div class="arch-item">
              <div class="arch-icon"><i data-lucide="shield-check"></i></div>
              <div>
                <strong>Безопасность & Изоляция</strong>
                <p>Все конфиденциальные данные вынесены за пределы клиентского кода. Применяются стандарты изоляции среды.</p>
              </div>
            </div>
            <div class="arch-item">
              <div class="arch-icon"><i data-lucide="zap"></i></div>
              <div>
                <strong>Производительность & Оптимизация</strong>
                <p>Минимизация задержек за счет асинхронной обработки и эффективного использования аппаратных ресурсов.</p>
              </div>
            </div>
            <div class="arch-item">
              <div class="arch-icon"><i data-lucide="refresh-cw"></i></div>
              <div>
                <strong>Надежность & Fallback</strong>
                <p>Предусмотрены сценарии обработки ошибок сетевого слоя и локальные пути сохранения работоспособности.</p>
              </div>
            </div>
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
