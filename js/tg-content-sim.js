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
    formatted: `<h3 class="tg-post-title">Проектирование асинхронного Telegram-пайплайна: дедупликация и защита сессий</h3>
<p class="tg-post-intro">Разбор микросервисной архитектуры для сбора и обработки потока данных из 50+ источников.</p>
<div class="tg-post-section-label"><i data-lucide="cpu"></i> Ключевые инженерные решения:</div>
<ul class="tg-post-bullets">
  <li><span class="bullet-dot"></span><b>Async Telethon Engine:</b> асинхронная обработка и ротация прокси-серверов.</li>
  <li><span class="bullet-dot"></span><b>Deduplication &amp; Hash Guard:</b> проверка MD5-сигнатур и защита базы от повторов.</li>
  <li><span class="bullet-dot"></span><b>Topic Routing Manager:</b> динамическая маршрутизация сообщений по топикам.</li>
</ul>
<div class="tg-post-note"><i>Суммаризация лонгридов реализована на базе локальной модели Qwen 3.5 Coder.</i></div>
<div class="tg-post-tags">
  <span class="tag-chip">#architecture</span>
  <span class="tag-chip">#python</span>
  <span class="tag-chip">#asyncio</span>
  <span class="tag-chip">#devops</span>
</div>`,

    markdownV2: `\\*\\*Проектирование асинхронного Telegram\\-пайплайна: дедупликация и защита сессий\\*\\*

Разбор микросервисной архитектуры для сбора и обработки потока данных из 50\\+ источников\\.

\\*\\*Ключевые инженерные решения:\\*\\*
• \`Async Telethon Engine\` — асинхронная обработка и ротация прокси\\-серверов\\.
• \`Deduplication \\& Hash Guard\` — проверка MD5\\-сигнатур и защита базы от повторов\\.
• \`Topic Routing Manager\` — динамическая маршрутизация сообщений по топикам\\.

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
    formatted: `<h3 class="tg-post-title">Аналитика ончейн-активности: Чистый приток в L2-протоколы и валидация нод</h3>
<p class="tg-post-intro">Ежедневная аналитическая выжимка активности сетей, созданная AI-пайплайном.</p>
<div class="tg-post-section-label"><i data-lucide="line-chart"></i> Ключевые показатели и тренды:</div>
<ul class="tg-post-bullets">
  <li><span class="bullet-dot"></span><b>Ликвидность L2-сетей:</b> приток капитала <b>+$140M</b> за последние 24 часа.</li>
  <li><span class="bullet-dot"></span><b>Валидация транзакций:</b> снижение комиссии на <b>34%</b> в решениях ZK-Rollups.</li>
  <li><span class="bullet-dot"></span><b>Авто-Мониторинг:</b> сканирование 50+ смарт-контрактов без оператора.</li>
</ul>
<div class="tg-post-note"><i>Подробный отчет и сигналы роутинга сохранены в закрытой базе знаний.</i></div>
<div class="tg-post-tags">
  <span class="tag-chip">#web3</span>
  <span class="tag-chip">#crypto</span>
  <span class="tag-chip">#onchain</span>
  <span class="tag-chip">#smart_contracts</span>
</div>`,

    markdownV2: `\\*\\*Аналитика ончейн\\-активности: Чистый приток в L2\\-протоколы и валидация нод\\*\\*

Ежедневная аналитическая выжимка активности сетей, созданная AI\\-пайплайном\\.

