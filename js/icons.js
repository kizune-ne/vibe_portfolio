/* ==========================================================================
   SAFE LUCIDE ICONS HELPER
   Prevents Lucide createIcons() from wiping out existing SVGs on re-renders
   Includes retry timers for async CDN script loading
   ========================================================================== */

export function safeInitLucideIcons() {
  const run = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons();
      } catch (err) {
        console.warn('Lucide icon rendering warning:', err);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // Retry triggers to ensure icons render even if CDN script arrives slightly later
  setTimeout(run, 200);
  setTimeout(run, 800);
}
