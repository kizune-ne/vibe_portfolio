/* ==========================================================================
   OBSIDIAN SECOND BRAIN SHOWCASE MODULE (HUMAN-READABLE & UNIVERSAL)
   ========================================================================== */

export function initObsidianShowcase() {
  const stand = document.getElementById('obsidianRAGStand');
  if (!stand) return;

  const tabs = stand.querySelectorAll('.obsidian-mode-btn');
  const viewports = stand.querySelectorAll('.obsidian-viewport');
  const catItems = stand.querySelectorAll('.vault-cat-item');
  const previewContainer = document.getElementById('vaultNotePreview');

  // Vault Categories Data - Simple, Clean, Universal for Any Reader
  const NOTES_DATA = {
    'cheatsheets': {
      title: '[[Команды_и_Шпаргалки.md]]',
      tag: '#cheatsheet',
      desc: 'Быстрые проверенные инструкции по настройке окружения, запуску серверов и деплою.',
      code: `# Базовые инструкции по запуску
1. Проверка переменных среды (.env)
2. Локальный запуск dev-сервера
3. Автоматический сбор логов в папку /logs/`
    },
    'architecture': {
      title: '[[Стандарты_и_Архитектура.md]]',
      tag: '#architecture',
      desc: 'Зафиксированные правила построения кода, чистой структуры проектов и стандартам качества.',
      code: `# Стандарты Разработки
- Модульность: каждый файл решает одну четкую задачу
- Изоляция: чувствительные ключи хранятся в _keys/.env
- Документирование: понятные комментарии к ключевой логике`
    },
    'ai': {
      title: '[[Правила_для_ИИ_Разработчика.md]]',
      tag: '#ai_prompts',
      desc: 'Откалиброванные системные промпты и правила, которые передаются ИИ перед началом кодинга.',
      code: `# Системный Промпт для ИИ-Ассистента
Роль: Senior Fullstack Architect
Правила:
- Пиши код строго на английском языке
- Используй современные стандарты без усложнений
- Все объяснения давай на понятном русском языке`
    },
    'research': {
      title: '[[База_Знаний_и_Заметок.md]]',
      tag: '#second_brain',
      desc: 'Единый каталог всех полезных решений, библиотек, статей и двунаправленных связей.',
      code: `# Единый Инженерный Хаб
- [[Команды_и_Шпаргалки]] — инструкции по деплою
- [[Стандарты_и_Архитектура]] — правила кода
- [[Правила_для_ИИ_Разработчика]] — системные промпты`
    }
  };

  // Tab switching
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      
      tabs.forEach(t => t.classList.remove('active'));
      viewports.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetViewport = stand.querySelector(`.obsidian-viewport[data-viewport="${mode}"]`);
      if (targetViewport) {
        targetViewport.classList.add('active');
      }
    });
  });

  // Vault Category selection
  catItems.forEach(item => {
    item.addEventListener('click', () => {
      catItems.forEach(c => c.classList.remove('active'));
      item.classList.add('active');

      const catKey = item.getAttribute('data-cat');
      const note = NOTES_DATA[catKey];
      if (note && previewContainer) {
        previewContainer.innerHTML = `
          <div class="preview-note-header">
            <span class="preview-note-title"><i data-lucide="file-text"></i> ${note.title}</span>
            <span class="preview-note-tag">${note.tag}</span>
          </div>
          <p class="preview-note-desc">${note.desc}</p>
          <pre><code class="language-markdown">${escapeHtml(note.code)}</code></pre>
        `;
        if (window.lucide) lucide.createIcons();
      }
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
