const DEFAULT_SYSTEM_PROMPT = `Ты — демо-ИИ-ассистент, встроенный в веб-портфолио разработчика kizun.

ПРАВИЛА:
1. КТО ТЫ: Ты — интерактивный демо-бот для показа работы ИИ в интерфейсах. Не называй себя kizun (kizun — это автор портфолио).
2. СТИЛЬ И ЯЗЫК: Отвечай СТРОГО на русском языке. Ответы должны быть короткими, четкими и по существу (1-3 предложения). Без "воды" и без размышлений на английском.
3. ОБЩЕНИЕ: Общайся естественно и дружелюбно на "ты". Отвечай на любые вопросы пользователя по ИИ, коду, разработке или общим темам.`;

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
      const urlObj = new URL(request.url);

      // Handle Analytics & Visitor Tracking
      if (urlObj.pathname.endsWith('/analytics')) {
        const payload = await request.json();
        const botToken = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
          // Cloudflare Geolocation Headers
          const country = request.cf?.country || 'RU';
          const city = request.cf?.city || 'Москва';
          const geoStr = city ? `${country}, ${city}` : country;

          // User Agent device info
          const ua = request.headers.get('user-agent') || '';
          let deviceType = 'Desktop 💻';
          if (/mobile/i.test(ua)) deviceType = 'Mobile 📱';
          if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet 📱';

          const dateObj = payload.timestamp ? new Date(payload.timestamp) : new Date();
          const timeMsk = dateObj.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          let msgText = '';

          if (payload.type === 'visit') {
            const isReturning = payload.isReturning;
            const headerIcon = isReturning ? '🔄' : '👀';
            const headerTitle = isReturning ? '*ПОСЕТИТЕЛЬ СНОВА ВЕРНУЛСЯ!*' : '*Новый визит на портфолио!*';

            msgText = 
              `${headerIcon} ${headerTitle}\n\n` +
              `👤 *ID:* \`${payload.visitorId || 'аноним'}\`\n` +
              `🌐 *Гео:* \`${geoStr}\`\n` +
              `💻 *Устройство:* \`${deviceType}\` (${payload.screen || 'N/A'})\n` +
              `🔗 *Источник:* \`${payload.referrer || 'Прямой заход'}\`\n` +
              `🕒 *Время:* \`${timeMsk} МСК\``;
          } else if (payload.type === 'event') {
            let eventIcon = '⚡';
            let eventTitle = payload.eventName || 'Действие';

            if (payload.eventName?.includes('открыл Резюме')) {
              eventIcon = '📄';
              eventTitle = '*РЕКРУТЕР ОТКРЫЛ РЕЗЮМЕ (PDF)*';
            } else if (payload.eventName?.includes('скачал Резюме')) {
              eventIcon = '📥';
              eventTitle = '*РЕКРУТЕР СКАЧАЛ РЕЗЮМЕ (CV)*';
            } else if (payload.eventName?.includes('Email')) {
              eventIcon = '✉️';
              eventTitle = '*Скопирован Email адрес*';
            } else if (payload.eventName?.includes('Telegram')) {
              eventIcon = '💬';
              eventTitle = '*Переход в Telegram личку*';
            }

            msgText = 
              `${eventIcon} ${eventTitle}\n\n` +
              `👤 *ID:* \`${payload.visitorId || 'аноним'}\`\n` +
              `🌐 *Гео:* \`${geoStr}\`\n` +
              `💻 *Устройство:* \`${deviceType}\`\n` +
              `🕒 *Время:* \`${timeMsk} МСК\``;
          }

          if (msgText) {
            const tgBody = {
              chat_id: chatId,
              text: msgText,
              parse_mode: 'Markdown'
            };

            const threadId = env.TELEGRAM_THREAD_ID || env.TELEGRAM_TOPIC_ID;
            if (threadId) {
              tgBody.message_thread_id = parseInt(threadId, 10);
            }

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(tgBody)
            }).catch(() => {});
          }
        }

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
      }
      
      // Handle Feedback submission
      if (urlObj.pathname.endsWith('/api/feedback') || urlObj.pathname.endsWith('/feedback')) {
        const payload = await request.json();
        const botToken = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;
        
        if (botToken && chatId) {
          const ratingVal = parseInt(payload.rating || 5, 10);
          const starsStr = '⭐'.repeat(Math.max(1, Math.min(5, ratingVal)));
          const ratingLabel = payload.ratingText || `${ratingVal} из 5`;
          
          const commentStr = payload.comment ? `«${payload.comment}»` : '_Без комментария_';
          const contactStr = payload.contact ? `\`${payload.contact}\`` : '_Не указан_';

          // Accurate Moscow Time (Europe/Moscow)
          const dateObj = payload.timestamp ? new Date(payload.timestamp) : new Date();
          const timeMsk = dateObj.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          const msgText = 
            `✨ *Новый отзыв о портфолио!*\n` +
            `${starsStr} *${ratingLabel}*\n\n` +
            `💬 *Сообщение:* ${commentStr}\n` +
            `👤 *Контакт:* ${contactStr}\n` +
            `🕒 *Время:* \`${timeMsk} МСК\``;

          const tgBody = {
            chat_id: chatId,
            text: msgText,
            parse_mode: 'Markdown'
          };

          // Support for Telegram Forum Topics / Threads
          const threadId = env.TELEGRAM_THREAD_ID || env.TELEGRAM_TOPIC_ID;
          if (threadId) {
            tgBody.message_thread_id = parseInt(threadId, 10);
          }

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tgBody)
          }).catch(() => {});
        }

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
      }

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
      let reply = replyPart?.text || '';

      // Clean out any inline <think> tags or reasoning prefixes
      if (reply) {
        reply = reply
          .replace(/<think>[\s\S]*?<\/think>/gi, '')
          .replace(/^(Thought|Thinking)\s*(Process)?:[\s\S]*?\n\n/gi, '')
          .replace(/^Thought:\s*/gi, '')
          .trim();
      }

      if (reply) {
        return new Response(JSON.stringify({ reply, model: selectedModel }), { status: 200, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: "No response text from model" }), { status: 500, headers: corsHeaders });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};
