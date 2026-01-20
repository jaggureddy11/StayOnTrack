(function () {
    'use strict';

    let isEnabled = true;

    // Initialize storage
    chrome.storage.local.get(['enabled'], (result) => {
        if (result.enabled !== undefined) {
            isEnabled = result.enabled;
        }
        updateBlocking();
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.enabled) {
            isEnabled = changes.enabled.newValue;
            updateBlocking();

            // Notify active tabs
            chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { action: 'toggle', enabled: isEnabled });
                });
            });
        }
    });

    const adFilters = [
        "*://*.googlevideo.com/videoplayback?*adformat=*",
        "*://*.youtube.com/get_midroll_info*",
        "*://*.doubleclick.net/*",
        "*://*.googleadservices.com/*"
    ];

    function blockRequest(details) {
        if (!isEnabled) return { cancel: false };
        console.log("Blocking ad request:", details.url);
        return { cancel: true };
    }

    function updateBlocking() {
        if (isEnabled) {
            if (!chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
                chrome.webRequest.onBeforeRequest.addListener(
                    blockRequest,
                    { urls: adFilters },
                    ["blocking"]
                );
            }
        } else {
            chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
        }
    }

})();
