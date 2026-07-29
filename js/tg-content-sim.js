/* ==========================================================================
   TELEGRAM AI CONTENT GENERATOR & PREMIUM EDITORIAL SIMULATOR
   ========================================================================== */

const FORMATS_DATABASE = {
  arch: {
    badge: "ENGINEERING REVIEW // TELEGRAM PIPELINE",
    time: "14:32",
    views: "4.2k",
    reactions: "👍 240  💡 112  💻 58",
    er: "10.4%",
    formatted: `<b>Проектирование асинхронного Telegram-пайплайна: дедупликация и защита сессий</b>

Разбор микросервисной архитектуры для бесперебойного сбора и обработки потока данных из 50+ источников.

<b>Ключевые инженерные решения:</b>
• <code>Async Telethon Engine</code> — асинхронное ядро обработки с механизмом адаптивных задержек (Exponential Backoff) и ротацией прокси-серверов.
• <code>Deduplication &amp; Hash Guard</code> — алгоритм проверки MD5-сигнатур медиафайлов и хэширования фрагментов текста для защиты базы данных от повторов.
• <code>Topic Routing Manager</code> — система динамической маршрутизации входящих сообщений по тематическим топикам супергруппы.

<i>Суммаризация лонгридов реализована на базе локальной модели Qwen 3.5 Coder.</i>

#architecture #python #asyncio #telegram_api #devops`,

    markdownV2: `\\*\\*Проектирование асинхронного Telegram\\-пайплайна: дедупликация и защита сессий\\*\\*

Разбор микросервисной архитектуры для бесперебойного сбора и обработки потока данных из 50\\+ источников\\.

\\*\\*Ключевые инженерные решения:\\*\\*
• \`Async Telethon Engine\` — асинхронное ядро обработки с механизмом адаптивных задержек \\(Exponential Backoff\\) и ротацией прокси\\-серверов\\.
• \`Deduplication \\& Hash Guard\` — алгоритм проверки MD5\\-сигнатур медиафайлов и хэширования фрагментов текста для защиты базы данных от повторов\\.
• \`Topic Routing Manager\` — система динамической маршрутизации входящих сообщений по тематическим топикам супергруппы\\.

_Суммаризация лонгридов реализована на базе локальной модели Qwen 3\\.5 Coder\\._

\\#architecture \\#python \\#asyncio \\#telegram\\_api \\#devops`,

    prompt: `SYSTEM ROLE: Senior Python & Infrastructure Engineer.
TASK: Write a technical architectural post regarding Telegram scraping pipeline.
STYLE: Editorial, precise, objective, no conversational filler or emojis.
MODEL: Qwen 3.5 Coder (Temperature: 0.2, Top-P: 0.9)`
  },

  news: {
    badge: "TREND INTELLIGENCE // LLM REWRITE",
    time: "11:05",
    views: "5.8k",
    reactions: "📈 512  🎯 280  💡 140",
    er: "13.6%",
    formatted: `<b>Релиз модели Qwen 3.6: Интеграция в локальную инфраструктуру Ollama</b>

Событие зафиксировано автоматической системой мониторинга. Аналитическая выжимка сформирована и подготовлена к публикации за 120 секунд.

<b>Основные изменения и метрики:</b>
• Рост производительности генерации кода на <b>35%</b> по результатам внутренних CUDA-бенчмарков.
• Расширение контекстного окна до <b>128 000 токенов</b> с сохранением точности извлечения информации.
• Контейнеризация в Docker Compose с удерживанием весов модели в VRAM видеокарты.

<i>Публикация провалидирована через закрытый модерационный канал.</i>

#ai_engineering #llm #ollama #qwen #benchmarks`,

    markdownV2: `\\*\\*Релиз модели Qwen 3\\.6: Интеграция в локальную инфраструктуру Ollama\\*\\*

Событие зафиксировано автоматической системой мониторинга\\. Аналитическая выжимка сформирована и подготовлена к публикации за 120 секунд\\.

\\*\\*Основные изменения и метрики:\\*\\*
• Рост производительности генерации кода на \\*\\*35%\\*\\* по результатам внутренних CUDA\\-бенчмарков\\.
• Расширение контекстного окна до \\*\\*128 000 токенов\\*\\* с сохранением точности извлечения информации\\.
• Контейнеризация в Docker Compose с удерживанием весов модели в VRAM видеокарты\\.

_Публикация провалидирована через закрытый модерационный канал\\._

\\#ai\\_engineering \\#llm \\#ollama \\#qwen \\#benchmarks`,

    prompt: `SYSTEM ROLE: Senior AI Research Analyst.
TASK: Produce an executive summary for breaking open-source LLM releases.
STYLE: Data-driven, precise numbers, benchmark comparisons.
MODEL: Gemini 3.5 Flash (Temperature: 0.1)`
  },

  cta: {
    badge: "B2B SOLUTIONS // AI AUTOMATION",
    time: "16:40",
    views: "3.5k",
    reactions: "💼 195  💬 84  👍 62",
    er: "8.9%",
    formatted: `<b>Разработка автономных Telegram-систем и ИИ-агентов под ключ</b>

Проектирование и внедрение отказоустойчивых сервисов автоматизации для бизнеса и контент-команд.

<b>Направления разработки:</b>
• <b>Парсеры и мониторинг:</b> Выделенные асинхронные скрипты с дедупликацией и защитой от блокировок.
• <b>ИИ-Ассистенты и RAG:</b> Интеграция локальных баз знаний Obsidian с поиском по эмбеддингам.
• <b>Инфраструктура:</b> Развертывание в Docker с обеспечением 99.9% Uptime и полной изоляцией секретов.

<i>Для обсуждения технического задания обратитесь к автору в Telegram.</i>

#b2b #telegram_bot #ai_agents #python #architecture`,

    markdownV2: `\\*\\*Разработка автономных Telegram\\-систем и ИИ\\-агентов под ключ\\*\\*

Проектирование и внедрение отказоустойчивых сервисов автоматизации для бизнеса и контент\\-команд\\.

\\*\\*Направления разработки:\\*\\*
• \\*\\*Парсеры и мониторинг:\\*\\* Выделенные асинхронные скрипты с дедупликацией и защитой от блокировок\\.
• \\*\\*ИИ\\-Ассистенты и RAG:\\*\\* Интеграция локальных баз знаний Obsidian с поиском по эмбеддингам\\.
• \\*\\*Инфраструктура:\\*\\* Развертывание в Docker с обеспечением 99\\.9% Uptime и полной изоляцией секретов\\.

_Для обсуждения технического задания обратитесь к автору в Telegram\\._

\\#b2b \\#telegram\\_bot \\#ai\\_agents \\#python \\#architecture`,

    prompt: `SYSTEM ROLE: B2B Technology Solution Architect.
TASK: Present technical service offerings clearly and concisely.
STYLE: Formal, professional, benefit-focused.
MODEL: Claude 3.5 Sonnet (Temperature: 0.3)`
  },

  digest: {
    badge: "EXECUTIVE SUMMARY // WEEKLY REVIEW",
    time: "19:00",
    views: "4.9k",
    reactions: "📊 310  💡 180  👍 125",
    er: "11.8%",
    formatted: `<b>Еженедельный отчет: Ключевые публикации и архитектурные решения</b>

Автоматическая суммаризация главных материалов канала за прошедший период.

<b>Топ-3 публикации:</b>
1. <b>DevContainer Setup:</b> Практическое руководство по изоляции окружения Python и пробросу GPU CUDA.
2. <b>Obsidian RAG Engine:</b> Построение локальной системы поиска по базе знаний с задержкой отклика до 150 мс.
3. <b>QMK C-Firmware:</b> Разработка низкоуровневой прошивки клавиатуры MonsGeek M1 V5.

<i>Сформировано модулем планирования публикаций Telegram Bot API.</i>

#digest #summary #architecture #ai_engineering`,

    markdownV2: `\\*\\*Еженедельный отчет: Ключевые публикации и архитектурные решения\\*\\*

Автоматическая суммаризация главных материалов канала за прошедший период\\.

\\*\\*Топ\\-3 публикации:\\*\\*
1\\. \\*\\*DevContainer Setup:\\*\\* Практическое руководство по изоляции окружения Python и пробросу GPU CUDA\\.
2\\. \\*\\*Obsidian RAG Engine:\\*\\* Построение локальной системы поиска по базе знаний с задержкой отклика до 150 мс\\.
3\\. \\*\\*QMK C\\-Firmware:\\*\\* Разработка низкоуровневой прошивки клавиатуры MonsGeek M1 V5\\.

_Сформировано модулем планирования публикаций Telegram Bot API\\._

\\#digest \\#summary \\#architecture \\#ai\\_engineering`,

    prompt: `SYSTEM ROLE: Editorial Content Executive.
TASK: Produce a concise weekly executive summary of published engineering posts.
STYLE: Structured, clean, bulleted.
MODEL: Local Qwen 3.5 (Temperature: 0.1)`
  }
};

