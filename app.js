const STORAGE_KEYS = {
  language: 'iic_language',
  state: 'iic_state_v3',
  legacyStateV2: 'iic_state_v2',
  legacyChecklist: 'iic_checklist_v1'
};

const APP_VERSION = window.__APP_VERSION__ || 'dev';
const BUILD_TIMESTAMP = window.__BUILD_TIMESTAMP__ || '';
const ASSET_VERSION = window.__ASSET_VERSION__ || APP_VERSION;

const REMINDER_PRESETS = ['7d', '1d', '2h'];

const CATEGORY_DEFINITIONS = [
  {
    id: 'sec-codice-fiscale',
    badge: '🟩',
    colorClass: 'section-green',
    titleKey: 'tasks.sections.codiceFiscale.title',
    subtitleKey: 'tasks.sections.codiceFiscale.subtitle',
    subtasks: [
      {
        id: 'task-cf-appointment-booked',
        titleKey: 'tasks.items.cfAppointmentBooked.title',
        detailKey: 'tasks.items.cfAppointmentBooked.detail',
        requiredDocs: ['appointment-confirmation', 'aa48-form']
      },
      {
        id: 'task-cf-aa48-filled',
        titleKey: 'tasks.items.cfAa48Filled.title',
        detailKey: 'tasks.items.cfAa48Filled.detail',
        requiredDocs: ['aa48-form']
      },
      {
        id: 'task-cf-issued',
        titleKey: 'tasks.items.cfIssued.title',
        detailKey: 'tasks.items.cfIssued.detail',
        requiredDocs: ['codice-fiscale-pdf']
      }
    ]
  },
  {
    id: 'sec-your-residency',
    badge: '🟦',
    colorClass: 'section-blue',
    titleKey: 'tasks.sections.yourResidency.title',
    subtitleKey: 'tasks.sections.yourResidency.subtitle',
    subtasks: [
      {
        id: 'task-your-residency-registered',
        titleKey: 'tasks.items.yourResidencyRegistered.title',
        detailKey: 'tasks.items.yourResidencyRegistered.detail',
        requiredDocs: ['residency-request']
      },
      {
        id: 'task-your-police-visit-completed',
        titleKey: 'tasks.items.yourPoliceVisitCompleted.title',
        detailKey: 'tasks.items.yourPoliceVisitCompleted.detail',
        requiredDocs: ['police-visit-note']
      },
      {
        id: 'task-your-residency-confirmed',
        titleKey: 'tasks.items.yourResidencyConfirmed.title',
        detailKey: 'tasks.items.yourResidencyConfirmed.detail',
        requiredDocs: ['residency-certificate']
      }
    ]
  },
  {
    id: 'sec-her-residency',
    badge: '🟨',
    colorClass: 'section-yellow',
    titleKey: 'tasks.sections.herResidency.title',
    subtitleKey: 'tasks.sections.herResidency.subtitle',
    subtasks: [
      {
        id: 'task-her-cf-obtained',
        titleKey: 'tasks.items.herCfObtained.title',
        detailKey: 'tasks.items.herCfObtained.detail',
        requiredDocs: ['codice-fiscale-pdf']
      },
      {
        id: 'task-her-residency-submitted',
        titleKey: 'tasks.items.herResidencySubmitted.title',
        detailKey: 'tasks.items.herResidencySubmitted.detail',
        requiredDocs: ['residency-request', 'rental-contract']
      },
      {
        id: 'task-her-police-visit-completed',
        titleKey: 'tasks.items.herPoliceVisitCompleted.title',
        detailKey: 'tasks.items.herPoliceVisitCompleted.detail',
        requiredDocs: ['police-visit-note']
      },
      {
        id: 'task-her-residency-confirmed',
        titleKey: 'tasks.items.herResidencyConfirmed.title',
        detailKey: 'tasks.items.herResidencyConfirmed.detail',
        requiredDocs: ['residency-certificate']
      }
    ]
  },
  {
    id: 'sec-marriage-registration',
    badge: '🟥',
    colorClass: 'section-red',
    titleKey: 'tasks.sections.marriageRegistration.title',
    subtitleKey: 'tasks.sections.marriageRegistration.subtitle',
    subtasks: [
      {
        id: 'task-marriage-michigan-certificate-received',
        titleKey: 'tasks.items.marriageMichiganCertificateReceived.title',
        detailKey: 'tasks.items.marriageMichiganCertificateReceived.detail',
        requiredDocs: ['us-marriage-certificate']
      },
      {
        id: 'task-marriage-translation-ready',
        titleKey: 'tasks.items.marriageTranslationReady.title',
        detailKey: 'tasks.items.marriageTranslationReady.detail',
        requiredDocs: ['italian-translation-notarized']
      },
      {
        id: 'task-marriage-apostille-obtained',
        titleKey: 'tasks.items.marriageApostilleObtained.title',
        detailKey: 'tasks.items.marriageApostilleObtained.detail',
        requiredDocs: ['apostille']
      },
      {
        id: 'task-marriage-submitted-comune',
        titleKey: 'tasks.items.marriageSubmittedComune.title',
        detailKey: 'tasks.items.marriageSubmittedComune.detail',
        requiredDocs: ['submission-receipt']
      },
      {
        id: 'task-marriage-apostille-delivered-comune',
        titleKey: 'tasks.items.marriageApostilleDeliveredComune.title',
        detailKey: 'tasks.items.marriageApostilleDeliveredComune.detail',
        requiredDocs: ['apostille-delivery-proof']
      },
      {
        id: 'task-marriage-registered-italy',
        titleKey: 'tasks.items.marriageRegisteredItaly.title',
        detailKey: 'tasks.items.marriageRegisteredItaly.detail',
        requiredDocs: ['registration-confirmation']
      },
      {
        id: 'task-marriage-extract-issued',
        titleKey: 'tasks.items.marriageExtractIssued.title',
        detailKey: 'tasks.items.marriageExtractIssued.detail',
        requiredDocs: ['estratto-matrimonio']
      }
    ]
  },
  {
    id: 'sec-permesso',
    badge: '🟩',
    colorClass: 'section-green',
    titleKey: 'tasks.sections.permesso.title',
    subtitleKey: 'tasks.sections.permesso.subtitle',
    subtasks: [
      {
        id: 'task-permesso-application-submitted',
        titleKey: 'tasks.items.permessoApplicationSubmitted.title',
        detailKey: 'tasks.items.permessoApplicationSubmitted.detail',
        requiredDocs: ['permesso-receipt']
      },
      {
        id: 'task-permesso-fingerprints-completed',
        titleKey: 'tasks.items.permessoFingerprintsCompleted.title',
        detailKey: 'tasks.items.permessoFingerprintsCompleted.detail',
        requiredDocs: ['fingerprint-appointment-proof']
      },
      {
        id: 'task-permesso-apostille-delivered-questura',
        titleKey: 'tasks.items.permessoApostilleDeliveredQuestura.title',
        detailKey: 'tasks.items.permessoApostilleDeliveredQuestura.detail',
        requiredDocs: ['apostille-delivery-proof']
      },
      {
        id: 'task-permesso-approved',
        titleKey: 'tasks.items.permessoApproved.title',
        detailKey: 'tasks.items.permessoApproved.detail',
        requiredDocs: ['permesso-approval']
      },
      {
        id: 'task-permesso-card-received',
        titleKey: 'tasks.items.permessoCardReceived.title',
        detailKey: 'tasks.items.permessoCardReceived.detail',
        requiredDocs: ['permesso-card']
      }
    ]
  },
  {
    id: 'sec-after-permesso',
    badge: '🟦',
    colorClass: 'section-blue',
    titleKey: 'tasks.sections.afterPermesso.title',
    subtitleKey: 'tasks.sections.afterPermesso.subtitle',
    subtasks: [
      {
        id: 'task-after-tessera-issued',
        titleKey: 'tasks.items.afterTesseraIssued.title',
        detailKey: 'tasks.items.afterTesseraIssued.detail',
        requiredDocs: ['tessera-sanitaria']
      },
      {
        id: 'task-after-family-doctor-assigned',
        titleKey: 'tasks.items.afterFamilyDoctorAssigned.title',
        detailKey: 'tasks.items.afterFamilyDoctorAssigned.detail',
        requiredDocs: ['doctor-assignment-proof']
      },
      {
        id: 'task-after-family-status-updated',
        titleKey: 'tasks.items.afterFamilyStatusUpdated.title',
        detailKey: 'tasks.items.afterFamilyStatusUpdated.detail',
        requiredDocs: ['family-status-update']
      },
      {
        id: 'task-after-tax-benefits-updated',
        titleKey: 'tasks.items.afterTaxBenefitsUpdated.title',
        detailKey: 'tasks.items.afterTaxBenefitsUpdated.detail',
        requiredDocs: ['tax-benefit-update']
      }
    ]
  },
  {
    id: 'sec-apostille-logistics',
    badge: '🟩',
    colorClass: 'section-green',
    titleKey: 'tasks.sections.apostilleLogistics.title',
    subtitleKey: 'tasks.sections.apostilleLogistics.subtitle',
    subtasks: [
      {
        id: 'task-logistics-certificate-arrives-colorado',
        titleKey: 'tasks.items.logisticsCertificateArrivesColorado.title',
        detailKey: 'tasks.items.logisticsCertificateArrivesColorado.detail',
        requiredDocs: ['shipping-tracking']
      },
      {
        id: 'task-logistics-friends-send-lansing',
        titleKey: 'tasks.items.logisticsFriendsSendLansing.title',
        detailKey: 'tasks.items.logisticsFriendsSendLansing.detail',
        requiredDocs: ['shipping-tracking']
      },
      {
        id: 'task-logistics-family-brings-great-seal',
        titleKey: 'tasks.items.logisticsFamilyBringsGreatSeal.title',
        detailKey: 'tasks.items.logisticsFamilyBringsGreatSeal.detail',
        requiredDocs: ['office-receipt']
      },
      {
        id: 'task-logistics-apostille-issued-same-day',
        titleKey: 'tasks.items.logisticsApostilleIssuedSameDay.title',
        detailKey: 'tasks.items.logisticsApostilleIssuedSameDay.detail',
        requiredDocs: ['apostille']
      },
      {
        id: 'task-logistics-apostille-shipped-italy',
        titleKey: 'tasks.items.logisticsApostilleShippedItaly.title',
        detailKey: 'tasks.items.logisticsApostilleShippedItaly.detail',
        requiredDocs: ['shipping-tracking']
      },
      {
        id: 'task-logistics-apostille-received-italy',
        titleKey: 'tasks.items.logisticsApostilleReceivedItaly.title',
        detailKey: 'tasks.items.logisticsApostilleReceivedItaly.detail',
        requiredDocs: ['apostille', 'delivery-proof']
      }
    ]
  },
  {
    id: 'sec-legal-stay',
    badge: '🟦',
    colorClass: 'section-blue',
    titleKey: 'tasks.sections.legalStay.title',
    subtitleKey: 'tasks.sections.legalStay.subtitle',
    subtasks: [
      {
        id: 'task-legal-entry-90-day',
        titleKey: 'tasks.items.legalEntry90Day.title',
        detailKey: 'tasks.items.legalEntry90Day.detail',
        requiredDocs: ['passport-stamp']
      },
      {
        id: 'task-legal-permesso-application-extends-stay',
        titleKey: 'tasks.items.legalPermessoApplicationExtendsStay.title',
        detailKey: 'tasks.items.legalPermessoApplicationExtendsStay.detail',
        requiredDocs: ['permesso-receipt']
      }
    ]
  }
];

