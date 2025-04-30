(function() {
  // Toggle blocking on/off
  const toggleEl = document.getElementById('toggleBlocking');
  if (toggleEl) {
    browser.storage.local.get('enabled').then((result) => {
      toggleEl.checked = result.enabled !== false;
    });
    toggleEl.addEventListener('change', () => {
      browser.storage.local.set({ enabled: toggleEl.checked });
    });
  }
  
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function renderList() {
    browser.storage.local.get('whitelist').then((result) => {
      const list = result.whitelist || [];
      const ul = document.getElementById('list');
      ul.innerHTML = '';
      list.forEach((pattern, idx) => {
        const li = document.createElement('li');
        li.innerHTML = escapeHtml(pattern) + ' ';
        const btn = document.createElement('button');
        btn.textContent = 'Delete';
        btn.addEventListener('click', () => {
          list.splice(idx, 1);
          browser.storage.local.set({ whitelist: list }).then(renderList);
        });
        li.appendChild(btn);
        ul.appendChild(li);
      });
    });
  }

  document.getElementById('addBtn').addEventListener('click', () => {
    const input = document.getElementById('newPattern');
    const val = input.value.trim();
    if (val) {
      browser.storage.local.get('whitelist').then((result) => {
        const list = result.whitelist || [];
        if (!list.includes(val)) {
          list.push(val);
          browser.storage.local.set({ whitelist: list }).then(() => {
            input.value = '';
            renderList();
          });
        }
      });
    }
  });

  // Bulk add patterns from textarea
  const bulkBtn = document.getElementById('bulkAddBtn');
  if (bulkBtn) {
    bulkBtn.addEventListener('click', () => {
      const textarea = document.getElementById('bulkPatterns');
      const lines = textarea.value.split(/\r?\n/).map(s => s.trim()).filter(s => s);
      if (lines.length === 0) return;
      browser.storage.local.get('whitelist').then((result) => {
        const list = result.whitelist || [];
        let changed = false;
        lines.forEach((pattern) => {
          if (!list.includes(pattern)) {
            list.push(pattern);
            changed = true;
          }
        });
        if (changed) {
          browser.storage.local.set({ whitelist: list }).then(() => {
            textarea.value = '';
            renderList();
          });
        }
      });
    });
  }

  renderList();
})();