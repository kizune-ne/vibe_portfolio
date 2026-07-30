/* ==========================================================================
   MOBILE WEBKIT UNBREAKABLE TOUCH SCROLL ENGINE
   ========================================================================== */

export function initMobileScrollFix() {
  if (!('ontouchstart' in window) && navigator.maxTouchPoints <= 0) {
    return;
  }

  let touchStartY = 0;
  let touchStartX = 0;

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = touchStartY - currentY;
    const deltaX = touchStartX - currentX;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 2) {
      // Allow modals, text inputs, textareas
      const interactive = e.target.closest('.modal-overlay.active, .case-inspector-overlay.active, input, textarea, select');
      if (interactive) return;

      // Check if target is inside an internally scrollable container
      const scrollable = e.target.closest('.chat-container, .tg-main-chat, .code-editor-wrap, .terminal-window, .case-inspector-body');
      if (scrollable) {
        const atTop = scrollable.scrollTop <= 0 && deltaY < 0;
        const atBottom = (scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1) && deltaY > 0;
        if (!atTop && !atBottom) {
          // Inner container can scroll in this direction
          return;
        }
      }

      window.scrollBy(0, deltaY);
      touchStartY = currentY;
      touchStartX = currentX;
    }
  }, { passive: true });
}
