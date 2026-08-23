# Italy Immigration Companion

Phase 1 delivers a framework-free (plain HTML/CSS/JS) Progressive Web App for immigration task tracking.

## Features

- Installable PWA app shell (`manifest.json`, `service-worker.js`, offline cache)
- Language switcher with persisted preference (`localStorage`) and JSON locale files:
  - English: `/locales/en.json`
  - Italian: `/locales/it.json`
  - German: `/locales/de.json`
- Immigration checklist with stable task IDs for durable persistence
- Appointments module with:
  - `title`, `datetime`, `office`, `address`, `mapsLink`, `phone`, `website`, `reminderOffsets`
- ICS export:
  - Single appointment
  - All appointments
- Document vault metadata storage with expiry warnings dashboard
- Rule-based “Next 3 actions” panel

## Project Structure

- `/index.html` — app shell
- `/styles.css` — styling
- `/app.js` — app logic, persistence, i18n, rules, ICS exports
- `/manifest.json` — web app manifest
- `/service-worker.js` — offline caching
- `/icons/` — icon placeholders
- `/locales/` — translation files

## Local Setup

Because the app fetches JSON locale files and registers a service worker, run it through a local HTTP server.

### Option 1: Python

```bash
cd <project-directory>
python3 -m http.server 8080
```

Then open: `http://localhost:8080`

### Option 2: Node (serve)

```bash
cd <project-directory>
npx serve .
```

## Install as PWA

1. Open the app in a Chromium-based browser.
2. Use the in-app **Install** button when available.
3. Or use the browser install prompt/menu.

## Data Storage

All data is stored locally in browser `localStorage` only:

- Language preference
- Checklist completion state (keyed by stable task IDs)

Appointments and document vault entries are kept in runtime memory and are cleared when the browser tab/app is closed.

## Legal Disclaimer

This application is provided for informational and organizational purposes only.
It is **not** legal advice, does not create a professional-client relationship, and may be incomplete or outdated.
Always verify requirements with official Italian authorities or a qualified immigration professional.