const USEFUL_LINKS = [
  {
    id: 'agenzia-entrate',
    titleKey: 'links.items.agenziaEntrate.title',
    subtitleKey: 'links.items.agenziaEntrate.subtitle',
    descriptionKey: 'links.items.agenziaEntrate.description',
    url: 'https://www.agenziaentrate.gov.it/portale/'
  },
  {
    id: 'comune-eppan',
    titleKey: 'links.items.comuneEppan.title',
    subtitleKey: 'links.items.comuneEppan.subtitle',
    descriptionKey: 'links.items.comuneEppan.description',
    url: 'https://www.eppan.com/'
  },
  {
    id: 'questura-bolzano',
    titleKey: 'links.items.questuraBolzano.title',
    subtitleKey: 'links.items.questuraBolzano.subtitle',
    descriptionKey: 'links.items.questuraBolzano.description',
    url: 'https://questure.poliziadistato.it/it/Bolzano/'
  },
  {
    id: 'michigan-great-seal',
    titleKey: 'links.items.michiganGreatSeal.title',
    subtitleKey: 'links.items.michiganGreatSeal.subtitle',
    descriptionKey: 'links.items.michiganGreatSeal.description',
    url: 'https://www.michigan.gov/sos/all-services/notary-application-and-instructions/apostille-certificates'
  },
  {
    id: 'michigan-vital-records',
    titleKey: 'links.items.michiganVitalRecords.title',
    subtitleKey: 'links.items.michiganVitalRecords.subtitle',
    descriptionKey: 'links.items.michiganVitalRecords.description',
    url: 'https://www.michigan.gov/mdhhs/doing-business/vitalrecords'
  }
];

const LEGACY_TASK_MIGRATION = {
  'register-address': 'task-your-residency-registered',
  'book-residence-permit': 'task-permesso-application-submitted',
  'sub-address-docs': 'task-your-residency-registered',
  'sub-address-appointment': 'task-your-residency-registered',
  'sub-address-confirmation': 'task-your-residency-confirmed',
  'sub-permesso-kit': 'task-permesso-application-submitted',
  'sub-permesso-post': 'task-permesso-application-submitted',
  'sub-permesso-questura': 'task-permesso-fingerprints-completed',
  'sub-marriage-certificates': 'task-marriage-michigan-certificate-received',
  'sub-marriage-appointment': 'task-marriage-submitted-comune',
  'sub-marriage-transcript': 'task-marriage-registered-italy'
};

const B2_QUESTION_SETS = [
  {
    id: 'reading',
    durationMinutes: 20,
    titleKey: 'learning.sections.reading',
    questions: [
      {
        id: 'reading-1',
        type: 'multiple-choice',
        promptKey: 'learning.questions.reading1.prompt',
        options: ['learning.questions.reading1.a', 'learning.questions.reading1.b', 'learning.questions.reading1.c'],
        answerIndex: 1
      },
      {
        id: 'reading-2',
        type: 'multiple-choice',
        promptKey: 'learning.questions.reading2.prompt',
        options: ['learning.questions.reading2.a', 'learning.questions.reading2.b', 'learning.questions.reading2.c'],
        answerIndex: 2
      }
    ]
  },
  {
    id: 'grammar',
    durationMinutes: 15,
    titleKey: 'learning.sections.grammar',
    questions: [
      {
        id: 'grammar-1',
        type: 'multiple-choice',
        promptKey: 'learning.questions.grammar1.prompt',
        options: ['learning.questions.grammar1.a', 'learning.questions.grammar1.b', 'learning.questions.grammar1.c'],
        answerIndex: 0
      },
      {
        id: 'grammar-2',
        type: 'multiple-choice',
        promptKey: 'learning.questions.grammar2.prompt',
        options: ['learning.questions.grammar2.a', 'learning.questions.grammar2.b', 'learning.questions.grammar2.c'],
        answerIndex: 1
      }
    ]
  },
  {
    id: 'listening',
    durationMinutes: 10,
    titleKey: 'learning.sections.listening',
    questions: [
      {
        id: 'listening-1',
        type: 'multiple-choice',
        promptKey: 'learning.questions.listening1.prompt',
        options: ['learning.questions.listening1.a', 'learning.questions.listening1.b', 'learning.questions.listening1.c'],
        answerIndex: 2
      },
      {
        id: 'listening-2',
        type: 'multiple-choice',
        promptKey: 'learning.questions.listening2.prompt',
        options: ['learning.questions.listening2.a', 'learning.questions.listening2.b', 'learning.questions.listening2.c'],
        answerIndex: 0
      }
    ]
  }
];

const DEFAULT_DURATION_BY_MODE = {
  full: 45,
  reading: 20,
  grammar: 15,
  listening: 10
};

const DOC_TYPE_LABELS = {
  other: 'documents.typeOther',
  'appointment-confirmation': 'documents.types.appointmentConfirmation',
  'aa48-form': 'documents.types.aa48Form',
  'codice-fiscale-pdf': 'documents.types.codiceFiscalePdf',
  'residency-request': 'documents.types.residencyRequest',
  'police-visit-note': 'documents.types.policeVisitNote',
  'residency-certificate': 'documents.types.residencyCertificate',
  'rental-contract': 'documents.types.rentalContract',
  'us-marriage-certificate': 'documents.types.usMarriageCertificate',
  'italian-translation-notarized': 'documents.types.italianTranslationNotarized',
  apostille: 'documents.types.apostille',
  'submission-receipt': 'documents.types.submissionReceipt',
  'apostille-delivery-proof': 'documents.types.apostilleDeliveryProof',
  'registration-confirmation': 'documents.types.registrationConfirmation',
  'estratto-matrimonio': 'documents.types.estrattoMatrimonio',
  'permesso-receipt': 'documents.types.permessoReceipt',
  'fingerprint-appointment-proof': 'documents.types.fingerprintAppointmentProof',
  'permesso-approval': 'documents.types.permessoApproval',
  'permesso-card': 'documents.types.permessoCard',
  'tessera-sanitaria': 'documents.types.tesseraSanitaria',
  'doctor-assignment-proof': 'documents.types.doctorAssignmentProof',
  'family-status-update': 'documents.types.familyStatusUpdate',
  'tax-benefit-update': 'documents.types.taxBenefitUpdate',
  'shipping-tracking': 'documents.types.shippingTracking',
  'office-receipt': 'documents.types.officeReceipt',
  'delivery-proof': 'documents.types.deliveryProof',
  'passport-stamp': 'documents.types.passportStamp'
};

