/* ==========================================================================
   OBSIDIAN SECOND BRAIN SHOWCASE MODULE
   ========================================================================== */

export function initObsidianShowcase() {
  const stand = document.getElementById('obsidianRAGStand');
  if (!stand) return;

  const tabs = stand.querySelectorAll('.obsidian-mode-btn');
  const viewports = stand.querySelectorAll('.obsidian-viewport');
  const catItems = stand.querySelectorAll('.vault-cat-item');
  const previewContainer = document.getElementById('vaultNotePreview');

  // Vault Categories Data
  const NOTES_DATA = {
    'infra': {
      title: '[[docker_nvidia_cuda_passthrough.md]]',
      tag: '#infrastructure',
      desc: 'Готовый рабочий рецепт проброса VRAM видеокарты RTX 4070 Ti SUPER в контейнеры Ollama и ComfyUI.',
      code: `version: "3.8"
services:
  ollama:
    image: ollama/ollama:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]`
    },
    'python': {
      title: '[[tg_async_dedup_engine.md]]',
      tag: '#python_async',
      desc: 'Алгоритм хэширования медиа и асинхронной проверки дубликатов сообщений перед записью в PostgreSQL.',
      code: `import hashlib
async def is_duplicate(message_bytes: bytes, redis_client) -> bool:
    msg_hash = hashlib.sha256(message_bytes).hexdigest()
    exists = await redis_client.get(f"msg:{msg_hash}")
    if not exists:
        await redis_client.setex(f"msg:{msg_hash}", 86400, "1")
    return bool(exists)`
    },
    'ai': {
      title: '[[lora_flux_captioning_template.md]]',
      tag: '#generative_media',
      desc: 'Откалиброванные системные промпты для идеального капшенинга и обучения персонажных LoRA под Flux/Wan.',
      code: `[SYSTEM_PROMPT]
Role: Elite AI Vision Captioner
Task: Generate precise trigram tags for character consistency.
Format: [trigger_word], [clothing], [lighting], [camera_angle]`
    },
    'qmk': {
      title: '[[monsgeek_vial_linker_patch.md]]',
      tag: '#embedded_c',
      desc: 'Фикс ошибки линковщика GCC ARM LDFLAGS при компиляции прошивки клавиатуры MonsGeek M1 под Vial.',
      code: `// rules.mk patch for LDFLAGS overflow
LDFLAGS += -Wl,--gc-sections
BOOTLOADER = stm32-dfu
VIAL_ENABLE = yes`
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
          <pre><code class="language-yaml">${escapeHtml(note.code)}</code></pre>
        `;
        if (window.lucide) lucide.createIcons();
      }
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
