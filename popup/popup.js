document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const hostnameDisplay = document.getElementById('hostname-display');
    const youtubeToggle = document.getElementById('youtube-toggle');
    const progressBar = document.getElementById('progress-bar');

    // History elements
    const viewHistoryBtn = document.getElementById('view-history');
    const closeHistoryBtn = document.getElementById('close-history');
    const historyPanel = document.getElementById('history-panel');
    const historyList = document.getElementById('history-list');
    const historySearch = document.getElementById('history-search');

    let timerInterval;
    let allHistoryData = {};
    let isHistoryVisible = false;
    let lastRenderedData = "";

    // --- Initialize UI ---
    chrome.storage.local.get(['enabled'], (result) => {
        youtubeToggle.checked = result.enabled !== false;
    });

    // Start polling for timer
    startTimerPolling();

    // --- Handlers ---
    youtubeToggle.addEventListener('change', () => {
        const isEnabled = youtubeToggle.checked;
        chrome.storage.local.set({ enabled: isEnabled });
        chrome.runtime.sendMessage({ action: 'toggleYouTube', enabled: isEnabled });
    });

    // History Toggle
    viewHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.remove('hidden');
        isHistoryVisible = true;
        updateTimer();
    });

    closeHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.add('hidden');
        isHistoryVisible = false;
        lastRenderedData = "";
    });

    // Search History
    historySearch.addEventListener('input', () => {
        renderHistory(historySearch.value.toLowerCase());
    });

    // --- Rendering ---
    function renderHistory(query = '') {
        if (!isHistoryVisible) return;

        const dataSignature = JSON.stringify(allHistoryData) + query;
        if (dataSignature === lastRenderedData) return;
        lastRenderedData = dataSignature;

        const currentScroll = historyList.scrollTop;

        const sortedSites = Object.entries(allHistoryData)
            .sort((a, b) => b[1] - a[1]);

        historyList.innerHTML = '';
        let found = false;

        sortedSites.forEach(([domain, ms]) => {
            if (query && !domain.toLowerCase().includes(query)) return;
            found = true;

            const item = document.createElement('div');
            item.className = 'history-item';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'site-name';
            nameSpan.title = domain;
            nameSpan.textContent = domain;

            const timeSpan = document.createElement('span');
            timeSpan.className = 'item-time';
            timeSpan.textContent = formatTime(ms);

            item.appendChild(nameSpan);
            item.appendChild(timeSpan);
            historyList.appendChild(item);
        });

        if (!found) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '40px 20px';
            emptyMsg.style.color = '#71717a';
            emptyMsg.style.fontSize = '0.85rem';
            emptyMsg.textContent = 'No activity found';
            historyList.appendChild(emptyMsg);
        }

        historyList.scrollTop = currentScroll;
    }

    function formatTime(totalMs) {
        const seconds = Math.floor((totalMs / 1000) % 60);
        const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
        const hours = Math.floor((totalMs / (1000 * 60 * 60)));

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    // --- Timer Utility ---
    function startTimerPolling() {
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        chrome.runtime.sendMessage({ action: 'getCurrentTime' }, (response) => {
            if (chrome.runtime.lastError || !response) return;

            const totalMs = response.totalElapsed;
            const hostname = response.hostname || "Browser";
            allHistoryData = response.allTimes || {};

            timerDisplay.textContent = formatTime(totalMs);
            hostnameDisplay.textContent = hostname;

            if (progressBar) {
                const twentyMinutesMs = 20 * 60 * 1000;
                const percent = Math.min((totalMs / twentyMinutesMs) * 100, 100);
                progressBar.style.width = `${percent}%`;

                if (percent >= 100) {
                    progressBar.style.boxShadow = '0 0 15px var(--green)';
                } else {
                    progressBar.style.boxShadow = '0 0 8px rgba(242, 13, 13, 0.3)';
                }
            }

            if (isHistoryVisible) {
                renderHistory(historySearch.value.toLowerCase());
            }
        });
    }

    window.addEventListener('unload', () => {
        clearInterval(timerInterval);
    });
});
