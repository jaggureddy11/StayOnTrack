# StayOnTrack: Simple Productivity

StayOnTrack is a minimalist productivity companion for **Firefox** and **Chromium-based browsers**. It helps you stay mindful of your time with website-specific counters and a distraction-free experience.

## 🚀 Key Features

### 1. Website-Wise Timer
Stay aware of your browsing habits with a real-time active session counter that tracks per-site.
- **Smart Pause/Resume**: Automatically detects when you shift focus or move to a different tab.
- **Persistent Data**: Remembers how much time you've spent on each site, even after you close the browser.

### 2. YouTube Shield
A cleaner, distraction-free YouTube experience.
- **Ad Blocking**: Automatically skips and blocks YouTube ads at the network level.
- **Minimalist UI**: Focus only on the content that matters.

## 📂 Project Structure

- **`manifest.json`**: Manifest V3 configuration for both Firefox and Chromium.
- **`background.js`**: Core logic for high-performance time tracking and session management.
- **`popup/`**: Premium, ultra-minimalist UI with the live timer and controls.
- **`rules.json`**: Static rules for efficient network request blocking.

## 🛠 Installation

### For Firefox
1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file in this directory.

### For Chrome / Edge
1. Go to `chrome://extensions` or `edge://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this directory.

## 🔒 Privacy First
- **Zero Tracking**: We collect no user data. All timing data stays locally on your device.
- **Clean Code**: No obfuscation, purely functional and transparent.

---
**Developed by Jaggu**  
Contact: [jaggureddy2004@gmail.com](mailto:jaggureddy2004@gmail.com)
