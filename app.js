const STORAGE_KEYS = {
  language: 'iic_language',
  state: 'iic_state_v2',
  legacyChecklist: 'iic_checklist_v1'
};

const REMINDER_PRESETS = ['7d', '1d', '2h'];

const CATEGORY_DEFINITIONS = [
  {
    id: 'cat-address',
    titleKey: 'tasks.categories.changeAddress.title',
    subtasks: [
      { id: 'sub-address-docs', titleKey: 'tasks.subtasks.addressDocs.title', detailKey: 'tasks.subtasks.addressDocs.detail' },
      { id: 'sub-address-appointment', titleKey: 'tasks.subtasks.addressAppointment.title', detailKey: 'tasks.subtasks.addressAppointment.detail' },
      { id: 'sub-address-confirmation', titleKey: 'tasks.subtasks.addressConfirmation.title', detailKey: 'tasks.subtasks.addressConfirmation.detail' }
    ]
  },
  {
    id: 'cat-permesso',
    titleKey: 'tasks.categories.permesso.title',
    subtasks: [
      { id: 'sub-permesso-kit', titleKey: 'tasks.subtasks.permessoKit.title', detailKey: 'tasks.subtasks.permessoKit.detail' },
      { id: 'sub-permesso-post', titleKey: 'tasks.subtasks.permessoPost.title', detailKey: 'tasks.subtasks.permessoPost.detail' },
      { id: 'sub-permesso-questura', titleKey: 'tasks.subtasks.permessoQuestura.title', detailKey: 'tasks.subtasks.permessoQuestura.detail' }
    ]
  },
  {
    id: 'cat-marriage',
    titleKey: 'tasks.categories.marriage.title',
    subtasks: [
      { id: 'sub-marriage-certificates', titleKey: 'tasks.subtasks.marriageCertificates.title', detailKey: 'tasks.subtasks.marriageCertificates.detail' },
      { id: 'sub-marriage-appointment', titleKey: 'tasks.subtasks.marriageAppointment.title', detailKey: 'tasks.subtasks.marriageAppointment.detail' },
      { id: 'sub-marriage-transcript', titleKey: 'tasks.subtasks.marriageTranscript.title', detailKey: 'tasks.subtasks.marriageTranscript.detail' }
    ]
  }
];

const LEGACY_TASK_MIGRATION = {
  'register-address': 'sub-address-appointment',
  'book-residence-permit': 'sub-permesso-post'
};

let translations = {};
let state = loadAppState();
let deferredInstallPrompt;
let supabaseClient = null;
let authSession = null;
let inAppAlerts = [];

const languageSelect = document.getElementById('language-select');
const installBtn = document.getElementById('install-btn');
const categoryList = document.getElementById('category-list');
const nextPendingList = document.getElementById('next-pending-list');
const overallProgress = document.getElementById('overall-progress');
const reminderAlerts = document.getElementById('reminder-alerts');
const appointmentForm = document.getElementById('appointment-form');
const timelineList = document.getElementById('timeline-list');
const exportAllEventsBtn = document.getElementById('export-all-events');
const documentForm = document.getElementById('document-form');
const documentsList = document.getElementById('documents-list');
const documentDashboard = document.getElementById('document-dashboard');
const documentStatus = document.getElementById('document-status');
const documentsFilter = document.getElementById('documents-filter');
const linkedTaskSelect = document.getElementById('linked-task-select');
const learningForm = document.getElementById('learning-form');
const learningSummary = document.getElementById('learning-summary');
const syncForm = document.getElementById('sync-form');
const authSignInBtn = document.getElementById('auth-signin');
const authSignUpBtn = document.getElementById('auth-signup');
const authSignOutBtn = document.getElementById('auth-signout');
const syncNowBtn = document.getElementById('sync-now');
const requestNotificationBtn = document.getElementById('request-notification');
const exportBackupBtn = document.getElementById('export-backup');
const importBackupInput = document.getElementById('import-backup-file');
const syncStatus = document.getElementById('sync-status');
const bottomNavButtons = Array.from(document.querySelectorAll('.bottom-nav button'));

