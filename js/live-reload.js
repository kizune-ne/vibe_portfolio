/* JS Module: Auto Live-Reload during local development */
export function initLiveReload() {
  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!isLocal) return;

  let lastEtag = null;

  async function checkForChanges() {
    try {
      const response = await fetch(location.href, { method: 'HEAD', cache: 'no-store' });
      const currentEtag = response.headers.get('etag') || response.headers.get('last-modified');

      if (lastEtag && currentEtag && lastEtag !== currentEtag) {
        console.log('[Live-Reload] Изменения в коде обнаружены! Перезагрузка страницы...');
        window.location.reload();
      }
      lastEtag = currentEtag;
    } catch (err) {}
  }

  setInterval(checkForChanges, 1200);
}
