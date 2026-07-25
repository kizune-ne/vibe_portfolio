import { safeInitLucideIcons } from './icons.js';

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
  const mainTag = document.getElementById('aiFeaturedTag');
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
      mainImg.style.transform = 'scale(0.98)';

      setTimeout(() => {
        mainImg.src = data.src;
        if (mainTitle) mainTitle.textContent = data.title;
        if (mainDesc) mainDesc.textContent = data.desc;
        if (mainTag) mainTag.innerHTML = `<i data-lucide="file-text"></i> ${data.tag}`;
        if (tagsContainer) {
          tagsContainer.innerHTML = data.tags.map(t => `<span class="chip-accent">${t}</span>`).join('');
        }
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'scale(1)';
        safeInitLucideIcons();
      }, 150);
    });
  });

  // Click-to-Zoom Lightbox Modal for 100% Uncropped View
  mainImg.addEventListener('click', () => {
    let lightbox = document.getElementById('aiLightboxModal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'aiLightboxModal';
      lightbox.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0, 0, 0, 0.92); backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center;
        padding: 24px; cursor: zoom-out; opacity: 0; transition: opacity 0.25s ease;
      `;
      lightbox.innerHTML = `
        <div style="position: relative; max-width: 90vw; max-height: 90vh;">
          <img id="aiLightboxImg" src="" style="max-width: 100%; max-height: 90vh; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); object-fit: contain;">
          <div style="position: absolute; top: -36px; right: 0; color: #a1a1aa; font-family: monospace; font-size: 0.8rem; cursor: pointer;">
            ✕ ЗАКРЫТЬ [ESC]
          </div>
        </div>
      `;
      document.body.appendChild(lightbox);

      lightbox.addEventListener('click', () => {
        lightbox.style.opacity = '0';
        setTimeout(() => { lightbox.style.display = 'none'; }, 250);
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display !== 'none') {
          lightbox.style.opacity = '0';
          setTimeout(() => { lightbox.style.display = 'none'; }, 250);
        }
      });
    }

    const lightboxImg = document.getElementById('aiLightboxImg');
    if (lightboxImg) lightboxImg.src = mainImg.src;

    lightbox.style.display = 'flex';
    requestAnimationFrame(() => { lightbox.style.opacity = '1'; });
  });
}