let translations = {};
let state = loadAppState();
let deferredInstallPrompt;
let supabaseClient = null;
let authSession = null;
let inAppAlerts = [];
let learningTimer = null;
let reminderTimer = null;
let swRegistration = null;
let swDiagnostics = null;
let updateReady = false;
let reloadOnControllerChange = false;

const languageSelect = document.getElementById('language-select');
const installBtn = document.getElementById('install-btn');
const updateBanner = document.getElementById('update-banner');
const updateRefreshBtn = document.getElementById('update-refresh-btn');
const categoryList = document.getElementById('category-list');
const nextPendingList = document.getElementById('next-pending-list');
const overallProgress = document.getElementById('overall-progress');
const reminderAlerts = document.getElementById('reminder-alerts');
const usefulLinksList = document.getElementById('useful-links-list');
const timelineList = document.getElementById('timeline-list');
const exportAllEventsBtn = document.getElementById('export-all-events');
const documentsList = document.getElementById('documents-list');
const documentStatus = document.getElementById('document-status');
const documentsSectionFilter = document.getElementById('documents-section-filter');
const documentsTaskFilter = document.getElementById('documents-task-filter');
const documentsTypeFilter = document.getElementById('documents-type-filter');
const documentsMissing = document.getElementById('documents-missing');
const learningMode = document.getElementById('learning-mode');
const learningStartBtn = document.getElementById('learning-start');
const learningSubmitBtn = document.getElementById('learning-submit');
const learningTimerEl = document.getElementById('learning-timer');
const learningTestArea = document.getElementById('learning-test-area');
const learningSummary = document.getElementById('learning-summary');
const learningHistory = document.getElementById('learning-history');
const syncForm = document.getElementById('sync-form');
const authSignInBtn = document.getElementById('auth-signin');
const authSignUpBtn = document.getElementById('auth-signup');
const authSignOutBtn = document.getElementById('auth-signout');
const syncNowBtn = document.getElementById('sync-now');
const requestNotificationBtn = document.getElementById('request-notification');
const exportBackupBtn = document.getElementById('export-backup');
const importBackupInput = document.getElementById('import-backup-file');
const syncStatus = document.getElementById('sync-status');
const appVersionInfo = document.getElementById('app-version-info');
const swVersionInfo = document.getElementById('sw-version-info');
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
    inAppAlerts = inAppAlerts.slice(0, 12);
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

  categoryList.addEventListener('click', onCategoryClick);
  categoryList.addEventListener('change', onCategoryChange);
  categoryList.addEventListener('submit', onCategorySubmit);
  categoryList.addEventListener('input', onCategoryInput);

  documentsSectionFilter.addEventListener('change', () => {
    renderDocumentsHub();
  });
  documentsTaskFilter.addEventListener('change', () => {
    renderDocumentsHub();
  });
  documentsTypeFilter.addEventListener('change', () => {
    renderDocumentsHub();
  });

  learningMode.addEventListener('change', renderLearning);
  learningStartBtn.addEventListener('click', startB2MockTest);
  learningSubmitBtn.addEventListener('click', () => submitB2MockTest('manual'));
  learningTestArea.addEventListener('change', onLearningAnswerChange);

  exportAllEventsBtn.addEventListener('click', exportAllEventsIcs);

  authSignInBtn.addEventListener('click', () => authWithSupabase('signin'));
  authSignUpBtn.addEventListener('click', () => authWithSupabase('signup'));
  authSignOutBtn.addEventListener('click', () => authWithSupabase('signout'));
  syncNowBtn.addEventListener('click', syncNow);

  requestNotificationBtn.addEventListener('click', async () => {
    const permission = await notificationService.requestPermission();
    state.reminders.notificationPermission = permission;
    state.reminders.updated_at = nowIso();
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
  updateRefreshBtn?.addEventListener('click', applyServiceWorkerUpdate);

  bottomNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.addEventListener('scroll', refreshBottomNavActiveState, { passive: true });

  installPwaWiring();
  await initSupabase();
  if (reminderTimer) clearInterval(reminderTimer);
  if (learningTimer) clearInterval(learningTimer);
  reminderTimer = setInterval(checkDueReminders, 60 * 1000);
  learningTimer = setInterval(tickLearningTimer, 1000);
  checkDueReminders();
  renderAll();
}

function installPwaWiring() {
  if ('serviceWorker' in navigator) {
    registerServiceWorker().catch(() => {
      renderVersionDiagnostics();
    });
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

  window.addEventListener('focus', () => {
    swRegistration?.update().catch(() => {});
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      swRegistration?.update().catch(() => {});
    }
  });
}

async function registerServiceWorker() {
  const registration = await navigator.serviceWorker.register(versionedAssetUrl('./service-worker.js'));
  swRegistration = registration;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!reloadOnControllerChange) return;
    reloadOnControllerChange = false;
    window.location.reload();
  });

  monitorServiceWorker(registration);
  await refreshServiceWorkerDiagnostics(registration);

  if (registration.waiting && navigator.serviceWorker.controller) {
    updateReady = true;
    renderUpdateBanner();
  }

  navigator.serviceWorker.ready
    .then(async (readyRegistration) => {
      swRegistration = readyRegistration;
      await refreshServiceWorkerDiagnostics(readyRegistration);
    })
    .catch(() => {});
}

function monitorServiceWorker(registration) {
  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;
    if (!worker) return;

    worker.addEventListener('statechange', async () => {
      await refreshServiceWorkerDiagnostics(registration);

      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        updateReady = true;
        renderUpdateBanner();
      }
    });
  });
}

async function refreshServiceWorkerDiagnostics(registration) {
  const worker = registration.waiting || registration.active || registration.installing;
  if (!worker) {
    swDiagnostics = null;
    renderVersionDiagnostics();
    return;
  }

  const metadata = await requestServiceWorkerMetadata(worker);
  swDiagnostics = {
    state: worker.state || '',
    version: metadata?.version || '',
    buildTimestamp: metadata?.buildTimestamp || '',
    isWaiting: Boolean(registration.waiting),
    isControllingPage: Boolean(navigator.serviceWorker.controller)
  };
  renderVersionDiagnostics();
}

function requestServiceWorkerMetadata(worker) {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeoutId = window.setTimeout(() => resolve(null), 1500);

    channel.port1.onmessage = (event) => {
      window.clearTimeout(timeoutId);
      resolve(event.data || null);
    };

    try {
      worker.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
    } catch {
      window.clearTimeout(timeoutId);
      resolve(null);
    }
  });
}

function renderUpdateBanner() {
  if (!updateBanner) return;
  updateBanner.hidden = !updateReady;
}

function applyServiceWorkerUpdate() {
  updateReady = false;
  renderUpdateBanner();

  if (swRegistration?.waiting) {
    reloadOnControllerChange = true;
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    return;
  }

  window.location.reload();
}

function renderVersionDiagnostics() {
  if (appVersionInfo) {
    appVersionInfo.textContent = `${t('settings.appVersionLabel')}: ${APP_VERSION} · ${t('settings.buildTimestampLabel')}: ${formatDisplayTimestamp(BUILD_TIMESTAMP)}`;
  }

  if (!swVersionInfo) return;

  if (!('serviceWorker' in navigator)) {
    swVersionInfo.textContent = `${t('settings.serviceWorkerVersionLabel')}: ${t('settings.serviceWorkerUnsupported')}`;
    return;
  }

  if (!swDiagnostics) {
    swVersionInfo.textContent = `${t('settings.serviceWorkerVersionLabel')}: ${t('settings.serviceWorkerUnavailable')}`;
    return;
  }

  const parts = [
    `${t('settings.serviceWorkerVersionLabel')}: ${swDiagnostics.version || t('settings.serviceWorkerUnavailable')}`,
    `${t('settings.serviceWorkerStatusLabel')}: ${getServiceWorkerStatusLabel(swDiagnostics)}`,
    `${t('settings.buildTimestampLabel')}: ${formatDisplayTimestamp(swDiagnostics.buildTimestamp || BUILD_TIMESTAMP)}`
  ];
  swVersionInfo.textContent = parts.join(' · ');
}

function getServiceWorkerStatusLabel(diagnostics) {
  if (diagnostics.isWaiting) return t('settings.serviceWorkerWaiting');
  if (diagnostics.state === 'installing') return t('settings.serviceWorkerInstalling');
  if (diagnostics.state === 'activated' || diagnostics.isControllingPage) return t('settings.serviceWorkerActive');
  return diagnostics.state || t('settings.serviceWorkerUnavailable');
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
    } else if (mode === 'signup') {
      const result = await supabaseClient.auth.signUp({ email, password });
      if (result.error) throw result.error;
      authSession = result.data.session || null;
      syncStatus.textContent = t('settings.messages.signUpCheckEmail');
    } else if (mode === 'signout') {
      const result = await supabaseClient.auth.signOut();
      if (result.error) throw result.error;
      authSession = null;
      syncStatus.textContent = t('settings.messages.signedOut');
    }
  } catch (error) {
    syncStatus.textContent = `${t('settings.messages.authError')}: ${error?.message || ''}`;
  }
}

