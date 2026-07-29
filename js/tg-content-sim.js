/* ==========================================================================
   TELEGRAM AI CONTENT GENERATOR & PROFESSIONAL SIMULATOR
   ========================================================================== */

const FORMATS_DATABASE = {
  arch: {
    badge: "ENGINEERING // ARCHITECTURE DIGEST",
    time: "14:32",
    views: "4.2k",
    reactions: "🔥 240  ⚡ 112  💻 58",
    er: "10.4%",
    formatted: `<b>⚡ Потоковый Telegram-Парсер с топик-роутингом & Deduplication</b>

Разбор архитектуры асинхронного скрапинга 50+ каналов без блокировок.

<b>Ключевые решения:</b>
• <code>Async Telethon Engine</code> — ротация прокси-серверов с экспоненциальными задержками.
• <code>MD5 Hash Deduplication</code> — проверка хэшей изображений и фрагментов текста для защиты БД от дублей.
• <code>Topic Routing Manager</code> — авто-раскладка входящего потока по топикам супергруппы.

<i>Сжатие лонгридов выполнено через локальную модель Qwen 3.5.</i>

#python #asyncio #telegram_api #architecture`,

    markdownV2: `\\*\\*⚡ Потоковый Telegram\\-Парсер с топик\\-роутингом \\& Deduplication\\*\\*

Разбор архитектуры асинхронного скрапинга 50\\+ каналов без блокировок\\.

\\*\\*Ключевые решения:\\*\\*
• \`Async Telethon Engine\` — ротация прокси\\-серверов с экспоненциальными задержками\\.
• \`MD5 Hash Deduplication\` — проверка хэшей изображений и фрагментов текста для защиты БД от дублей\\.
• \`Topic Routing Manager\` — авто\\-раскладка входящего потока по топикам супергруппы\\.

_Сжатие лонгридов выполнено через локальную модель Qwen 3\\.5\\._

\\#python \\#asyncio \\#telegram\\_api \\#architecture`,

    prompt: `SYSTEM ROLE: Senior Python Architect & Content Engineer.
TASK: Write a technical architectural post about Telegram scraping pipeline.
RULES: Use MarkdownV2, code blocks for library names, bullet points for key decisions, concise tone without buzzwords.
MODEL: Qwen 3.5 Coder (Temperature: 0.3, Top-P: 0.9)`
  },

  news: {
    badge: "NEWSJACKING // FAST REWRITE (120s)",
    time: "11:05",
    views: "5.8k",
    reactions: "⚡ 512  🚀 280  💡 140",
    er: "13.6%",
    formatted: `<b>🔥 ТРЕНД ЗА 2 МИНУТЫ: Выход Qwen 3.6 & Интеграция в Ollama</b>

Инфоповод обнаружен авто-сканером трендов в 11:03. Уникализированный рерайт опубликован за 120 секунд.

<b>Что изменилось:</b>
• Увеличена скорость генерации кода на <b>+35%</b> (CUDA benchmark).
• Поддержка контекстного окна <b>128k токенов</b> без потери точности.
• Автоматический проброс через Docker Compose с удержанием в VRAM.

<i>Автопостинг выполнен через закрытый канал модератора.</i>

#ai_news #llm #ollama #qwen #newsjacking`,

    markdownV2: `\\*\\*🔥 ТРЕНД ЗА 2 МИНУТЫ: Выход Qwen 3\\.6 \\& Интеграция в Ollama\\*\\*

Инфоповод обнаружен авто\\-сканером трендов в 11:03\\. Уникализированный рерайт опубликован за 120 секунд\\.

\\*\\*Что изменилось:\\*\\*
• Увеличена скорость генерации кода на \\*\\+\\(35%\\)\\* \\(CUDA benchmark\\)\\.
• Поддержка контекстного окна \\*\\*128k токенов\\*\\* без потери точности\\.
• Автоматический проброс через Docker Compose с удержанием в VRAM\\.

_Автопостинг выполнен через закрытый канал модератора\\._

\\#ai\\_news \\#llm \\#ollama \\#qwen \\#newsjacking`,

    prompt: `SYSTEM ROLE: Fast AI News Analyst (Newsjacking Engine).
TASK: Summarize raw breaking news within 120 seconds.
RULES: Include time delta, key metrics in bold, 3 short highlights, hashtags.
MODEL: Gemini 3.5 Flash (Temperature: 0.2)`
  },

  cta: {
    badge: "CONVERSION // CTA & INLINE FUNNEL",
    time: "16:40",
    views: "3.5k",
    reactions: "🎯 195  💬 84  ⚡ 62",
    er: "8.9%",
    formatted: `<b>🎯 Нужен асинхронный бот или ИИ-агент под ваши задачи?</b>

Автоматизирую рутинные процессы: от парсеров любой сложности до локальных ИИ-ассистентов с базами знаний (RAG).

<b>Что входит в разработку:</b>
• Проектирование архитектуры и защита от банов (Proxy / MD5).
• Docker-контейнеризация и 99.9% Uptime на вашем сервере.
• Интеграция с Telegram Bot API, веб-вебхуки и инлайн-панели.

<i>Нажмите кнопку ниже для бесплатной консультации и обсуждения ТЗ.</i>

#services #telegram_bot #ai_agents #python`,

    markdownV2: `\\*\\*🎯 Нужен асинхронный бот или ИИ\\-агент под ваши задачи?\\*\\*

Автоматизирую рутинные процессы: от парсеров любой сложности до локальных ИИ\\-ассистентов с базами знаний \\(RAG\\)\\.

\\*\\*Что входит в разработку:\\*\\*
• Проектирование архитектуры и защита от банов \\(Proxy / MD5\\)\\.
• Docker\\-контейнеризация и 99\\.9% Uptime на вашем сервере\\.
• Интеграция с Telegram Bot API, веб\\-вебхуки и инлайн\\-панели\\.

_Нажмите кнопку ниже для бесплатной консультации и обсуждения ТЗ\\._

\\#services \\#telegram\\_bot \\#ai\\_agents \\#python`,

    prompt: `SYSTEM ROLE: B2B Copywriter & Conversion Specialist.
TASK: Craft a high-converting CTA post for Telegram automation services.
RULES: Transparent offerings, clear benefits, actionable CTA inline buttons.
MODEL: Claude 3.5 Sonnet / Gemini (Temperature: 0.4)`
  },

  digest: {
    badge: "WEEKLY DIGEST // AI AUTOMATION",
    time: "19:00",
    views: "4.9k",
    reactions: "📊 310  ⚡ 180  🔥 125",
    er: "11.8%",
    formatted: `<b>📊 ИИ-Дайджест Недели: Главные материалы и релизы</b>

Автоматический сбор лучших постов канала за прошедшие 7 дней.

<b>Топ-3 публикации недели:</b>
1. <b>DevContainer Setup:</b> Настройка 100% изоляции Python и GPU VRAM.
2. <b>Obsidian RAG Engine:</b> Поиск по вашей базе знаний за 150 мс.
3. <b>QMK Firmware:</b> Кастомная C-прошивка клавиатуры MonsGeek M1 V5.

<i>Сформировано авто-планировщиком публикаций на базе Telegram Bot API.</i>

#digest #summary #weekly #ai_engineering`,

    markdownV2: `\\*\\*📊 ИИ\\-Дайджест Недели: Главные материалы и релизы\\*\\*

Автоматический сбор лучших постов канала за прошедшие 7 дней\\.

\\*\\*Топ\\-3 публикации недели:\\*\\*
1\\. \\*\\*DevContainer Setup:\\*\\* Настройка 100% изоляции Python и GPU VRAM\\.
2\\. \\*\\*Obsidian RAG Engine:\\*\\* Поиск по вашей базе знаний за 150 мс\\.
3\\. \\*\\*QMK Firmware:\\*\\* Кастомная C\\-прошивка клавиатуры MonsGeek M1 V5\\.

_Сформировано авто\\-планировщиком публикаций на базе Telegram Bot API\\._

\\#digest \\#summary \\#weekly \\#ai\\_engineering`,

    prompt: `SYSTEM ROLE: Weekly Digest Auto-Summarizer.
TASK: Aggregate top performing posts from weekly database logs.
RULES: Numbered top-3 list, concise summaries, auto-publishing trigger.
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
            <span>⚙️ Посмотреть разметку MarkdownV2</span>
          </button>
          <button class="tg-inline-btn" id="btnActionPrompt">
            <i data-lucide="cpu"></i>
            <span>🧠 Промпт &amp; Системный контекст</span>
          </button>
          <a href="https://t.me/kizune_ne" target="_blank" class="tg-inline-btn primary-cta">
            <i data-lucide="send"></i>
            <span>💬 Написать @kizune_ne в Telegram</span>
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
  }, animate ? 200 : 0);
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
