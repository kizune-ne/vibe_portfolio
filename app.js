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
  initLiveReload(); // Auto-reload browser on code change
});
