// Script for blocked.html to display blocked URL and domain
(function() {
  const params = new URLSearchParams(location.search);
  const original = params.get('url');
  const linkEl = document.getElementById('url');
  const domainEl = document.getElementById('domain');
  if (original) {
    linkEl.textContent = original;
    linkEl.href = original;
    try {
      const u = new URL(original);
      domainEl.textContent = u.hostname;
    } catch (e) {
      domainEl.textContent = '不明';
    }
  }
  document.getElementById('back').addEventListener('click', () => {
    history.back();
  });
})();