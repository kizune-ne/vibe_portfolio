/* ==========================================================================
   TELEGRAM AI CONTENT GENERATOR & LIVE POST SIMULATOR
   ========================================================================== */

const POST_DATABASE = {
  it: [
    {
      title: "⚡ Как перенести 100k строк кода в DevContainer и сохранить 100% изоляции",
      badge: "IT & ARCHITECTURE // EXPERT",
      time: "14:32",
      views: "3.8k",
      shares: "184",
      reactions: "🔥 210  ⚡ 94  💻 42",
      er: "9.2%",
      content: `Разбор кейса построения локальной Dev-среды под Docker Compose. 

<b>Ключевые инженерные решения:</b>
• <code>CUDA Passthrough</code> — проброс RTX 4070 Ti SUPER (16GB VRAM) прямиком в контейнер Ollama.
• <code>Bind Mounts</code> — монтирование только папки <code>_keys/</code> с абсолютным изолированием секретов от репозитория.
• <code>Entrypoint Patcher</code> — автоматическое удаление дубликатов встроенного ИИ при старте контейнера.

<i>Результат: поднятие чистой рабочей среды с нуля ровно за 1 команду.</i>

#docker #devops #python #architecture`,
      inlineButtons: [
        { icon: "file-code-2", label: "Читать архитектурный разбор", url: "https://t.me/kizune_ne" },
        { icon: "git-branch", label: "Docker Compose Config", url: "https://t.me/kizune_ne" }
      ]
    },
    {
      title: "🤖 Вайбкодинг 2026: От монолитных скриптов к мульти-агентным сетям",
      badge: "AI ENGINEERING // TRENDS",
      time: "17:05",
      views: "4.2k",
      shares: "240",
      reactions: "🚀 312  💡 128  🤖 88",
      er: "11.4%",
      content: `Почему классический одиночный промптинг больше не работает для крупных продуктов.

<b>Архитектура 3-уровневого агента:</b>
1. <b>Architect (Antigravity):</b> Анализ требований, создание ТЗ и <code>implementation_plan.md</code>.
2. <b>Coder Subagent:</b> Написание изолированного кода без замусоривания главного контекста.
3. <b>Reviewer & Critic:</b> Автоматический прогон тестов, проверка на костыли и дедупликацию.

#ai_agents #llm #vibe_coding #system_design`,
      inlineButtons: [
        { icon: "bot", label: "Запросить аудит ИИ-архитектуры", url: "https://t.me/kizune_ne" }
      ]
    }
  ],
  crypto: [
    {
      title: "💎 Web3 Analysis: Скрытая активность валидаторов и разбор нод",
      badge: "WEB3 & CRYPTO // INSIGHTS",
      time: "11:15",
      views: "5.1k",
      shares: "310",
      reactions: "⚡ 430  💎 210  📈 95",
      er: "12.8%",
      content: `Экспресс-выжимка ончейн-метрик за прошедшие 24 часа.

<b>Главное из аналитического отчета:</b>
• Чистый приток ликвидности в L2-протоколы составил <b>+$140M</b>.
• Запущена новая волна тестнетов с валидацией транзакций через ZK-Rollups.
• Скрипт авто-мониторинга зафиксировал снижение комиссий на <b>34%</b>.

<i>Подробный график и сигналы роутинга добавлены в закрытую базу знаний.</i>

#crypto #web3 #onchain #analytics`,
      inlineButtons: [
        { icon: "trending-up", label: "Смотреть On-Chain График", url: "https://t.me/kizune_ne" },
        { icon: "shield-alert", label: "Аналитика Нод & Тестнетов", url: "https://t.me/kizune_ne" }
      ]
    }
  ],
  igaming: [
    {
      title: "🎲 iGaming Traffic 2026: Сквозная аналитика и AI-оптимизация воронок",
      badge: "IGAMING // AFFILIATE",
      time: "15:45",
      views: "2.9k",
      shares: "145",
      reactions: "🎯 180  💰 92  🔥 77",
      er: "8.7%",
      content: `Как выстроить конверсионный контент-пайплайн для арбитражных каналов.

<b>Ключевые связки и метрики:</b>
• <code>AI-Generative Hooks</code> — цепляющие вступления повышают Retention 1-го экрана на <b>+42%</b>.
• <code>Dynamic CTA Buttons</code> — кастомные инлайн-кнопки под каждого провайдера трафика.
• <code>A/B Testing Tone-of-Voice</code> — сравнение дерзкого и экспертного стилей подач.

#igaming #affiliate #traffic #funnels`,
      inlineButtons: [
        { icon: "target", label: "Разбор конверсионной воронки", url: "https://t.me/kizune_ne" }
      ]
    }
  ],
  fintech: [
    {
      title: "📈 FinTech Macro: Автоматизированный анализ отчетов и рисков",
      badge: "FINTECH // TRADING",
      time: "09:30",
      views: "3.4k",
      shares: "190",
      reactions: "📊 215  ⚡ 110  🎯 65",
      er: "9.9%",
      content: `Ежедневный макроэкономический дайджест, сформированный AI-пайплайном.

<b>Финансовые метрики рынка:</b>
• <b>Индекс волатильности:</b> Снижение на 4.2% на фоне стабилизации процентных ставок.
• <b>Автоматический парсинг:</b> Извлечение данных из 50+ финансовых отчетов за 90 секунд.
• <b>Управление рисками:</b> Выявление корреляций между секторами в реальном времени.

#fintech #trading #macroeconomics #ai_parsing`,
      inlineButtons: [
        { icon: "bar-chart-3", label: "Скачать макро-дайджест", url: "https://t.me/kizune_ne" }
      ]
    }
  ]
};

