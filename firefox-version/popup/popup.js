document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggle-switch');
    const statusText = document.getElementById('status-text');

    // Load current state
    chrome.storage.local.get(['enabled'], (result) => {
        const isEnabled = result.enabled !== false; // Default to true
        toggleSwitch.checked = isEnabled;
        updateStatusText(isEnabled);
    });

    // Handle toggle
    toggleSwitch.addEventListener('change', () => {
        const isEnabled = toggleSwitch.checked;
        chrome.storage.local.set({ enabled: isEnabled });
        updateStatusText(isEnabled);
    });

    function updateStatusText(enabled) {
        statusText.textContent = enabled ? 'Protection is Active' : 'Protection is Disabled';
        statusText.style.color = enabled ? '#ffffff' : '#aaaaaa';
    }
});