const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.requestPermission();
  },
  notify(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
      return;
    }
    inAppAlerts.unshift({ id: createId(), title, body, at: new Date().toISOString() });
    inAppAlerts = inAppAlerts.slice(0, 8);
  },
  registerPushSubscription() {
    return null;
  }
};

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
    const title = (formData.get('title') || '').toString().trim();
    const datetime = (formData.get('datetime') || '').toString();
    const office = (formData.get('office') || '').toString().trim();
    const address = (formData.get('address') || '').toString().trim();
    if (!title || !datetime || !office || !address) return;

    state.appointments.push({
      id: createId(),
      type: 'appointment',
      title,
      datetime,
      office,
      address,
      mapsLink: normalizeHttpUrl((formData.get('mapsLink') || '').toString().trim()),
      phone: (formData.get('phone') || '').toString().trim(),
      website: normalizeHttpUrl((formData.get('website') || '').toString().trim()),
      reminderOffsets: parseReminderOffsets((formData.get('reminderOffsets') || '').toString()),
      updated_at: nowIso()
    });

    appointmentForm.reset();
    saveStateAndRender();
  });

  exportAllEventsBtn.addEventListener('click', exportAllEventsIcs);

  documentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(documentForm);
    const name = (formData.get('name') || '').toString().trim();
    const category = (formData.get('category') || '').toString().trim();
    if (!name || !category) return;

    const uploadFile = formData.get('uploadFile');
    const captureFile = formData.get('captureFile');
    const file = uploadFile instanceof File && uploadFile.size > 0
      ? uploadFile
      : captureFile instanceof File && captureFile.size > 0
        ? captureFile
        : null;

    const linkedTaskId = (formData.get('linkedTaskId') || '').toString();
    const documentEntry = {
      id: createId(),
      name,
      category,
      issueDate: (formData.get('issueDate') || '').toString(),
      expiryDate: (formData.get('expiryDate') || '').toString(),
      linkedTaskId,
      fileName: file ? file.name : '',
      fileUrl: '',
      updated_at: nowIso()
    };

    if (file) {
      const uploadResult = await uploadDocumentFile(file, documentEntry.id);
      documentEntry.fileUrl = uploadResult.url;
      documentEntry.storageProvider = uploadResult.provider;
      documentStatus.textContent = uploadResult.message;
    } else {
      documentEntry.storageProvider = 'metadata-only';
      documentStatus.textContent = t('documents.messages.metadataOnly');
    }

    state.documents.push(documentEntry);
    documentForm.reset();
    saveStateAndRender();
  });

  documentsFilter.addEventListener('change', renderDocuments);

  learningForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(learningForm);
    const completedLessons = Math.max(0, Number.parseInt((formData.get('completedLessons') || '0').toString(), 10) || 0);
    const totalLessons = Math.max(1, Number.parseInt((formData.get('totalLessons') || '1').toString(), 10) || 1);
    state.learningProgress = { completedLessons, totalLessons, updated_at: nowIso() };
    saveStateAndRender();
  });

  authSignInBtn.addEventListener('click', () => authWithSupabase('signin'));
  authSignUpBtn.addEventListener('click', () => authWithSupabase('signup'));
  authSignOutBtn.addEventListener('click', () => authWithSupabase('signout'));
  syncNowBtn.addEventListener('click', syncNow);

  requestNotificationBtn.addEventListener('click', async () => {
    const permission = await notificationService.requestPermission();
    state.reminders.notificationPermission = permission;
    saveStateAndRender();
    if (permission === 'granted') {
      notificationService.registerPushSubscription();
      syncStatus.textContent = t('settings.messages.notificationsGranted');
    } else {
      syncStatus.textContent = t('settings.messages.notificationsDenied');
    }
  });

  exportBackupBtn.addEventListener('click', exportBackup);
  importBackupInput.addEventListener('change', importBackup);

  bottomNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.addEventListener('scroll', refreshBottomNavActiveState, { passive: true });

  installPwaWiring();
  await initSupabase();
  setInterval(checkDueReminders, 60 * 1000);
  checkDueReminders();
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

async function initSupabase() {
  const env = window.__APP_ENV__ || {};
  const url = env.SUPABASE_URL || '';
  const key = env.SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    syncStatus.textContent = t('settings.messages.supabaseMissing');
    return;
  }

  try {
    const supabaseModule = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabaseClient = supabaseModule.createClient(url, key);
    const auth = await supabaseClient.auth.getSession();
    authSession = auth.data.session;
    syncStatus.textContent = authSession ? t('settings.messages.signedIn') : t('settings.messages.supabaseReady');
  } catch {
    syncStatus.textContent = t('settings.messages.supabaseLoadError');
  }
}

