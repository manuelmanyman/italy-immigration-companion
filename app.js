const STORAGE_KEYS = {
  language: 'iic_language',
  checklist: 'iic_checklist_v1'
};

const TASK_DEFINITIONS = [
  { id: 'register-address', titleKey: 'checklist.tasks.registerAddress.title', detailKey: 'checklist.tasks.registerAddress.detail', priority: 2 },
  { id: 'apply-tax-code', titleKey: 'checklist.tasks.applyTaxCode.title', detailKey: 'checklist.tasks.applyTaxCode.detail', priority: 1 },
  { id: 'book-residence-permit', titleKey: 'checklist.tasks.bookResidencePermit.title', detailKey: 'checklist.tasks.bookResidencePermit.detail', priority: 1 },
  { id: 'healthcare-enrollment', titleKey: 'checklist.tasks.healthcareEnrollment.title', detailKey: 'checklist.tasks.healthcareEnrollment.detail', priority: 3 },
  { id: 'open-bank-account', titleKey: 'checklist.tasks.openBankAccount.title', detailKey: 'checklist.tasks.openBankAccount.detail', priority: 3 }
];

let translations = {};
let checklistState = loadJSON(STORAGE_KEYS.checklist, {});
let appointments = [];
let documents = [];
let deferredInstallPrompt;

const languageSelect = document.getElementById('language-select');
const installBtn = document.getElementById('install-btn');
const taskList = document.getElementById('task-list');
const appointmentForm = document.getElementById('appointment-form');
const appointmentsList = document.getElementById('appointments-list');
const exportAllAppointmentsBtn = document.getElementById('export-all-appointments');
const documentForm = document.getElementById('document-form');
const documentsList = document.getElementById('documents-list');
const documentDashboard = document.getElementById('document-dashboard');
const nextActions = document.getElementById('next-actions');

init();

async function init() {
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.language) || 'en';
  languageSelect.value = savedLanguage;
  await setLanguage(savedLanguage);

  languageSelect.addEventListener('change', async (event) => {
    await setLanguage(event.target.value);
  });

  appointmentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(appointmentForm);
    const item = {
      id: createId(),
      title: formData.get('title')?.toString().trim() || '',
      datetime: formData.get('datetime')?.toString() || '',
      office: formData.get('office')?.toString().trim() || '',
      address: formData.get('address')?.toString().trim() || '',
      mapsLink: normalizeHttpUrl(formData.get('mapsLink')?.toString().trim() || ''),
      phone: formData.get('phone')?.toString().trim() || '',
      website: normalizeHttpUrl(formData.get('website')?.toString().trim() || ''),
      reminderOffsets: parseReminderOffsets(formData.get('reminderOffsets'))
    };

    if (!item.title || !item.datetime || !item.office || !item.address) return;
    appointments.push(item);
    appointmentForm.reset();
    renderAll();
  });

  exportAllAppointmentsBtn.addEventListener('click', () => exportAllAppointmentsIcs());

  documentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(documentForm);
    const item = {
      id: createId(),
      title: formData.get('title')?.toString().trim() || '',
      category: formData.get('category')?.toString().trim() || '',
      number: formData.get('number')?.toString().trim() || '',
      issueDate: formData.get('issueDate')?.toString() || '',
      expiryDate: formData.get('expiryDate')?.toString() || '',
      notes: formData.get('notes')?.toString().trim() || ''
    };

    if (!item.title || !item.category || !item.expiryDate) return;
    documents.push(item);
    documentForm.reset();
    renderAll();
  });

  installPwaWiring();
  renderAll();
}

function installPwaWiring() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installBtn.hidden = false;
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installBtn.hidden = true;
  });
}

async function setLanguage(language) {
  const response = await fetch(`./locales/${language}.json`);
  if (!response.ok) return;
  translations = await response.json();
  localStorage.setItem(STORAGE_KEYS.language, language);
  document.documentElement.lang = language;
  applyTranslations();
  renderAll();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.getAttribute('data-i18n'));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    node.placeholder = t(node.getAttribute('data-i18n-placeholder'));
  });
}

function renderAll() {
  renderChecklist();
  renderAppointments();
  renderDocuments();
  renderNextActions();
}