let currentNiche = 'it';
let currentIndex = 0;

export function initTgContentSimulator() {
  const container = document.getElementById('cardTgContent');
  if (!container) return;

  const tabs = container.querySelectorAll('.tov-tab');
  const btnGenerate = container.querySelector('#btnTgGenerateNext');
  
  // Tab Switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const niche = tab.getAttribute('data-niche');
      if (!niche || niche === currentNiche) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      currentNiche = niche;
      currentIndex = 0;
      renderPost(true);
    });
  });

  // Generate Next Button
  if (btnGenerate) {
    btnGenerate.addEventListener('click', () => {
      const posts = POST_DATABASE[currentNiche] || [];
      if (posts.length <= 1) {
        // Trigger visual regenerate animation
        renderPost(true);
        return;
      }
      currentIndex = (currentIndex + 1) % posts.length;
      renderPost(true);
    });
  }

  // Initial Render
  renderPost(false);
}

function renderPost(animate = true) {
  const postCard = document.getElementById('tgSimPostCard');
  if (!postCard) return;

  const posts = POST_DATABASE[currentNiche] || POST_DATABASE.it;
  const post = posts[currentIndex % posts.length];

  if (animate) {
    postCard.classList.add('is-generating');
  }

  setTimeout(() => {
    // Update Badge & Header
    const badgeEl = postCard.querySelector('.tg-post-badge');
    const timeEl = postCard.querySelector('.tg-post-time');
    const contentEl = postCard.querySelector('.tg-post-body');
    const buttonsContainer = postCard.querySelector('.tg-post-inline-buttons');
    const viewsEl = document.getElementById('tgStatViews');
    const reactionsEl = document.getElementById('tgStatReactions');
    const erEl = document.getElementById('tgStatEr');

    if (badgeEl) badgeEl.textContent = post.badge;
    if (timeEl) timeEl.textContent = post.time;
    if (contentEl) contentEl.innerHTML = post.content;
    if (viewsEl) viewsEl.textContent = post.views;
    if (reactionsEl) reactionsEl.textContent = post.reactions;
    if (erEl) erEl.textContent = post.er;

    // Render Inline Buttons
    if (buttonsContainer) {
      buttonsContainer.innerHTML = post.inlineButtons.map(btn => `
        <a href="${btn.url}" target="_blank" class="tg-inline-btn">
          <i data-lucide="${btn.icon}"></i>
          <span>${btn.label}</span>
        </a>
      `).join('');
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    if (animate) {
      postCard.classList.remove('is-generating');
    }
  }, animate ? 250 : 0);
}
