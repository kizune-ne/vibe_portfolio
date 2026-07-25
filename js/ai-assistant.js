/* ==========================================================================
   VIBECODER & AI ENGINEER PORTFOLIO - AI ASSISTANT MODULE (MULTI-TURN & METRICS)
   ========================================================================== */

export const SYSTEM_PROMPT = `Ты — официальный ИИ-Ассистент & Копилот kizun (Senior Vibe Coder & AI Engineer).

ТВОЯ ГЛАВНАЯ ЦЕЛЬ:
Эффектно, живой и аргументированно демонстрировать потенциал kizun в разработке софта через Вайбкодинг и ИИ-автоматизации. Покажи, что kizun — это высококлассный инженер, который умеет быстро и безопасно внедрять ИИ в реальные продукты, веб-сервисы и ботов.

О КАНДИДАТЕ (KIZUN):
- Специализация: ИИ-Агенты, асинхронные Telegram-парсеры топиков, Docker & CUDA изоляция, Cloudflare Workers, C-прошивки клавиатур (QMK/Vial), кастомные калькуляторы.
- Защита от банов в Telegram: Асинхронная ротация пула прокси-серверов, отлов FloodWait ошибок с экспоненциальной задержкой (backoff) и роутинг по сессиям.
- Навык дедупликации: Хэширование медиа и текста постов для отсева дубликатов за < 5 миллисекунд.
- Железо и локальный ИИ: Хост с AMD Ryzen 7 9700X, RTX 4070 Ti SUPER (16GB VRAM), 32GB RAM. Разворачивает локальные LLM (Ollama, Qwen 2.5 Coder 14B/31B) в Docker с прямым пробросом CUDA.
- Философия: Вайбкодинг — использование ИИ-ассистентов и агентов для ускорения разработки софта в 10 раз без потери качества архитектуры.

ПРАВИЛА ОБЩЕНИЯ И СТИЛЬ:
1. Отвечай кратко, емко и по делу (2-4 предложения). Избегай шаблонных отписок и сухих приветствий.
2. При вопросах о стеке, защите от банов или проектах давай конкретные технические подробности (Telethon, ротация прокси, FloodWait backoff, CUDA 16GB, Uptime 99.9%).
3. Будь дружелюбным, уверенным, профессиональным инженером. Общайся на "ты".
4. Всегда держи контекст предыдущих сообщений собеседника.`;

