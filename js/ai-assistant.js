const SYSTEM_PROMPT = `Ты — живой умный ИИ-Ассистент интерактивного портфолио kizun (Senior Vibe Coder & AI Engineer).

ТВОЯ РОЛЬ И ЗАДАЧИ:
1. Отвечать на любые вопросы пользователя по ИИ-технологиям, веб-разработке, кодингу, автоматизациям и инфраструктуре.
2. Быть естественным, умным и грамотным собеседником. Отвечать дружелюбно, профессионально и по делу (2-4 предложения).
3. Общаться на "ты", избегать сухой канцелярии и навязчивой саморекламы. Если спрашивают про kizun — давай лаконичную справку по стеку (Telegram-боты, Docker CUDA, Cloudflare Workers, Вайбкодинг).

ПРАВИЛА ОТВЕТА:
- На приветствия ("привет", "хай") отвечай тепло и открыто.
- На вопросы по коду или технологиям давай четкий технический ответ.
- Если вопрос общий — поддерживай диалог естественно.`;

export function initAiAssistant() {
  const chatContainer = document.getElementById('chatContainer');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const promptChips = document.querySelectorAll('.prompt-chip');

  // Multi-turn Conversation Memory History (Last 8 messages)
  const chatHistory = [];

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
        { label: 'Проброс CUDA в Docker', prompt: 'Расскажи подробнее про настройку NVIDIA CUDA в Docker' },
        { label: 'Защита секретов _keys/', prompt: 'Как устроена защита секретов в Bind Mounts?' }
      ];
    }
    if (lower.includes('telegram') || lower.includes('парсер') || lower.includes('бот') || lower.includes('telethon')) {
      return [
        { label: 'Обход банов Telethon', prompt: 'Как устроена защита от бана сессий Telegram в парсере?' },
        { label: 'Скорость парсинга постов', prompt: 'Как работает алгоритм дедупликации сообщений за 2 секунды?' }
      ];
    }
    if (lower.includes('гемма') || lower.includes('gemma') || lower.includes('модель') || lower.includes('llm') || lower.includes('нейросет')) {
      return [
        { label: 'Железо для Ollama', prompt: 'На каком железе развернуты локальные нейросети?' },
        { label: 'Связь с разработчиком', prompt: 'Как связаться с kizun в Telegram?' }
      ];
    }
    if (lower.includes('клавиатур') || lower.includes('прошивк') || lower.includes('qmk') || lower.includes('vial')) {
      return [
        { label: 'QMK & Vial прошивки', prompt: 'Расскажи про C-прошивки для кастомных клавиатур' },
        { label: 'MonsGeek M1 V5', prompt: 'Какие особенности у клавиатуры MonsGeek M1 V5?' }
      ];
    }
    if (lower.includes('стек') || lower.includes('верстк') || lower.includes('портфолио') || lower.includes('дизайн')) {
      return [
        { label: 'Стек этого портфолио', prompt: 'Расскажи про стек и архитектуру этого портфолио' },
        { label: 'Bento Grid адаптив', prompt: 'Как устроена верстка Bento Grid на чистом CSS?' }
      ];
    }
    return [
      { label: 'Философия Vibe Coding', prompt: 'Расскажи про философию Вайбкодинга kizun' },
      { label: 'Написать @kizune_ne', prompt: 'Как написать kizun в Telegram?' }
    ];
  }

  function appendChatMessage(sender, htmlContent, metrics = null, suggestedChips = null) {
    if (!chatContainer) return;

    // Clean up any previously displayed prompt chips so ONLY the latest message has chips
    chatContainer.querySelectorAll('.msg-suggested-chips').forEach(chipsEl => chipsEl.remove());

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
      const timeoutId = setTimeout(() => controller.abort(), 25000);

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
      console.warn('AI Worker timeout or network issue:', e);
    }

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    if (!answer) {
      answer = 'Серверная модель временно недоступна или превышен лимит API-запросов. Пожалуйста, повторите попытку через пару секунд!';
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