async function authWithSupabase(mode) {
  if (!supabaseClient) {
    syncStatus.textContent = t('settings.messages.supabaseMissing');
    return;
  }

  const formData = new FormData(syncForm);
  const email = (formData.get('email') || '').toString().trim();
  const password = (formData.get('password') || '').toString();

  try {
    if (mode === 'signin') {
      const result = await supabaseClient.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      authSession = result.data.session;
      syncStatus.textContent = t('settings.messages.signedIn');
      return;
    }

    if (mode === 'signup') {
      const result = await supabaseClient.auth.signUp({ email, password });
      if (result.error) throw result.error;
      authSession = result.data.session || null;
      syncStatus.textContent = t('settings.messages.signUpCheckEmail');
      return;
    }

    await supabaseClient.auth.signOut();
    authSession = null;
    syncStatus.textContent = t('settings.messages.signedOut');
  } catch (error) {
    syncStatus.textContent = `${t('settings.messages.authError')}: ${error.message}`;
  }
}

async function syncNow() {
  state.settings.workspaceId = ((new FormData(syncForm).get('workspaceId') || '').toString().trim() || state.settings.workspaceId || 'default-workspace');
  if (!supabaseClient || !authSession) {
    syncStatus.textContent = t('settings.messages.syncNeedsAuth');
    saveState();
    return;
  }

  const workspaceId = state.settings.workspaceId;
  const localPayload = serializeStateForSync();

  try {
    const readResult = await supabaseClient
      .from('workspace_states')
      .select('workspace_id,payload,updated_at')
      .eq('workspace_id', workspaceId)
      .maybeSingle();

    if (readResult.error && readResult.error.code !== 'PGRST116') throw readResult.error;

    const remotePayload = readResult.data?.payload || null;
    const mergedPayload = remotePayload ? mergeSyncPayloads(localPayload, remotePayload) : localPayload;

    const upsertResult = await supabaseClient.from('workspace_states').upsert({
      workspace_id: workspaceId,
      payload: mergedPayload,
      updated_at: nowIso()
    });

    if (upsertResult.error) throw upsertResult.error;

    applyImportedState(mergedPayload, true);
    state.sync.lastSyncedAt = nowIso();
    saveStateAndRender();
    syncStatus.textContent = t('settings.messages.syncSuccess');
  } catch (error) {
    syncStatus.textContent = `${t('settings.messages.syncError')}: ${error.message}`;
  }
}

function mergeSyncPayloads(localPayload, remotePayload) {
  const merged = {
    ...localPayload,
    reminders: mergeByUpdated(localPayload.reminders, remotePayload.reminders),
    learningProgress: mergeByUpdated(localPayload.learningProgress, remotePayload.learningProgress),
    subtaskState: {},
    appointments: [],
    documents: []
  };

  const allSubtaskIds = new Set([
    ...Object.keys(localPayload.subtaskState || {}),
    ...Object.keys(remotePayload.subtaskState || {})
  ]);

  allSubtaskIds.forEach((subtaskId) => {
    merged.subtaskState[subtaskId] = mergeSubtaskState(
      localPayload.subtaskState?.[subtaskId],
      remotePayload.subtaskState?.[subtaskId]
    );
  });

  merged.appointments = mergeEntityArrays(localPayload.appointments || [], remotePayload.appointments || []);
  merged.documents = mergeEntityArrays(localPayload.documents || [], remotePayload.documents || []);
  merged.settings = {
    ...remotePayload.settings,
    ...localPayload.settings,
    workspaceId: localPayload.settings?.workspaceId || remotePayload.settings?.workspaceId || 'default-workspace'
  };

  return merged;
}

