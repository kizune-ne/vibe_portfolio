/* JS Module: Full Explicit VS Code Tree Explorer & Code Inspector with Syntax Highlighting */
import { REAL_FIRMWARE_TREE } from './firmware-tree-data.js';

export function initFirmwareEditor() {
  const fileTreeContainer = document.getElementById('fileTreeContainer');
  const codeOutput = document.getElementById('codeOutput');
  const breadcrumbText = document.getElementById('breadcrumbText');
  const btnReplayCode = document.getElementById('btnReplayCode');

  let typewriterTimer = null;
  let activeFileObj = null;

  const DEFAULT_OPEN_FOLDERS = ['keyboards', 'linker', 'monsgeek', 'm1_v5', 'm1_v5_us', 'keymaps'];

  const KEY_MAPPINGS = {
    'TAB': 'key-tab', 'Q': 'key-q', 'W': 'key-w', 'E': 'key-e', 'R': 'key-r', 'T': 'key-t',
    'LCTL': 'key-ctrl', 'A': 'key-a', 'S': 'key-s', 'D': 'key-d', 'F': 'key-f', 'G': 'key-g',
    'Y': 'key-y', 'U': 'key-u', 'I': 'key-i', 'O': 'key-o', 'P': 'key-p', 'BSPC': 'key-bspc',
    'H': 'key-h', 'J': 'key-j', 'K': 'key-k', 'L': 'key-l', 'SCLN': 'key-scln',
    'Z': 'key-z', 'X': 'key-x', 'C': 'key-c', 'V': 'key-v', 'B': 'key-b',
    'N': 'key-n', 'M': 'key-m', 'COMM': 'key-comm', 'DOT': 'key-dot', 'SLSH': 'key-slsh', 'ESC': 'key-esc'
  };

  function triggerKeyHighlight(keyId) {
    const keyEl = document.getElementById(keyId);
    if (keyEl) {
      keyEl.classList.add('key-pressed');
      setTimeout(() => {
        keyEl.classList.remove('key-pressed');
      }, 150);
    }
  }

  function getFileIcon(filename) {
    if (filename.endsWith('.c')) return 'file-code';
    if (filename.endsWith('.h')) return 'file-text';
    if (filename.endsWith('.mk')) return 'file-cog';
    if (filename.endsWith('.json')) return 'file-json';
    return 'file-text';
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlightSyntaxLine(lineText, filename = '') {
    if (filename.endsWith('.json')) {
      let html = escapeHtml(lineText);
      html = html.replace(/(&quot;[\w_]+&quot;)(\s*:)/g, '<span class="syn-key">$1</span>$2');
      html = html.replace(/(:\s*)(&quot;.*?&quot;)/g, '$1<span class="syn-str">$2</span>');
      html = html.replace(/(:\s*)(\d+|true|false)/g, '$1<span class="syn-num">$2</span>');
      return html;
    }

    let html = escapeHtml(lineText);

    // 1. Comments
    const commentIdx = html.indexOf('//');
    let lineCode = html;
    let commentCode = '';
    if (commentIdx !== -1) {
      lineCode = html.substring(0, commentIdx);
      commentCode = `<span class="syn-comment">${html.substring(commentIdx)}</span>`;
    } else if (html.trim().startsWith('/*') || html.trim().startsWith('*')) {
      return `<span class="syn-comment">${html}</span>`;
    }

    // 2. Preprocessor Directives (#define, #include, #pragma, #ifdef, #ifndef, #endif, #else)
    lineCode = lineCode.replace(/(#(?:include|define|pragma|ifdef|ifndef|endif|else|elif))\b/g, '<span class="syn-preproc">$1</span>');

    // 3. Strings & Header Includes
    lineCode = lineCode.replace(/(&quot;.*?&quot;|&lt;[a-zA-Z0-9_/\.]+\.h&gt;)/g, '<span class="syn-str">$1</span>');

    // 4. Hexadecimal & Numbers
    lineCode = lineCode.replace(/\b(0x[0-9a-fA-F]+|\d+)\b/g, '<span class="syn-num">$1</span>');

    // 5. C Keywords & Types
    lineCode = lineCode.replace(/\b(void|int|uint8_t|uint16_t|uint32_t|bool|true|false|const|static|enum|struct|switch|case|default|break|return|if|else|while|for|PROGMEM|extern)\b/g, '<span class="syn-keyword">$1</span>');

    // 6. Function Invocations & Declarations
    lineCode = lineCode.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="syn-func">$1</span>');

    // 7. QMK & Firmware Macros / Keycodes
    lineCode = lineCode.replace(/\b(KC_[A-Z0-9_]+|RGB_[A-Z0-9_]+|VIAL_[A-Z0-9_]+|MD_[A-Z0-9_]+|DEVS_[A-Z0-9_]+|HS_[A-Z0-9_]+|LAYOUT_[A-Z0-9_]+)\b/g, '<span class="syn-macro">$1</span>');

    return lineCode + commentCode;
  }

  function startTypewriterAnimation(fileObj) {
    if (!fileObj) return;
    if (typewriterTimer) clearInterval(typewriterTimer);
    activeFileObj = fileObj;

    if (breadcrumbText) breadcrumbText.textContent = fileObj.path;
    if (codeOutput) codeOutput.innerHTML = '';

    const lines = (fileObj.content || '').split('\n');
    let lineIdx = 0;

    typewriterTimer = setInterval(() => {
      if (lineIdx < lines.length) {
        const rawLine = lines[lineIdx];
        const highlightedHtml = highlightSyntaxLine(rawLine, fileObj.name);
        if (codeOutput) codeOutput.innerHTML += highlightedHtml + '\n';
        
        for (const [keyToken, targetId] of Object.entries(KEY_MAPPINGS)) {
          if (rawLine.includes(keyToken)) {
            triggerKeyHighlight(targetId);
          }
        }

        lineIdx++;
      } else {
        clearInterval(typewriterTimer);
      }
    }, 35);
  }

  function renderTreeNode(node) {
    if (node.type === 'folder') {
      const isOpen = DEFAULT_OPEN_FOLDERS.includes(node.name);
      const folderDiv = document.createElement('div');
      folderDiv.className = `tree-folder ${isOpen ? 'open' : ''}`;

      const titleDiv = document.createElement('div');
      titleDiv.className = 'folder-title';
      titleDiv.innerHTML = `
        <i data-lucide="${isOpen ? 'chevron-down' : 'chevron-right'}" class="chevron-icon"></i>
        <i data-lucide="folder" class="folder-icon"></i>
        <span class="folder-name">${node.name}</span>
      `;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'folder-content';
      if (!isOpen) {
        contentDiv.style.display = 'none';
      }

      titleDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        folderDiv.classList.toggle('open');
        const chevron = titleDiv.querySelector('.chevron-icon');
        
        if (folderDiv.classList.contains('open')) {
          contentDiv.style.display = 'flex';
          if (chevron) chevron.setAttribute('data-lucide', 'chevron-down');
        } else {
          contentDiv.style.display = 'none';
          if (chevron) chevron.setAttribute('data-lucide', 'chevron-right');
        }
        if (window.lucide) lucide.createIcons();
      });

      (node.children || []).forEach(child => {
        contentDiv.appendChild(renderTreeNode(child));
      });

      folderDiv.appendChild(titleDiv);
      folderDiv.appendChild(contentDiv);
      return folderDiv;
    } else {
      const fileDiv = document.createElement('div');
      fileDiv.className = 'tree-file';
      fileDiv.setAttribute('data-path', node.path);
      const iconName = getFileIcon(node.name);
      fileDiv.innerHTML = `
        <i data-lucide="${iconName}" class="file-icon"></i>
        <span class="file-name">${node.name}</span>
      `;

      fileDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.tree-file').forEach(f => f.classList.remove('active'));
        fileDiv.classList.add('active');
        startTypewriterAnimation(node);
      });

      // Default select keyboards/monsgeek/m1_v5/m1_v5_us/config.h
      if (node.path === 'keyboards/monsgeek/m1_v5/m1_v5_us/config.h') {
        setTimeout(() => {
          document.querySelectorAll('.tree-file').forEach(f => f.classList.remove('active'));
          fileDiv.classList.add('active');
          startTypewriterAnimation(node);
        }, 100);
      }

      return fileDiv;
    }
  }

  if (fileTreeContainer) {
    fileTreeContainer.innerHTML = '';
    const rootNode = renderTreeNode(REAL_FIRMWARE_TREE);
    fileTreeContainer.appendChild(rootNode);

    if (window.lucide) lucide.createIcons();
  }

  if (btnReplayCode) {
    btnReplayCode.addEventListener('click', () => {
      if (activeFileObj) startTypewriterAnimation(activeFileObj);
    });
  }
}