export function initAiAssistant() {
  const chatContainer = document.getElementById('chatContainer');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const promptChips = document.querySelectorAll('.prompt-chip');

  // Multi-turn Conversation Memory History (Last 8 messages)
  const chatHistory = [];

  const LOCAL_KNOWLEDGE = [
    {
      keywords: ['бан', 'сесси', 'бан сессий', 'floodwait', 'забанят', 'блокировк', 'защита от бана'],
      answer: 'Для защиты от банов Telegram в парсере применяется асинхронный ротационный пул прокси-серверов, авто-отлов ошибок FloodWait с экспоненциальной задержкой (backoff) и разделение запросов по уникальным Telethon/Pyrogram сессиям.'
    },
    {
      keywords: ['дедупликация', 'пост', 'дубликат', 'повтор'],
      answer: 'Алгоритм дедупликации рассчитывает уникальный хэш текстовых блоков и медиафайлов входящего поста. Повторяющиеся публикации автоматически отсекаются менее чем за 5 миллисекунд.'
    },
    {
      keywords: ['docker', 'cuda', 'ollama', 'контейнер', 'gpu', 'инфраструктура'],
      answer: 'Инфраструктура на базе Docker Compose пробрасывает 16GB VRAM RTX 4070 Ti SUPER прямо в контейнер Ollama, поддерживая задержку инференса локальной нейросети Qwen < 500мс при полной изоляции секретов _keys/.'
    },
    {
      keywords: ['qmk', 'прошивк', 'vial', 'клавиатур'],
      answer: 'Прошивка клавиатуры MonsGeek M1 V5 собрана на C в QMK с портированием протокола Vial GUI для нативной перенастройки кеймапов на лету без пересборки микрокода.'
    },
    {
      keywords: ['kizun', 'ник', 'кто', 'автор', 'вайбкодер', 'резюме', 'сайт', 'о себе', 'кто ты', 'вайбкодинг'],
      answer: 'kizun — Senior Vibe Coder & AI Engineer. С помощью вайбкодинга он создает веб-сервисы, Telegram-ботов, парсеры и ИИ-автоматизации в 10 раз быстрее обычного. На сайте представлены наглядные примеры его работ!'
    },
    {
      keywords: ['связь', 'контакт', 'написать', 'написать kizun', 'как связаться', 'цена', 'заказ'],
      answer: 'Связаться с kizun напрямую для обсуждения проекта можно в Telegram: @kizune_ne (https://t.me/kizune_ne).'
    }
  ];

  // Simple Markdown formatting helper
  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  // Generate dynamic follow-up chips based on text topic
  function getSuggestedChips(text) {
    const lower = text.toLowerCase();
    if (lower.includes('docker') || lower.includes('cuda') || lower.includes('gpu')) {
      return [
        { label: 'Как устроен проброс CUDA?', prompt: 'Расскажи подробнее про настройку NVIDIA CUDA в Docker' },
        { label: 'Хранение секретов _keys/', prompt: 'Как устроена защита секретов в Bind Mounts?' }
      ];
    }
    if (lower.includes('telegram') || lower.includes('парсер') || lower.includes('бот') || lower.includes('бан')) {
      return [
        { label: 'Как обходить баны в Telethon?', prompt: 'Как устроена защита от бана сессий Telegram в парсере?' },
        { label: 'Дедупликация постов', prompt: 'Как работает алгоритм дедупликации сообщений за 2 секунды?' }
      ];
    }
    if (lower.includes('гемма') || lower.includes('gemma') || lower.includes('модель') || lower.includes('ии')) {
      return [
        { label: 'Какое железо используется?', prompt: 'На каком железе развернуты локальные нейросети?' },
        { label: 'Написать @kizune_ne', prompt: 'Как связаться с kizun в Telegram?' }
      ];
    }
    return [
      { label: 'В чем суть Вайбкодинга?', prompt: 'Расскажи про философию Вайбкодинга kizun' },
      { label: 'Написать @kizune_ne', prompt: 'Как написать kizun в Telegram?' }
    ];
  }

  function appendChatMessage(sender, htmlContent, metrics = null, suggestedChips = null) {
    if (!chatContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message msg-${sender}`;

    const iconTag = sender === 'agent'
      ? `<i data-lucide="bot"></i>`
      : `<i data-lucide="user"></i>`;

    let metricsHtml = '';
    if (sender === 'agent' && metrics) {
      metricsHtml = `
        <div class="msg-tech-footer">
          <span class="tech-footer-chip">
            <i data-lucide="zap"></i> ${metrics.model} • Latency: ${metrics.latency}ms • Worker Proxy
          </span>
        </div>
      `;
    }

    let chipsHtml = '';
    if (sender === 'agent' && suggestedChips && suggestedChips.length > 0) {
      chipsHtml = `
        <div class="msg-suggested-chips">
          ${suggestedChips.map(c => `
            <button class="chip-suggested-item" data-prompt="${c.prompt}">
              <i data-lucide="sparkles"></i> ${c.label}
            </button>
          `).join('')}
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="avatar">${iconTag}</div>
      <div class="bubble-wrap">
        <div class="bubble">${htmlContent}</div>
        ${metricsHtml}
        ${chipsHtml}
      </div>
    `;

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Bind click events to dynamic suggested chips
    if (suggestedChips) {
      msgDiv.querySelectorAll('.chip-suggested-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const prompt = btn.getAttribute('data-prompt');
          handleUserQuestion(prompt);
        });
      });
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function getLocalFallbackAnswer(questionText) {
    const lower = questionText.toLowerCase();
    for (const item of LOCAL_KNOWLEDGE) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        return item.answer;
      }
    }
    return 'kizun проектирует высококлассные Telegram-автоматизации (Telethon, ротация прокси, защита от банов), Docker CUDA инфраструктуру и ИИ-сервисы. Вы можете написать ему в Telegram: @kizune_ne!';
  }

  async function handleUserQuestion(questionText) {
    if (!questionText || !questionText.trim()) return;

    appendChatMessage('user', formatMarkdown(questionText));

    // Save to multi-turn conversation history
    chatHistory.push({ role: 'user', text: questionText });
    if (chatHistory.length > 8) {
      chatHistory.shift();
    }

    // Typing indicator
    const typingId = 'typingIndicator_' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message msg-agent';
    typingDiv.id = typingId;
    typingDiv.innerHTML = `
      <div class="avatar"><i data-lucide="bot"></i></div>
      <div class="bubble-wrap">
        <div class="bubble" style="font-style: italic; color: var(--color-stone);">Инференс ИИ-ассистента...</div>
      </div>
    `;
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (window.lucide) lucide.createIcons();

    const startTime = performance.now();
    let answer = null;
    let usedModel = 'Gemma 4 31B';
    const workerUrl = window.AI_WORKER_URL || 'https://vibe-ai-proxy.androidvgb.workers.dev/';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: questionText,
          history: chatHistory,
          systemPrompt: SYSTEM_PROMPT
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          answer = data.reply;
          if (data.model) {
            usedModel = data.model.replace('-it', '').toUpperCase();
          }
        }
      }
    } catch (e) {
      console.warn('AI Worker timeout or network issue, using fallback:', e);
    }

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    if (!answer) {
      answer = getLocalFallbackAnswer(questionText);
    }

    // Save model reply to conversation history
    chatHistory.push({ role: 'model', text: answer });
    if (chatHistory.length > 8) {
      chatHistory.shift();
    }

    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    const formattedAnswer = formatMarkdown(answer);
    const suggestedChips = getSuggestedChips(questionText + ' ' + answer);

    appendChatMessage('agent', formattedAnswer, { model: usedModel, latency }, suggestedChips);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value;
      chatInput.value = '';
      handleUserQuestion(text);
    });
  }

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      handleUserQuestion(prompt);
    });
  });
}
