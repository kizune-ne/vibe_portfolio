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

  // 3. Universal Automatic Event Delegation (Auto-Tracks any link/button)
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

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
  } catch (_) {}
}

function setupAutoTracker(visitorId) {
  document.addEventListener('click', (e) => {
    const clickable = e.target.closest('a, button, [data-track]');
    if (!clickable) return;

    // 1. Explicit data-track attribute (Custom labels in HTML)
    if (clickable.dataset && clickable.dataset.track) {
      trackEvent(clickable.dataset.track);
      return;
    }

    // 2. Special Case Inspection buttons
    if (clickable.classList.contains('btn-case-inspect')) {
      const caseId = clickable.getAttribute('data-case-id') || 'кейс';
      trackEvent(`📂 Просмотр кейса: [${caseId}]`);
      return;
    }

    // 3. Telegram links (t.me)
    if (clickable.href && clickable.href.includes('t.me')) {
      const text = clickable.textContent.trim() || '@kizune_ne';
      trackEvent(`💬 Переход в Telegram: ${text}`);
      return;
    }

    // 4. GitHub links
    if (clickable.href && clickable.href.includes('github.com')) {
      const text = clickable.textContent.trim() || 'GitHub Repo';
      trackEvent(`🐙 Переход на GitHub: ${text}`);
      return;
    }

    // 5. Open Calculator button
    if (clickable.id === 'btnOpenCalcModal') {
      trackEvent('🧮 Запуск Калькулятора Печати');
      return;
    }

    // 6. Generic external links (target="_blank")
    if (clickable.href && clickable.target === '_blank' && !clickable.href.startsWith('javascript:')) {
      const label = clickable.textContent.trim() || clickable.href;
      trackEvent(`🔗 Переход по внешней ссылке: ${label}`);
    }
  }, { passive: true });
}
