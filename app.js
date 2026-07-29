/* ==========================================================================
   VIBECODER & AI ENGINEER PORTFOLIO - MAIN JS ENTRY (MODULAR STRUCTURE)
   ========================================================================== */

import { initSpotlight } from './js/spotlight.js';
import { initAiAssistant } from './js/ai-assistant.js?v=gemma4';
import { initFirmwareEditor } from './js/firmware-editor.js';
import { initCalculator } from './js/calculator.js';
import { initSkillMatrix } from './js/skill-matrix.js';
import { initDevOpsShowcase } from './js/devops.js';
import { initCaseInspector } from './js/case-inspector.js';
import { initAiInfluencerInspector } from './js/ai-influencer-inspector.js';
import { initObsidianShowcase } from './js/obsidian-showcase.js';
import { initTgContentSimulator } from './js/tg-content-sim.js';
import { initQuickFeedback } from './js/quick-feedback.js';
import { initCopyEmail } from './js/copy-email.js';
import { initAnalytics } from './js/analytics.js';
import { initLiveReload } from './js/live-reload.js';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  // Initialize Modules
  initSpotlight();
  initAiAssistant();
  initFirmwareEditor();
  initCalculator();
  initSkillMatrix();
  initDevOpsShowcase();
  initCaseInspector();
  initAiInfluencerInspector();
  initObsidianShowcase();
  initTgContentSimulator();
  initQuickFeedback();
  initCopyEmail();
  initAnalytics();
  initLiveReload(); // Auto-reload browser on code change
});
