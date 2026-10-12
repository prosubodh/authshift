# Security Policy

## Supported Versions

We actively provide security patches and updates for the following versions of **AuthShift**:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

---

## Security Philosophy

AuthShift handles authentication tokens, session cookies, and Web Storage data on the user's browser. As such, our primary architectural guarantee is **Zero Remote Transmission**:
* All session snapshots, cookies, and personas are persisted exclusively in the user's local browser storage (`chrome.storage.local`).
* AuthShift does not run remote analytics, tracking, or external telemetry scripts.
* No authorization tokens or user data ever leave your machine.

---

## Reporting a Vulnerability

If you discover a security vulnerability within AuthShift, please do **NOT** report it publicly on GitHub Issues.

Instead, please report it responsibly by contacting:

* **Email:** [prosubodh+git@gmail.com](mailto:prosubodh+git@gmail.com)
* **Subject:** `[SECURITY] Vulnerability Report: AuthShift`

### What to Include in Your Report

To help us triage and resolve the issue quickly, please provide:
1. A clear description of the vulnerability and its potential impact.
2. Step-by-step reproduction instructions or a minimal proof-of-concept (PoC).
3. The affected version of AuthShift and your Chromium browser version.
4. Any proposed remediations or patches if you have one.

### Response Timeline

* **Initial Acknowledgment:** Within 48 hours of receipt.
* **Triage & Assessment:** Within 5 business days.
* **Public Disclosure:** Coordinated disclosure after a fix has been tested and published to the Chrome Web Store.

Thank you for helping keep AuthShift and its users secure!