async function syncNow() {
  if (!supabaseClient || !authSession) {
    syncStatus.textContent = t('settings.messages.syncNeedsAuth');
    return;
  }

  const formData = new FormData(syncForm);
  state.settings.workspaceId = (formData.get('workspaceId') || '').toString().trim() || state.settings.workspaceId || 'default-workspace';

  const workspaceId = state.settings.workspaceId;
  try {
    const remote = await supabaseClient
      .from('workspace_states')
      .select('payload,updated_at')
      .eq('workspace_id', workspaceId)
      .maybeSingle();

    if (remote.error && remote.error.code !== 'PGRST116') throw remote.error;

    const localPayload = serializeStateForSync();
    const remotePayload = sanitizePayload(remote.data?.payload || null);
    const merged = mergeSyncPayloads(localPayload, remotePayload);

    const writeResult = await supabaseClient
      .from('workspace_states')
      .upsert({
        workspace_id: workspaceId,
        payload: merged,
        updated_at: nowIso()
      }, { onConflict: 'workspace_id' });

    if (writeResult.error) throw writeResult.error;

    state = sanitizePayload(merged);
    state.sync.lastSyncedAt = nowIso();
    saveStateAndRender();
    syncStatus.textContent = t('settings.messages.syncSuccess');
  } catch (error) {
    syncStatus.textContent = `${t('settings.messages.syncError')}: ${error?.message || ''}`;
  }
}

function mergeSyncPayloads(localPayload, remotePayload) {
  const local = sanitizePayload(localPayload);
  const remote = sanitizePayload(remotePayload);

  const merged = {
    version: 3,
    subtaskState: { ...local.subtaskState },
    documents: mergeEntityArrays(local.documents, remote.documents),
    reminders: mergeByUpdated(local.reminders, remote.reminders),
    learning: mergeByUpdated(local.learning, remote.learning),
    settings: mergeByUpdated(local.settings, remote.settings),
    sync: mergeByUpdated(local.sync, remote.sync),
    updated_at: nowIso()
  };

  Object.entries(remote.subtaskState || {}).forEach(([taskId, remoteTaskState]) => {
    merged.subtaskState[taskId] = mergeSubtaskState(local.subtaskState[taskId], remoteTaskState);
  });

  CATEGORY_DEFINITIONS.flatMap((section) => section.subtasks).forEach((task) => {
    if (!merged.subtaskState[task.id]) merged.subtaskState[task.id] = defaultSubtaskState();
  });

  merged.updated_at = maxIso(local.updated_at, remote.updated_at) || nowIso();
  return merged;
}

function mergeSubtaskState(localItem, remoteItem) {
  if (!localItem) return remoteItem || defaultSubtaskState();
  if (!remoteItem) return localItem;

  const merged = {
    done: localItem.done || remoteItem.done,
    targetDate: parseDate(localItem.updated_at) >= parseDate(remoteItem.updated_at) ? localItem.targetDate : remoteItem.targetDate,
    notes: parseDate(localItem.updated_at) >= parseDate(remoteItem.updated_at) ? localItem.notes : remoteItem.notes,
    reminderOffsets: parseDate(localItem.updated_at) >= parseDate(remoteItem.updated_at)
      ? localItem.reminderOffsets
      : remoteItem.reminderOffsets,
    completedAt: maxIso(localItem.completedAt, remoteItem.completedAt),
    updated_at: maxIso(localItem.updated_at, remoteItem.updated_at)
  };
  return merged;
}

function mergeEntityArrays(localArray, remoteArray) {
  const map = new Map();
  [...(localArray || []), ...(remoteArray || [])].forEach((item) => {
    if (!item || !item.id) return;
    const prev = map.get(item.id);
    if (!prev || parseDate(item.updated_at) > parseDate(prev.updated_at)) {
      map.set(item.id, item);
    }
  });
  return [...map.values()];
}

function mergeByUpdated(localItem, remoteItem) {
  if (!localItem) return remoteItem;
  if (!remoteItem) return localItem;
  return parseDate(localItem.updated_at) >= parseDate(remoteItem.updated_at) ? localItem : remoteItem;
}

async function setLanguage(language) {
  const response = await fetch(versionedAssetUrl(`./locales/${language}.json`), { cache: 'no-store' });
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
  renderLinks();
  renderTimeline();
  renderDocumentsHubFilters();
  renderDocumentsHub();
  renderLearning();
  renderReminderAlerts();
  refreshBottomNavActiveState();
  renderUpdateBanner();
  renderVersionDiagnostics();
}

function renderTasks() {
  categoryList.innerHTML = '';

  CATEGORY_DEFINITIONS.forEach((section) => {
    const { done, total, percent } = computeCategoryProgress(section);
    const wrapper = document.createElement('article');
    wrapper.className = `item section-card ${section.colorClass}`;
    const sectionFilter = state.ui.sectionDocumentFilters[section.id] || { taskId: 'all', docType: 'all', expanded: false };

    const subtasksHtml = section.subtasks.map((task) => {
      const taskState = ensureSubtaskState(task.id);
      const dueInfo = getDueInfo(taskState.targetDate, taskState.done);
      const taskDocs = state.documents.filter((doc) => doc.linkedTaskId === task.id);
      const completedClass = taskState.done ? 'is-complete' : '';
      const dueChip = dueInfo.level === 'soon'
        ? `<span class="chip chip-warning">${t('tasks.dueSoon')}</span>`
        : dueInfo.level === 'overdue'
          ? `<span class="chip chip-danger">${t('tasks.overdue')}</span>`
          : '';
      return `
        <li class="task-card ${completedClass}" data-task-id="${task.id}">
          <div class="task-head">
            <label class="task-toggle">
              <input type="checkbox" data-task-toggle="${task.id}" ${taskState.done ? 'checked' : ''} />
              <strong>${escapeHtml(t(task.titleKey))}</strong>
            </label>
            <div class="task-chips">
              <span class="chip">${taskDocs.length} ${t('documents.shortLabel')}</span>
              ${dueChip}
            </div>
          </div>
          <p>${escapeHtml(t(task.detailKey))}</p>
          <div class="task-actions-row" role="group" aria-label="${escapeAttribute(t('tasks.taskActions'))}">
            <button type="button" data-open-panel="check" data-task-panel="${task.id}">${t('tasks.actions.checkDone')}</button>
            <button type="button" data-open-panel="reminder" data-task-panel="${task.id}">${t('tasks.actions.reminder')}</button>
            <button type="button" data-open-panel="documents" data-task-panel="${task.id}">${t('tasks.actions.documents')}</button>
            <button type="button" data-open-panel="notes" data-task-panel="${task.id}">${t('tasks.actions.notes')}</button>
          </div>
          <div class="task-panel" data-panel-type="check" data-panel-owner="${task.id}" hidden>
            <label class="inline-checkbox">
              <input type="checkbox" data-task-toggle="${task.id}" ${taskState.done ? 'checked' : ''} />
              <span>${t('tasks.markCompleted')}</span>
            </label>
          </div>
          <div class="task-panel" data-panel-type="reminder" data-panel-owner="${task.id}" hidden>
            <label>
              <span>${t('tasks.targetDate')}</span>
              <input type="date" data-task-date="${task.id}" value="${escapeAttribute(taskState.targetDate || '')}" />
            </label>
            <label>
              <span>${t('tasks.reminders')}</span>
              <input type="text" data-task-reminders="${task.id}" value="${escapeAttribute(formatReminderOffsets(taskState.reminderOffsets || []))}" placeholder="7d,1d,2h" />
            </label>
          </div>
          <div class="task-panel" data-panel-type="documents" data-panel-owner="${task.id}" hidden>
            <form data-task-doc-form="${task.id}" class="form-grid compact">
              <input name="name" required placeholder="${escapeAttribute(t('documents.fields.name'))}" />
              <select name="docType">${buildDocumentTypeOptions(task.requiredDocs || [])}</select>
              <input name="uploadFile" type="file" accept="image/*,.pdf" />
              <input name="captureFile" type="file" accept="image/*" capture="environment" />
              <button type="submit">${t('documents.addForTask')}</button>
            </form>
            <ul class="stack mini-doc-list">${renderTaskDocumentItems(taskDocs)}</ul>
          </div>
          <div class="task-panel" data-panel-type="notes" data-panel-owner="${task.id}" hidden>
            <label>
              <span>${t('tasks.notes')}</span>
              <textarea data-task-notes="${task.id}">${escapeHtml(taskState.notes || '')}</textarea>
            </label>
          </div>
        </li>
      `;
    }).join('');

    const sectionDocs = getSectionDocuments(section.id, sectionFilter);
    const missingItems = getSectionMissingDocuments(section);
    const missingText = missingItems.length
      ? `${t('documents.missingLabel')}: ${missingItems.slice(0, 4).map((item) => escapeHtml(item)).join(', ')}${missingItems.length > 4 ? '…' : ''}`
      : t('documents.noneMissing');

    wrapper.innerHTML = `
      <div class="section-header">
        <div>
          <p class="section-badge">${section.badge}</p>
          <h3>${escapeHtml(t(section.titleKey))}</h3>
          <p>${escapeHtml(t(section.subtitleKey))}</p>
        </div>
        <div class="section-metrics">
          <span class="chip">${done}/${total}</span>
          <span class="chip">${percent}%</span>
          <button type="button" data-section-toggle="${section.id}" aria-expanded="${sectionFilter.expanded ? 'true' : 'false'}">${sectionFilter.expanded ? t('tasks.closeCategory') : t('tasks.openCategory')}</button>
        </div>
      </div>
      <progress max="100" value="${percent}" aria-label="${escapeAttribute(t(section.titleKey))} ${percent}%"></progress>
      <div class="section-body" ${sectionFilter.expanded ? '' : 'hidden'} id="section-${section.id}">
        <ul class="stack">${subtasksHtml}</ul>
        <div class="section-doc-center item">
          <div class="section-doc-head">
            <h4>${t('documents.sectionCenterTitle')}</h4>
            <button type="button" data-scroll-docs="${section.id}">${t('documents.viewAllSectionDocuments')}</button>
          </div>
          <p class="muted">${missingText}</p>
          <div class="form-grid compact">
            <label>
              <span>${t('documents.filterTask')}</span>
              <select data-section-doc-task-filter="${section.id}">${buildSectionTaskFilterOptions(section, sectionFilter.taskId)}</select>
            </label>
            <label>
              <span>${t('documents.filterType')}</span>
              <select data-section-doc-type-filter="${section.id}">${buildSectionTypeFilterOptions(section, sectionFilter.docType)}</select>
            </label>
          </div>
          <ul class="stack">${renderDocumentItems(sectionDocs)}</ul>
        </div>
      </div>
    `;

    categoryList.appendChild(wrapper);
  });
}

