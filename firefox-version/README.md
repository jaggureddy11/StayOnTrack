# PureStream for YouTube (Firefox)

PureStream is a high-performance Firefox extension designed to provide a cleaner, more focused YouTube viewing experience. It reduces intrusive sponsored content and automatically skips video ads using policy-compliant, transparent techniques.

## File Structure & Purpose (Firefox MV2)

- **`manifest.json`**: The core configuration file for Firefox (Manifest V2). It defines the extension's metadata, permissions (`webRequest`, `webRequestBlocking`, `storage`), and entry points.
- **`background.js`**: A persistent background script that uses the `webRequest` API to block ad-related network requests at the browser level for maximum efficiency.
- **`content.js`**: A script that runs in the context of YouTube pages. It uses a `MutationObserver` to dynamically hide sponsored UI elements and monitors the video player to auto-skip injected ads.
- **`popup/`**: Contains the user interface files (`popup.html`, `popup.css`, `popup.js`) for the extension's control panel.
- **`icons/`**: Directory for the extension's icons.

## Compliance & Privacy

- **Manifest V2**: Fully compliant with current Firefox Add-on standards.
- **No Data Collection**: The extension does not collect, store, or transmit any user data.
- **Minimal Permissions**: Uses only the necessary permissions required for its core functionality.
- **Transparent Logic**: The code is clean, non-obfuscated, and follows Firefox Add-ons best practices.

## Installation for Development

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file inside the `firefox-version` directory.
