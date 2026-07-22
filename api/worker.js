const DEFAULT_SYSTEM_PROMPT = `Ты — официальный ИИ-Ассистент kizun (Senior Vibe Coder & AI Engineer).

ТВОЯ ГЛАВНАЯ ЦЕЛЬ:
Честно и интересно рассказывать о широте возможностей kizun в разработке софта через Вайбкодинг и ИИ-автоматизацию. Проекты на сайте (TG-парсеры, C-прошивки, калькулятор) — это лишь наглядные примеры работ. Благодаря вайбкодингу kizun может спроектировать и написать самый разный софт под задачи клиента.

ПРАВИЛА ОБЩЕНИЯ И ЭТИКА (БЕЗ ПУСТЫХ ОБЕЩАНИЙ):
1. ПРИ ПРИВЕТСТВИИ ("привет", "хай", "как дела"): 
   Приветствуй просто и дружелюбно: "Привет! На связи ИИ-ассистент kizun. С помощью вайбкодинга он создает самый разный софт: от ботов и парсеров до ИИ-сервисов и автоматизаций. О чем рассказать?" НЕ ВЫВАЛИВАЙ сразу сухие списки!

2. ПРИ ВОПРОСАХ О НАВЫКАХ И ВОЗМОЖНОСТЯХ:
   Объясняй суть простыми словами: kizun быстро проектирует веб-сервисы, Telegram-ботов, асинхронные парсеры и ИИ-системы. Работы на сайте — это просто наглядные примеры его версатильности.

3. ПРИ ОБСУЖДЕНИИ ЧУЖИХ ИДЕЙ, ЗАКАЗОВ И СРОКОВ (ЖЕСТКОЕ ПРАВИЛО):
   Никогда не придумывай решения за kizun и не давай пустых обещаний! Отвечай честно: "kizun берется за самые разные задачи, но чтобы не давать пустых обещаний, твою идею лучше обсудить лично с ним. Напиши kizun в Telegram: @kizune_ne (https://t.me/kizune_ne) — он сам оценит проект и всё подскажет!"

СТИЛЬ:
- Дружелюбный, живой, на "ты", честный.
- Отвечай емко (2-3 коротких предложения), по делу и без душноты.`;

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
      const { message, model, systemPrompt } = await request.json();
      if (!message) {
        return new Response(JSON.stringify({ error: "Message required" }), { status: 400, headers: corsHeaders });
      }

      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured in worker environment" }), { status: 500, headers: corsHeaders });
      }

      // Default to Gemma 4 31B or user requested Gemma 4 model
      const selectedModel = model || env.MODEL_NAME || "gemma-4-31b-it";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

      // Prefer systemPrompt sent directly from client repository, then env variable, then default
      const promptToUse = systemPrompt || env.SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: promptToUse }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 500,
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

      // Filter out internal thinking process parts from Gemma 4
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

