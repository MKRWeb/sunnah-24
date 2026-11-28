<div align="center">

### بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

# ☪️ Sunnah 24

### **Prophetic 24-Hour Lifestyle & Habit Planner**

*100% offline-first • SHA-256 integrity-verified • Built for PWA & Android 16 (API 36)*

<br>

[![Live Web App](https://img.shields.io/badge/🌐_Live_PWA-Launch_App-065f46?style=for-the-badge&labelColor=052e16)](https://sunnah-24.github.io/sunnah24/)
[![Download APK](https://img.shields.io/github/v/release/Sunnah-24/sunnah24?style=for-the-badge&label=📲_Android_Release&color=b45309&labelColor=052e16)](https://github.com/Sunnah-24/sunnah24/releases/latest)
[![Privacy Policy](https://img.shields.io/badge/🛡️_Privacy-Zero_Tracking-0f766e?style=for-the-badge&labelColor=052e16)](https://sunnah-24.github.io/sunnah24/privacy.html)
[![License](https://img.shields.io/badge/⚖️_License-AGPLv3-475569?style=for-the-badge&labelColor=052e16)](#license)

</div>

---

> *"The most beloved deeds to Allah are those that are most consistent, even if they are small."* — **Sahih al-Bukhari & Sahih Muslim**
>
> **Sunnah 24** harmonizes daily Prophetic rhythms with modern chronobiology in a private, zero-telemetry workspace—combining a **32-habit 24-hour cycle**, **primary Hadith proofs**, **haptic digital Tasbih**, **Masnoon Adhkar**, and a **cryptographically verified local vault**.

---

## ✨ Core Highlights

| Pillar | What You Get |
| :--- | :--- |
| **🕒 24-Hour Prophetic Cycle** | **32 core habits** organized across **7 daily phases**—from *Tahajjud & Fajr* to *Prophetic Sleep*, alongside *Tibb Nabawi Nutrition*, *Fitrah Hygiene*, and *Akhlaq*. |
| **📖 Hadith & Science** | Every habit pairs verified citations (*Sahih al-Bukhari*, *Sahih Muslim*, *Sunan*) with practical chronobiology and physiological insights. |
| **📿 Haptic Tasbih & Adhkar** | Dedicated counter for post-Salah Tasbihat, Istighfar, Salawat, and Hawqalah with persistent lifetime analytics and Masnoon Adhkar. |
| **🛡️ SHA-256 Local Vault** | Local-first storage protected by a **SHA-256 checksum digest chain**, complete with 1-click signed JSON backup and integrity verification. |
| **☁️ Cloud-Signed Android Builds** | Built with **Capacitor 8** targeting **Android 16 (API 36)**—automatically compiled, aligned, and signed (`.apk` & `.aab`) via GitHub Actions. |

---

## 🧩 Architecture

```text
sunnah24/
├── www/
│   ├── index.html               # Main PWA & Capacitor shell
│   ├── style.css                # Serene emerald & gold UI theme
│   ├── astronomy.js             # Solar & daily phase timing engine
│   ├── storage.js               # Offline vault + SHA-256 checksum chain
│   ├── ui.js                    # Interactive views, habit tracking & haptic Tasbih
│   ├── s24_apk_ota_manager.js   # Verified Android in-app update manager
│   ├── sw.js & manifest.json    # Offline service worker & PWA manifest
│   ├── icon.svg & privacy.html  # App emblem & zero-tracking privacy policy
│   └── data/
│       ├── habits-duas-data.js  # 32 habits, Hadith proofs, science notes & Adhkar
│       ├── i18n-data.js         # Localization & UI strings
│       └── locations-data.js    # Location presets & coordinates
└── .github/workflows/
    └── sunnah-24-pipeline.yml   # Automated Pages deploy + signed APK & AAB build
