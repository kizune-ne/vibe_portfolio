/* ==========================================================================
   CASE INSPECTOR MODULE - STAR METHODOLOGY CASE STUDIES FOR EMPLOYERS
   ========================================================================== */

import { CASES_DATA } from './data/case-studies.js';

export { CASES_DATA };

/* ==========================================================================
   CASE INSPECTOR CONTROLLER CLASS
   ========================================================================== */

export function initCaseInspector() {
  const modalOverlay = document.getElementById('caseInspectorModal');
  if (!modalOverlay) return;

  const btnClose = document.getElementById('btnCloseCaseInspector');
  const tabsNav = document.getElementById('caseInspectorTabs');
  const inspectButtons = document.querySelectorAll('.btn-case-inspect');

  let activeCase = null;
  let activeTab = 'overview'; // 'overview' | 'architecture' | 'tech'

  // Open modal with specific case ID
  function openCaseModal(caseId) {
    const caseData = CASES_DATA[caseId];
    if (!caseData) return;

    activeCase = caseData;
    activeTab = 'overview';

    renderModalHeader();
    renderTabs();
    renderTabContent();

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Re-initialize icons inside modal
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Close modal
  function closeCaseModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Render modal header info
  function renderModalHeader() {
    if (!activeCase) return;

    document.getElementById('modalCaseBadge').textContent = activeCase.badge;
    document.getElementById('modalCaseTitle').textContent = activeCase.title;
    document.getElementById('modalCaseSubtitle').textContent = activeCase.subtitle;
    document.getElementById('modalCaseRole').textContent = `Роль: ${activeCase.role}`;
  }

  // Render navigation tabs
  function renderTabs() {
    if (!tabsNav) return;
    tabsNav.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === activeTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Render tab body content
  function renderTabContent() {
    const bodyContainer = document.getElementById('caseModalBodyContent');
    if (!bodyContainer || !activeCase) return;

    if (activeTab === 'overview') {
      bodyContainer.innerHTML = `
        <!-- Metrics Grid -->
        <div class="modal-metrics-grid">
          ${activeCase.metrics.map(m => `
            <div class="modal-metric-card">
              <span class="modal-metric-val">${m.value}</span>
              <span class="modal-metric-lbl">${m.label}</span>
            </div>
          `).join('')}
        </div>

        <!-- STAR Sections -->
        <div class="star-section-block">
          <div class="star-header">
            <span class="star-badge badge-problem"><i data-lucide="alert-circle"></i> S & T // Проблема и Задача</span>
          </div>
          <div class="star-content">
            ${formatParagraphs(activeCase.problem)}
          </div>
        </div>

        <div class="star-section-block">
          <div class="star-header">
            <span class="star-badge badge-solution"><i data-lucide="wrench"></i> A // Инженерное Решение</span>
          </div>
          <div class="star-content">
            ${formatParagraphs(activeCase.solution)}
          </div>
        </div>

        <div class="star-section-block">
          <div class="star-header">
            <span class="star-badge badge-result"><i data-lucide="check-circle-2"></i> R // Результат и Выгода</span>
          </div>
          <div class="star-content">
            ${formatParagraphs(activeCase.results)}
          </div>
        </div>
      `;
    } else if (activeTab === 'architecture') {
      const arch = activeCase.architecture || {
        title: 'Архитектурный подход и роли компонентов',
        desc: 'Данный кейс спроектирован с учетом требований высокой отказоустойчивости, модульности и безопасного разделения ответственности.',
        highlights: [
          { icon: 'shield-check', title: 'Безопасность & Изоляция', desc: 'Все конфиденциальные данные вынесены за пределы клиентского кода.' },
          { icon: 'zap', title: 'Производительность & Оптимизация', desc: 'Минимизация задержек за счет асинхронной обработки ресурсов.' },
          { icon: 'refresh-cw', title: 'Надежность & Fallback', desc: 'Предусмотрены сценарии сохранения работоспособности.' }
        ]
      };

      bodyContainer.innerHTML = `
        <div class="architecture-tab-wrap">
          <h4><i data-lucide="layers"></i> ${arch.title}</h4>
          <p class="arch-desc">${arch.desc}</p>
          
          <div class="arch-highlights-list">
            ${arch.highlights.map(h => `
              <div class="arch-item">
                <div class="arch-icon"><i data-lucide="${h.icon}"></i></div>
                <div>
                  <strong>${h.title}</strong>
                  <p>${h.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (activeTab === 'tech') {
      bodyContainer.innerHTML = `
        <div class="tech-tab-wrap">
          <h4><i data-lucide="cpu"></i> Технологический стек и инструменты</h4>
          <div class="tech-badges-grid">
            ${activeCase.techStack.map(t => `
              <div class="tech-badge-card">
                <i data-lucide="${t.icon}"></i>
                <span>${t.name}</span>
              </div>
            `).join('')}
          </div>

          <h4 style="margin-top: 24px;"><i data-lucide="link"></i> Быстрые ссылки и Демо</h4>
          <div class="case-links-group">
            ${activeCase.links.map(l => {
              if (l.external) {
                return `
                  <a href="${l.url}" target="_blank" class="btn btn-secondary btn-sm">
                    <i data-lucide="${l.icon}"></i> ${l.label} ↗
                  </a>
                `;
              } else {
                return `
                  <button class="btn btn-secondary btn-sm btn-nav-target" data-target-id="${l.targetId}">
                    <i data-lucide="${l.icon}"></i> ${l.label}
                  </button>
                `;
              }
            }).join('')}
          </div>
        </div>
      `;

      // Bind in-page navigation target buttons
      bodyContainer.querySelectorAll('.btn-nav-target').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.dataset.targetId;
          closeCaseModal();
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Format text paragraphs with markdown bold/bullets
  function formatParagraphs(text) {
    if (!text) return '';
    return text.split('\n\n').map(p => {
      let formatted = p
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/• (.*)/g, '<li class="star-bullet">$1</li>');

      if (formatted.includes('<li class=')) {
        return `<ul class="star-ul">${formatted}</ul>`;
      }
      return `<p class="star-p">${formatted}</p>`;
    }).join('');
  }

  // Event Listeners
  inspectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const caseId = btn.dataset.caseId;
      openCaseModal(caseId);
    });
  });

  if (btnClose) {
    btnClose.addEventListener('click', closeCaseModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeCaseModal();
      }
    });
  }

  if (tabsNav) {
    tabsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (btn && btn.dataset.tab) {
        activeTab = btn.dataset.tab;
        renderTabs();
        renderTabContent();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeCaseModal();
    }
  });
}
