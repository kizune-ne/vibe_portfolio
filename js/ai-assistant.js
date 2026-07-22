/* JS Module: Narrow-Context AI Assistant (100% Secret-Free Client Logic) */
export const SYSTEM_PROMPT = `Ты — легкий ИИ-демо-ассистент kizun (работающий на модели Gemma 4).

ТВОЯ РОЛЬ:
Ты — легкий демонстрационный бот, встроенный в сайт для показа возможностей интеграции ИИ в веб-интерфейсы. Ты не несешь в себе специализированной сложной аналитики, а просто вежливо и легко общаешься с посетителями о портфолио и направлениях работы kizun.

ПРАВИЛА ОБЩЕНИЯ И ЭТИКА (БЕЗ ПУСТЫХ ОБЕЩАНИЙ):
1. ПРИ ПРИВЕТСТВИИ ("привет", "хай", "как дела"): 
   Приветствуй просто: "Привет! Я легкий демо-бот kizun для показа интеграции ИИ. Помогу сориентироваться по работам и идеям kizun. О чем рассказать?"

2. ПРИ ВОПРОСАХ О НАВЫКАХ И ВОЗМОЖНОСТЯХ:
   Объясняй доступно: kizun с помощью вайбкодинга проектирует веб-сервисы, Telegram-ботов, парсеры и ИИ-автоматизации. Работы на сайте — это просто наглядные демо-примеры его возможностей.

3. ПРИ ОБСУЖДЕНИИ КАСТОМНЫХ ИДЕЙ ИЛИ ЗАКАЗОВ (ЖЕСТКОЕ ПРАВИЛО):
   Никогда не придумывай решения за kizun и не давай пустых обещаний! Отвечай честно: "Я просто легкий демо-бот. Твою идею лучше обсудить напрямую с kizun в Telegram: @kizune_ne (https://t.me/kizune_ne) — он сам оценит проект и всё подскажет!"

СТИЛЬ:
- Дружелюбный, живой, на "ты", честный.
- Отвечай емко (2-3 коротких предложения), по делу и без душноты.`;

export function initAiAssistant() {
  const chatContainer = document.getElementById('chatContainer');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const promptChips = document.querySelectorAll('.prompt-chip');

  const ALEXEY_KNOWLEDGE = [
    {
      keywords: ['kizun', 'ник', 'кто', 'автор', 'вайбкодер', 'резюме', 'сайт', 'о себе', 'кто ты', 'вайбкодинг'],
      answer: 'kizun — Senior Vibe Coder & AI Engineer. С помощью вайбкодинга он быстро проектирует и разрабатывает веб-сервисы, Telegram-ботов, парсеры и ИИ-автоматизации. Проекты на сайте — это лишь малая часть примеров его возможностей!'
    },
    {
      keywords: ['связь', 'контакт', 'телеграм', 'telegram', 'kizune_ne', 'написать', 'цена', 'заказ', 'работа', 'обсудить'],
      answer: 'kizun берется за самые разные задачи! Чтобы не давать пустых обещаний, твою идею лучше обсудить лично с ним в Telegram: @kizune_ne (https://t.me/kizune_ne) — он сам оценит проект и всё подскажет.'
    },
    {
      keywords: ['бот', 'парсер', 'топик', 'канал', 'приватн', 'telegram-боты'],
      answer: 'kizun отлично разбирается в Telegram-автоматизациях: приватные боты, асинхронные парсеры каналов, фильтрация постов и пересылка по топикам.'
    },
    {
      keywords: ['пример', 'проект', 'работы', 'покажи'],
      answer: 'На сайте представлены примеры работ: от TG-парсеров и C-прошивок до калькулятора печати. Но с помощью вайбкодинга kizun может создать почти любой софт под твои задачи!'
    }
  ];

  function appendChatMessage(sender, htmlContent) {
    if (!chatContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message msg-${sender}`;

    const iconTag = sender === 'agent'
      ? `<i data-lucide="bot"></i>`
      : `<i data-lucide="user"></i>`;

    msgDiv.innerHTML = `
      <div class="avatar">${iconTag}</div>
      <div class="bubble">${htmlContent}</div>
    `;

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function getLocalFallbackAnswer(questionText) {
    const lower = questionText.toLowerCase();
    for (const item of ALEXEY_KNOWLEDGE) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        return item.answer;
      }
    }
    return 'Я узконаправленный ИИ-ассистент kizun. Я знаю про его навыки (TG-парсеры, Docker & CUDA, C-прошивки клавиатур, калькулятор типографии, LoRA, TikTok и полиграфия). Вы можете задать вопрос или написать kizun напрямую в Telegram: @kizune_ne!';
  }

  async function handleUserQuestion(questionText) {
    if (!questionText || !questionText.trim()) return;
    appendChatMessage('user', questionText);

    // Typing indicator
    const typingId = 'typingIndicator_' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message msg-agent';
    typingDiv.id = typingId;
    typingDiv.innerHTML = `
      <div class="avatar"><i data-lucide="bot"></i></div>
      <div class="bubble" style="font-style: italic; color: var(--color-stone);">Думает (Gemma 4)...</div>
    `;
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (window.lucide) lucide.createIcons();

    let answer = null;
    const workerUrl = window.AI_WORKER_URL || 'https://vibe-ai-proxy.androidvgb.workers.dev/';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: questionText, systemPrompt: SYSTEM_PROMPT }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          answer = data.reply;
        }
      }
    } catch (e) {
      console.warn('AI Worker error or timeout, fallback to local knowledge:', e);
    }

    if (!answer) {
      answer = getLocalFallbackAnswer(questionText);
    }

    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    appendChatMessage('agent', answer);
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