function mergeEntityArrays(localItems, remoteItems) {
  const map = new Map();
  [...remoteItems, ...localItems].forEach((item) => {
    if (!item?.id) return;
    const current = map.get(item.id);
    if (!current || parseDate(item.updated_at) >= parseDate(current.updated_at)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
}

function mergeSubtaskState(localItem, remoteItem) {
  const local = localItem || defaultSubtaskState();
  const remote = remoteItem || defaultSubtaskState();
  const winner = parseDate(local.updated_at) >= parseDate(remote.updated_at) ? local : remote;
  const completedAt = maxIso(local.completedAt, remote.completedAt);
  const merged = {
    ...winner,
    reminderOffsets: uniqueSorted([...(local.reminderOffsets || []), ...(remote.reminderOffsets || [])])
  };

  if (completedAt) {
    merged.completedAt = completedAt;
    merged.done = local.done || remote.done;
  }

  merged.updated_at = maxIso(local.updated_at, remote.updated_at) || nowIso();
  return merged;
}

function mergeByUpdated(localItem, remoteItem) {
  if (!localItem) return remoteItem;
  if (!remoteItem) return localItem;
  return parseDate(localItem.updated_at) >= parseDate(remoteItem.updated_at) ? localItem : remoteItem;
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
  renderTasks();
  renderProgress();
  renderNextPending();
  renderTimeline();
  renderDocuments();
  renderLearning();
  renderReminderAlerts();
  renderSelectOptions();
  refreshBottomNavActiveState();
}

function renderTasks() {
  categoryList.innerHTML = '';

  CATEGORY_DEFINITIONS.forEach((category) => {
    const { done, total, percent } = computeCategoryProgress(category);
    const wrapper = document.createElement('article');
    wrapper.className = 'item';

    const subtasksHtml = category.subtasks.map((subtask) => {
      const itemState = ensureSubtaskState(subtask.id);
      return `
        <div class="subtask-grid item" data-subtask-id="${subtask.id}">
          <label>
            <input type="checkbox" data-subtask-toggle="${subtask.id}" ${itemState.done ? 'checked' : ''} />
            <strong>${t(subtask.titleKey)}</strong>
          </label>
          <p>${t(subtask.detailKey)}</p>
          <label>
            <span>${t('tasks.targetDate')}</span>
            <input type="date" data-subtask-date="${subtask.id}" value="${escapeAttribute(itemState.targetDate || '')}" />
          </label>
          <label>
            <span>${t('tasks.reminders')}</span>
            <input type="text" data-subtask-reminders="${subtask.id}" value="${escapeAttribute(formatReminderOffsets(itemState.reminderOffsets || []))}" placeholder="7d,1d,2h" />
          </label>
          <label>
            <span>${t('tasks.notes')}</span>
            <textarea data-subtask-notes="${subtask.id}">${escapeHtml(itemState.notes || '')}</textarea>
          </label>
        </div>
      `;
    }).join('');

    wrapper.innerHTML = `
      <div class="category-header">
        <div>
          <h3>${t(category.titleKey)}</h3>
          <p>${done}/${total} (${percent}%)</p>
        </div>
        <button type="button" data-category-toggle="${category.id}" aria-expanded="false">${t('tasks.openCategory')}</button>
      </div>
      <progress max="100" value="${percent}" aria-label="${escapeAttribute(t(category.titleKey))} ${percent}%"></progress>
      <div class="category-subtasks" id="subtasks-${category.id}" hidden>
        ${subtasksHtml}
      </div>
    `;

    wrapper.querySelector('[data-category-toggle]')?.addEventListener('click', (event) => {
      const section = wrapper.querySelector(`#subtasks-${category.id}`);
      if (!section) return;
      const hidden = section.hasAttribute('hidden');
      if (hidden) {
        section.removeAttribute('hidden');
        event.currentTarget.textContent = t('tasks.closeCategory');
        event.currentTarget.setAttribute('aria-expanded', 'true');
      } else {
        section.setAttribute('hidden', 'hidden');
        event.currentTarget.textContent = t('tasks.openCategory');
        event.currentTarget.setAttribute('aria-expanded', 'false');
      }
    });

    wrapper.querySelectorAll('[data-subtask-toggle]').forEach((input) => {
      input.addEventListener('change', (event) => {
        const subtaskId = event.target.getAttribute('data-subtask-toggle');
        const subtaskState = ensureSubtaskState(subtaskId);
        subtaskState.done = event.target.checked;
        if (event.target.checked) subtaskState.completedAt = nowIso();
        subtaskState.updated_at = nowIso();
        saveStateAndRender();
      });
    });

    wrapper.querySelectorAll('[data-subtask-date]').forEach((input) => {
      input.addEventListener('change', (event) => {
        const subtaskId = event.target.getAttribute('data-subtask-date');
        const subtaskState = ensureSubtaskState(subtaskId);
        subtaskState.targetDate = event.target.value || '';
        subtaskState.updated_at = nowIso();
        saveStateAndRender();
      });
    });

    wrapper.querySelectorAll('[data-subtask-reminders]').forEach((input) => {
      input.addEventListener('change', (event) => {
        const subtaskId = event.target.getAttribute('data-subtask-reminders');
        const subtaskState = ensureSubtaskState(subtaskId);
        subtaskState.reminderOffsets = parseReminderOffsets(event.target.value || '');
        subtaskState.updated_at = nowIso();
        saveStateAndRender();
      });
    });

    wrapper.querySelectorAll('[data-subtask-notes]').forEach((input) => {
      input.addEventListener('change', (event) => {
        const subtaskId = event.target.getAttribute('data-subtask-notes');
        const subtaskState = ensureSubtaskState(subtaskId);
        subtaskState.notes = event.target.value || '';
        subtaskState.updated_at = nowIso();
        saveStateAndRender();
      });
    });

    categoryList.appendChild(wrapper);
  });
}

function renderProgress() {
  const totals = getOverallProgress();
  overallProgress.innerHTML = `
    <h3>${t('dashboard.overallProgress')}</h3>
    <p>${totals.done}/${totals.total} (${totals.percent}%)</p>
    <progress max="100" value="${totals.percent}" aria-label="${totals.percent}%"></progress>
  `;
}

function renderNextPending() {
  const pending = CATEGORY_DEFINITIONS
    .flatMap((category) => category.subtasks.map((subtask) => ({
      category,
      subtask,
      state: ensureSubtaskState(subtask.id)
    })))
    .filter((item) => !item.state.done)
    .sort((a, b) => {
      if (a.state.targetDate && b.state.targetDate) return a.state.targetDate.localeCompare(b.state.targetDate);
      if (a.state.targetDate) return -1;
      if (b.state.targetDate) return 1;
      return 0;
    })
    .slice(0, 5);

  nextPendingList.innerHTML = '';
  if (!pending.length) {
    nextPendingList.innerHTML = `<li class="item empty">${t('common.empty')}</li>`;
    return;
  }

  pending.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <strong>${t(item.subtask.titleKey)}</strong>
      <p>${t(item.category.titleKey)}</p>
      <p>${item.state.targetDate ? item.state.targetDate : t('tasks.noDate')}</p>
    `;
    nextPendingList.appendChild(li);
  });
}

function renderTimeline() {
  timelineList.innerHTML = '';
  const events = getAllEvents().sort((a, b) => parseDate(a.datetime) - parseDate(b.datetime));

  if (!events.length) {
    timelineList.innerHTML = `<li class="item empty">${t('calendar.empty')}</li>`;
    return;
  }

  events.forEach((event) => {
    const li = document.createElement('li');
    li.className = 'item';
    const title = document.createElement('h3');
    title.textContent = event.title;
    li.appendChild(title);

    const date = document.createElement('p');
    date.textContent = new Date(event.datetime).toLocaleString();
    li.appendChild(date);

    const context = document.createElement('p');
    context.textContent = event.context;
    li.appendChild(context);

    const reminderText = document.createElement('p');
    reminderText.textContent = `${t('calendar.reminders')}: ${formatReminderOffsets(event.reminderOffsets)}`;
    li.appendChild(reminderText);

    const actions = document.createElement('div');
    actions.className = 'item-actions';

    if (event.phone) {
      const phone = document.createElement('a');
      phone.href = `tel:${event.phone}`;
      phone.textContent = t('calendar.call');
      actions.appendChild(phone);
    }

    if (event.mapsLink) {
      const map = document.createElement('a');
      map.href = event.mapsLink;
      map.target = '_blank';
      map.rel = 'noopener';
      map.textContent = t('calendar.map');
      actions.appendChild(map);
    }

    if (event.website) {
      const website = document.createElement('a');
      website.href = event.website;
      website.target = '_blank';
      website.rel = 'noopener';
      website.textContent = t('calendar.website');
      actions.appendChild(website);
    }

    const exportBtn = document.createElement('button');
    exportBtn.type = 'button';
    exportBtn.textContent = t('calendar.exportOne');
    exportBtn.addEventListener('click', () => exportSingleEventIcs(event.id));
    actions.appendChild(exportBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = t('common.delete');
    deleteBtn.addEventListener('click', () => deleteEvent(event));
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    timelineList.appendChild(li);
  });
}

function deleteEvent(event) {
  if (!confirm(t('common.confirmDelete'))) return;
  if (event.source === 'appointment') {
    state.appointments = state.appointments.filter((item) => item.id !== event.id);
  }
  if (event.source === 'subtask') {
    const subtaskState = ensureSubtaskState(event.id);
    subtaskState.targetDate = '';
    subtaskState.reminderOffsets = [];
    subtaskState.updated_at = nowIso();
  }
  saveStateAndRender();
}

function renderDocuments() {
  documentsList.innerHTML = '';
  const filterValue = documentsFilter.value || 'all';
  const filteredDocs = state.documents.filter((doc) => filterValue === 'all' || doc.linkedTaskId === filterValue);

  filteredDocs.forEach((documentItem) => {
    const expiryInfo = getExpiryInfo(documentItem.expiryDate);
    const linkedTitle = getSubtaskTitle(documentItem.linkedTaskId);
    const li = document.createElement('li');
    li.className = 'item';

    const title = document.createElement('h3');
    title.textContent = `${documentItem.name} (${documentItem.category})`;
    li.appendChild(title);

    const linkedTask = document.createElement('p');
    linkedTask.textContent = `${t('documents.linkedTask')}: ${linkedTitle}`;
    li.appendChild(linkedTask);

    const issueDate = document.createElement('p');
    issueDate.textContent = `${t('documents.issueDate')}: ${documentItem.issueDate || t('tasks.noDate')}`;
    li.appendChild(issueDate);

    const expiryDate = document.createElement('p');
    expiryDate.textContent = `${t('documents.expiryDate')}: ${documentItem.expiryDate || t('tasks.noDate')}`;
    li.appendChild(expiryDate);

    const fileName = document.createElement('p');
    fileName.textContent = `${t('documents.file')}: ${documentItem.fileName || t('documents.noFile')}`;
    li.appendChild(fileName);

    const expiryMessage = document.createElement('p');
    expiryMessage.textContent = expiryInfo.message;
    if (expiryInfo.isExpired || expiryInfo.daysLeft <= 30) expiryMessage.classList.add('danger');
    li.appendChild(expiryMessage);

    const actions = document.createElement('div');
    actions.className = 'item-actions';

    if (documentItem.fileUrl) {
      const fileLink = document.createElement('a');
      fileLink.href = documentItem.fileUrl;
      fileLink.target = '_blank';
      fileLink.rel = 'noopener';
      fileLink.textContent = t('documents.openFile');
      actions.appendChild(fileLink);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = t('common.delete');
    deleteBtn.addEventListener('click', () => {
      if (!confirm(t('common.confirmDelete'))) return;
      state.documents = state.documents.filter((item) => item.id !== documentItem.id);
      saveStateAndRender();
    });
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    documentsList.appendChild(li);
  });

  if (!filteredDocs.length) {
    documentsList.innerHTML = `<li class="item empty">${t('documents.empty')}</li>`;
  }

  renderDocumentDashboard();
}

function renderDocumentDashboard() {
  const metrics = {
    total: state.documents.length,
    expired: 0,
    expiring7: 0,
    expiring30: 0
  };

  state.documents.forEach((item) => {
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

function renderLearning() {
  const completed = state.learningProgress.completedLessons || 0;
  const total = state.learningProgress.totalLessons || 1;
  learningSummary.textContent = `${t('learning.progress')}: ${completed}/${total}`;
  learningForm.elements.completedLessons.value = String(completed);
  learningForm.elements.totalLessons.value = String(total);
}

function renderReminderAlerts() {
  reminderAlerts.innerHTML = '';
  if (!inAppAlerts.length) {
    reminderAlerts.innerHTML = `<li class="item empty">${t('dashboard.noAlerts')}</li>`;
    return;
  }

  inAppAlerts.forEach((alertItem) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<strong>${escapeHtml(alertItem.title)}</strong><p>${escapeHtml(alertItem.body)}</p>`;
    reminderAlerts.appendChild(li);
  });
}

function renderSelectOptions() {
  const allSubtasks = CATEGORY_DEFINITIONS.flatMap((category) => category.subtasks);

  linkedTaskSelect.innerHTML = `<option value="">${t('documents.unlinked')}</option>` + allSubtasks
    .map((subtask) => `<option value="${subtask.id}">${escapeHtml(t(subtask.titleKey))}</option>`)
    .join('');

  const currentFilter = documentsFilter.value || 'all';
  documentsFilter.innerHTML = `<option value="all">${t('documents.filterAll')}</option>` + allSubtasks
    .map((subtask) => `<option value="${subtask.id}">${escapeHtml(t(subtask.titleKey))}</option>`)
    .join('');
  documentsFilter.value = currentFilter;
}

function refreshBottomNavActiveState() {
  const sections = bottomNavButtons.map((button) => ({
    button,
    section: document.getElementById(button.dataset.target)
  })).filter((entry) => entry.section);

  const viewportMid = window.scrollY + window.innerHeight * 0.4;
  sections.forEach(({ button, section }) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    button.classList.toggle('active', viewportMid >= top && viewportMid <= bottom);
  });
}

