import os

filepath = 'src/sections/hero.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = '<p class="hero-description" lang="ru">'
end_target = '</p>'

start_idx = content.find(target)
end_idx = content.find(end_target, start_idx) + len(end_target)

original_p = content[start_idx:end_idx]

replacement = """<style>
  .hero-desc-wrapper { position: relative; margin-bottom: 24px; }
  .btn-read-more-hero { display: none; }
  @media (max-width: 768px) {
    .hero-desc-wrapper.is-collapsed .hero-description {
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .hero-desc-wrapper.is-collapsed .btn-read-more-hero {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e4e4e7; padding: 6px 14px; border-radius: 8px;
      font-size: 0.75rem; cursor: pointer; font-family: var(--font-ui, 'Inter', sans-serif);
      transition: all 0.2s;
    }
    .hero-desc-wrapper.is-collapsed .btn-read-more-hero:active {
      background: rgba(255, 255, 255, 0.1);
    }
  }
</style>
<div class="hero-desc-wrapper is-collapsed" id="heroDescWrapper">
  """ + original_p + """
  <button class="btn-read-more-hero" id="btnReadMoreDesc" onclick="document.getElementById('heroDescWrapper').classList.remove('is-collapsed'); if(window.lucide) lucide.createIcons();">
    <span>Читать далее</span>
    <i data-lucide="chevron-down" style="width:14px;height:14px;"></i>
  </button>
</div>"""

if 'hero-desc-wrapper' not in content:
    new_content = content.replace(original_p, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Patched hero.html")
else:
    print("Already patched")
