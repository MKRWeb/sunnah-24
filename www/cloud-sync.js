/**
 * ===================================================
 * SUNNAH-24: LIFELONG CLOUD SYNC & STREAK PROTECTION ENGINE (cloud-sync.js)
 * Rename this file to `cloud-sync.js` and upload it to your GitHub repo root.
 * ============================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// ----------------------------------------------------------------------------
// STEP 1: PASTE YOUR FIREBASE CONFIG BELOW (From console.firebase.google.com)
// ----------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCqdAA7TjVUy6sQ5BZIxgzJGasxdgTAOLk",
  authDomain: "sunnah-24-sync.firebaseapp.com",
  projectId: "sunnah-24-sync",
  storageBucket: "sunnah-24-sync.firebasestorage.app",
  messagingSenderId: "653478860032",
  appId: "1:653478860032:web:8882e5wb3b7e2939788fe5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Enable IndexedDB persistent cache so offline checks sync automatically later
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

let currentUser = null;
let syncTimer = null;
let isRestoringFromCloud = false;

// ----------------------------------------------------------------------------
// STEP 2: LOCK BROWSER STORAGE AGAINST OS AUTO-EVICTION
// ----------------------------------------------------------------------------
async function enableOSPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const granted = await navigator.storage.persist();
      console.log("[Sunnah-24] OS Persistent Storage lock:", granted);
    } catch (e) {
      console.warn("[Sunnah-24] Storage persist check failed:", e);
    }
  }
}

// ----------------------------------------------------------------------------
// STEP 3: SNAPSHOT ALL SUNNAH-24 LOCALSTORAGE KEYS
// ----------------------------------------------------------------------------
function captureLocalStorageSnapshot() {
  const snapshot = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !key.startsWith("firebase:") && !key.startsWith("__firebase")) {
      snapshot[key] = localStorage.getItem(key);
    }
  }
  return snapshot;
}

// ----------------------------------------------------------------------------
// STEP 4: SMART STREAK & HISTORY MERGE (Protects Against Cache Wipes)
// ----------------------------------------------------------------------------
function mergeLocalAndCloudState(localData, cloudData) {
  const merged = { ...localData };
  const rawSetItem = window.__sunnahRawSetItem || localStorage.setItem.bind(localStorage);

  for (const [key, cloudRaw] of Object.entries(cloudData)) {
    if (key === "updatedAt" || key === "lastSyncedDevice") continue;
    const localRaw = localData[key];

    // Case A: Key missing locally (e.g. user cleared browser cache or switched phones)
    if (localRaw === undefined || localRaw === null || localRaw === "") {
      merged[key] = cloudRaw;
      rawSetItem(key, cloudRaw);
      continue;
    }

    // Case B: Both exist -> intelligently merge JSON objects, arrays, or streak numbers
    try {
      const localParsed = JSON.parse(localRaw);
      const cloudParsed = JSON.parse(cloudRaw);

      // 1. Plain Numbers (e.g., direct streak counter keys)
      if (typeof localParsed === "number" && typeof cloudParsed === "number") {
        const bestVal = Math.max(localParsed, cloudParsed);
        merged[key] = JSON.stringify(bestVal);
        rawSetItem(key, merged[key]);
      }
      // 2. Arrays (e.g., array of completed date strings ["2026-11-05", "2026-11-06"])
      else if (Array.isArray(localParsed) && Array.isArray(cloudParsed)) {
        const combinedSet = Array.from(new Set([...cloudParsed, ...localParsed]));
        merged[key] = JSON.stringify(combinedSet);
        rawSetItem(key, merged[key]);
      }
      // 3. Objects (e.g., daily logs, nested streak stats, or settings)
      else if (
        typeof localParsed === "object" &&
        localParsed !== null &&
        typeof cloudParsed === "object" &&
        cloudParsed !== null
      ) {
        const combinedObj = { ...cloudParsed, ...localParsed };

        // Deep merge nested date dictionaries so no completed Sunnah task is lost
        for (const subKey of Object.keys(cloudParsed)) {
          if (
            typeof cloudParsed[subKey] === "object" &&
            cloudParsed[subKey] !== null &&
            typeof localParsed[subKey] === "object" &&
            localParsed[subKey] !== null &&
            !Array.isArray(cloudParsed[subKey])
          ) {
            combinedObj[subKey] = { ...cloudParsed[subKey], ...localParsed[subKey] };
          }
        }

        // Protect numeric streak properties inside state objects
        const streakFields = ["streak", "currentStreak", "bestStreak", "longestStreak", "totalDays"];
        for (const field of streakFields) {
          if (typeof cloudParsed[field] === "number" || typeof localParsed[field] === "number") {
            combinedObj[field] = Math.max(
              Number(cloudParsed[field] || 0),
              Number(localParsed[field] || 0)
            );
          }
        }

        merged[key] = JSON.stringify(combinedObj);
        rawSetItem(key, merged[key]);
      }
    } catch (err) {
      // Non-JSON string value: keep local value unless empty
      merged[key] = localRaw || cloudRaw;
      rawSetItem(key, merged[key]);
    }
  }

  return merged;
}

// ----------------------------------------------------------------------------
// STEP 5: PUSH LOCAL CHANGES TO FIRESTORE (Debounced)
// ----------------------------------------------------------------------------
export async function syncToCloud(immediate = false) {
  if (!currentUser || isRestoringFromCloud) return;

  updateSyncStatusUI("syncing", "Syncing streak to cloud...", currentUser.email);
  clearTimeout(syncTimer);

  const executePush = async () => {
    try {
      const userDocRef = doc(db, "sunnah24_users", currentUser.uid);
      const snapshot = captureLocalStorageSnapshot();
      await setDoc(
        userDocRef,
        {
          ...snapshot,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
      updateSyncStatusUI("online", "Lifelong Cloud Backup Active", currentUser.email);
    } catch (error) {
      console.error("[Sunnah-24] Cloud push error:", error);
      updateSyncStatusUI("offline", "Saved locally (Offline mode)", currentUser.email);
    }
  };

  if (immediate) {
    await executePush();
  } else {
    syncTimer = setTimeout(executePush, 700);
  }
}

// ----------------------------------------------------------------------------
// STEP 6: PULL & RECONCILE ON LOGIN OR CACHE RECOVERY
// ----------------------------------------------------------------------------
async function restoreAndMergeFromCloud(user) {
  isRestoringFromCloud = true;
  updateSyncStatusUI("syncing", "Restoring your lifelong streak...", user.email);

  try {
    const userDocRef = doc(db, "sunnah24_users", user.uid);
    const docSnap = await getDoc(userDocRef);
    const beforeSnapshot = JSON.stringify(captureLocalStorageSnapshot());
    const localData = captureLocalStorageSnapshot();

    if (docSnap.exists()) {
      const cloudData = docSnap.data();
      const mergedData = mergeLocalAndCloudState(localData, cloudData);

      await setDoc(
        userDocRef,
        {
          ...mergedData,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );

      const afterSnapshot = JSON.stringify(captureLocalStorageSnapshot());
      if (beforeSnapshot !== afterSnapshot) {
        // Trigger UI refresh if streak/history was recovered from the cloud
        window.dispatchEvent(new Event("storage"));
        if (typeof window.initApp === "function") {
          window.initApp();
        } else if (typeof window.renderApp === "function") {
          window.renderApp();
        } else {
          window.location.reload();
        }
      }
    } else {
      // First-time cloud link: upload current local progress immediately
      await setDoc(userDocRef, {
        ...localData,
        updatedAt: new Date().toISOString()
      });
    }

    updateSyncStatusUI("online", "Lifelong Cloud Backup Active", user.email);
  } catch (error) {
    console.error("[Sunnah-24] Cloud restore error:", error);
    updateSyncStatusUI("offline", "Offline - Progress saved on device", user.email);
  } finally {
    isRestoringFromCloud = false;
  }
}

// ----------------------------------------------------------------------------
// STEP 7: ZERO-REFACTOR LOCALSTORAGE INTERCEPTOR
// Automatically detects whenever your existing app.js updates a streak or task
// ----------------------------------------------------------------------------
const originalSetItem = localStorage.setItem.bind(localStorage);
window.__sunnahRawSetItem = originalSetItem;

localStorage.setItem = function (key, value) {
  originalSetItem(key, value);
  if (key && !key.startsWith("firebase:") && !key.startsWith("__firebase") && currentUser) {
    syncToCloud(false);
  }
};

// ----------------------------------------------------------------------------
// STEP 8: WIRE UP UI BUTTONS & AUTH LISTENERS
// ----------------------------------------------------------------------------
function updateSyncStatusUI(state, titleText, subtitleText) {
  const dot = document.getElementById("sync-status-dot");
  const title = document.getElementById("sync-title");
  const sub = document.getElementById("sync-subtitle");
  const heroDot = document.getElementById("hero-sync-dot");
  const heroText = document.getElementById("hero-sync-text");
  const storageLayers = document.getElementById("storage-layers-status");

  if (dot) dot.className = `status-dot ${state}`;
  if (title) title.textContent = titleText;
  if (sub) sub.textContent = subtitleText;

  if (heroDot) heroDot.className = `status-dot ${state}`;
  if (heroText) {
    heroText.textContent =
      state === "online"
        ? "☁️ ক্লাউড সিঙ্ক সক্রিয়"
        : state === "syncing"
        ? "🔄 সিঙ্ক হচ্ছে..."
        : "☁️ ক্লাউড ব্যাকআপ";
  }
  if (storageLayers && state === "online") {
    storageLayers.textContent = "LocalStorage + IndexedDB + Native Vault + Firebase Cloud Active";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  enableOSPersistentStorage();

  const loginBtn = document.getElementById("btn-google-login");
  const syncNowBtn = document.getElementById("btn-sync-now");
  const logoutBtn = document.getElementById("btn-google-logout");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (err) {
        console.error("[Sunnah-24] Google Sign-In cancelled or failed:", err);
        updateSyncStatusUI("offline", "Sign-In Cancelled", "Tap Connect Google to try again");
      }
    });
  }

  if (syncNowBtn) {
    syncNowBtn.addEventListener("click", () => syncToCloud(true));
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => signOut(auth));
  }

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      if (loginBtn) loginBtn.style.display = "none";
      if (syncNowBtn) syncNowBtn.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      restoreAndMergeFromCloud(user);
    } else {
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (syncNowBtn) syncNowBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
      updateSyncStatusUI(
        "offline",
        "Local Storage Only",
        "Sign in to protect your streak forever"
      );
    }
  });
});