function checkDueReminders() {
  const now = Date.now();
  const events = getAllEvents();
  const validReminderKeys = new Set();

  events.forEach((event) => {
    (event.reminderOffsets || []).forEach((offset) => {
      const triggerAt = new Date(event.datetime).getTime() - offset * 60 * 1000;
      const key = `${event.id}_${offset}_${event.datetime}`;
      validReminderKeys.add(key);
      const fired = state.reminders.fired[key];
      if (!fired && triggerAt <= now) {
        state.reminders.fired[key] = nowIso();
        notificationService.notify(t('dashboard.reminderTitle'), `${event.title} — ${new Date(event.datetime).toLocaleString()}`);
      }
    });
  });

  Object.keys(state.reminders.fired).forEach((key) => {
    if (!validReminderKeys.has(key)) delete state.reminders.fired[key];
  });

  saveState();
  renderReminderAlerts();
}

async function uploadDocumentFile(file, documentId) {
  if (!supabaseClient || !authSession) {
    return { provider: 'local', url: '', message: t('documents.messages.localOnly') };
  }

  try {
    const workspaceId = state.settings.workspaceId || 'default-workspace';
    const safeName = safeStorageName(file.name);
    const path = `${workspaceId}/${documentId}-${safeName}`;
    const result = await supabaseClient.storage.from('documents').upload(path, file, {
      upsert: true
    });

    if (result.error) throw result.error;

    const publicUrl = supabaseClient.storage.from('documents').getPublicUrl(path).data.publicUrl;
    return { provider: 'supabase', url: publicUrl, message: t('documents.messages.uploaded') };
  } catch {
    return { provider: 'local', url: '', message: t('documents.messages.uploadFailed') };
  }
}

