/* JS Module: DevOps Infrastructure Topology Stand */
export function initDevOpsShowcase() {
  const topoCards = document.querySelectorAll('.topo-card');

  topoCards.forEach(card => {
    card.addEventListener('click', () => {
      topoCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}
