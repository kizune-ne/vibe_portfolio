/* JS Module: Printing & Typography Calculator Logic & Modal Controller */
export function initCalculator() {
  const miniCalcRange = document.getElementById('miniCalcRange');
  const miniCalcQtyVal = document.getElementById('miniCalcQtyVal');
  const miniCalcPriceVal = document.getElementById('miniCalcPriceVal');
  const calcTypeTabs = document.getElementById('calcTypeTabs');

  let currentType = 'bizcards';
  const typeBasePrices = {
    bizcards: 4.8,  // 4.8 руб / шт
    flyers: 8.5,    // 8.5 руб / шт
    drawings: 45.0, // 45 руб / шт
    stickers: 12.0  // 12 руб / шт
  };

  function updateMiniCalc() {
    if (!miniCalcRange || !miniCalcPriceVal) return;
    const qty = parseInt(miniCalcRange.value, 10);
    const unitPrice = typeBasePrices[currentType] || 5.0;

    if (miniCalcQtyVal) miniCalcQtyVal.textContent = qty.toLocaleString('ru-RU') + ' шт.';
    const total = Math.round(qty * unitPrice + (currentType === 'drawings' ? 500 : 350));
    miniCalcPriceVal.textContent = total.toLocaleString('ru-RU') + ' ₽';
  }

  if (miniCalcRange) {
    miniCalcRange.addEventListener('input', updateMiniCalc);
  }

  if (calcTypeTabs) {
    const tabBtns = calcTypeTabs.querySelectorAll('.calc-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentType = btn.getAttribute('data-type') || 'bizcards';
        updateMiniCalc();
      });
    });
  }

  updateMiniCalc();

  // --- Modal Controller for Full Printing Calculator ---
  const calcModalOverlay = document.getElementById('calcModalOverlay');
  const btnOpenCalcModal = document.getElementById('btnOpenCalcModal');
  const cardCalculator = document.getElementById('cardCalculator');
  const btnCloseCalcModal = document.getElementById('btnCloseCalcModal');

  function openModal() {
    if (calcModalOverlay) {
      calcModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (calcModalOverlay) {
      calcModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnOpenCalcModal) btnOpenCalcModal.addEventListener('click', (e) => { e.stopPropagation(); openModal(); });
  if (cardCalculator) cardCalculator.addEventListener('click', (e) => {
    // Prevent opening modal if clicking directly on GitHub button
    if (e.target.closest('#btnCalcGitRepo')) return;
    openModal();
  });
  if (btnCloseCalcModal) btnCloseCalcModal.addEventListener('click', closeModal);

  if (calcModalOverlay) {
    calcModalOverlay.addEventListener('click', (e) => {
      if (e.target === calcModalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && calcModalOverlay && calcModalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}