function exportSingleEventIcs(eventId) {
  const event = getAllEvents().find((item) => item.id === eventId);
  if (!event) return;
  downloadIcs(buildIcs([event]), `${safeFileName(event.title)}.ics`);
}

function exportAllEventsIcs() {
  const events = getAllEvents();
  if (!events.length) return;
  downloadIcs(buildIcs(events), 'timeline-events.ics');
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
      `LOCATION:${escapeIcs(item.context || '')}`,
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

function exportBackup() {
  const payload = serializeStateForSync();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'italy-immigration-backup.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const content = await file.text();
    const parsed = JSON.parse(content);
    if (!parsed || (parsed.version && parsed.version !== 2)) {
      syncStatus.textContent = t('settings.messages.importInvalidVersion');
      return;
    }
    if (!confirm(t('settings.messages.importConfirm'))) return;
    applyImportedState(parsed, false);
    saveStateAndRender();
    syncStatus.textContent = t('settings.messages.importSuccess');
  } catch {
    syncStatus.textContent = t('settings.messages.importError');
  } finally {
    importBackupInput.value = '';
  }
}

function applyImportedState(payload, replaceFully) {
  const imported = sanitizePayload(payload);
  if (replaceFully) {
    state = imported;
  } else {
    state = mergeSyncPayloads(state, imported);
  }
}

