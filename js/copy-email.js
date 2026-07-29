/* ==========================================================================
   COPY EMAIL INTERACTIVITY (CLIPBOARD SYNC + TOAST/BADGE FEEDBACK)
   ========================================================================== */

import { trackEvent } from './analytics.js';

export function initCopyEmail() {
  const emailElements = document.querySelectorAll('.btn-copy-email, [href^="mailto:"]');

  emailElements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      
      const email = el.getAttribute('data-email') || 'kizunezn@gmail.com';
      
      // Track analytics event
      trackEvent('✉️ Скопирован Email', { email: email });

      // Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }

      // Visual feedback on button
      const originalContent = el.innerHTML;
      el.classList.add('copied');
      
      const hasIcon = el.querySelector('i, svg');
      if (hasIcon) {
        el.innerHTML = `<i data-lucide="check"></i> <span>Скопировано!</span>`;
      } else {
        el.innerHTML = `✓ Скопировано!`;
      }
      
      if (window.lucide) lucide.createIcons();

      // Floating Toast Notification
      showCopyToast(`Email ${email} скопирован в буфер!`);

      setTimeout(() => {
        el.classList.remove('copied');
        el.innerHTML = originalContent;
        if (window.lucide) lucide.createIcons();
      }, 2500);
    });
  });
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (_) {}
  document.body.removeChild(textarea);
}

function showCopyToast(message) {
  let toast = document.getElementById('copyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i data-lucide="check-circle-2"></i> <span>${message}</span>`;
  if (window.lucide) lucide.createIcons();
  
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
