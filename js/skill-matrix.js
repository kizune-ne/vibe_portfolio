/* JS Module: Skill Matrix Spotlight Filtering */
export function initSkillMatrix() {
  const skillBadges = document.querySelectorAll('.skill-badge');
  const bentoCards = document.querySelectorAll('.bento-card');

  const SKILL_CARD_MAP = {
    'ai-agent': 'cardAiAssistant',
    'firmware': 'cardCodeViewer',
    'tg-bots': 'cardTgSimulator',
    'calculator': 'cardCalculator',
    'docker': 'cardDocker',
    'ai-gen': 'cardAiGen',
    'tiktok': 'cardTikTok',
    'design': 'cardPrintDesign',
    'dashboards': 'cardDocker'
  };

  skillBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      skillBadges.forEach(b => b.classList.remove('active'));
      badge.classList.add('active');

      const skillKey = badge.getAttribute('data-skill');
      const targetCardId = SKILL_CARD_MAP[skillKey];

      bentoCards.forEach(c => c.classList.remove('highlight-card'));

      if (targetCardId) {
        const targetEl = document.getElementById(targetCardId);
        if (targetEl) {
          targetEl.classList.add('highlight-card');
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          setTimeout(() => {
            targetEl.classList.remove('highlight-card');
          }, 3000);
        }
      }
    });
  });
}