function getAllEvents() {
  const appointmentEvents = state.appointments
    .filter((item) => item.datetime)
    .map((item) => ({
      id: item.id,
      source: 'appointment',
      title: item.title,
      datetime: item.datetime,
      context: `${item.office} — ${item.address}`,
      phone: item.phone,
      mapsLink: item.mapsLink,
      website: item.website,
      reminderOffsets: item.reminderOffsets || []
    }));

  const subtaskEvents = CATEGORY_DEFINITIONS
    .flatMap((category) => category.subtasks.map((subtask) => ({ category, subtask })))
    .map(({ category, subtask }) => {
      const itemState = ensureSubtaskState(subtask.id);
      if (!itemState.targetDate) return null;
      return {
        id: subtask.id,
        source: 'subtask',
        title: t(subtask.titleKey),
        datetime: toLocalDateAtNineAmWithOffset(itemState.targetDate),
        context: t(category.titleKey),
        phone: '',
        mapsLink: '',
        website: '',
        reminderOffsets: itemState.reminderOffsets || []
      };
    })
    .filter(Boolean);

  return [...appointmentEvents, ...subtaskEvents];
}

function computeCategoryProgress(category) {
  const done = category.subtasks.filter((subtask) => ensureSubtaskState(subtask.id).done).length;
  const total = category.subtasks.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return { done, total, percent };
}

