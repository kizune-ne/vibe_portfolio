const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('file://' + process.cwd() + '/index.html', { waitUntil: 'networkidle0' });

  const getSpacing = await page.evaluate(() => {
    const heroRow = document.querySelector('.row-hero');
    const heroCard = document.querySelector('.card-hero').getBoundingClientRect();
    const aiCard = document.querySelector('.card-ai-assistant').getBoundingClientRect();
    
    const tgRow = document.querySelector('.row-tg-content');
    const tgSimCard = document.querySelector('.card-tg-simulator').getBoundingClientRect();
    const tgContentCard = document.querySelector('.card-tg-content-main').getBoundingClientRect();
    
    const calcRow = document.querySelector('.row-calc-firmware');
    const calcPrevCard = document.querySelector('.card-calc-preview').getBoundingClientRect();
    const codeCard = document.querySelector('.card-code-viewer').getBoundingClientRect();

    const dockerRow = document.querySelector('.row-docker-feedback');
    const dockerCard = document.querySelector('.card-docker').getBoundingClientRect();
    const feedbackCard = document.querySelector('.card-quick-feedback').getBoundingClientRect();

    return {
      hero_ai_gap: aiCard.top - heroCard.bottom,
      heroRow_computed_gap: window.getComputedStyle(heroRow).gap,
      tg_sim_content_gap: tgContentCard.top - tgSimCard.bottom,
      tgRow_computed_gap: window.getComputedStyle(tgRow).gap,
      calc_prev_code_gap: codeCard.top - calcPrevCard.bottom,
      calcRow_computed_gap: window.getComputedStyle(calcRow).gap,
      docker_feedback_gap: feedbackCard.top - dockerCard.bottom,
      dockerRow_computed_gap: window.getComputedStyle(dockerRow).gap,
      hero_row_bottom: heroRow.getBoundingClientRect().bottom,
      tg_row_top: tgRow.getBoundingClientRect().top,
      row_to_row_gap: tgRow.getBoundingClientRect().top - heroRow.getBoundingClientRect().bottom,
      main_computed_gap: window.getComputedStyle(document.querySelector('.bento-main')).gap
    };
  });
  console.log(JSON.stringify(getSpacing, null, 2));
  await browser.close();
})();
