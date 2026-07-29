/* ==========================================================================
   PORTFOLIO VISITOR ANALYTICS & RETURNING RECRUITER TRACKING
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

  // 2. Check single-session ping lock
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

  // 3. Setup event trackers for key user actions
  setupEventTrackers(visitorId);
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

function setupEventTrackers(visitorId) {
  // Track open calculator
  const openCalcBtn = document.getElementById('btnOpenCalcModal');
  if (openCalcBtn) {
    openCalcBtn.addEventListener('click', () => {
      trackEvent('🧮 Запуск Калькулятора Печати');
    });
  }

  // Track case inspections
  document.querySelectorAll('.btn-case-inspect').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-case-id') || 'кейс';
      trackEvent(`📂 Просмотр кейса: [${caseId}]`);
    });
  });

  // Track GitHub repo links
  document.querySelectorAll('.btn-github-repo').forEach(link => {
    link.addEventListener('click', () => {
      const repoUrl = link.getAttribute('href') || '';
      trackEvent(`🐙 Переход на GitHub: ${repoUrl}`);
    });
  });
}
