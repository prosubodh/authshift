# Contributing to AuthShift

Thank you for your interest in contributing to **AuthShift**! As a developer-first tool, community contributions—whether bug reports, documentation enhancements, or feature pull requests—are warmly welcomed.

Please take a moment to review these guidelines to make the contribution process smooth and enjoyable.

---

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [prosubodh+git@gmail.com](mailto:prosubodh+git@gmail.com).

---

## Getting Started

### Prerequisites

* **Node.js:** v18.0.0 or higher (v20+ recommended)
* **npm:** v9.0.0 or higher
* **Google Chrome** (or any Chromium browser such as Brave, Arc, Edge)
* **Python 3** (optional, only needed if modifying or generating icons via Pillow)

### Repository Setup

1. **Fork and Clone:**
   ```bash
   git clone https://github.com/<your-username>/authshift.git
   cd authshift
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Build the Extension:**
   ```bash
   npm run build
   ```
   This compiles the extension into the `dist/` directory.

4. **Watch Mode (Development):**
   ```bash
   npm run dev
   ```
   Vite will automatically watch for source changes and rebuild `dist/` on save.

---

## Loading Unpacked in Chrome

To test your local changes in real time:

1. Open Chrome and navigate to `chrome://extensions/`.
2. Toggle on **Developer mode** in the top right corner.
3. Click **Load unpacked** (top left).
4. Select the `dist/` folder inside your cloned repository.
5. Whenever you make code changes, click the **Reload (🔄)** icon on the AuthShift card in `chrome://extensions/` to load the fresh build.

---

## Development Guidelines

### 1. Manifest V3 Security Constraints
* **No Remotely Hosted Code:** All code, libraries, and assets must be bundled inside the extension package. Never use external CDN `<script>` tags.
* **No `eval()` or `new Function()`:** Chrome's extension Content Security Policy (CSP) strictly blocks dynamic code execution.
* **Modern Async APIs:** Always use `async`/`await` with `chrome.*` APIs. Avoid callback hell.

### 2. TypeScript & Code Style
* Maintain strict TypeScript typing. Avoid `any` types where models or Chrome types exist.
* Use React 19 functional components and hooks.
* UI styles should leverage utility classes via Tailwind CSS.

### 3. Session & Storage Integrity
* AuthShift deals with sensitive user credentials, session cookies, and local tokens.
* **Zero Network Exfiltration:** No data, analytics, or tokens should ever be sent to external servers or telemetry endpoints. All data must stay strictly client-side within `chrome.storage.local`.

---

## Pull Request Workflow

1. **Create a Topic Branch:**
   Branch names should be descriptive and prefixed with their purpose:
   ```bash
   git checkout -b feat/export-json-encryption
   # or
   git checkout -b fix/cookie-partition-key
   ```

2. **Commit Conventions:**
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   * `feat: add export encryption option`
   * `fix: handle partitioned cookies on Chrome 119+`
   * `docs: update Chrome Web Store review steps`
   * `chore: update dependencies`

3. **Verify the Build Before Submitting:**
   Make sure TypeScript typechecks and Vite bundles cleanly without warnings:
   ```bash
   npm run build
   ```

4. **Submit Your Pull Request:**
   * Push your branch to your fork.
   * Open a Pull Request against the `main` branch of `prosubodh/authshift`.
   * Fill out the PR template explaining the motivation and how to test your changes.

---

## Reporting Issues

* **Bug Reports:** If you discover a bug, please use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.yml) and include reproduction steps, your Chromium browser version, and framework context (e.g. Next.js, Clerk, Supabase).
* **Feature Requests:** Have an idea to make persona switching smoother? Open a [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml) to discuss it!

Thank you for helping make AuthShift the fastest session switcher for developers! 🚀
