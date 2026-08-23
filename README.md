# Italy Immigration Companion

Mobile-first, multilingual (EN/IT/DE) PWA for the **Italy Registration Checklist** workflow.

## What changed

- Canonical checklist structure restored:
  - 8 sections
  - 34 tasks
  - links/offices block
- Task-first workflow:
  - no standalone appointment creator
  - each task has done/date/reminders/notes/documents actions
- Task-linked documents:
  - upload PDF/image from device or email download
  - mobile camera capture support (`capture="environment"`)
  - every document is auto-linked to its task (`linkedTaskId`)
- Section document center:
  - each section shows all linked docs
  - filter by task and document type
  - missing required-document indicators
- Timeline/reminders:
  - upcoming timeline is sourced from task due dates/reminder offsets
  - ICS export is generated from task reminders
- B2 module:
  - timed mock-test modes (full, reading, grammar/use-of-language, listening placeholder)
  - score report and local history

## Project Structure

- `/index.html` — app shell and sections
- `/styles.css` — mobile-first styles, sticky bottom nav, touch targets
- `/app.js` — checklist data, task workflow, reminder/timeline, documents, B2 tests, sync
- `/version.js` — shared app/service-worker version metadata
- `/locales/*.json` — EN/IT/DE translation keys
- `/manifest.json`, `/service-worker.js`, `/icons/` — PWA assets

## Cache and versioning

- Static assets are versioned with a `?v=<app-version>` query string from `index.html`.
- The service worker uses explicit versioned caches:
  - `iic-app-shell-<version>`
  - `iic-runtime-<version>`
- During activation, old `iic-*` caches are removed automatically.
- Navigation and `index.html` requests use a **network-first** strategy so the newest app shell is preferred.
- Versioned JS/CSS/manifest/locale requests use cached responses only as a short-lived fallback while the service worker revalidates in the background.
- Local data keys are unchanged, so checklist progress/documents stored in browser storage remain intact across updates.

## Expected update behavior

- Browser tabs should fetch the latest `index.html` on the next navigation or reload without manual cache clearing in most cases.
- Installed PWAs should download the new service worker in the background and show a **“New version available”** banner inside the app.
- Tapping the refresh action reloads the app into the newest deployed version.
- Settings now shows the app version, build timestamp, and active service worker version/status for rollout diagnostics.

## Force refresh for users

- **Chrome desktop**: open the app and press `Ctrl+Shift+R` (`Cmd+Shift+R` on macOS) if the update banner does not appear.
- **Chrome Android**: reopen the app, wait a moment for the update check, then tap the in-app refresh banner if shown.
- **Safari iOS / installed home-screen app**: close and reopen the app, then tap the refresh banner when available. If Safari still shows stale UI, use Safari's website data clear for the site as a last resort.

## Short test steps

1. **Chrome desktop**
   - Open the site once, then deploy a version change.
   - Reopen the same URL and confirm the newest shell loads.
   - If the previous tab stayed open, confirm the **New version available** banner appears and reloads into the new version.
2. **Chrome Android**
   - Install the PWA to the home screen.
   - Deploy a new version, reopen the installed app, and confirm the banner appears.
   - Tap refresh and confirm Settings shows the updated app/service worker version.
3. **Safari iOS**
   - Open the website or home-screen app.
   - After a new deployment, reopen it and verify the latest UI loads without clearing cache in normal cases.
   - Confirm Settings/About shows the current version/build details.

## Run

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Supabase sync scaffolding

No secrets are committed. Provide runtime config before `app.js`:

```html
<script>
  window.__APP_ENV__ = {
    SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
    SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY"
  };
</script>
```

Expected backend resources:

- Table `workspace_states` (`workspace_id`, `payload`, `updated_at`)
- Storage bucket `documents`

## Permissions guidance

- **Camera**: task document capture uses `accept="image/*" capture="environment"`
- **Notifications**: enable in Settings for reminder alerts

## Backup

- Export JSON backup from Settings
- Import JSON backup from Settings (merge flow)

## Legal Disclaimer

This application is for informational and organizational purposes only. It is **not legal advice**. Always verify legal requirements with official Italian authorities or a qualified immigration professional.
