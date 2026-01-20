let activeTabId = null;
let activeHostname = null;
let startTime = Date.now();

// Track session times by hostname
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enabled: true,
    tabTimes: {}
  });
});

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (e) {
    return null;
  }
}

// Track active tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
  updateCurrentSession();
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError || !tab || !tab.url) return;
    startNewSession(tab.id, getHostname(tab.url));
  });
});

// Track URL changes within the same tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    updateCurrentSession();
    startNewSession(tabId, getHostname(changeInfo.url));
  }
});

// Track window focus changes
chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateCurrentSession();
    activeTabId = null;
    activeHostname = null;
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        startNewSession(tabs[0].id, getHostname(tabs[0].url));
      }
    });
  }
});

const DISTRACTING_SITES = [
  'instagram.com', 'facebook.com', 'twitter.com', 'x.com',
  'reddit.com', 'netflix.com', 'tiktok.com', 'twitch.tv'
];

function startNewSession(tabId, hostname) {
  if (!hostname) return;
  activeTabId = tabId;
  activeHostname = hostname;
  startTime = Date.now();

  // Check for distracting sites to trigger interstitial
  const isDistracting = DISTRACTING_SITES.some(site => hostname.includes(site));
  if (isDistracting) {
    chrome.tabs.sendMessage(tabId, { action: 'showInterstitial' }).catch(() => { });
  }
}

function updateCurrentSession() {
  if (!activeHostname) return;

  const now = Date.now();
  const elapsed = now - startTime;

  chrome.storage.local.get(['tabTimes', 'lastNotifiedIntervals'], (result) => {
    const times = result.tabTimes || {};
    const lastNotified = result.lastNotifiedIntervals || {};

    const newTotal = (times[activeHostname] || 0) + elapsed;
    times[activeHostname] = newTotal;
    chrome.storage.local.set({ tabTimes: times });

    // 20 minute check
    const intervalMs = 20 * 60 * 1000;
    const currentInterval = Math.floor(newTotal / intervalMs);
    const lastInterval = lastNotified[activeHostname] || 0;

    if (currentInterval > lastInterval && currentInterval > 0) {
      if (activeTabId) {
        chrome.tabs.sendMessage(activeTabId, { action: 'showEyeBreak' }).catch(() => { });
      }
      lastNotified[activeHostname] = currentInterval;
      chrome.storage.local.set({ lastNotifiedIntervals: lastNotified });
    }
  });

  startTime = now;
}

// Save periodically
setInterval(updateCurrentSession, 5000);

// Handle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentTime') {
    const now = Date.now();
    const currentSessionElapsed = activeHostname ? (now - startTime) : 0;

    chrome.storage.local.get(['tabTimes'], (result) => {
      const times = result.tabTimes || {};
      // Create a copy and add current live time
      const allTimes = { ...times };
      if (activeHostname) {
        allTimes[activeHostname] = (allTimes[activeHostname] || 0) + currentSessionElapsed;
      }

      sendResponse({
        totalElapsed: activeHostname ? allTimes[activeHostname] : 0,
        hostname: activeHostname,
        allTimes: allTimes
      });
    });
    return true;
  }

  if (request.action === 'toggleYouTube') {
    const isEnabled = request.enabled;
    chrome.declarativeNetRequest.updateEnabledRulesets({
      [isEnabled ? 'enableRulesetIds' : 'disableRulesetIds']: ['ruleset_1']
    });
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: 'toggle', enabled: isEnabled });
      });
    });
  }
});
