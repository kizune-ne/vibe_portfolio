/* ==========================================================================
   PORTFOLIO VISITOR ANALYTICS & DYNAMIC EVENT TRACKING
   ========================================================================== */

export function initAnalytics() {
  // 1. Get or generate persistent Visitor ID
  let visitorId = localStorage.getItem('vibe_visitor_id');
  let isReturning = true;

  if (!visitorId) {
    visitorId = 'visitor_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
    localStorage.setItem('vibe_visitor_id', visitorId);
    isReturning = false;
  }

  // 2. Single-session visit notification guard
  const sessionPingSent = sessionStorage.getItem('vibe_session_ping');

  if (!sessionPingSent) {
    sessionStorage.setItem('vibe_session_ping', 'true');
    sendAnalyticsPing({
      type: 'visit',
      visitorId: visitorId,
      isReturning: isReturning,
      referrer: document.referrer || 'Прямой заход / Закладки',
      screen: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString()
    });
  }

  // 3. Universal Automatic Event Delegation (Left-click & Middle-wheel auxclick support)
  setupAutoTracker(visitorId);
}

export function trackEvent(eventName, details = {}) {
  const visitorId = localStorage.getItem('vibe_visitor_id') || 'unknown';
  sendAnalyticsPing({
    type: 'event',
    eventName: eventName,
    visitorId: visitorId,
    details: details,
    timestamp: new Date().toISOString()
  });
}

function sendAnalyticsPing(payload) {
  const baseUrl = window.AI_WORKER_URL || 'https://vibe-ai-proxy.androidvgb.workers.dev/';
  const endpoint = baseUrl.replace(/\/$/, '') + '/analytics';

  // Use reliable fetch with keepalive: true (prevents silent sendBeacon CORS drops)
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch((err) => {
    console.warn('[Analytics Error]', err);
  });
}

function setupAutoTracker(visitorId) {
  const handleUserInteraction = (e) => {
    // Only capture left click (click) or middle wheel click (auxclick with button === 1)
    if (e.type === 'auxclick' && e.button !== 1) return;

    const clickable = e.target.closest('a, button, .ai-selector-item, [data-track]');
    if (!clickable) return;

    let modifierTag = '';
    if (e.button === 1) modifierTag = ' (Колесико мыши)';

    // 1. Explicit data-track attribute (Highest priority)
    if (clickable.dataset && clickable.dataset.track) {
      trackEvent(clickable.dataset.track + modifierTag);
      return;
    }

    // 2. Resume Open / Download
    if (clickable.href && clickable.href.includes('resume.pdf')) {
      if (clickable.hasAttribute('download')) {
        trackEvent('📥 Рекрутер скачал Резюме (CV)' + modifierTag);
      } else {
        trackEvent('📄 Рекрутер открыл Резюме (PDF)' + modifierTag);
      }
      return;
    }

    // 3. Case Inspection buttons
    if (clickable.classList.contains('btn-case-inspect')) {
      const caseId = clickable.getAttribute('data-case-id') || 'кейс';
      trackEvent(`📂 Просмотр кейса: [${caseId}]${modifierTag}`);
      return;
    }

    // 4. Telegram links (t.me)
    if (clickable.href && clickable.href.includes('t.me')) {
      const text = clickable.textContent.trim().replace(/\s+/g, ' ') || '@kizune_ne';
      trackEvent(`💬 Переход в Telegram: ${text}${modifierTag}`);
      return;
    }

    // 5. GitHub links
    if (clickable.href && clickable.href.includes('github.com')) {
      const text = clickable.textContent.trim().replace(/\s+/g, ' ') || 'GitHub';
      trackEvent(`🐙 Переход на GitHub: ${text}${modifierTag}`);
      return;
    }

    // 6. Copy Email button
    if (clickable.classList.contains('btn-copy-email')) {
      trackEvent('✉️ Скопирован Email' + modifierTag);
      return;
    }

    // 7. Open Calculator button
    if (clickable.id === 'btnOpenCalcModal' || clickable.classList.contains('btn-launch-calc-hero')) {
      trackEvent('🧮 Запуск Калькулятора Печати' + modifierTag);
      return;
    }

    // 8. Skill Matrix badges
    if (clickable.classList.contains('skill-badge')) {
      const skillName = clickable.textContent.trim().replace(/\s+/g, ' ');
      trackEvent(`🎯 Фильтр навыков: ${skillName}${modifierTag}`);
      return;
    }

    // 9. TOV Niche tabs
    if (clickable.classList.contains('tov-tab')) {
      const niche = clickable.textContent.trim().replace(/\s+/g, ' ');
      trackEvent(`💬 Смена ниши постов TG: ${niche}${modifierTag}`);
      return;
    }

    // 10. AI Assistant prompt chips
    if (clickable.classList.contains('prompt-chip')) {
      const promptText = clickable.textContent.trim().replace(/\s+/g, ' ');
      trackEvent(`🤖 Клик подсказки ИИ: ${promptText}${modifierTag}`);
      return;
    }

    // 11. Generic external links (target="_blank")
    if (clickable.href && clickable.target === '_blank' && !clickable.href.startsWith('javascript:')) {
      const label = clickable.textContent.trim().replace(/\s+/g, ' ') || clickable.href;
      trackEvent(`🔗 Переход по ссылке: ${label}${modifierTag}`);
    }
  };

  document.addEventListener('click', handleUserInteraction, { passive: true });
  document.addEventListener('auxclick', handleUserInteraction, { passive: true });
}
