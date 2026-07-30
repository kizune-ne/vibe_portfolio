const SYSTEM_PROMPT = `Ты — демо-ИИ-ассистент, встроенный в веб-портфолио разработчика kizun.

ПРАВИЛА:
1. КТО ТЫ: Ты — интерактивный демо-бот для показа работы ИИ в интерфейсах. Не называй себя kizun (kizun — это автор портфолио).
2. СТИЛЬ И ЯЗЫК: Отвечай СТРОГО на русском языке. Ответы должны быть короткими, четкими и по существу (1-3 предложения). Без "воды" и без размышлений на английском.
3. ОБЩЕНИЕ: Общайся естественно и дружелюбно на "ты". Отвечай на любые вопросы пользователя по ИИ, коду, разработке или общим темам.`;

export function initAiAssistant() {
  const chatContainer = document.getElementById('chatContainer');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const promptChips = document.querySelectorAll('.prompt-chip');

  // Multi-turn Conversation Memory History (Last 8 messages)
  const chatHistory = [];

  // Helper to clean out reasoning/thinking blocks from LLM output
  function cleanAiResponse(text) {
    if (!text) return '';
    return text
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/^(Thought|Thinking)\s*(Process)?:[\s\S]*?\n\n/gi, '')
      .replace(/^Thought:\s*/gi, '')
      .trim();
  }

  // Simple Markdown formatting helper
  function formatMarkdown(rawText) {
    if (!rawText) return '';
    const text = cleanAiResponse(rawText);
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function appendChatMessage(sender, htmlContent, metrics = null) {
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

    msgDiv.innerHTML = `
      <div class="avatar">${iconTag}</div>
      <div class="bubble-wrap">
        <div class="bubble">${htmlContent}</div>
        ${metricsHtml}
      </div>
    `;

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

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

    appendChatMessage('agent', formattedAnswer, { model: usedModel, latency });
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