function renderProgress() {
  const totals = getOverallProgress();
  overallProgress.innerHTML = `
    <h3>${t('dashboard.overallProgress')}</h3>
    <p>${totals.done} ${t('dashboard.of')} ${totals.total} ${t('dashboard.stepsCompleted')} · ${totals.percent}%</p>
    <progress max="100" value="${totals.percent}" aria-label="${totals.percent}%"></progress>
  `;
}

function renderNextPending() {
  const pending = CATEGORY_DEFINITIONS
    .flatMap((section) => section.subtasks.map((task) => ({ section, task, taskState: ensureSubtaskState(task.id) })))
    .filter((entry) => !entry.taskState.done)
    .sort((a, b) => {
      if (a.taskState.targetDate && b.taskState.targetDate) return a.taskState.targetDate.localeCompare(b.taskState.targetDate);
      if (a.taskState.targetDate) return -1;
      if (b.taskState.targetDate) return 1;
      return 0;
    })
    .slice(0, 5);

  nextPendingList.innerHTML = '';
  if (!pending.length) {
    nextPendingList.innerHTML = `<li class="item empty">${t('common.empty')}</li>`;
    return;
  }

  pending.forEach((entry) => {
    const dueInfo = getDueInfo(entry.taskState.targetDate, false);
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <strong>${escapeHtml(t(entry.task.titleKey))}</strong>
      <p>${escapeHtml(t(entry.section.titleKey))}</p>
      <p>${entry.taskState.targetDate || t('tasks.noDate')}</p>
      <p class="${dueInfo.level === 'overdue' ? 'danger' : ''}">${escapeHtml(dueInfo.text)}</p>
    `;
    nextPendingList.appendChild(li);
  });
}

function renderLinks() {
  usefulLinksList.innerHTML = USEFUL_LINKS.map((item) => `
    <li class="item">
      <strong>${escapeHtml(t(item.titleKey))}</strong>
      <p>${escapeHtml(t(item.subtitleKey))}</p>
      <p>${escapeHtml(t(item.descriptionKey))}</p>
      <a href="${escapeAttribute(item.url)}" target="_blank" rel="noopener">${t('links.open')}</a>
    </li>
  `).join('');
}

function renderTimeline() {
  timelineList.innerHTML = '';
  const events = getAllEvents().sort((a, b) => parseDate(a.datetime) - parseDate(b.datetime));

  if (!events.length) {
    timelineList.innerHTML = `<li class="item empty">${t('calendar.empty')}</li>`;
    return;
  }

  events.forEach((event) => {
    const dueInfo = getDueInfo(event.dateOnly, false);
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <h3>${escapeHtml(event.title)}</h3>
      <p>${new Date(event.datetime).toLocaleString()}</p>
      <p>${escapeHtml(event.context)}</p>
      <p>${t('calendar.reminders')}: ${escapeHtml(formatReminderOffsets(event.reminderOffsets))}</p>
      <p class="${dueInfo.level === 'overdue' ? 'danger' : ''}">${escapeHtml(dueInfo.text)}</p>
      <div class="item-actions">
        <button type="button" data-export-event="${event.id}">${t('calendar.exportOne')}</button>
        <button type="button" data-clear-event="${event.id}">${t('calendar.clearDate')}</button>
      </div>
    `;
    timelineList.appendChild(li);
  });

  timelineList.querySelectorAll('[data-export-event]').forEach((button) => {
    button.addEventListener('click', () => exportSingleEventIcs(button.getAttribute('data-export-event')));
  });

  timelineList.querySelectorAll('[data-clear-event]').forEach((button) => {
    button.addEventListener('click', () => {
      const taskId = button.getAttribute('data-clear-event');
      const taskState = ensureSubtaskState(taskId);
      taskState.targetDate = '';
      taskState.updated_at = nowIso();
      saveStateAndRender();
    });
  });
}

function renderDocumentsHubFilters() {
  const sections = CATEGORY_DEFINITIONS;
  const tasks = CATEGORY_DEFINITIONS.flatMap((section) => section.subtasks.map((task) => ({ sectionId: section.id, ...task })));
  const allTypes = [...new Set(state.documents.map((doc) => doc.docType).filter(Boolean))].sort();

  const currentSection = documentsSectionFilter.value || 'all';
  documentsSectionFilter.innerHTML = `<option value="all">${t('documents.filterAllSections')}</option>` + sections
    .map((section) => `<option value="${section.id}">${escapeHtml(t(section.titleKey))}</option>`)
    .join('');
  documentsSectionFilter.value = currentSection;

  const taskOptions = tasks.filter((task) => currentSection === 'all' || task.sectionId === currentSection);
  const currentTask = documentsTaskFilter.value || 'all';
  documentsTaskFilter.innerHTML = `<option value="all">${t('documents.filterAllTasks')}</option>` + taskOptions
    .map((task) => `<option value="${task.id}">${escapeHtml(t(task.titleKey))}</option>`)
    .join('');
  if (Array.from(documentsTaskFilter.options).some((option) => option.value === currentTask)) {
    documentsTaskFilter.value = currentTask;
  }

  const currentType = documentsTypeFilter.value || 'all';
  documentsTypeFilter.innerHTML = `<option value="all">${t('documents.filterAllTypes')}</option>` + allTypes
    .map((docType) => `<option value="${escapeAttribute(docType)}">${escapeHtml(getDocTypeLabel(docType))}</option>`)
    .join('');
  if (Array.from(documentsTypeFilter.options).some((option) => option.value === currentType)) {
    documentsTypeFilter.value = currentType;
  }
}

function renderDocumentsHub() {
  documentsList.innerHTML = '';
  const sectionId = documentsSectionFilter.value || 'all';
  const taskId = documentsTaskFilter.value || 'all';
  const docType = documentsTypeFilter.value || 'all';

  const docs = state.documents.filter((doc) => {
    if (sectionId !== 'all' && getSectionForTask(doc.linkedTaskId)?.id !== sectionId) return false;
    if (taskId !== 'all' && doc.linkedTaskId !== taskId) return false;
    if (docType !== 'all' && doc.docType !== docType) return false;
    return true;
  });

  if (!docs.length) {
    const empty = document.createElement('li');
    empty.className = 'item empty';
    empty.textContent = t('documents.empty');
    documentsList.replaceChildren(empty);
  } else {
    documentsList.replaceChildren(...buildDocumentNodes(docs));
  }

  const missing = getMissingDocumentsForFilters(sectionId, taskId);
  documentsMissing.textContent = missing.length
    ? `${t('documents.missingLabel')}: ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? '…' : ''}`
    : t('documents.noneMissing');

  bindDocumentActions(documentsList);
}

function renderLearning() {
  const active = state.learning.activeAttempt;
  if (!active) {
    learningSubmitBtn.hidden = true;
    learningTimerEl.textContent = '';
    learningSummary.textContent = t('learning.ready');
    learningTestArea.innerHTML = `<p class="muted">${t('learning.startPrompt')}</p>`;
  } else {
    learningSubmitBtn.hidden = false;
    const remaining = getLearningRemainingSeconds(active);
    learningTimerEl.textContent = `${t('learning.timeLeft')}: ${formatSeconds(remaining)}`;
    learningSummary.textContent = `${t('learning.activeMode')}: ${t(`learning.modes.${active.mode}`)}`;
    learningTestArea.innerHTML = renderLearningQuestions(active);
  }

  const history = state.learning.history || [];
  learningHistory.innerHTML = history.length
    ? history.slice().reverse().map((entry) => `
      <li class="item">
        <strong>${escapeHtml(t(`learning.modes.${entry.mode}`))}</strong>
        <p>${entry.score}/${entry.total} (${entry.percent}%)</p>
        <p>${new Date(entry.completedAt).toLocaleString()}</p>
      </li>
    `).join('')
    : `<li class="item empty">${t('learning.noHistory')}</li>`;
}