function renderChecklist() {
  taskList.innerHTML = '';

  TASK_DEFINITIONS.forEach((task) => {
    const done = Boolean(checklistState[task.id]);
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <label>
        <input type="checkbox" data-id="${task.id}" ${done ? 'checked' : ''} />
        <strong>${t(task.titleKey)}</strong>
      </label>
      <p>${t(task.detailKey)}</p>
    `;

    li.querySelector('input').addEventListener('change', (event) => {
      checklistState[task.id] = event.target.checked;
      saveJSON(STORAGE_KEYS.checklist, checklistState);
      renderNextActions();
    });

    taskList.appendChild(li);
  });
}

function renderAppointments() {
  appointmentsList.innerHTML = '';

  const sorted = [...appointments].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  sorted.forEach((appointment) => {
    const li = document.createElement('li');
    li.className = 'item';
    const websiteUrl = normalizeHttpUrl(appointment.website);
    const mapsUrl = normalizeHttpUrl(appointment.mapsLink);

    const reminders = appointment.reminderOffsets.length
      ? appointment.reminderOffsets.map((m) => `${m}m`).join(', ')
      : t('appointments.none');

    li.innerHTML = `
      <h3>${escapeHtml(appointment.title)}</h3>
      <p>${new Date(appointment.datetime).toLocaleString()}</p>
      <p>${escapeHtml(appointment.office)} — ${escapeHtml(appointment.address)}</p>
      <p>${t('appointments.reminders')}: ${reminders}</p>
      <p>${appointment.phone ? `${t('appointments.phone')}: ${escapeHtml(appointment.phone)}` : ''}</p>
      <p>${websiteUrl ? `<a href="${escapeAttribute(websiteUrl)}" target="_blank" rel="noopener">${t('appointments.website')}</a>` : ''}</p>
      <p>${mapsUrl ? `<a href="${escapeAttribute(mapsUrl)}" target="_blank" rel="noopener">${t('appointments.maps')}</a>` : ''}</p>
      <div>
        <button type="button" data-export-id="${appointment.id}">${t('appointments.exportOne')}</button>
        <button type="button" data-delete-id="${appointment.id}">${t('common.delete')}</button>
      </div>
    `;

    li.querySelector('[data-export-id]').addEventListener('click', () => exportSingleAppointmentIcs(appointment.id));
    li.querySelector('[data-delete-id]').addEventListener('click', () => {
      appointments = appointments.filter((item) => item.id !== appointment.id);
      renderAll();
    });

    appointmentsList.appendChild(li);
  });
}

function renderDocuments() {
  documentsList.innerHTML = '';

  documents.forEach((documentItem) => {
    const expiryInfo = getExpiryInfo(documentItem.expiryDate);
    const li = document.createElement('li');
    li.className = 'item';

    li.innerHTML = `
      <h3>${escapeHtml(documentItem.title)} (${escapeHtml(documentItem.category)})</h3>
      <p>${t('documents.expiryDate')}: ${escapeHtml(documentItem.expiryDate)}</p>
      <p>${documentItem.number ? `${t('documents.number')}: ${escapeHtml(documentItem.number)}` : ''}</p>
      <p>${documentItem.issueDate ? `${t('documents.issueDate')}: ${escapeHtml(documentItem.issueDate)}` : ''}</p>
      <p>${documentItem.notes ? `${t('documents.notes')}: ${escapeHtml(documentItem.notes)}` : ''}</p>
      <p class="${expiryInfo.isExpired || expiryInfo.daysLeft <= 30 ? 'danger' : ''}">${expiryInfo.message}</p>
      <button type="button" data-delete-doc-id="${documentItem.id}">${t('common.delete')}</button>
    `;

    li.querySelector('[data-delete-doc-id]').addEventListener('click', () => {
      documents = documents.filter((item) => item.id !== documentItem.id);
      renderAll();
    });

    documentsList.appendChild(li);
  });

  renderDocumentDashboard();
}

function renderDocumentDashboard() {
  const metrics = {
    total: documents.length,
    expired: 0,
    expiring7: 0,
    expiring30: 0
  };

  documents.forEach((item) => {
    const info = getExpiryInfo(item.expiryDate);
    if (info.isExpired) metrics.expired += 1;
    if (!info.isExpired && info.daysLeft <= 7) metrics.expiring7 += 1;
    if (!info.isExpired && info.daysLeft <= 30) metrics.expiring30 += 1;
  });

  documentDashboard.innerHTML = `
    <div class="card"><strong>${metrics.total}</strong><p>${t('documents.dashboard.total')}</p></div>
    <div class="card"><strong>${metrics.expired}</strong><p>${t('documents.dashboard.expired')}</p></div>
    <div class="card"><strong>${metrics.expiring7}</strong><p>${t('documents.dashboard.expiring7')}</p></div>
    <div class="card"><strong>${metrics.expiring30}</strong><p>${t('documents.dashboard.expiring30')}</p></div>
  `;
}

function renderNextActions() {
  const actions = [];
  const now = new Date();
  let documentAlerts = 0;
  const pendingTasks = TASK_DEFINITIONS.filter((task) => !checklistState[task.id]);

  documents.forEach((item) => {
    const expiry = getExpiryInfo(item.expiryDate);
    if (expiry.isExpired) {
      documentAlerts += 1;
      actions.push({ priority: 1, text: t('nextActions.rules.expiredDoc').replace('{doc}', item.title) });
    } else if (expiry.daysLeft <= 30) {
      documentAlerts += 1;
      actions.push({ priority: 2, text: t('nextActions.rules.expiringDoc').replace('{doc}', item.title).replace('{days}', String(expiry.daysLeft)) });
    }
  });

  const upcomingAppointments = appointments
    .map((item) => ({ ...item, date: new Date(item.datetime) }))
    .filter((item) => item.date >= now)
    .sort((a, b) => a.date - b.date);

  if (upcomingAppointments.length === 0 && (pendingTasks.length > 0 || documentAlerts > 0)) {
    actions.push({ priority: 1, text: t('nextActions.rules.noAppointments') });
  } else {
    const soon = upcomingAppointments[0];
    const days = soon ? Math.ceil((soon.date - now) / (1000 * 60 * 60 * 24)) : Number.POSITIVE_INFINITY;
    if (soon && days <= 7 && (!soon.reminderOffsets || soon.reminderOffsets.length === 0)) {
      actions.push({ priority: 2, text: t('nextActions.rules.addReminder').replace('{title}', soon.title) });
    }
  }

  pendingTasks
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)
    .forEach((task) => {
      actions.push({ priority: task.priority + 1, text: t('nextActions.rules.pendingTask').replace('{task}', t(task.titleKey)) });
    });

  const top = actions.sort((a, b) => a.priority - b.priority).slice(0, 3);
  nextActions.innerHTML = '';

  if (!top.length) {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = t('nextActions.allClear');
    nextActions.appendChild(li);
    return;
  }

  top.forEach((action) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.textContent = action.text;
    nextActions.appendChild(li);
  });
}

function parseReminderOffsets(value) {
  if (!value) return [];
  const parsed = value
    .toString()
    .split(',')
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);

  return [...new Set(parsed)].sort((a, b) => a - b);
}

function exportSingleAppointmentIcs(appointmentId) {
  const appointment = appointments.find((item) => item.id === appointmentId);
  if (!appointment) return;
  const content = buildIcs([appointment]);
  downloadIcs(content, `${safeFileName(appointment.title)}.ics`);
}

function exportAllAppointmentsIcs() {
  if (!appointments.length) return;
  const content = buildIcs(appointments);
  downloadIcs(content, 'appointments.ics');
}

function buildIcs(items) {
  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Italy Immigration Companion//EN',
    'CALSCALE:GREGORIAN'
  ];

  const events = items.map((item) => {
    const start = new Date(item.datetime);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const lines = [
      'BEGIN:VEVENT',
      `UID:${item.id}@italy-immigration-companion.local`,
      `DTSTAMP:${toUtcIcs(new Date())}`,
      `DTSTART:${toUtcIcs(start)}`,
      `DTEND:${toUtcIcs(end)}`,
      `SUMMARY:${escapeIcs(item.title)}`,
      `LOCATION:${escapeIcs(`${item.office} - ${item.address}`)}`,
      `DESCRIPTION:${escapeIcs([item.phone, item.website, item.mapsLink].filter(Boolean).join(' | '))}`
    ];

    (item.reminderOffsets || []).forEach((minutes) => {
      lines.push('BEGIN:VALARM');
      lines.push(`TRIGGER:-PT${minutes}M`);
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${escapeIcs(item.title)}`);
      lines.push('END:VALARM');
    });

    lines.push('END:VEVENT');
    return lines.join('\r\n');
  });

  return [...header, ...events, 'END:VCALENDAR', ''].join('\r\n');
}

function downloadIcs(content, filename) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getExpiryInfo(expiryDate) {
  if (!expiryDate) {
    return { daysLeft: Number.POSITIVE_INFINITY, isExpired: false, message: t('documents.expiryUnknown') };
  }

  const today = new Date();
  const localMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(`${expiryDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) {
    return { daysLeft: Number.POSITIVE_INFINITY, isExpired: false, message: t('documents.expiryUnknown') };
  }
  const diffMs = target - localMidnight;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return { daysLeft, isExpired: true, message: t('documents.expired') };
  }

  if (daysLeft <= 30) {
    return { daysLeft, isExpired: false, message: t('documents.expiringSoon').replace('{days}', String(daysLeft)) };
  }

  return { daysLeft, isExpired: false, message: t('documents.valid').replace('{days}', String(daysLeft)) };
}

function t(path) {
  const value = path.split('.').reduce((acc, key) => (acc && key in acc ? acc[key] : undefined), translations);
  return value ?? path;
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function toUtcIcs(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcs(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function safeFileName(text) {
  return String(text || 'appointment').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function normalizeHttpUrl(value) {
  if (!value) return '';

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : '';
  } catch {
    return '';
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/\s+/g, ' ').trim();
}