\\*\\*Ключевые показатели и тренды:\\*\\*
• \\*\\*Ликвидность L2\\-сетей:\\*\\* приток капитала \\*\\*\\+\\$140M\\*\\* за последние 24 часа\\.
• \\*\\*Валидация транзакций:\\*\\* снижение комиссии на \\*\\*34%\\*\\* в решениях ZK\\-Rollups\\.
• \\*\\*Авто\\-Мониторинг:\\*\\* сканирование 50\\+ смарт\\-контрактов без оператора\\.

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
    formatted: `<h3 class="tg-post-title">Сквозная аналитика контент-воронок и оптимизация Retention в iGaming</h3>
<p class="tg-post-intro">Разбор методов повышения удержания аудитории в медиабайинговых Telegram-каналах.</p>
<div class="tg-post-section-label"><i data-lucide="target"></i> Применяемые AI-механики:</div>
<ul class="tg-post-bullets">
  <li><span class="bullet-dot"></span><b>AI-Generative Hooks:</b> рост удержания первого экрана на <b>+42%</b>.</li>
  <li><span class="bullet-dot"></span><b>Dynamic CTA Buttons:</b> авто-генерация адаптивных инлайн-кнопок под трафик.</li>
  <li><span class="bullet-dot"></span><b>A/B Testing Tone-of-Voice:</b> анализ конверсии экспертного стиля подачи.</li>
</ul>
<div class="tg-post-note"><i>Сформировано модулем планирования публикаций Telegram Bot API.</i></div>
<div class="tg-post-tags">
  <span class="tag-chip">#igaming</span>
  <span class="tag-chip">#affiliate</span>
  <span class="tag-chip">#traffic</span>
  <span class="tag-chip">#funnels</span>
</div>`,

    markdownV2: `\\*\\*Сквозная аналитика контент\\-воронок и оптимизация Retention в iGaming\\*\\*

Разбор методов повышения удержания аудитории в медиабайинговых Telegram\\-каналах\\.

\\*\\*Применяемые AI\\-механики:\\*\\*
• \\*\\*AI\\-Generative Hooks:\\*\\* рост удержания первого экрана на \\*\\*\\+42%\\*\\*\\.
• \\*\\*Dynamic CTA Buttons:\\*\\* авто\\-генерация адаптивных инлайн\\-кнопок под трафик\\.
• \\*\\*A/B Testing Tone\\-of\\-Voice:\\*\\* анализ конверсии экспертного стиля подачи\\.

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
    formatted: `<h3 class="tg-post-title">Макроэкономический дайджест: Оценка волатильности и корпоративных отчетов</h3>
<p class="tg-post-intro">Ежедневный финансовый анализ рынка, созданный LLM-суммаризацией.</p>
<div class="tg-post-section-label"><i data-lucide="bar-chart-3"></i> Финансовые индикаторы:</div>
<ul class="tg-post-bullets">
  <li><span class="bullet-dot"></span><b>Индекс волатильности:</b> снижение на <b>4.2%</b> на фоне стабилизации ставок.</li>
  <li><span class="bullet-dot"></span><b>Авто-Суммаризация:</b> извлечение метрик из 50+ отчетов за 90 секунд.</li>
  <li><span class="bullet-dot"></span><b>Risk Management Model:</b> выявление корреляций в реальном времени.</li>
</ul>
<div class="tg-post-note"><i>Сформировано в рамках автоматизированной контент-матрицы.</i></div>
<div class="tg-post-tags">
  <span class="tag-chip">#fintech</span>
  <span class="tag-chip">#trading</span>
  <span class="tag-chip">#macroeconomics</span>
  <span class="tag-chip">#ai_parsing</span>
</div>`,

    markdownV2: `\\*\\*Макроэкономический дайджест: Оценка волатильности и корпоративных отчетов\\*\\*

Ежедневный финансовый анализ рынка, созданный LLM\\-суммаризацией\\.

\\*\\*Финансовые индикаторы:\\*\\*
• \\*\\*Индекс волатильности:\\*\\* снижение на \\*\\*4\\.2%\\*\\* на фоне стабилизации ставок\\.
• \\*\\*Авто\\-Суммаризация:\\*\\* извлечение метрик из 50\\+ отчетов за 90 секунд\\.
• \\*\\*Risk Management Model:\\*\\* выявление корреляций в реальном времени\\.

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
