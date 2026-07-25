/* ==========================================================================
   AI INFLUENCER & DATASET INSPECTOR MODULE
   Interactive Focal Media Inspector & Selector for Portfolio
   ========================================================================== */

export const SAMPLES_DATA = {
  '01': {
    title: 'Sample #01: Закатное Освещение',
    desc: 'Теплый вечерний боковой свет, кружевная одежда, детализация волос и тона кожи в закатный час.',
    tag: 'Dataset Sample #01',
    src: 'assets/ai_influencer/ref_base.jpg',
    tags: ['Sunset Light', 'Wan 2.2 Tagged', 'Heterochromia Retained']
  },
  '02': {
    title: 'Sample #02: Яркий Студийный Свет',
    desc: 'Нейтральный белый фон, студийная вспышка, фронтальный портрет с идеальной детализацией лица.',
    tag: 'Dataset Sample #02',
    src: 'assets/ai_influencer/studio_shot.jpg',
    tags: ['Studio Light', 'Clear Features', 'High-Key Flash']
  },
  '03': {
    title: 'Sample #03: Нижний Ракурс & Макро',
    desc: 'Съемка со сниженного угла вверх, фиксация мимики, гетерохромии глаз и геометрии лица.',
    tag: 'Dataset Sample #03',
    src: 'assets/ai_influencer/close_up.jpg',
    tags: ['Low Angle', 'Heterochromia', 'Macro Geometry']
  },
  '04': {
    title: 'Sample #04: Пляж & Естественный Свет',
    desc: 'Дневное естественное освещение на открытом воздухе, морской фон и льняная рубашка.',
    tag: 'Dataset Sample #04',
    src: 'assets/ai_influencer/outdoor_beach.jpg',
    tags: ['Outdoor Beach', 'Natural Light', 'Ocean Background']
  },
  '05': {
    title: 'Sample #05: Интерьер в Золотой Час',
    desc: 'Мягкие тени от солнца в комнате, шелковая текстура халата и теплые тона.',
    tag: 'Dataset Sample #05',
    src: 'assets/ai_influencer/golden_hour.jpg',
    tags: ['Indoor Sunset', 'Golden Hour', 'AI-Toolkit Ready']
  }
};

export function initAiInfluencerInspector() {
  const showcaseContainer = document.getElementById('aiInfluencerShowcase');
  if (!showcaseContainer) return;

  const mainImg = document.getElementById('aiFeaturedImage');
  const mainTitle = document.getElementById('aiFeaturedTitle');
  const mainDesc = document.getElementById('aiFeaturedDesc');
  const mainTagText = document.getElementById('aiFeaturedTagText');
  const tagsContainer = document.getElementById('aiFeaturedTags');
  const selectorItems = showcaseContainer.querySelectorAll('.ai-selector-item');

  if (!mainImg || !selectorItems.length) return;

  selectorItems.forEach(item => {
    item.addEventListener('click', () => {
      const sampleId = item.dataset.sampleId;
      const data = SAMPLES_DATA[sampleId];
      if (!data) return;

      // Update active state in selector filmstrip
      selectorItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      // Smooth Fade Transition for Featured Image & Metadata
      mainImg.style.opacity = '0.3';

      setTimeout(() => {
        mainImg.src = data.src;
        if (mainTitle) mainTitle.innerHTML = `<i data-lucide="image"></i> ${data.title}`;
        if (mainDesc) mainDesc.textContent = data.desc;
        if (mainTagText) mainTagText.textContent = data.tag;
        if (tagsContainer) {
          tagsContainer.innerHTML = data.tags.map(t => `<span class="tech-pill">${t}</span>`).join('');
        }
        mainImg.style.opacity = '1';
        if (window.lucide) {
          lucide.createIcons();
        }
      }, 150);
    });
  });
}
