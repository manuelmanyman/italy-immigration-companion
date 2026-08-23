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
- `/locales/*.json` — EN/IT/DE translation keys
- `/manifest.json`, `/service-worker.js`, `/icons/` — PWA assets

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
