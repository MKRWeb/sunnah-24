/**
 * ============================================================================
 * SUNNAH-24: AUTOMATIC DEVICE JSON BACKUP ENGINE (auto-device-backup.js)
 * Rename this file to `auto-device-backup.js` and upload it to your GitHub repo root.
 * ============================================================================
 */

let autoBackupTimer = null;

// 1. Generate and trigger a silent background JSON file download on the device
function triggerDeviceJsonBackup() {
  try {
    const snapshot = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith("firebase:") && !key.startsWith("__firebase")) {
        snapshot[key] = localStorage.getItem(key);
      }
    }

    const exportData = {
      version: "4.2",
      appName: "Sunnah-24 Auto-Backup",
      backupDate: new Date().toISOString(),
      data: snapshot
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    
    // Format filename with current date: sunnah-24-autobackup-2026-11-06.json
    const dateStamp = new Date().toISOString().split("T")[0];
    downloadAnchor.setAttribute("download", `sunnah-24-autobackup-${dateStamp}.json`);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    console.log("[Sunnah-24] Automatic device JSON backup triggered successfully.");
  } catch (err) {
    console.error("[Sunnah-24] Auto-device backup failed:", err);
  }
}

// 2. Debounced auto-backup hook (runs 5 seconds after a user finishes checking off tasks)
export function scheduleAutoDeviceBackup() {
  clearTimeout(autoBackupTimer);
  autoBackupTimer = setTimeout(() => {
    // Only auto-download once per day to avoid spamming the downloads folder
    const lastAutoBackup = localStorage.getItem("s24_last_autobackup_date");
    const todayStr = new Date().toISOString().split("T")[0];

    if (lastAutoBackup !== todayStr) {
      triggerDeviceJsonBackup();
      localStorage.setItem("s24_last_autobackup_date", todayStr);
    }
  }, 5000);
}

// 3. Intercept localStorage changes to trigger auto-backup scheduling
const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
  originalSetItem(key, value);
  if (key && !key.startsWith("firebase:") && !key.startsWith("__firebase")) {
    scheduleAutoDeviceBackup();
  }
};
