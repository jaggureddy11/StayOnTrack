# 🧘 StayOnTrack: Elevate Your Digital Focus

**StayOnTrack** is a high-performance productivity companion designed to break the cycle of mindless browsing and digital fatigue. Built with a "Privacy-First" philosophy, it runs entirely on your local machine—tracking your habits, protecting your eyes, and shielding you from distractions.

## 🚀 Key Features

### 1. 🕒 Smart Website-Wise Timer
Stay aware of your browsing habits with a real-time active session counter that tracks per-site.
- **Smart Pause/Resume**: Automatically detects when you shift focus or move to a different tab.
- **Accuracy**: Sophisticated background tracking ensures your focus time is measured precisely.

### 2. 👁️ 20-20-20 Wellness Alerts
The extension helps you follow the 20-20-20 rule to reduce digital eye strain. 
- **Recurring Prompts**: Receives a gentle, non-intrusive notification every 20 minutes.
- **Guided Break**: Reminds you to look at something 20 feet away for 20 seconds.

### 3. 🛑 Mindful Social Pause (Interstitials)
Breaks the "muscle memory" of impulsive browsing.
- **Reflective Overlay**: Visiting distracting sites (Instagram, Reddit, X, etc.) triggers a 5-second mindful countdown.
- **Intentionality**: Forces you to decide if you really need to be on that site right now.

### 4. 🛡️ YouTube Shield
A cleaner, distraction-free YouTube experience.
- **Ad Blocking**: Automatically skips and blocks YouTube ads at the network and DOM levels.
- **Minimalist UI**: Focus only on the content that matters.

### 5. 📊 Activity Log
A private, searchable dashboard to review your usage habits.
- **Search & Filter**: Find specific sites in your history instantly.
- **Time Visualization**: Sites are sorted by total focus time.

## 📂 Project Structure

- **`manifest.json`**: Manifest V3 configuration for both Firefox and Chromium.
- **`background.js`**: Core logic for high-performance time tracking and session management.
- **`popup/`**: Premium, ultra-minimalist UI with the live timer and stats panel.
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
