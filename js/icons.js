/* ==========================================================================
   SAFE LUCIDE ICONS HELPER
   Prevents Lucide createIcons() from wiping out existing SVGs on re-renders
   ========================================================================== */

export function safeInitLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
    // Strip data-lucide attribute from generated SVGs to prevent duplicate processing wipeouts
    document.querySelectorAll('svg[data-lucide]').forEach(svg => {
      svg.removeAttribute('data-lucide');
    });
  }
}
