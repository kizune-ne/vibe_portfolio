/* JS Module: Mouse Spotlight Glow Effect (Optimized for Mobile) */
export function initSpotlight() {
  // Skip spotlight tracking on touch/mobile devices to guarantee 60fps smooth scrolling
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768) {
    return;
  }

  const bentoCards = document.querySelectorAll('.bento-card');
  const spotlightOverlay = document.getElementById('spotlightOverlay');

  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (spotlightOverlay) {
          spotlightOverlay.style.setProperty('--mouse-x', `${e.clientX}px`);
          spotlightOverlay.style.setProperty('--mouse-y', `${e.clientY}px`);
        }

        bentoCards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--card-mouse-x', `${x}px`);
          card.style.setProperty('--card-mouse-y', `${y}px`);
        });

        ticking = false;
      });
      ticking = true;
    }
  });
}
