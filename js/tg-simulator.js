/* JS Module: Telegram Stream Simulator */
export function initTgSimulator() {
  const tgMessagesStream = document.getElementById('tgMessagesStream');
  const btnToggleTgSim = document.getElementById('btnToggleTgSim');
  const textTgSimState = document.getElementById('textTgSimState');
  const tgChatItems = document.querySelectorAll('.tg-chat-item');
  const tgActiveBotTitle = document.getElementById('tgActiveBotTitle');

  const BOT_FEEDS = {
    'topic-parser': [
      { title: "📥 [Topic Parser] Новый пост из Telegram-источника #1", desc: "Маршрутизация в топик #Программирование | Статус: Доставлено (0.12s)" },
      { title: "🔍 [Topic Parser] Срабатывание ключевого слова 'Docker'", desc: "Пересылка в топик #DevOps | Убраны дубликаты и реклама." },
      { title: "⚡ [Topic Parser] Обработано 15 каналов без бана API", desc: "Сессия Telethon активна. Задержка между запросами 1.2s." },
      { title: "⚙️ [Topic Parser] Успешная сортровка 48 сообщений", desc: "Все сообщения доставлены в соответствующую тему супергруппы." }
    ],
    'ai-assistant': [
      { title: "⚡ [AI Companion] Обработан запрос от пользователя", desc: "Контекст сохранен. Ответ сформирован за 0.45s через локальную Ollama (Qwen)." },
      { title: "🧠 [AI Companion] Суммаризация длинного поста", desc: "Сжатие 1200 слов в 3 ключевых тезиса. Время генерации: 0.8s." },
      { title: "🔒 [AI Companion] Фильтрация чувствительных данных", desc: "Токены и API-ключи автоматически вырезаны из системного вывода." },
      { title: "💬 [AI Companion] Ответ отправлен в диалог TG", desc: "Использовано 180 токенов. Контекстное окно 8k опрос успешно завершен." }
    ],
    'auto-scraper': [
      { title: "📊 [Auto-Scraper] Парсинг 5 внешних источников завершен", desc: "Найдено 12 новых релевантных публикаций. Выгрузка в БД." },
      { title: "🌐 [Auto-Scraper] Ротация прокси-серверов прошла успешно", desc: "Новый IP: 185.220.xx.xx. Статус ответа 200 OK." },
      { title: "⏱️ [Auto-Scraper] Следующий запуск по расписанию через 5 минут", desc: "Планировщик APScheduler функционирует штатно." },
      { title: "💾 [Auto-Scraper] Экспорт данных в JSON / PostgreSQL", desc: "Записано 45 записей за последние 24 часа. Ошибок 0." }
    ]
  };

  let currentBotKey = 'topic-parser';
  let tgStreamTimer = null;
  let isTgSimRunning = true;
  let simFeedIdx = 0;

  function pushSimulatedMessage() {
    if (!tgMessagesStream) return;
    const feed = BOT_FEEDS[currentBotKey] || BOT_FEEDS['topic-parser'];
    const item = feed[simFeedIdx % feed.length];
    simFeedIdx++;

    const card = document.createElement('div');
    card.className = 'stream-card';
    card.innerHTML = `
      <div style="font-weight: 600; color: #fff;">${item.title}</div>
      <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 4px;">${item.desc}</div>
    `;

    tgMessagesStream.appendChild(card);
    if (tgMessagesStream.children.length > 5) {
      tgMessagesStream.removeChild(tgMessagesStream.children[0]);
    }
    tgMessagesStream.scrollTop = tgMessagesStream.scrollHeight;
  }

  function startTgStream() {
    if (tgStreamTimer) clearInterval(tgStreamTimer);
    tgStreamTimer = setInterval(pushSimulatedMessage, 2400);
  }

  if (btnToggleTgSim) {
    btnToggleTgSim.addEventListener('click', () => {
      isTgSimRunning = !isTgSimRunning;
      if (isTgSimRunning) {
        startTgStream();
        if (textTgSimState) textTgSimState.textContent = 'Пауза';
      } else {
        clearInterval(tgStreamTimer);
        if (textTgSimState) textTgSimState.textContent = 'Запустить';
      }
    });
  }

  tgChatItems.forEach(item => {
    item.addEventListener('click', () => {
      tgChatItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentBotKey = item.dataset.bot || 'topic-parser';
      simFeedIdx = 0;

      if (tgActiveBotTitle) {
        tgActiveBotTitle.textContent = '▲ ' + item.querySelector('.name').textContent + ' (Живой поток)';
      }
      
      if (tgMessagesStream) tgMessagesStream.innerHTML = '';
      pushSimulatedMessage();
    });
  });

  pushSimulatedMessage();
  startTgStream();
}
