// Background script for whitelist URL blocker
let whitelist = [];

function escapeRegex(str) {
  return str.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
}

function loadWhitelist() {
  return browser.storage.local.get('whitelist').then((result) => {
    if (Array.isArray(result.whitelist)) {
      whitelist = result.whitelist;
    } else {
      whitelist = ['*://example.com/*'];
      browser.storage.local.set({ whitelist });
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
    if (!isWhitelisted(details.url)) {
      // Redirect to internal blocked page with the original URL
      const redirectUrl = browser.runtime.getURL("blocked.html") + "?url=" + encodeURIComponent(details.url);
      return { redirectUrl };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

// Load initial whitelist
loadWhitelist();
// Update whitelist in background when storage changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.whitelist) {
    const newList = changes.whitelist.newValue;
    if (Array.isArray(newList)) {
      whitelist = newList;
    }
  }
});