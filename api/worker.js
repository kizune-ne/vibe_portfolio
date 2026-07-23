const DEFAULT_SYSTEM_PROMPT = `Ты — официальный ИИ-Ассистент & Копилот kizun (Senior Vibe Coder & AI Engineer).

ТВОЯ ГЛАВНАЯ ЦЕЛЬ:
Эффектно, живой и аргументированно демонстрировать потенциал kizun в разработке софта через Вайбкодинг и ИИ-автоматизации. Покажи, что kizun — это высококлассный инженер, который умеет быстро и безопасно внедрять ИИ в реальные продукты, веб-сервисы и ботов.

О КАНДИДАТЕ (KIZUN):
- Специализация: ИИ-Агенты, асинхронные Telegram-парсеры топиков, Docker & CUDA изоляция, Cloudflare Workers, C-прошивки клавиатур (QMK/Vial), кастомные калькуляторы.
- Навык защиты от банов в Telegram: Парсер использует асинхронную ротацию прокси-серверов, обработку FloodWait ошибок с экспоненциальной задержкой (backoff) и роутинг по сессиям.
- Навык дедупликации: Хэширование медиа и текста постов для отсева дубликатов за < 5 миллисекунд.
- Железо и локальный ИИ: Хост с AMD Ryzen 7 9700X, RTX 4070 Ti SUPER (16GB VRAM), 32GB RAM. Разворачивает локальные LLM (Ollama, Qwen 2.5 Coder 14B/31B) в Docker с прямым пробросом CUDA.
- Философия: Вайбкодинг — использование ИИ-ассистентов и агентов для ускорения разработки софта в 10 раз без потери качества архитектуры.

ПРАВИЛА ОБЩЕНИЯ И СТИЛЬ:
1. Отвечай прямо на вопрос пользователя (2-4 предложения). Избегай шаблонных отписок и сухих приветствий.
2. При вопросах о стеке, защите от банов или проектах давай конкретные технические подробности (Telethon, ротация прокси, FloodWait backoff, CUDA 16GB, Uptime 99.9%).
3. Будь дружелюбным, уверенным, профессиональным инженером. Общайся на "ты".
4. Всегда держи контекст предыдущих сообщений собеседника.`;

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
    }

    try {
      const { message, history, model, systemPrompt } = await request.json();
      if (!message && (!history || history.length === 0)) {
        return new Response(JSON.stringify({ error: "Message or history required" }), { status: 400, headers: corsHeaders });
      }

      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured in worker environment" }), { status: 500, headers: corsHeaders });
      }

      // Default to reliable high-speed Gemini 2.0 Flash / 1.5 Flash models
      const selectedModel = model || env.MODEL_NAME || "gemini-2.0-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
      const promptToUse = systemPrompt || env.SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;

      // Construct multi-turn contents list
      let apiContents = [];
      if (Array.isArray(history) && history.length > 0) {
        apiContents = history.map(item => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        }));
      }

      if (message) {
        const lastContent = apiContents[apiContents.length - 1];
        if (!lastContent || lastContent.role !== 'user' || lastContent.parts[0].text !== message) {
          apiContents.push({
            role: 'user',
            parts: [{ text: message }]
          });
        }
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: promptToUse }]
          },
          contents: apiContents,
          generationConfig: {
            maxOutputTokens: 650,
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: "Google AI Studio API error", details: errorText }), { status: 502, headers: corsHeaders });
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];

      // Filter out thinking process parts if any
      const cleanParts = parts.filter(p => !p.thought);
      const replyPart = cleanParts.length > 0 ? cleanParts[cleanParts.length - 1] : parts[parts.length - 1];
      const reply = replyPart?.text;

      if (reply) {
        return new Response(JSON.stringify({ reply, model: selectedModel }), { status: 200, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: "No response text from model" }), { status: 500, headers: corsHeaders });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};
