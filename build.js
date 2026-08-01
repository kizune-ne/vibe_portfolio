const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getGitCommitHash() {
  if (process.env.GITHUB_SHA) {
    return process.env.GITHUB_SHA.substring(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (e) {
    return 'main';
  }
}

function build() {
  console.log('🔨 Starting Vibe Portfolio modular build...');
  const templatePath = path.join(__dirname, 'src', 'template.html');
  const sectionsDir = path.join(__dirname, 'src', 'sections');
  const outputPath = path.join(__dirname, 'index.html');

  let template = fs.readFileSync(templatePath, 'utf8');

  const commitHash = getGitCommitHash();
  const buildDate = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const versionBannerPath = path.join(sectionsDir, 'version-banner.html');
  const versionBannerHtml = `<div id="version-test-banner" style="background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899); color:#ffffff; text-align:center; padding:8px 12px; font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:600; position:relative; z-index:999999; letter-spacing:0.05em; box-shadow: 0 2px 10px rgba(99,102,241,0.3);">
  ▲ VIBECODER PORTFOLIO v1.2.2 (MOBILE FIX v2) | СБОРКА: ${commitHash} (${buildDate}) | MODULAR BUILD
</div>`;

  fs.writeFileSync(versionBannerPath, versionBannerHtml, 'utf8');

  const sectionMap = {
    'VERSION_BANNER': 'version-banner.html',
    'NAVBAR': 'navbar.html',
    'HERO': 'hero.html',
    'TG_CONTENT': 'tg-content.html',
    'AI_INFLUENCER': 'ai-influencer.html',
    'OBSIDIAN': 'obsidian.html',
    'FIRMWARE': 'firmware.html',
    'DEVOPS': 'devops.html',
    'FOOTER': 'footer.html',
    'MODALS': 'modals.html'
  };

  for (const [key, filename] of Object.entries(sectionMap)) {
    const filePath = path.join(sectionsDir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      template = template.replace(`<!-- INCLUDE:${key} -->`, content);
    } else {
      console.warn(`⚠️ Warning: Section file not found: ${filename}`);
      template = template.replace(`<!-- INCLUDE:${key} -->`, '');
    }
  }

  fs.writeFileSync(outputPath, template, 'utf8');
  console.log(`✅ Build completed! Output written to index.html (${template.length} bytes)`);
}

build();
