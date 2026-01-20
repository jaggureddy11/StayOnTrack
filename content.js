(function () {
  'use strict';

  let isEnabled = true;

  // YouTube logic initialization
  chrome.storage.local.get(['enabled'], (result) => {
    if (result.enabled !== undefined) {
      isEnabled = result.enabled;
    }
    if (isEnabled && window.location.hostname.includes('youtube.com')) {
      initYouTubeCleanup();
    }
  });

  // Listen for messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle') {
      isEnabled = request.enabled;
      if (isEnabled && window.location.hostname.includes('youtube.com')) {
        initYouTubeCleanup();
      } else if (window.location.hostname.includes('youtube.com')) {
        location.reload();
      }
    }

    if (request.action === 'showInterstitial') {
      showMindfulInterstitial();
    }

    if (request.action === 'showEyeBreak') {
      showEyeBreakNotification();
    }

    if (request.action === 'extractText') {
      const pageText = extractMainContent();
      sendResponse({ text: pageText });
    }
  });

  function showEyeBreakNotification() {
    const toast = document.createElement('div');
    toast.id = 'stay-on-track-toast';
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 8px; height: 8px; background: #de7e4a; border-radius: 50%; box-shadow: 0 0 10px #de7e4a;"></div>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px;">Eye Break Time</div>
          <div style="font-size: 12px; opacity: 0.8;">Hey, quick 20-second eye break</div>
        </div>
      </div>
    `;

    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#18181b',
      color: '#fafafa',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      zIndex: '2147483647',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transform: 'translateX(120%)',
      transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
      cursor: 'pointer'
    });

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);

    // Auto-remove after 5 seconds
    const removeToast = () => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 500);
    };

    toast.onclick = removeToast;
    setTimeout(removeToast, 5000);
  }

  function showMindfulInterstitial() {
    // Avoid double interstitials
    if (document.getElementById('stay-on-track-interstitial')) return;

    const overlay = document.createElement('div');
    overlay.id = 'stay-on-track-interstitial';
    overlay.innerHTML = `
      <div style="text-align: center; max-width: 400px; padding: 40px; background: #121214; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
        <div style="font-size: 48px; margin-bottom: 20px;">🧘</div>
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #fff;">Mindful Moment</h2>
        <p style="font-family: 'Outfit', sans-serif; font-size: 16px; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px;">Do you really need to be here right now, or is it just muscle memory?</p>
        <div id="countdown-btn" style="display: inline-block; padding: 12px 30px; background: rgba(255,255,255,0.05); color: #fff; border-radius: 12px; font-weight: 600; font-family: 'Outfit', sans-serif;">
          Waiting... 5s
        </div>
      </div>
    `;

    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(9, 9, 11, 0.98)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '2147483647',
      backdropFilter: 'blur(10px)',
      transition: 'opacity 0.5s ease'
    });

    document.documentElement.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    let secondsLeft = 5;
    const btn = overlay.querySelector('#countdown-btn');

    const interval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        btn.textContent = `Waiting... ${secondsLeft}s`;
      } else {
        clearInterval(interval);
        btn.textContent = "Proceed to Site";
        btn.style.background = "#de7e4a"; // Use accent color
        btn.style.cursor = "pointer";
        btn.onclick = () => {
          overlay.style.opacity = '0';
          setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
          }, 500);
        };
      }
    }, 1000);
  }

  // --- YouTube Cleanup Logic ---
  function initYouTubeCleanup() {
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
    cleanupAds();
    setupVideoMonitor();
  }

  function handleMutations() {
    if (isEnabled) cleanupAds();
  }

  function cleanupAds() {
    const adSelectors = [
      '.ytd-ad-slot-renderer', '#player-ads', '.ytp-ad-overlay-container',
      '.ytp-ad-message-container', 'ytd-promoted-video-renderer',
      'ytd-display-ad-renderer', 'ytd-statement-banner-renderer',
      'ytd-in-feed-ad-layout-renderer', '#masthead-ad'
    ];
    adSelectors.forEach(s => {
      document.querySelectorAll(s).forEach(el => el.style.display = 'none');
    });
  }

  function setupVideoMonitor() {
    const video = document.querySelector('video');
    if (!video) {
      setTimeout(setupVideoMonitor, 1000);
      return;
    }
    video.addEventListener('timeupdate', () => {
      if (!isEnabled) return;
      const ad = document.querySelector('.ad-showing, .ytp-ad-player-overlay');
      if (ad) {
        const skip = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
        if (skip) skip.click();
        else if (video.duration > 0) video.currentTime = video.duration - 0.1;
      }
    });
  }

  // --- Summarization Extraction Logic ---
  function extractMainContent() {
    // Basic heuristic to extract main article text
    const selectors = ['article', 'main', '.post-content', '.article-body', '#content'];
    let content = "";

    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) {
        content = el.innerText;
        break;
      }
    }

    if (!content) {
      // Fallback: get all paragraph text
      const ps = Array.from(document.querySelectorAll('p'));
      content = ps.map(p => p.innerText).join('\n');
    }

    return content.trim().substring(0, 5000); // Limit context size
  }
})();
