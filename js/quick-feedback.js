/* ==========================================================================
   QUICK HR / LEAD FEEDBACK FORM INTERACTIVITY
   ========================================================================== */

export function initQuickFeedback() {
  const form = document.getElementById('quickFeedbackForm');
  if (!form) return;

  const pills = form.querySelectorAll('.rating-pill');
  const commentInput = document.getElementById('quickComment');
  const contactInput = document.getElementById('quickContact');
  const statusDiv = document.getElementById('quickFeedbackStatus');

  let selectedRating = 'fire';

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedRating = pill.getAttribute('data-rating') || 'fire';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const payload = {
      rating: selectedRating,
      comment: commentInput ? commentInput.value.trim() : '',
      contact: contactInput ? contactInput.value.trim() : '',
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('vibe_quick_feedback') || '[]');
    saved.push(payload);
    localStorage.setItem('vibe_quick_feedback', JSON.stringify(saved));

    // Show success confirmation
    if (statusDiv) {
      statusDiv.style.opacity = '1';
      statusDiv.textContent = '🚀 Спасибо за отзыв! Принято';
      
      setTimeout(() => {
        statusDiv.style.opacity = '0';
      }, 4000);
    }

    if (commentInput) commentInput.value = '';
    if (contactInput) contactInput.value = '';
  });
}