function getOverallProgress() {
  const allSubtasks = CATEGORY_DEFINITIONS.flatMap((category) => category.subtasks);
  const done = allSubtasks.filter((subtask) => ensureSubtaskState(subtask.id).done).length;
  const total = allSubtasks.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

function ensureSubtaskState(subtaskId) {
  if (!state.subtaskState[subtaskId]) {
    state.subtaskState[subtaskId] = defaultSubtaskState();
  }
  return state.subtaskState[subtaskId];
}

function defaultSubtaskState() {
  return {
    done: false,
    targetDate: '',
    notes: '',
    reminderOffsets: REMINDER_PRESETS.map(parseSingleReminderOffset).filter(Boolean),
    completedAt: '',
    updated_at: nowIso()
  };
}

function loadAppState() {
  const base = {
    version: 2,
    subtaskState: {},
    appointments: [],
    documents: [],
    reminders: { fired: {}, notificationPermission: 'default', updated_at: nowIso() },
    learningProgress: { completedLessons: 0, totalLessons: 20, updated_at: nowIso() },
    settings: { workspaceId: 'default-workspace' },
    sync: { lastSyncedAt: '' }
  };

  const stored = loadJSON(STORAGE_KEYS.state, null);
  const merged = sanitizePayload(stored || base);

  migrateLegacyChecklist(merged);

  CATEGORY_DEFINITIONS.flatMap((category) => category.subtasks).forEach((subtask) => {
    if (!merged.subtaskState[subtask.id]) {
      merged.subtaskState[subtask.id] = defaultSubtaskState();
    }
  });

  return merged;
}

function migrateLegacyChecklist(targetState) {
  const legacy = loadJSON(STORAGE_KEYS.legacyChecklist, null);
  if (!legacy) return;

  Object.entries(legacy).forEach(([legacyId, done]) => {
    const subtaskId = LEGACY_TASK_MIGRATION[legacyId];
    if (!subtaskId) return;
    const subtaskState = targetState.subtaskState[subtaskId] || defaultSubtaskState();
    if (done) {
      subtaskState.done = true;
      subtaskState.completedAt = subtaskState.completedAt || nowIso();
    }
    targetState.subtaskState[subtaskId] = subtaskState;
  });
}

function sanitizePayload(payload) {
  const safe = payload || {};
  return {
    version: 2,
    subtaskState: safe.subtaskState && typeof safe.subtaskState === 'object' ? safe.subtaskState : {},
    appointments: Array.isArray(safe.appointments) ? safe.appointments : [],
    documents: Array.isArray(safe.documents) ? safe.documents : [],
    reminders: safe.reminders && typeof safe.reminders === 'object' ? safe.reminders : { fired: {}, notificationPermission: 'default', updated_at: nowIso() },
    learningProgress: safe.learningProgress && typeof safe.learningProgress === 'object'
      ? safe.learningProgress
      : { completedLessons: 0, totalLessons: 20, updated_at: nowIso() },
    settings: safe.settings && typeof safe.settings === 'object' ? safe.settings : { workspaceId: 'default-workspace' },
    sync: safe.sync && typeof safe.sync === 'object' ? safe.sync : { lastSyncedAt: '' }
  };
}

function saveState() {
  saveJSON(STORAGE_KEYS.state, getLocallyPersistedState(state));
}

function saveStateAndRender() {
  saveState();
  renderAll();
}

function serializeStateForSync() {
  return sanitizePayload(state);
}

function getLocallyPersistedState(sourceState) {
  const payload = sanitizePayload(sourceState);
  return {
    ...payload,
    appointments: [],
    documents: []
  };
}

function getSubtaskTitle(subtaskId) {
  const allSubtasks = CATEGORY_DEFINITIONS.flatMap((category) => category.subtasks);
  const subtask = allSubtasks.find((item) => item.id === subtaskId);
  return subtask ? t(subtask.titleKey) : t('documents.unlinked');
}

function parseReminderOffsets(value) {
  if (!value) return [];
  return uniqueSorted(String(value)
    .split(',')
    .map((raw) => parseSingleReminderOffset(raw.trim()))
    .filter((item) => item > 0));
}

function parseSingleReminderOffset(token) {
  if (!token) return 0;
  if (/^\d+$/.test(token)) return Number.parseInt(token, 10);
  const match = token.match(/^(\d+)([mhd])$/i);
  if (!match) return 0;
  const value = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit === 'm') return value;
  if (unit === 'h') return value * 60;
  if (unit === 'd') return value * 60 * 24;
  return 0;
}

function formatReminderOffsets(offsets) {
  if (!offsets || !offsets.length) return t('appointments.none');
  return offsets.map((offset) => {
    if (offset % (60 * 24) === 0) return `${offset / (60 * 24)}d`;
    if (offset % 60 === 0) return `${offset / 60}h`;
    return `${offset}m`;
  }).join(', ');
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

function nowIso() {
  return new Date().toISOString();
}

function toLocalDateAtNineAmWithOffset(dateOnly) {
  const localDate = new Date(`${dateOnly}T09:00:00`);
  const timezoneOffsetMinutes = -localDate.getTimezoneOffset();
  const sign = timezoneOffsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(timezoneOffsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const minutes = String(abs % 60).padStart(2, '0');
  return `${dateOnly}T09:00:00${sign}${hours}:${minutes}`;
}

function parseDate(value) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function maxIso(a, b) {
  if (!a) return b || '';
  if (!b) return a;
  return parseDate(a) >= parseDate(b) ? a : b;
}

function uniqueSorted(values) {
  return [...new Set(values.filter((item) => Number.isFinite(item) && item > 0))].sort((a, b) => a - b);
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
  return String(text || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function safeStorageName(text) {
  return String(text || 'file')
    .replace(/[\\/]/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
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
