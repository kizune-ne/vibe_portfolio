/* ==========================================================================
   PORTFOLIO VISITOR ANALYTICS & DYNAMIC EVENT TRACKING
   ========================================================================== */

export function initAnalytics() {
  const now = Date.now();
  let visitorId = localStorage.getItem('vibe_visitor_id');
  let isNewVisitor = false;

  if (!visitorId) {
    visitorId = 'visitor_' + Math.random().toString(36).substring(2, 9) + now.toString(36).substring(4);
    localStorage.setItem('vibe_visitor_id', visitorId);
    isNewVisitor = true;
  }

  const lastLeave = parseInt(localStorage.getItem('vibe_last_leave') || '0', 10);
  const sessionStart = parseInt(localStorage.getItem('vibe_session_start') || '0', 10);
  const timeAway = now - lastLeave;
  
  // Обновляем время старта сессии, если это новый визит (или если прошло > 10 секунд с ухода)
  // 10000 мс = 10 секунд (защита от F5)
  if (isNewVisitor || timeAway > 10000) {
    localStorage.setItem('vibe_session_start', now.toString());
    
    // Если он вернулся, считаем, сколько он был в прошлый раз
    let lastDuration = 0;
    if (!isNewVisitor && sessionStart > 0 && lastLeave > sessionStart) {
        lastDuration = lastLeave - sessionStart;
    }

    sendAnalyticsPing({
      type: 'visit',
      visitorId: visitorId,
      isReturning: !isNewVisitor,
      timeAway: isNewVisitor ? 0 : timeAway,
      lastDuration: lastDuration,
      referrer: document.referrer || 'Прямой заход / Закладки',
      screen: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString()
    });
  }

  // Постоянно обновляем время ухода (heartbeat) раз в 5 секунд, пока вкладка открыта
  // А также при закрытии/скрытии страницы
  const updateLeaveTime = () => localStorage.setItem('vibe_last_leave', Date.now().toString());
  setInterval(updateLeaveTime, 5000);
  window.addEventListener('pagehide', updateLeaveTime);
  window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') updateLeaveTime();
  });

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
    if (e.type === 'auxclick' && e.button !== 1) return;

    const clickable = e.target.closest('a, button');
    if (!clickable) return;

    let modifierTag = '';
    if (e.button === 1) modifierTag = ' (Колесико мыши)';

    // Оставляем ТОЛЬКО резюме
    if (clickable.href && clickable.href.includes('resume.pdf')) {
      if (clickable.hasAttribute('download')) {
        trackEvent('📥 Рекрутер скачал Резюме (CV)' + modifierTag);
      } else {
        trackEvent('📄 Рекрутер открыл Резюме (PDF)' + modifierTag);
      }
    }
  };

  document.addEventListener('click', handleUserInteraction, { passive: true });
  document.addEventListener('auxclick', handleUserInteraction, { passive: true });
}