function onCategoryClick(event) {
  const sectionToggle = event.target.closest('[data-section-toggle]');
  if (sectionToggle) {
    const sectionId = sectionToggle.getAttribute('data-section-toggle');
    const filters = state.ui.sectionDocumentFilters[sectionId] || { taskId: 'all', docType: 'all', expanded: false };
    filters.expanded = !filters.expanded;
    state.ui.sectionDocumentFilters[sectionId] = filters;
    saveStateAndRender();
    return;
  }

  const panelBtn = event.target.closest('[data-open-panel]');
  if (panelBtn) {
    const taskId = panelBtn.getAttribute('data-task-panel');
    const panel = panelBtn.getAttribute('data-open-panel');
    toggleTaskPanel(taskId, panel);
    return;
  }

  const scrollDocs = event.target.closest('[data-scroll-docs]');
  if (scrollDocs) {
    const sectionId = scrollDocs.getAttribute('data-scroll-docs');
    documentsSectionFilter.value = sectionId;
    renderDocumentsHubFilters();
    renderDocumentsHub();
    document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const docAction = event.target.closest('[data-doc-action]');
  if (docAction) {
    void handleDocumentAction(docAction.getAttribute('data-doc-action'), docAction.getAttribute('data-doc-id'));
  }
}

function onCategoryChange(event) {
  if (event.target.matches('[data-task-toggle]')) {
    const taskId = event.target.getAttribute('data-task-toggle');
    const taskState = ensureSubtaskState(taskId);
    taskState.done = event.target.checked;
    if (event.target.checked) taskState.completedAt = taskState.completedAt || nowIso();
    if (!event.target.checked) taskState.completedAt = '';
    taskState.updated_at = nowIso();
    saveStateAndRender();
    return;
  }

  if (event.target.matches('[data-task-date]')) {
    const taskId = event.target.getAttribute('data-task-date');
    const taskState = ensureSubtaskState(taskId);
    taskState.targetDate = event.target.value || '';
    taskState.updated_at = nowIso();
    saveStateAndRender();
    return;
  }

  if (event.target.matches('[data-task-reminders]')) {
    const taskId = event.target.getAttribute('data-task-reminders');
    const taskState = ensureSubtaskState(taskId);
    taskState.reminderOffsets = parseReminderOffsets(event.target.value || '');
    taskState.updated_at = nowIso();
    saveStateAndRender();
    return;
  }

  if (event.target.matches('[data-section-doc-task-filter]')) {
    const sectionId = event.target.getAttribute('data-section-doc-task-filter');
    const filters = state.ui.sectionDocumentFilters[sectionId] || { taskId: 'all', docType: 'all', expanded: true };
    filters.taskId = event.target.value || 'all';
    state.ui.sectionDocumentFilters[sectionId] = filters;
    saveStateAndRender();
    return;
  }

  if (event.target.matches('[data-section-doc-type-filter]')) {
    const sectionId = event.target.getAttribute('data-section-doc-type-filter');
    const filters = state.ui.sectionDocumentFilters[sectionId] || { taskId: 'all', docType: 'all', expanded: true };
    filters.docType = event.target.value || 'all';
    state.ui.sectionDocumentFilters[sectionId] = filters;
    saveStateAndRender();
  }
}

function onCategoryInput(event) {
  if (event.target.matches('[data-task-notes]')) {
    const taskId = event.target.getAttribute('data-task-notes');
    const taskState = ensureSubtaskState(taskId);
    taskState.notes = event.target.value || '';
    taskState.updated_at = nowIso();
    saveState();
  }
}

async function onCategorySubmit(event) {
  const form = event.target.closest('[data-task-doc-form]');
  if (!form) return;
  event.preventDefault();

  const taskId = form.getAttribute('data-task-doc-form');
  const formData = new FormData(form);
  const name = (formData.get('name') || '').toString().trim();
  if (!name) return;

  const uploadFile = formData.get('uploadFile');
  const captureFile = formData.get('captureFile');
  const file = uploadFile instanceof File && uploadFile.size > 0
    ? uploadFile
    : captureFile instanceof File && captureFile.size > 0
      ? captureFile
      : null;

  const section = getSectionForTask(taskId);
  const documentEntry = {
    id: createId(),
    linkedTaskId: taskId,
    sectionId: section?.id || '',
    name,
    docType: (formData.get('docType') || '').toString().trim() || 'other',
    fileName: file ? file.name : '',
    fileUrl: '',
    fileDataUrl: '',
    storageProvider: 'metadata-only',
    createdAt: nowIso(),
    updated_at: nowIso()
  };

  if (file) {
    const uploadResult = await uploadDocumentFile(file, documentEntry.id);
    documentEntry.fileUrl = uploadResult.url;
    documentEntry.storageProvider = uploadResult.provider;
    if (!uploadResult.url) {
      documentEntry.fileDataUrl = await fileToDataUrl(file);
    }
    documentStatus.textContent = uploadResult.message;
  } else {
    documentStatus.textContent = t('documents.messages.metadataOnly');
  }

  state.documents.push(documentEntry);
  form.reset();
  saveStateAndRender();
}

function toggleTaskPanel(taskId, panelType) {
  const panels = categoryList.querySelectorAll(`[data-panel-owner="${CSS.escape(taskId)}"]`);
  panels.forEach((panel) => {
    if (panel.getAttribute('data-panel-type') === panelType) {
      panel.toggleAttribute('hidden');
    } else {
      panel.setAttribute('hidden', 'hidden');
    }
  });
}

function renderTaskDocumentItems(documents) {
  if (!documents.length) return `<li class="item empty">${t('documents.emptyTask')}</li>`;
  return renderDocumentItems(documents);
}

function renderDocumentItems(documents) {
  if (!documents.length) return `<li class="item empty">${t('documents.empty')}</li>`;
  return documents.map((doc) => {
    const fileHref = getSafeDocumentUrl(doc.fileUrl || doc.fileDataUrl || '');
    return `
      <li class="item">
        <h4>${escapeHtml(doc.name)}</h4>
        <p>${t('documents.linkedTask')}: ${escapeHtml(getSubtaskTitle(doc.linkedTaskId))}</p>
        <p>${t('documents.typeLabel')}: ${escapeHtml(getDocTypeLabel(doc.docType || 'other'))}</p>
        <p>${t('documents.file')}: ${escapeHtml(doc.fileName || t('documents.noFile'))}</p>
        <div class="item-actions">
          <button type="button" data-doc-action="preview" data-doc-id="${doc.id}" ${fileHref ? '' : 'disabled'}>${t('documents.preview')}</button>
          <button type="button" data-doc-action="download" data-doc-id="${doc.id}" ${fileHref ? '' : 'disabled'}>${t('documents.download')}</button>
          <button type="button" data-doc-action="share" data-doc-id="${doc.id}" ${fileHref ? '' : 'disabled'}>${t('documents.share')}</button>
          <button type="button" data-doc-action="print" data-doc-id="${doc.id}" ${fileHref ? '' : 'disabled'}>${t('documents.print')}</button>
          <button type="button" data-doc-action="delete" data-doc-id="${doc.id}">${t('common.delete')}</button>
        </div>
      </li>
    `;
  }).join('');
}

function bindDocumentActions(container) {
  container.querySelectorAll('[data-doc-action]').forEach((button) => {
    button.addEventListener('click', () => {
      void handleDocumentAction(button.getAttribute('data-doc-action'), button.getAttribute('data-doc-id'));
    });
  });
}

async function handleDocumentAction(action, docId) {
  const doc = state.documents.find((item) => item.id === docId);
  if (!doc) return;
  const fileHref = getSafeDocumentUrl(doc.fileUrl || doc.fileDataUrl || '');

  if (action === 'delete') {
    if (!confirm(t('common.confirmDelete'))) return;
    state.documents = state.documents.filter((item) => item.id !== docId);
    saveStateAndRender();
    return;
  }

  if (!fileHref) return;

  if (action === 'preview') {
    window.open(fileHref, '_blank', 'noopener');
    return;
  }

  if (action === 'download') {
    if (!/^https?:\/\//i.test(fileHref) && !/^blob:/i.test(fileHref) && !/^data:(image\/|application\/pdf)/i.test(fileHref)) return;
    const response = await fetch(fileHref);
    if (!response.ok) return;
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = doc.fileName || safeFileName(doc.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    return;
  }

  if (action === 'share') {
    if (navigator.share) {
      navigator.share({ title: doc.name, text: doc.name, url: fileHref }).catch(() => {});
    }
    return;
  }

  if (action === 'print') {
    if (!/^https?:\/\//i.test(fileHref) && !/^blob:/i.test(fileHref) && !/^data:(image\/|application\/pdf)/i.test(fileHref)) return;
    const printWindow = window.open(fileHref, '_blank', 'noopener');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  }
}

function buildDocumentNodes(documents) {
  return documents.map((doc) => {
    const fileHref = getSafeDocumentUrl(doc.fileUrl || doc.fileDataUrl || '');
    const li = document.createElement('li');
    li.className = 'item';

    const title = document.createElement('h4');
    title.textContent = doc.name || '';
    li.appendChild(title);

    const linkedTask = document.createElement('p');
    linkedTask.textContent = `${t('documents.linkedTask')}: ${getSubtaskTitle(doc.linkedTaskId)}`;
    li.appendChild(linkedTask);

    const type = document.createElement('p');
    type.textContent = `${t('documents.typeLabel')}: ${getDocTypeLabel(doc.docType || 'other')}`;
    li.appendChild(type);

    const file = document.createElement('p');
    file.textContent = `${t('documents.file')}: ${doc.fileName || t('documents.noFile')}`;
    li.appendChild(file);

    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const actionDefs = [
      ['preview', t('documents.preview')],
      ['download', t('documents.download')],
      ['share', t('documents.share')],
      ['print', t('documents.print')],
      ['delete', t('common.delete')]
    ];
    actionDefs.forEach(([actionId, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.dataset.docAction = actionId;
      button.dataset.docId = doc.id;
      if (!fileHref && actionId !== 'delete') button.disabled = true;
      actions.appendChild(button);
    });
    li.appendChild(actions);
    return li;
  });
}

function startB2MockTest() {
  if (state.learning.activeAttempt) {
    learningSummary.textContent = t('learning.alreadyRunning');
    learningTimerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  const mode = learningMode.value || 'full';
  const setIds = mode === 'full' ? B2_QUESTION_SETS.map((item) => item.id) : [mode];
  const sections = B2_QUESTION_SETS.filter((item) => setIds.includes(item.id));

  const questions = sections.flatMap((section) => section.questions.map((question) => ({
    ...question,
    sectionId: section.id,
    sectionTitleKey: section.titleKey
  })));

  state.learning.activeAttempt = {
    id: createId(),
    mode,
    startedAt: nowIso(),
    durationMinutes: DEFAULT_DURATION_BY_MODE[mode] || 30,
    answers: {},
    questions,
    updated_at: nowIso()
  };

  saveStateAndRender();
}

function onLearningAnswerChange(event) {
  if (!state.learning.activeAttempt) return;
  if (!event.target.matches('[data-learning-question]')) return;
  const questionId = event.target.getAttribute('data-learning-question');
  state.learning.activeAttempt.answers[questionId] = event.target.value;
  state.learning.activeAttempt.updated_at = nowIso();
  saveState();
}

function tickLearningTimer() {
  if (!state.learning.activeAttempt) return;
  const remaining = getLearningRemainingSeconds(state.learning.activeAttempt);
  if (remaining <= 0) {
    submitB2MockTest('timeout');
  } else if (learningTimerEl) {
    learningTimerEl.textContent = `${t('learning.timeLeft')}: ${formatSeconds(remaining)}`;
  }
}

function submitB2MockTest(reason) {
  const attempt = state.learning.activeAttempt;
  if (!attempt) return;

  let correct = 0;
  const bySection = {};

  attempt.questions.forEach((question) => {
    const selected = Number(attempt.answers[question.id] || -1);
    const isCorrect = selected === question.answerIndex;
    if (isCorrect) correct += 1;

    if (!bySection[question.sectionId]) {
      bySection[question.sectionId] = { correct: 0, total: 0 };
    }
    bySection[question.sectionId].total += 1;
    if (isCorrect) bySection[question.sectionId].correct += 1;
  });

  const total = attempt.questions.length;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  const historyEntry = {
    id: attempt.id,
    mode: attempt.mode,
    score: correct,
    total,
    percent,
    reason,
    bySection,
    startedAt: attempt.startedAt,
    completedAt: nowIso()
  };

  state.learning.history = [...(state.learning.history || []), historyEntry].slice(-30);
  state.learning.activeAttempt = null;
  saveStateAndRender();
}

function renderLearningQuestions(attempt) {
  return attempt.questions.map((question, index) => `
    <fieldset class="item">
      <legend>${index + 1}. ${escapeHtml(t(question.promptKey))}</legend>
      <p class="muted">${escapeHtml(t(question.sectionTitleKey))}</p>
      ${(question.options || []).map((optionKey, optionIndex) => `
        <label>
          <input
            type="radio"
            name="q-${question.id}"
            data-learning-question="${question.id}"
            value="${optionIndex}"
            ${(attempt.answers[question.id] || '') === String(optionIndex) ? 'checked' : ''}
          />
          <span>${escapeHtml(t(optionKey))}</span>
        </label>
      `).join('')}
    </fieldset>
  `).join('');
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
        notificationService.notify(
          t('dashboard.reminderTitle'),
          `${event.title} — ${new Date(event.datetime).toLocaleString()}`
        );
      }
    });
  });

  Object.keys(state.reminders.fired).forEach((key) => {
    if (!validReminderKeys.has(key)) delete state.reminders.fired[key];
  });

  state.reminders.updated_at = nowIso();
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
    const result = await supabaseClient.storage.from('documents').upload(path, file, { upsert: true });

    if (result.error) throw result.error;

    const publicUrl = supabaseClient.storage.from('documents').getPublicUrl(path).data.publicUrl;
    return { provider: 'supabase', url: publicUrl, message: t('documents.messages.uploaded') };
  } catch {
    return { provider: 'local', url: '', message: t('documents.messages.uploadFailed') };
  }
}

