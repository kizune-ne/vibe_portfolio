/* ==========================================================================
   TELEGRAM AI CONTENT GENERATOR & PREMIUM EDITORIAL SIMULATOR
   ========================================================================== */

const NICHES_DATABASE = {
  it: {
    badge: "IT & ARCHITECTURE // TECHNICAL REVIEW",
    time: "14:32",
    views: "4.2k",
    reactions: "👍 240  💡 112  💻 58",
    er: "10.4%",
    formatted: `<b>Проектирование асинхронного Telegram-пайплайна: дедупликация и защита сессий</b>

Разбор микросервисной архитектуры для бесперебойного сбора и обработки потока данных из 50+ источников.

<b>Ключевые инженерные решения:</b>
• <b>Async Telethon Engine:</b> асинхронное ядро обработки с механизмом задержек Exponential Backoff и ротацией прокси-серверов.
• <b>Deduplication &amp; Hash Guard:</b> алгоритм проверки MD5-сигнатур медиафайлов и хэширования фрагментов текста для защиты базы от повторов.
• <b>Topic Routing Manager:</b> система динамической маршрутизации входящих сообщений по тематическим топикам супергруппы.

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

    prompt: `SYSTEM ROLE: Senior Python & Infrastructure Architect.
TASK: Write an in-depth technical post about Telegram async ingestion pipeline.
STYLE: Editorial, precise, data-backed, zero filler words.
MODEL: Qwen 3.5 Coder (Temperature: 0.2, Top-P: 0.9)`
  },

  crypto: {
    badge: "WEB3 & CRYPTO // ON-CHAIN ANALYTICS",
    time: "11:15",
    views: "5.8k",
    reactions: "📈 512  🎯 280  💡 140",
    er: "13.6%",
    formatted: `<b>Аналитика ончейн-активности: Чистый приток в L2-протоколы и валидация нод</b>

Ежедневная аналитическая выжимка активности распределенных сетей, сформированная автоматическим AI-пайплайном.

<b>Ключевые показатели и тренды:</b>
• <b>Ликвидность L2-сетей:</b> Совокупный приток капитала составил <b>+$140M</b> за прошедшие 24 часа.
• <b>Валидация транзакций:</b> Зафиксировано снижение комиссии за газовые лимиты на <b>34%</b> в решениях ZK-Rollups.
• <b>Автоматический мониторинг:</b> Сканирование 50+ профильных смарт-контрактов без участия оператора.

<i>Подробный отчет и сигналы роутинга сохранены в закрытой базе знаний.</i>

#web3 #crypto #onchain #analytics #smart_contracts`,

    markdownV2: `\\*\\*Аналитика ончейн\\-активности: Чистый приток в L2\\-протоколы и валидация нод\\*\\*

Ежедневная аналитическая выжимка активности распределенных сетей, сформированная автоматическим AI\\-пайплайном\\.

\\*\\*Ключевые показатели и тренды:\\*\\*
• \\*\\*Ликвидность L2\\-сетей:\\*\\* Совокупный приток капитала составил \\*\\*\\+\\$140M\\*\\* за прошедшие 24 часа\\.
• \\*\\*Валидация транзакций:\\*\\* Зафиксировано снижение комиссии за газовые лимиты на \\*\\*34%\\*\\* в решениях ZK\\-Rollups\\.
• \\*\\*Автоматический мониторинг:\\*\\* Сканирование 50\\+ профильных смарт\\-контрактов без участия оператора\\.

_Подробный отчет и сигналы роутинга сохранены в закрытой базе знаний\\._

\\#web3 \\#crypto \\#onchain \\#analytics \\#smart\\_contracts`,

    prompt: `SYSTEM ROLE: Senior Web3 & On-Chain Analyst.
TASK: Summarize 24h market signals and L2 rollup metrics.
STYLE: Quantitative, precise financial figures, clear structure.
MODEL: Gemini 3.5 Flash (Temperature: 0.1)`
  },

  igaming: {
    badge: "IGAMING // TRAFFIC & FUNNEL ANALYTICS",
    time: "15:45",
    views: "3.5k",
    reactions: "🎯 195  💼 84  👍 62",
    er: "8.9%",
    formatted: `<b>Сквозная аналитика контент-воронок и оптимизация Retention в iGaming</b>

Разбор методов повышения удержания аудитории в медиабайинговых и арбитражных Telegram-каналах.

<b>Применяемые AI-механики:</b>
• <b>AI-Generative Hooks:</b> Использование структурированных вступлений повышает показатель удержания первого экрана на <b>42%</b>.
• <b>Dynamic CTA Buttons:</b> Автоматическая генерация адаптивных инлайн-кнопок под каждого провайдера трафика.
• <b>A/B Testing Tone-of-Voice:</b> Сравнительный анализ конверсии экспертного и инсайдерского стилей подачи.

<i>Сформировано модулем планирования публикаций Telegram Bot API.</i>

#igaming #affiliate #traffic #analytics #funnels`,

    markdownV2: `\\*\\*Сквозная аналитика контент\\-воронок и оптимизация Retention в iGaming\\*\\*

Разбор методов повышения удержания аудитории в медиабайинговых и арбитражных Telegram\\-каналах\\.

\\*\\*Применяемые AI\\-механики:\\*\\*
• \\*\\*AI\\-Generative Hooks:\\*\\* Использование структурированных вступлений повышает показатель удержания первого экрана на \\*\\*42%\\*\\*\\.
• \\*\\*Dynamic CTA Buttons:\\*\\* Автоматическая генерация адаптивных инлайн\\-кнопок под каждого провайдера трафика\\.
• \\*\\*A/B Testing Tone\\-of\\-Voice:\\*\\* Сравнительный анализ конверсии экспертного и инсайдерского стилей подачи\\.

_Сформировано модулем планирования публикаций Telegram Bot API\\._

\\#igaming \\#affiliate \\#traffic \\#analytics \\#funnels`,

    prompt: `SYSTEM ROLE: Media Buying & Funnel Optimization Strategist.
TASK: Analyze content conversion mechanics for affiliate networks.
STYLE: Analytical, conversion-driven, objective metrics.
MODEL: Claude 3.5 Sonnet / Gemini (Temperature: 0.3)`
  },

  fintech: {
    badge: "FINTECH // MACRO & RISK ANALYTICS",
    time: "09:30",
    views: "4.9k",
    reactions: "📊 310  💡 180  👍 125",
    er: "11.8%",
    formatted: `<b>Макроэкономический дайджест: Оценка волатильности и корпоративных отчетов</b>

Ежедневный финансовый анализ рынка, созданный с помощью асинхронного парсинга и LLM-суммаризации.

<b>Финансовые индикаторы:</b>
• <b>Индекс волатильности:</b> Снижение на <b>4.2%</b> на фоне стабилизации ключевых процентных ставок.
• <b>Автоматическая суммаризация:</b> Извлечение метрик из 50+ корпоративных отчетов за 90 секунд.
• <b>Risk Management Model:</b> Выявление межсекторальных корреляций в реальном времени.

<i>Сформировано в рамках автоматизированной контент-матрицы.</i>

#fintech #trading #macroeconomics #risk_management #ai_parsing`,

    markdownV2: `\\*\\*Макроэкономический дайджест: Оценка волатильности и корпоративных отчетов\\*\\*

Ежедневный финансовый анализ рынка, созданный с помощью асинхронного парсинга и LLM\\-суммаризации\\.

\\*\\*Финансовые индикаторы:\\*\\*
• \\*\\*Индекс волатильности:\\*\\* Снижение на \\*\\*4\\.2%\\*\\* на фоне стабилизации ключевых процентных ставок\\.
• \\*\\*Автоматическая суммаризация:\\*\\* Извлечение метрик из 50\\+ корпоративных отчетов за 90 секунд\\.
• \\*\\*Risk Management Model:\\*\\* Выявление межсекторальных корреляций в реальном времени\\.

_Сформировано в рамках автоматизированной контент\\-матрицы\\._

\\#fintech \\#trading \\#macroeconomics \\#risk\\_management \\#ai\\_parsing`,

    prompt: `SYSTEM ROLE: Senior FinTech Risk Analyst.
TASK: Synthesize macroeconomic indicators and market reports.
STYLE: Formal, quantitative, structured.
MODEL: Qwen 3.5 (Temperature: 0.1)`
  }
};

let currentNiche = 'it';
let currentMode = 'preview'; // 'preview' | 'markdown' | 'prompt'

export function initTgContentSimulator() {
  const container = document.getElementById('cardTgContent');
  if (!container) return;

  const nicheTabs = container.querySelectorAll('.tov-tab');
  const btnModePreview = container.querySelector('#btnTgModePreview');
  const btnModeMarkdown = container.querySelector('#btnTgModeMarkdown');
  const btnModePrompt = container.querySelector('#btnTgModePrompt');

  // Niche Tab Switching
  nicheTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const niche = tab.getAttribute('data-niche');
      if (!niche || niche === currentNiche) return;

      nicheTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      currentNiche = niche;
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

  const item = NICHES_DATABASE[currentNiche] || NICHES_DATABASE.it;

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

    // Render Interactive Inline Buttons (Hidden per user request)
    if (buttonsContainer) {
      buttonsContainer.style.display = 'none';
      buttonsContainer.innerHTML = '';
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
