/* ==========================================================================
   OBSIDIAN KNOWLEDGE VAULT & RAG INSPECTOR MODULE
   ========================================================================== */

export function initObsidianRAGInspector() {
  const obsidianStand = document.getElementById('obsidianRAGStand');
  if (!obsidianStand) return;

  const modeButtons = obsidianStand.querySelectorAll('.obsidian-mode-btn');
  const viewports = obsidianStand.querySelectorAll('.obsidian-viewport');

  // Mode switching (RAG Search / Graph View / Agent Terminal)
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      viewports.forEach(vp => {
        if (vp.dataset.viewport === mode) {
          vp.classList.add('active');
        } else {
          vp.classList.remove('active');
        }
      });
      
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  });

  // Interactive RAG Search Simulator Data
  const RAG_DATABASE = [
    {
      queryKey: 'cuda',
      keywords: ['cuda', 'docker', 'gpu', 'проброс', 'nvidia', 'rtx'],
      targetNote: '[[docker_nvidia_cuda_passthrough.md]]',
      similarity: '0.984 (Cosine)',
      tags: ['#infrastructure', '#docker', '#cuda', '#rtx4070ti'],
      chunkText: `## NVIDIA Container Toolkit & CUDA Passthrough
Настройка Compose-сервиса \`ollama\` для работы с 16GB VRAM NVIDIA RTX 4070 Ti SUPER.
Конфигурация \`deploy.resources.reservations.devices\` с драйвером \`nvidia\` и \`capabilities: [gpu]\`.
Результат: Время ответа TTFT < 250ms на модели Qwen 3.5 Coder 14B.`
    },
    {
      queryKey: 'dedup',
      keywords: ['дедупликация', 'дубли', 'telegram', 'парсер', 'хэш', 'md5', 'бд'],
      targetNote: '[[tg_parser_deduplication_engine.md]]',
      similarity: '0.962 (Cosine)',
      tags: ['#python', '#telethon', '#hash_md5', '#database'],
      chunkText: `## Telegram Stream Deduplication & Hash Engine
Двухуровневая дедупликация входящего потока новостей:
1. Вычисление MD5-сигнатуры медиа-вложений (фото/видео).
2. Смысловое хэширование нормализованных текстовых фрагментов.
Результат: 0 дублей в базе данных PostgreSQL при парсинге 50+ каналов.`
    },
    {
      queryKey: 'lora',
      keywords: ['lora', 'wan', 'flux', 'обучение', 'инфлюенсер', 'аватар', 'comfyui'],
      targetNote: '[[ai_influencer_lora_pipeline.md]]',
      similarity: '0.978 (Cosine)',
      tags: ['#generative_ai', '#lora', '#wan2_2', '#flux', '#ai_toolkit'],
      chunkText: `## Wan 2.2 / Flux LoRA Fine-Tuning Pipeline
4-этапный локальный тренинг виртуального аватара на RTX 4070 Ti SUPER:
1. Кадрирование датасета и авто-капшенинг.
2. Тренировка весов LoRA в AI-Toolkit (Rank 16, Alpha 16).
3. Сэмплирование в ComfyUI с сохранением 100% узнаваемости черт лица.`
    },
    {
      queryKey: 'qmk',
      keywords: ['qmk', 'vial', 'monsgeek', 'прошивка', 'ldflags', 'gcc', 'arm'],
      targetNote: '[[monsgeek_m1_v5_vial_porting.md]]',
      similarity: '0.951 (Cosine)',
      tags: ['#embedded_c', '#qmk', '#vial', '#gcc_arm'],
      chunkText: `## MonsGeek M1 V5 Vial Porting & Linker Patch
Портирование динамического протокола Vial ID под матричную структуру EEPROM.
Исправление ошибок дубликатов символов линковщика GCC ARM (\`gcc-arm-none-eabi\`) в LDFLAGS.
Результат: 0 ошибок компиляции, настройка клавиатуры в браузере за 1 секунду.`
    }
  ];

  // RAG Search Input & Chips
  const ragInput = obsidianStand.querySelector('#ragSearchInput');
  const ragChips = obsidianStand.querySelectorAll('.rag-chip');
  const ragResultsContainer = obsidianStand.querySelector('#ragResultsContainer');

  function runRAGSearch(queryText) {
    if (!ragResultsContainer) return;
    const lowerQuery = queryText.toLowerCase().trim();

    // Find best matching note or fallback
    let matches = RAG_DATABASE.filter(item => 
      item.keywords.some(kw => lowerQuery.includes(kw))
    );

    if (matches.length === 0) {
      matches = [RAG_DATABASE[0], RAG_DATABASE[1]]; // Show top 2 entries by default
    }

    ragResultsContainer.innerHTML = matches.map(m => `
      <div class="rag-result-card">
        <div class="rag-result-header">
          <span class="rag-note-title"><i data-lucide="file-text"></i> ${m.targetNote}</span>
          <span class="rag-score-pill"><i data-lucide="zap"></i> Match: ${m.similarity}</span>
        </div>
        <div class="rag-chunk-body">
          <pre>${m.chunkText}</pre>
        </div>
        <div class="rag-tags-wrap">
          ${m.tags.map(t => `<span class="rag-tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  if (ragInput) {
    ragInput.addEventListener('input', (e) => {
      runRAGSearch(e.target.value);
    });
  }

  ragChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query || chip.textContent.trim();
      if (ragInput) {
        ragInput.value = query;
      }
      runRAGSearch(query);
    });
  });

  // Initial load search simulation
  runRAGSearch("cuda");
}
