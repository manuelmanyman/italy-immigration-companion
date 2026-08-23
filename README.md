# Italy Immigration Companion

Task-centric, multilingual (EN/IT/DE) PWA for organizing immigration workflows in Italy.

## Features

- Hierarchical workflow:
  - Categories (address change, permesso, marriage registration)
  - Nested subtasks with stable IDs
  - Per-subtask checkbox, target date, notes, reminder offsets
- Progress tracking:
  - Per-category progress bars
  - Overall progress bar
  - Dashboard with next 5 pending items by nearest date
- Calendar and timeline:
  - Unified timeline of appointments + dated subtasks
  - Quick actions (phone, map, office website)
  - ICS export per event and all events
- Reminders:
  - Reminder offsets (`7d`, `1d`, `2h`)
  - In-app alerts + browser notification permission flow
  - Local reminder scheduling, structured for future server push reminders
- Document vault:
  - Global and per-task filtered views
  - Device upload and camera capture inputs
  - Metadata: `name`, `category`, `issueDate`, `expiryDate`, `linkedTaskId`
  - Supabase storage upload when configured/signed-in, local metadata fallback otherwise
- Sync and auth (Supabase):
  - Email/password auth
  - Shared workspace payload sync
  - Last-write-wins merge using `updated_at`
  - Completion timestamp protection during merges
- Data handling:
  - Migration from legacy checklist state
  - JSON backup export/import

## Project Structure

- `/index.html` — app shell and sections
- `/styles.css` — mobile-first styles and sticky bottom nav
- `/app.js` — app logic, i18n, reminders, timeline, sync, migration
- `/locales/*.json` — EN/IT/DE translation keys
- `/manifest.json`, `/service-worker.js`, `/icons/` — PWA assets

## Setup and Run

Run from an HTTP server (needed for locales/service worker):

```bash
cd /home/runner/work/italy-immigration-companion/italy-immigration-companion
python3 -m http.server 8080
```

Open: `http://localhost:8080`

## Supabase Configuration

No secrets are committed. Provide env config at runtime by defining `window.__APP_ENV__` before `app.js` loads:

```html
<script>
  window.__APP_ENV__ = {
    SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
    SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY"
  };
</script>
```

Expected backend resources:

- Table `workspace_states`:
  - `workspace_id` (text, primary/unique)
  - `payload` (json/jsonb)
  - `updated_at` (timestamp/timestamptz)
- Storage bucket `documents` (public or policy-configured for signed users)

## Permissions

- **Camera**: document capture input uses `accept="image/*" capture="environment"`
- **Notifications**: click “Enable notifications” in Settings

## PWA Install

- **Android (Chrome)**: menu → Install app / Add to Home screen
- **iOS (Safari)**: Share → Add to Home Screen

## Backup

- Export JSON backup from Settings
- Import JSON backup from Settings (merge flow with confirmation)

## Legal Disclaimer

This application is for informational and organizational purposes only. It is **not legal advice**. Always verify legal requirements with official Italian authorities or a qualified immigration professional.