let currentFormat = 'arch';
let currentMode = 'preview'; // 'preview' | 'markdown' | 'prompt'

export function initTgContentSimulator() {
  const container = document.getElementById('cardTgContent');
  if (!container) return;

  const formatTabs = container.querySelectorAll('.tov-tab');
  const btnModePreview = container.querySelector('#btnTgModePreview');
  const btnModeMarkdown = container.querySelector('#btnTgModeMarkdown');
  const btnModePrompt = container.querySelector('#btnTgModePrompt');

  // Format Tab Switching
  formatTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const format = tab.getAttribute('data-format');
      if (!format || format === currentFormat) return;

      formatTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      currentFormat = format;
      renderPost(true);
    });
  });

  // Mode Switching
  const modeBtns = [btnModePreview, btnModeMarkdown, btnModePrompt];
  modeBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      if (!mode || mode === currentMode) return;

      modeBtns.forEach(b => b && b.classList.remove('active'));
      btn.classList.add('active');

      currentMode = mode;
      renderPost(false);
    });
  });

  // Initial Render
  renderPost(false);
}

function renderPost(animate = true) {
  const postCard = document.getElementById('tgSimPostCard');
  if (!postCard) return;

  const item = FORMATS_DATABASE[currentFormat] || FORMATS_DATABASE.arch;

  if (animate) {
    postCard.classList.add('is-generating');
  }

  setTimeout(() => {
    const badgeEl = postCard.querySelector('.tg-post-badge');
    const timeEl = postCard.querySelector('.tg-post-time');
    const contentEl = postCard.querySelector('.tg-post-body');
    const buttonsContainer = postCard.querySelector('.tg-post-inline-buttons');
    const viewsEl = document.getElementById('tgStatViews');
    const reactionsEl = document.getElementById('tgStatReactions');
    const erEl = document.getElementById('tgStatEr');

    if (badgeEl) badgeEl.textContent = item.badge;
    if (timeEl) timeEl.textContent = item.time;
    if (viewsEl) viewsEl.textContent = item.views;
    if (reactionsEl) reactionsEl.textContent = item.reactions;
    if (erEl) erEl.textContent = item.er;

    // Render Content Based on Mode
    if (contentEl) {
      if (currentMode === 'markdown') {
        contentEl.innerHTML = `<div class="code-view-box"><div class="code-view-title">TELEGRAM BOT API MARKDOWNV2 RAW:</div><pre><code>${escapeHtml(item.markdownV2)}</code></pre></div>`;
      } else if (currentMode === 'prompt') {
        contentEl.innerHTML = `<div class="code-view-box"><div class="code-view-title">LLM PROMPT &amp; SYSTEM ENGINE MATRIX:</div><pre><code>${escapeHtml(item.prompt)}</code></pre></div>`;
      } else {
        contentEl.innerHTML = item.formatted;
      }
    }

    // Render Interactive Inline Buttons
    if (buttonsContainer) {
      if (currentMode === 'preview') {
        buttonsContainer.style.display = 'flex';
        buttonsContainer.innerHTML = `
          <button class="tg-inline-btn" id="btnActionMarkdown">
            <i data-lucide="file-code-2"></i>
            <span>Код разметки MarkdownV2</span>
          </button>
          <button class="tg-inline-btn" id="btnActionPrompt">
            <i data-lucide="cpu"></i>
            <span>Промпт и параметры LLM</span>
          </button>
          <a href="https://t.me/kizune_ne" target="_blank" class="tg-inline-btn primary-cta">
            <i data-lucide="send"></i>
            <span>Обсудить проект в Telegram</span>
          </a>
        `;

        // Wire click handlers for inline buttons
        const btnMd = buttonsContainer.querySelector('#btnActionMarkdown');
        const btnPr = buttonsContainer.querySelector('#btnActionPrompt');
        
        if (btnMd) {
          btnMd.addEventListener('click', () => {
            currentMode = 'markdown';
            updateModeButtonsUI();
            renderPost(false);
          });
        }
        if (btnPr) {
          btnPr.addEventListener('click', () => {
            currentMode = 'prompt';
            updateModeButtonsUI();
            renderPost(false);
          });
        }
      } else {
        buttonsContainer.style.display = 'none';
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    if (animate) {
      postCard.classList.remove('is-generating');
    }
  }, animate ? 150 : 0);
}

function updateModeButtonsUI() {
  const container = document.getElementById('cardTgContent');
  if (!container) return;
  const modeBtns = container.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    if (btn.getAttribute('data-mode') === currentMode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