function exportSingleEventIcs(taskId) {
  const event = getAllEvents().find((item) => item.id === taskId);
  if (!event) return;
  downloadIcs(buildIcs([event]), `${safeFileName(event.title)}.ics`);
}

function exportAllEventsIcs() {
  const events = getAllEvents();
  if (!events.length) return;
  downloadIcs(buildIcs(events), 'task-reminders.ics');
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
      `DESCRIPTION:${escapeIcs(formatReminderOffsets(item.reminderOffsets || []))}`
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
    if (!parsed || (parsed.version && ![2, 3].includes(parsed.version))) {
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
  return CATEGORY_DEFINITIONS
    .flatMap((section) => section.subtasks.map((task) => ({ section, task })))
    .map(({ section, task }) => {
      const taskState = ensureSubtaskState(task.id);
      if (!taskState.targetDate) return null;
      return {
        id: task.id,
        source: 'task',
        title: t(task.titleKey),
        datetime: toLocalDateAtNineAmWithOffset(taskState.targetDate),
        dateOnly: taskState.targetDate,
        context: t(section.titleKey),
        reminderOffsets: taskState.reminderOffsets || []
      };
    })
    .filter(Boolean);
}

function computeCategoryProgress(section) {
  const done = section.subtasks.filter((task) => ensureSubtaskState(task.id).done).length;
  const total = section.subtasks.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return { done, total, percent };
}

function getOverallProgress() {
  const tasks = CATEGORY_DEFINITIONS.flatMap((section) => section.subtasks);
  const done = tasks.filter((task) => ensureSubtaskState(task.id).done).length;
  const total = tasks.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

function ensureSubtaskState(taskId) {
  if (!state.subtaskState[taskId]) {
    state.subtaskState[taskId] = defaultSubtaskState();
  }
  return state.subtaskState[taskId];
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
    version: 3,
    subtaskState: {},
    documents: [],
    reminders: { fired: {}, notificationPermission: 'default', updated_at: nowIso() },
    learning: { history: [], activeAttempt: null, updated_at: nowIso() },
    settings: { workspaceId: 'default-workspace', updated_at: nowIso() },
    sync: { lastSyncedAt: '', updated_at: nowIso() },
    ui: { sectionDocumentFilters: {} },
    updated_at: nowIso()
  };

  const storedV3 = loadJSON(STORAGE_KEYS.state, null);
  if (storedV3) {
    const mergedV3 = sanitizePayload(storedV3);
    ensureAllTaskStates(mergedV3);
    return mergedV3;
  }

  const legacyV2 = loadJSON(STORAGE_KEYS.legacyStateV2, null);
  const merged = sanitizePayload(legacyV2 || base);

  migrateLegacyChecklist(merged);
  migrateLegacyStateTasks(merged, legacyV2 || {});
  ensureAllTaskStates(merged);

  return merged;
}

function ensureAllTaskStates(targetState) {
  CATEGORY_DEFINITIONS.flatMap((section) => section.subtasks).forEach((task) => {
    if (!targetState.subtaskState[task.id]) {
      targetState.subtaskState[task.id] = defaultSubtaskState();
    }
  });
}

function migrateLegacyChecklist(targetState) {
  const legacy = loadJSON(STORAGE_KEYS.legacyChecklist, null);
  if (!legacy) return;

  Object.entries(legacy).forEach(([legacyId, done]) => {
    const taskId = LEGACY_TASK_MIGRATION[legacyId];
    if (!taskId || !done) return;
    const taskState = targetState.subtaskState[taskId] || defaultSubtaskState();
    taskState.done = true;
    taskState.completedAt = taskState.completedAt || nowIso();
    taskState.updated_at = nowIso();
    targetState.subtaskState[taskId] = taskState;
  });
}

function migrateLegacyStateTasks(targetState, legacyState) {
  const legacyTaskState = legacyState?.subtaskState && typeof legacyState.subtaskState === 'object'
    ? legacyState.subtaskState
    : {};

  Object.entries(legacyTaskState).forEach(([legacyTaskId, oldState]) => {
    const mappedTaskId = LEGACY_TASK_MIGRATION[legacyTaskId];
    if (!mappedTaskId) return;

    const existing = targetState.subtaskState[mappedTaskId] || defaultSubtaskState();
    const merged = {
      ...existing,
      done: existing.done || Boolean(oldState?.done),
      targetDate: existing.targetDate || (oldState?.targetDate || ''),
      notes: existing.notes || (oldState?.notes || ''),
      reminderOffsets: (existing.reminderOffsets && existing.reminderOffsets.length)
        ? existing.reminderOffsets
        : parseReminderOffsets(formatReminderOffsets(oldState?.reminderOffsets || [])),
      completedAt: existing.completedAt || oldState?.completedAt || '',
      updated_at: maxIso(existing.updated_at, oldState?.updated_at) || nowIso()
    };

    targetState.subtaskState[mappedTaskId] = merged;
  });

  const migratedLegacyDocuments = (legacyState?.documents || []).map((doc) => {
    const mappedTaskId = LEGACY_TASK_MIGRATION[doc.linkedTaskId] || doc.linkedTaskId || '';
    const section = getSectionForTask(mappedTaskId);
    return {
      id: doc.id || createId(),
      linkedTaskId: mappedTaskId,
      sectionId: section?.id || '',
      name: doc.name || '',
      docType: doc.category || doc.docType || 'other',
      fileName: doc.fileName || '',
      fileUrl: doc.fileUrl || '',
      fileDataUrl: doc.fileDataUrl || '',
      storageProvider: doc.storageProvider || 'metadata-only',
      createdAt: doc.createdAt || doc.updated_at || nowIso(),
      updated_at: doc.updated_at || nowIso()
    };
  });

  targetState.documents = mergeEntityArrays(targetState.documents || [], migratedLegacyDocuments);
}

function sanitizePayload(payload) {
  const safe = payload || {};
  const reminders = safe.reminders && typeof safe.reminders === 'object' ? safe.reminders : { fired: {}, notificationPermission: 'default', updated_at: nowIso() };
  const learning = safe.learning && typeof safe.learning === 'object'
    ? safe.learning
    : safe.learningProgress && typeof safe.learningProgress === 'object'
      ? {
          history: safe.learningProgress.history || [],
          activeAttempt: null,
          updated_at: safe.learningProgress.updated_at || nowIso()
        }
      : { history: [], activeAttempt: null, updated_at: nowIso() };

  return {
    version: 3,
    subtaskState: safe.subtaskState && typeof safe.subtaskState === 'object' ? safe.subtaskState : {},
    documents: Array.isArray(safe.documents) ? safe.documents : [],
    reminders: {
      fired: reminders.fired && typeof reminders.fired === 'object' ? reminders.fired : {},
      notificationPermission: reminders.notificationPermission || 'default',
      updated_at: reminders.updated_at || nowIso()
    },
    learning: {
      history: Array.isArray(learning.history) ? learning.history : [],
      activeAttempt: learning.activeAttempt || null,
      updated_at: learning.updated_at || nowIso()
    },
    settings: safe.settings && typeof safe.settings === 'object'
      ? { ...safe.settings, workspaceId: safe.settings.workspaceId || 'default-workspace', updated_at: safe.settings.updated_at || nowIso() }
      : { workspaceId: 'default-workspace', updated_at: nowIso() },
    sync: safe.sync && typeof safe.sync === 'object'
      ? { ...safe.sync, lastSyncedAt: safe.sync.lastSyncedAt || '', updated_at: safe.sync.updated_at || nowIso() }
      : { lastSyncedAt: '', updated_at: nowIso() },
    ui: safe.ui && typeof safe.ui === 'object'
      ? { sectionDocumentFilters: safe.ui.sectionDocumentFilters || {} }
      : { sectionDocumentFilters: {} },
    updated_at: safe.updated_at || nowIso()
  };
}

function saveState() {
  saveJSON(STORAGE_KEYS.state, sanitizePayload(state));
}

function saveStateAndRender() {
  saveState();
  renderAll();
}

function serializeStateForSync() {
  return sanitizePayload(state);
}

function getSubtaskTitle(taskId) {
  const task = CATEGORY_DEFINITIONS.flatMap((section) => section.subtasks).find((item) => item.id === taskId);
  return task ? t(task.titleKey) : t('documents.unlinked');
}

function getSectionForTask(taskId) {
  return CATEGORY_DEFINITIONS.find((section) => section.subtasks.some((task) => task.id === taskId)) || null;
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
  if (!offsets || !offsets.length) return t('tasks.noReminders');
  return offsets.map((offset) => {
    if (offset % (60 * 24) === 0) return `${offset / (60 * 24)}d`;
    if (offset % 60 === 0) return `${offset / 60}h`;
    return `${offset}m`;
  }).join(', ');
}

function getDueInfo(targetDate, done) {
  if (!targetDate) return { level: 'none', text: t('tasks.noDate') };
  if (done) return { level: 'done', text: t('tasks.done') };

  const today = new Date();
  const localMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(`${targetDate}T00:00:00`);
  const diffMs = target - localMidnight;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days < 0) return { level: 'overdue', text: t('tasks.overdue') };
  if (days <= 7) return { level: 'soon', text: t('tasks.dueIn').replace('{days}', String(days)) };
  return { level: 'future', text: t('tasks.dueIn').replace('{days}', String(days)) };
}

