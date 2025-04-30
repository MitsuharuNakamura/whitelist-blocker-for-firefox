// Background script for whitelist URL blocker
let whitelist = [];
let enabled = true;

function escapeRegex(str) {
  return str.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
}

function loadSettings() {
  return browser.storage.local.get(['whitelist', 'enabled']).then((result) => {
    if (Array.isArray(result.whitelist)) {
      whitelist = result.whitelist;
    } else {
      whitelist = ['*://example.com/*'];
      browser.storage.local.set({ whitelist });
    }
    if (typeof result.enabled === 'boolean') {
      enabled = result.enabled;
    } else {
      enabled = true;
      browser.storage.local.set({ enabled });
    }
  });
}

function isWhitelisted(url) {
  for (const pattern of whitelist) {
    const parts = pattern.split('*').map(escapeRegex);
    const regex = new RegExp('^' + parts.join('.*') + '$');
    if (regex.test(url)) {
      return true;
    }
  }
  return false;
}

// Intercept requests and block if not whitelisted
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!enabled) {
      return;
    }
    if (!isWhitelisted(details.url)) {
      // Redirect to internal blocked page with the original URL
      const redirectUrl = browser.runtime.getURL("blocked.html") + "?url=" + encodeURIComponent(details.url);
      return { redirectUrl };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

// Load initial settings
loadSettings();
// Update settings in background when storage changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    if (changes.whitelist) {
      const newList = changes.whitelist.newValue;
      if (Array.isArray(newList)) {
        whitelist = newList;
      }
    }
    if (changes.enabled) {
      enabled = changes.enabled.newValue;
    }
  }
});