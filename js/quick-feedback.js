/* ==========================================================================
   PORTFOLIO STAR FEEDBACK FORM INTERACTIVITY & TELEGRAM SYNC
   ========================================================================== */

export function initQuickFeedback() {
  const form = document.getElementById('quickFeedbackForm');
  if (!form) return;

  const starBtns = form.querySelectorAll('.star-btn');
  const ratingText = document.getElementById('starRatingText');
  const commentInput = document.getElementById('quickComment');
  const contactInput = document.getElementById('quickContact');
  const statusDiv = document.getElementById('quickFeedbackStatus');

  let selectedRating = 5;

  const RATING_LABELS = {
    1: '1 из 5 (Есть замечания)',
    2: '2 из 5 (Ниже среднего)',
    3: '3 из 5 (Хорошо)',
    4: '4 из 5 (Очень хорошо!)',
    5: '5 из 5 (Отлично!)'
  };

  function updateStars(val) {
    starBtns.forEach(btn => {
      const btnVal = parseInt(btn.getAttribute('data-value'), 10);
      if (btnVal <= val) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    if (ratingText) {
      ratingText.textContent = RATING_LABELS[val] || `${val} из 5`;
    }
  }

  starBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const hoverVal = parseInt(btn.getAttribute('data-value'), 10);
      updateStars(hoverVal);
    });

    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.getAttribute('data-value'), 10);
      updateStars(selectedRating);
    });
  });

  const starRow = document.getElementById('starRatingRow');
  if (starRow) {
    starRow.addEventListener('mouseleave', () => {
      updateStars(selectedRating);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      rating: selectedRating,
      ratingText: RATING_LABELS[selectedRating],
      comment: commentInput ? commentInput.value.trim() : '',
      contact: contactInput ? contactInput.value.trim() : '',
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('vibe_portfolio_feedback') || '[]');
    saved.push(payload);
    localStorage.setItem('vibe_portfolio_feedback', JSON.stringify(saved));

    // Send to Worker feedback endpoint if available
    try {
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (_) {}

    // Show success confirmation
    if (statusDiv) {
      statusDiv.style.opacity = '1';
      statusDiv.textContent = '🚀 Спасибо за оценку! Отзыв успешно принят.';
      
      setTimeout(() => {
        statusDiv.style.opacity = '0';
      }, 4000);
    }

    if (commentInput) commentInput.value = '';
    if (contactInput) contactInput.value = '';
  });
}