function getSectionDocuments(sectionId, filterState) {
  return state.documents.filter((doc) => {
    const sameSection = getSectionForTask(doc.linkedTaskId)?.id === sectionId;
    if (!sameSection) return false;
    if (filterState.taskId !== 'all' && doc.linkedTaskId !== filterState.taskId) return false;
    if (filterState.docType !== 'all' && doc.docType !== filterState.docType) return false;
    return true;
  });
}

function getMissingDocumentsForFilters(sectionId, taskId) {
  const sections = CATEGORY_DEFINITIONS.filter((section) => sectionId === 'all' || section.id === sectionId);
  const missing = [];

  sections.forEach((section) => {
    section.subtasks.forEach((task) => {
      if (taskId !== 'all' && task.id !== taskId) return;
      (task.requiredDocs || []).forEach((requiredType) => {
        const hasDoc = state.documents.some((doc) => doc.linkedTaskId === task.id && doc.docType === requiredType);
        if (!hasDoc) missing.push(`${t(task.titleKey)} → ${getDocTypeLabel(requiredType)}`);
      });
    });
  });

  return missing;
}

function getSectionMissingDocuments(section) {
  return getMissingDocumentsForFilters(section.id, 'all');
}

function buildDocumentTypeOptions(requiredDocs) {
  const options = [...new Set([...(requiredDocs || []), 'other'])];
  return options.map((option) => `<option value="${escapeAttribute(option)}">${escapeHtml(getDocTypeLabel(option))}</option>`).join('');
}

function buildSectionTaskFilterOptions(section, selected) {
  const options = [`<option value="all">${t('documents.filterAllTasks')}</option>`];
  section.subtasks.forEach((task) => {
    options.push(`<option value="${task.id}" ${selected === task.id ? 'selected' : ''}>${escapeHtml(t(task.titleKey))}</option>`);
  });
  return options.join('');
}

function buildSectionTypeFilterOptions(section, selected) {
  const types = new Set();
  section.subtasks.forEach((task) => {
    (task.requiredDocs || []).forEach((item) => types.add(item));
  });
  state.documents
    .filter((doc) => getSectionForTask(doc.linkedTaskId)?.id === section.id)
    .forEach((doc) => {
      if (doc.docType) types.add(doc.docType);
    });

  const options = [`<option value="all">${t('documents.filterAllTypes')}</option>`];
  [...types].sort().forEach((docType) => {
    options.push(`<option value="${escapeAttribute(docType)}" ${selected === docType ? 'selected' : ''}>${escapeHtml(getDocTypeLabel(docType))}</option>`);
  });
  return options.join('');
}

function getDocTypeLabel(type) {
  const key = DOC_TYPE_LABELS[type];
  if (!key) return type || t('documents.typeOther');
  return t(key);
}

function getSafeDocumentUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.startsWith('data:image/') || raw.startsWith('data:application/pdf')) return raw;
  if (raw.startsWith('blob:')) return raw;
  try {
    const parsed = new URL(raw, window.location.origin);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : '';
  } catch {
    return '';
  }
}

function getLearningRemainingSeconds(attempt) {
  const started = parseDate(attempt.startedAt);
  const durationMs = (attempt.durationMinutes || 0) * 60 * 1000;
  const now = Date.now();
  const elapsed = now - started;
  return Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
}

function formatSeconds(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const mins = String(Math.floor(safe / 60)).padStart(2, '0');
  const secs = String(safe % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
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

function versionedAssetUrl(path) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}v=${encodeURIComponent(ASSET_VERSION)}`;
}

function formatDisplayTimestamp(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toLocaleString() : value;
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
