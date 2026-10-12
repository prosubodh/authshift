# ⚡ AuthShift

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **The Developer's 1-Click Auth, Session & RBAC Switcher**  
> Hot-swap complete authentication states across **Cookies, LocalStorage, and SessionStorage** in < 200ms.

---

## 🚀 How to Test & Load Unpacked in Chrome

1. **Build the extension:**
   ```bash
   npm run build
   ```
2. **Open Chrome Extensions Manager:**
   * In Google Chrome, navigate to `chrome://extensions/`
   * Enable **Developer mode** toggle in the top-right corner.
3. **Load the Extension:**
   * Click the **"Load unpacked"** button in the top-left.
   * Select the **`d:\projects\authshift\dist`** folder.
4. **Pin to Toolbar:**
   * Click the extension puzzle icon in Chrome's toolbar and pin **AuthShift**.
5. **Test on any web app:**
   * Open any local or staging app (e.g. `http://localhost:3000`).
   * Log in $\rightarrow$ Click AuthShift $\rightarrow$ **"Save Current Tab"** (e.g. name it "Admin").
   * Log out or log in as a different user $\rightarrow$ Save as "Free Member".
   * Click **"Switch"** or use `Alt + Shift + 1` / `Alt + Shift + 2` to watch roles swap instantly!

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`Alt + Shift + 1`** | Instantly switch to Persona 1 |
| **`Alt + Shift + 2`** | Instantly switch to Persona 2 |
| **`Alt + Shift + 3`** | Instantly switch to Persona 3 |
| **`Alt + Shift + 0`** | Clean Session (Instant Log Out / Wipe storage) |

---

## 🛠️ Project Structure

```
authshift/
├── dist/                  # Built production extension (ready to load unpacked)
├── public/
│   ├── manifest.json      # Chrome Manifest V3 configuration
│   └── icons/             # 16px, 48px, 128px high-res icons
├── src/
│   ├── background/        # Service Worker (keyboard shortcuts, tab badge sync)
│   ├── popup/             # React 19 + Tailwind popup UI
│   │   ├── components/    # Header, PersonaCard, CreateModal, ExportImport, Settings
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── lib/               # Atomic Engine, Cookie Utils, DOM WebStorage, chrome.storage
│   ├── types/             # TypeScript data models
│   └── styles/            # Tailwind CSS styles
├── scripts/
│   └── generate_icons.py  # Pillow script to render icons
└── package.json
```

---

## 📦 Scripts

* `npm run build` — Typecheck and build the `dist/` extension bundle.
* `npm run dev` — Build with watch mode during development.
* `npm run icons` — Regenerate PNG icon assets from Python.
* `npm run pack` — Build and compress to `authshift.zip` for Web Store upload.

---

## 🤝 Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for local environment setup, architecture overview, and PR guidelines.

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## 🔒 Security

For security policies and responsible vulnerability disclosures, please refer to [SECURITY.md](SECURITY.md).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).  
Copyright (c) 2026 Subodh Khanal.

