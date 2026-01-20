(function () {
    'use strict';

    let isEnabled = true;

    // Sync with storage
    chrome.storage.local.get(['enabled'], (result) => {
        if (result.enabled !== undefined) {
            isEnabled = result.enabled;
        }
        if (isEnabled) {
            init();
        }
    });

    // Listen for toggle messages
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'toggle') {
            isEnabled = request.enabled;
            if (isEnabled) {
                init();
            } else {
                location.reload();
            }
        }
    });

    function init() {
        const observer = new MutationObserver(handleMutations);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        cleanupAds();
        setupVideoMonitor();
    }

    function handleMutations() {
        if (!isEnabled) return;
        cleanupAds();
    }

    function cleanupAds() {
        const adSelectors = [
            '.ytd-ad-slot-renderer',
            '#player-ads',
            '.ytp-ad-overlay-container',
            '.ytp-ad-message-container',
            'ytd-promoted-video-renderer',
            'ytd-display-ad-renderer',
            'ytd-statement-banner-renderer',
            'ytd-in-feed-ad-layout-renderer',
            '#masthead-ad',
            '.ytd-video-masthead-ad-v3-renderer'
        ];

        adSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        });
    }

    function setupVideoMonitor() {
        const videoPlayer = document.querySelector('video');
        if (!videoPlayer) {
            setTimeout(setupVideoMonitor, 1000);
            return;
        }

        videoPlayer.addEventListener('timeupdate', () => {
            if (!isEnabled) return;

            const adShowing = document.querySelector('.ad-showing, .ytp-ad-player-overlay');
            if (adShowing) {
                const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
                if (skipButton) {
                    skipButton.click();
                } else {
                    if (videoPlayer.duration > 0 && !isNaN(videoPlayer.duration)) {
                        videoPlayer.currentTime = videoPlayer.duration - 0.1;
                    }
                }
            }
        });

        // Handle video end to ensure we don't get stuck on an ad
        videoPlayer.addEventListener('ended', () => {
            if (!isEnabled) return;
            const adShowing = document.querySelector('.ad-showing, .ytp-ad-player-overlay');
            if (adShowing) {
                const nextButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
                if (nextButton) nextButton.click();
            }
        });
    }
})();
