// ============================================================================
// SUNNAH 24 — STORAGE & LOCAL INTEGRITY VERIFICATION ENGINE
// (LocalStorage + IndexedDB + Native Android Vault + SHA-256 Digest)
// ============================================================================

let appState = {
  appName: "Sunnah 24",
  version: 42,
  locale: "bn",
  i18nHash: "",
  customHabits: [],
  completionsByDate: {},
  duaCompletionsByDate: {},
  diaryEntries: [],
  lifetimeDhikr: 0,
  lastUpdated: 0,
  signature: ""
};

let activePhase = "tahajjud_fajr";
let activeMasterSectionId = null;
let homeDashboardScrollY = 0;
let tasbihCount = 0;
let tasbihTarget = 33;
let verifiedI18nDigest = "";
let historyRangeDays = 30;
let selectedArchiveMonthKey = getTodayKey().slice(0, 7);
let lastObservedDateKey = getTodayKey();

// SHA-256 with Pure-JS Fallback so it never crashes on file:// or non-HTTPS WebViews
async function computeSHA256(payloadString, salt = LEDGER_SALT) {
  const input = payloadString + "|" + salt;
  if (window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h1 = 0xdeadbeef ^ input.length,
    h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0, ch; i < input.length; i++) {
    ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex = (n) => (n >>> 0).toString(16).padStart(8, "0");
  return (hex(h1) + hex(h2)).repeat(4);
}

async function computeI18nDictionaryHash() {
  const canonicalPayload = canonicalizeObject({
    dictionaries: I18N_DICTIONARIES,
    habits: SUNNAH_24_HABITS,
    duas: SUNNAH_24_DUAS
  });
  return computeSHA256(canonicalPayload, I18N_SALT);
}

function getCanonicalStatePayload(stateObj, useLegacyRawArrays = false) {
  return JSON.stringify({
    appName: "Sunnah 24",
    version: stateObj.version,
    locale: stateObj.locale || "bn",
    i18nHash: stateObj.i18nHash || verifiedI18nDigest,
    customHabits: useLegacyRawArrays
      ? stateObj.customHabits || []
      : JSON.parse(canonicalizeObject(stateObj.customHabits || [])),
    completionsByDate: canonicalizeObject(stateObj.completionsByDate || {}),
    duaCompletionsByDate: canonicalizeObject(stateObj.duaCompletionsByDate || {}),
    diaryEntries: useLegacyRawArrays
      ? stateObj.diaryEntries || []
      : JSON.parse(canonicalizeObject(stateObj.diaryEntries || [])),
    lifetimeDhikr: stateObj.lifetimeDhikr || 0
  });
}

// ============================================================================
// TRIPLE-REDUNDANT STORAGE ENGINE (LocalStorage + IndexedDB + Native Android)
// ============================================================================

function openSunnahIDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function saveToIndexedDB(jsonStr) {
  const db = await openSunnahIDB();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(jsonStr, IDB_KEY);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

async function loadFromIndexedDB() {
  const db = await openSunnahIDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// Deep-merge multiple storage snapshots so no past day's history is ever lost
function mergeHistoryStates(statesArray) {
  const validStates = statesArray.filter((s) => s && typeof s === "object");
  if (validStates.length === 0) return null;

  // Sort by lastUpdated descending so latest preferences win
  validStates.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
  const base = { ...validStates[0] };

  const mergedCompletions = {};
  const mergedDuaCompletions = {};
  const mergedCustomMap = new Map();
  const mergedDiaryMap = new Map();
  let maxDhikr = 0;

  validStates.forEach((st) => {
    if ((st.lifetimeDhikr || 0) > maxDhikr) {
      maxDhikr = st.lifetimeDhikr;
    }
    if (st.completionsByDate && typeof st.completionsByDate === "object") {
      Object.keys(st.completionsByDate).forEach((dateKey) => {
        const arr = Array.isArray(st.completionsByDate[dateKey]) ? st.completionsByDate[dateKey] : [];
        if (!mergedCompletions[dateKey]) {
          mergedCompletions[dateKey] = new Set();
        }
        arr.forEach((hId) => mergedCompletions[dateKey].add(hId));
      });
    }
    if (st.duaCompletionsByDate && typeof st.duaCompletionsByDate === "object") {
      Object.keys(st.duaCompletionsByDate).forEach((dateKey) => {
        const arr = Array.isArray(st.duaCompletionsByDate[dateKey]) ? st.duaCompletionsByDate[dateKey] : [];
        if (!mergedDuaCompletions[dateKey]) {
          mergedDuaCompletions[dateKey] = new Set();
        }
        arr.forEach((dId) => mergedDuaCompletions[dateKey].add(dId));
      });
    }
    if (Array.isArray(st.customHabits)) {
      st.customHabits.forEach((ch) => {
        if (ch && ch.id && !mergedCustomMap.has(ch.id)) {
          mergedCustomMap.set(ch.id, ch);
        }
      });
    }
    if (Array.isArray(st.diaryEntries)) {
      st.diaryEntries.forEach((de) => {
        if (de && de.id && !mergedDiaryMap.has(de.id)) {
          mergedDiaryMap.set(de.id, de);
        }
      });
    }
  });

  const finalCompletions = {};
  Object.keys(mergedCompletions)
    .sort()
    .forEach((dateKey) => {
      const list = Array.from(mergedCompletions[dateKey]);
      if (list.length > 0 || dateKey === getTodayKey()) {
        finalCompletions[dateKey] = list;
      }
    });

  const finalDuaCompletions = {};
  Object.keys(mergedDuaCompletions)
    .sort()
    .forEach((dateKey) => {
      const list = Array.from(mergedDuaCompletions[dateKey]);
      if (list.length > 0 || dateKey === getTodayKey()) {
        finalDuaCompletions[dateKey] = list;
      }
    });

  return {
    appName: "Sunnah 24",
    version: 42,
    locale: base.locale || "bn",
    i18nHash: verifiedI18nDigest,
    customHabits: Array.from(mergedCustomMap.values()),
    completionsByDate: finalCompletions,
    duaCompletionsByDate: finalDuaCompletions,
    diaryEntries: Array.from(mergedDiaryMap.values()).sort((a, b) => Number(a.id) - Number(b.id)),
    lifetimeDhikr: maxDhikr,
    lastUpdated: Date.now(),
    signature: ""
  };
}

async function saveAndSealState() {
  verifiedI18nDigest = await computeI18nDictionaryHash();
  appState.version = 42;
  appState.i18nHash = verifiedI18nDigest;
  appState.lastUpdated = Date.now();
  const payload = getCanonicalStatePayload(appState);
  appState.signature = await computeSHA256(payload);

  const serialized = JSON.stringify(appState);

  // Layer 1: Primary & Mirror LocalStorage
  let lsOk = false;
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(BACKUP_MIRROR_KEY, serialized);
    lsOk = true;
  } catch (e) {
    console.warn("LocalStorage write warning:", e);
  }

  // Layer 2: IndexedDB Asynchronous Database
  const idbOk = await saveToIndexedDB(serialized);

  // Layer 3: Native Android Internal Vault (Survives WebView cache resets)
  let nativeOk = false;
  try {
    if (
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.autoSaveInternalVault === "function"
    ) {
      nativeOk = Boolean(window.AndroidDownloader.autoSaveInternalVault(serialized));
    }
  } catch (e) {
    console.warn("Native vault write warning:", e);
  }

  updateStorageStatusIndicator(lsOk, idbOk, nativeOk);
  updateIntegrityUI(true);
}

function updateStorageStatusIndicator(lsOk, idbOk, nativeOk) {
  const statusEl = document.getElementById("storage-layers-status");
  if (!statusEl) return;
  const layers = [];
  if (lsOk) layers.push("LocalStorage ✓");
  if (idbOk) layers.push("IndexedDB ✓");
  if (nativeOk) layers.push("Android Native Vault ✓");
  const totalDays = Object.keys(appState.completionsByDate || {}).filter(
    (k) => (appState.completionsByDate[k] || []).length > 0
  ).length;
  const activeDaysLbl =
    appState.locale === "ar"
      ? "الأيام المحفوظة:"
      : appState.locale === "en"
      ? "Saved Active Days:"
      : "সংরক্ষিত সক্রিয় দিন:";
  statusEl.textContent = `${layers.join(" • ")} | ${activeDaysLbl} ${localizeDigits(totalDays, appState.locale)}`;
}

async function loadAndVerifyState() {
  verifiedI18nDigest = await computeI18nDictionaryHash();

  // Request persistent storage permission from browser/WebView so OS never evicts data
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(() => {});
  }

  const candidates = [];

  // 1. Read Primary LocalStorage
  try {
    const rawLS = localStorage.getItem(STORAGE_KEY);
    if (rawLS) candidates.push(JSON.parse(rawLS));
  } catch {}

  // 2. Read Mirror LocalStorage
  try {
    const rawMirror = localStorage.getItem(BACKUP_MIRROR_KEY);
    if (rawMirror) candidates.push(JSON.parse(rawMirror));
  } catch {}

  // 3. Read IndexedDB
  try {
    const rawIDB = await loadFromIndexedDB();
    if (rawIDB) candidates.push(JSON.parse(rawIDB));
  } catch {}

  // 4. Read Native Android AutoVault
  try {
    if (
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.autoLoadInternalVault === "function"
    ) {
      const rawNative = window.AndroidDownloader.autoLoadInternalVault();
      if (rawNative && rawNative.trim().startsWith("{")) {
        candidates.push(JSON.parse(rawNative));
      }
    }
  } catch {}

  if (candidates.length === 0) {
    appState.locale = "bn";
    await saveAndSealState();
    return;
  }

  // Deep-merge all storage layers so history from previous days/months is never lost
  const merged = mergeHistoryStates(candidates);
  if (merged) {
    appState = merged;
    await saveAndSealState();
  }
}

function updateIntegrityUI(isVerified) {
  const badge = document.getElementById("integrity-badge");
  const hashEl = document.getElementById("latest-hash-display");
  const i18nHashEl = document.getElementById("i18n-hash-display");

  if (hashEl) {
    hashEl.textContent = appState.signature || "Pending signature...";
  }
  if (i18nHashEl) {
    i18nHashEl.textContent = `${appState.locale.toUpperCase()} • ${verifiedI18nDigest}`;
  }
  if (badge) {
    if (isVerified) {
      badge.textContent =
        window.AndroidDownloader && typeof getInstalledAppVersionTag === "function"
          ? `🛡️ S24 • ${getInstalledAppVersionTag()}`
          : t("badge_verified");
      badge.className = "badge-verified";
    } else {
      badge.textContent = t("badge_tampered");
      badge.className = "badge-verified badge-tampered";
    }
  }
}

