// ============================================================================
// SUNNAH 24 — SNAP-TUBE-GRADE APK DOWNLOAD & SELF-UPDATE MANAGER (v2.0)
// Deterministic Version Guard + SHA-256 Artifact Integrity + Atomic State FSM
// Compatible with Capacitor 8 Android Bridge (`AndroidDownloader`) & Web/PWA
// ============================================================================

(function (global) {
  "use strict";

  const S24OtaState = Object.freeze({
    IDLE: "IDLE",
    CHECKING: "CHECKING",
    UPDATE_AVAILABLE: "UPDATE_AVAILABLE",
    DOWNLOADING: "DOWNLOADING",
    VERIFYING: "VERIFYING",
    READY_TO_INSTALL: "READY_TO_INSTALL",
    PERMISSION_REQUIRED: "PERMISSION_REQUIRED",
    UP_TO_DATE: "UP_TO_DATE",
    ERROR: "ERROR"
  });

  const DEFAULT_REPO_OWNER = "MKRWeb";
  const DEFAULT_REPO_NAME = "sunnah-24";
  const DEFAULT_RELEASE_API = `https://api.github.com/repos/${DEFAULT_REPO_OWNER}/${DEFAULT_REPO_NAME}/releases/latest`;
  const FALLBACK_APK_URL = `https://github.com/${DEFAULT_REPO_OWNER}/${DEFAULT_REPO_NAME}/releases/latest/download/Sunnah-24-v4.3-Enterprise-Signed.apk`;

  let currentState = S24OtaState.IDLE;
  let lastProgressPct = -1;
  let lastUiDispatchTs = 0;
  let pendingUpdateInfo = null;
  let installRetryTimer = null;

  function getLocale() {
    try {
      if (global.appState && typeof global.appState.locale === "string") {
        return global.appState.locale;
      }
    } catch (_) {}
    const htmlLang = (document.documentElement.lang || "bn").toLowerCase();
    if (htmlLang.startsWith("ar")) return "ar";
    if (htmlLang.startsWith("en")) return "en";
    return "bn";
  }

  function fmtNum(n) {
    const loc = getLocale();
    if (typeof global.localizeDigits === "function") {
      return global.localizeDigits(n, loc);
    }
    return String(n);
  }

  function parseVersionTokens(verStr) {
    if (!verStr || typeof verStr !== "string") return [0];
    const cleaned = verStr
      .trim()
      .replace(/^v/i, "")
      .split(/[-+]/)[0];
    const parts = cleaned.split(".").map((seg) => {
      const num = parseInt(seg.replace(/\D/g, ""), 10);
      return Number.isFinite(num) ? num : 0;
    });
    return parts.length > 0 ? parts : [0];
  }

  function compareVersions(remoteVer, localVer) {
    const a = parseVersionTokens(remoteVer);
    const b = parseVersionTokens(localVer);
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const av = i < a.length ? a[i] : 0;
      const bv = i < b.length ? b[i] : 0;
      if (av !== bv) {
        return av > bv ? 1 : -1;
      }
    }
    return 0;
  }

  function isValidHttpsUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== "string") return false;
    try {
      const parsed = new URL(rawUrl.trim());
      return parsed.protocol === "https:" && Boolean(parsed.hostname);
    } catch (_) {
      return false;
    }
  }

  function getNativeBridge() {
    const bridge = global.AndroidDownloader;
    if (!bridge || typeof bridge !== "object") return null;
    return bridge;
  }

  function isNativeAndroidContext() {
    if (getNativeBridge() !== null) return true;
    try {
      if (
        global.Capacitor &&
        typeof global.Capacitor.isNativePlatform === "function" &&
        global.Capacitor.isNativePlatform()
      ) {
        return true;
      }
    } catch (_) {}
    const proto = (global.location && global.location.protocol) || "";
    return proto === "capacitor:" || proto === "file:";
  }

  function getInstalledVersion() {
    const bridge = getNativeBridge();
    if (bridge && typeof bridge.getInstalledVersionName === "function") {
      try {
        const ver = bridge.getInstalledVersionName();
        if (typeof ver === "string" && ver.trim().length > 0) {
          return ver.trim();
        }
      } catch (_) {}
    }
    return "4.3.0";
  }

  function canSelfInstallApk() {
    const bridge = getNativeBridge();
    if (!bridge) return false;
    if (typeof bridge.isSelfUpdateSupported === "function") {
      try {
        if (!bridge.isSelfUpdateSupported()) return false;
      } catch (_) {
        return false;
      }
    }
    return (
      typeof bridge.downloadAndAutoInstallVersionApk === "function" ||
      typeof bridge.downloadAndInstallApk === "function"
    );
  }

  function hasUnknownSourcePermission() {
    const bridge = getNativeBridge();
    if (!bridge || typeof bridge.canRequestPackageInstalls !== "function") {
      return true;
    }
    try {
      return Boolean(bridge.canRequestPackageInstalls());
    } catch (_) {
      return true;
    }
  }

  function extractExpectedSha256(releaseObj, apkAsset) {
    if (apkAsset && typeof apkAsset.digest === "string") {
      const m = apkAsset.digest.match(/sha256:([a-fA-F0-9]{64})/);
      if (m) return m[1].toLowerCase();
    }
    if (releaseObj && typeof releaseObj.body === "string") {
      const m = releaseObj.body.match(/sha256[:\s=]+([a-fA-F0-9]{64})/i);
      if (m) return m[1].toLowerCase();
    }
    return "";
  }

  function getLocalizedStrings(versionTag, isCached) {
    const loc = getLocale();
    const safeVer = String(versionTag || "latest");

    if (loc === "ar") {
      return {
        title: `تحديث متاح (${safeVer}) • سنة ٢٤`,
        subReady: isCached
          ? "ملف التحديث جاهز على الجهاز. اضغط للتثبيت الآن."
          : "تنزيل مباشر وتثبيت تلقائي مثل سناب تيوب.",
        subPerm: "فعّل «السماح من هذا المصدر» ثم عد لتشغيل المثبّت تلقائياً.",
        ctaInstall: "تثبيت الآن",
        ctaDownload: "تحميل وتثبيت",
        ctaAllow: "السماح والتثبيت",
        ctaDismiss: "لاحقاً",
        upToDate: `أنت تستخدم أحدث إصدار (${safeVer}).`
      };
    }

    if (loc === "en") {
      return {
        title: `Update Ready (${safeVer}) • Sunnah 24`,
        subReady: isCached
          ? "Verified APK is cached on device. Tap to install."
          : "Direct APK download + one-tap package installer launch.",
        subPerm: "Enable 'Allow from this source' in Settings; installer resumes automatically.",
        ctaInstall: "Install Now",
        ctaDownload: "Download & Install",
        ctaAllow: "Allow & Install",
        ctaDismiss: "Later",
        upToDate: `You are on the latest version (${safeVer}).`
      };
    }

    return {
      title: `নতুন আপডেট (${safeVer}) • সুন্নাহ ২৪`,
      subReady: isCached
        ? "যাচাইকৃত APK ফাইলটি ফোনে প্রস্তুত আছে। এখনই ইনস্টল করুন।"
        : "সরাসরি APK ডাউনলোড ও স্বয়ংক্রিয় ইনস্টলার চালু হবে।",
      subPerm: "সেটিংস থেকে 'Allow from this source' চালু করে ব্যাক করুন—ইনস্টল শুরু হবে।",
      ctaInstall: "এখনই ইনস্টল করুন",
      ctaDownload: "ডাউনলোড ও ইনস্টল",
      ctaAllow: "অনুমতি ও ইনস্টল",
      ctaDismiss: "পরে",
      upToDate: `আপনি সর্বশেষ সংস্করণ (${safeVer}) ব্যবহার করছেন।`
    };
  }

  function ensureOtaBannerNode() {
    let banner = document.getElementById("s24-update-banner");
    if (banner) return banner;

    banner = document.createElement("div");
    banner.id = "s24-update-banner";
    banner.className = "update-banner-card";
    banner.style.display = "none";

    banner.innerHTML = `
      <div class="update-banner-content">
        <span>📲</span>
        <div style="flex:1;min-width:0;">
          <strong id="s24-update-title"></strong>
          <small id="s24-update-status"></small>
          <div id="s24-update-progress-wrap" class="progress-track" style="display:none;height:7px;margin:7px 0 2px;">
            <div id="s24-update-progress-bar" class="progress-fill" style="width:0%;"></div>
          </div>
        </div>
      </div>
      <div class="update-banner-actions">
        <button type="button" id="trigger-native-update-btn" class="btn-update-action" style="background:var(--accent-gold,#b45309);color:#ffffff;font-weight:700;"></button>
        <button type="button" id="s24-update-dismiss-btn" class="btn-update-dismiss"></button>
      </div>
    `;

    document.body.appendChild(banner);

    const dismissBtn = document.getElementById("s24-update-dismiss-btn");
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        banner.style.display = "none";
      });
    }

    const actionBtn = document.getElementById("trigger-native-update-btn");
    if (actionBtn) {
      actionBtn.addEventListener("click", () => {
        handleActionButtonClick();
      });
    }

    return banner;
  }

  function renderOtaBanner(info, isCached = false) {
    if (!info) return;
    const banner = ensureOtaBannerNode();
    const strings = getLocalizedStrings(info.versionTag, isCached);
    const titleEl = document.getElementById("s24-update-title");
    const statusEl = document.getElementById("s24-update-status");
    const btnEl = document.getElementById("trigger-native-update-btn");
    const dismissEl = document.getElementById("s24-update-dismiss-btn");

    if (titleEl) titleEl.textContent = strings.title;
    if (dismissEl) dismissEl.textContent = strings.ctaDismiss;

    const hasPerm = hasUnknownSourcePermission();
    if (btnEl) {
      btnEl.disabled = false;
      if (isCached && hasPerm) {
        btnEl.textContent = strings.ctaInstall;
        btnEl.style.background = "var(--accent-emerald,#10b981)";
        btnEl.style.color = "#ffffff";
      } else if (isCached && !hasPerm) {
        btnEl.textContent = strings.ctaAllow;
        btnEl.style.background = "var(--accent-gold,#b45309)";
        btnEl.style.color = "#ffffff";
      } else {
        btnEl.textContent = strings.ctaDownload;
        btnEl.style.background = "var(--accent-gold,#b45309)";
        btnEl.style.color = "#ffffff";
      }
    }

    if (statusEl) {
      statusEl.textContent = !hasPerm ? strings.subPerm : strings.subReady;
    }

    banner.style.display = "block";
    banner.classList.remove("hidden");
  }

  function triggerNativeInstallation(info) {
    const bridge = getNativeBridge();
    if (!bridge || !info || !isValidHttpsUrl(info.apkUrl)) return false;

    if (!hasUnknownSourcePermission()) {
      currentState = S24OtaState.PERMISSION_REQUIRED;
      if (typeof bridge.openUnknownSourceSettings === "function") {
        try {
          bridge.openUnknownSourceSettings();
        } catch (_) {}
      }
      if (installRetryTimer) clearTimeout(installRetryTimer);
      installRetryTimer = setTimeout(() => {
        if (hasUnknownSourcePermission() && pendingUpdateInfo) {
          invokeBridgeDownload(pendingUpdateInfo);
        }
      }, 1500);
      return true;
    }

    return invokeBridgeDownload(info);
  }

  function invokeBridgeDownload(info) {
    const bridge = getNativeBridge();
    if (!bridge || !info || !isValidHttpsUrl(info.apkUrl)) return false;

    currentState = S24OtaState.DOWNLOADING;
    lastProgressPct = 0;

    const btnEl = document.getElementById("trigger-native-update-btn");
    const progWrap = document.getElementById("s24-update-progress-wrap");
    const progBar = document.getElementById("s24-update-progress-bar");

    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = `⬇️ ${fmtNum(0)}%`;
    }
    if (progWrap) progWrap.style.display = "block";
    if (progBar) progBar.style.width = "0%";

    try {
      if (typeof bridge.downloadAndAutoInstallVersionApk === "function") {
        if (typeof bridge.downloadAndAutoInstallVersionApk.length >= 3) {
          bridge.downloadAndAutoInstallVersionApk(
            info.apkUrl,
            info.versionTag,
            info.sha256 || ""
          );
        } else {
          bridge.downloadAndAutoInstallVersionApk(info.apkUrl, info.versionTag);
        }
        return true;
      }
      if (typeof bridge.downloadAndInstallApk === "function") {
        bridge.downloadAndInstallApk(info.apkUrl);
        return true;
      }
    } catch (err) {
      currentState = S24OtaState.ERROR;
      if (btnEl) btnEl.disabled = false;
      const statusEl = document.getElementById("s24-update-status");
      if (statusEl) statusEl.textContent = `⚠️ ${err && err.message ? err.message : "Download failed"}`;
    }
    return false;
  }

  function handleActionButtonClick() {
    const info = pendingUpdateInfo || {
      versionTag: "latest",
      apkUrl: FALLBACK_APK_URL,
      sha256: ""
    };

    if (!isNativeAndroidContext()) {
      const a = document.createElement("a");
      a.href = isValidHttpsUrl(info.apkUrl) ? info.apkUrl : FALLBACK_APK_URL;
      a.setAttribute("download", "");
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => a.remove(), 1000);
      return;
    }

    const bridge = getNativeBridge();
    if (bridge && typeof bridge.isVersionApkCached === "function") {
      try {
        if (bridge.isVersionApkCached(info.versionTag) && hasUnknownSourcePermission()) {
          currentState = S24OtaState.READY_TO_INSTALL;
          if (typeof bridge.installCachedVersionApk === "function") {
            bridge.installCachedVersionApk(info.versionTag);
            return;
          }
          if (typeof bridge.installLocalApk === "function") {
            bridge.installLocalApk();
            return;
          }
        }
      } catch (_) {}
    }

    triggerNativeInstallation(info);
  }

  async function checkForLatestApkUpdate(options = {}) {
    const manual = Boolean(options && options.manual);
    if (!manual && !canSelfInstallApk()) {
      return null;
    }

    if (currentState === S24OtaState.CHECKING || currentState === S24OtaState.DOWNLOADING) {
      return pendingUpdateInfo;
    }

    currentState = S24OtaState.CHECKING;
    const installedVer = getInstalledVersion();

    try {
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 9000) : null;

      const resp = await fetch(DEFAULT_RELEASE_API, {
        cache: "no-store",
        signal: controller ? controller.signal : undefined,
        headers: { Accept: "application/vnd.github+json" }
      });

      if (timeoutId) clearTimeout(timeoutId);
      if (!resp || !resp.ok) {
        currentState = S24OtaState.IDLE;
        return null;
      }

      const releaseData = await resp.json();
      const latestTag = releaseData && typeof releaseData.tag_name === "string"
        ? releaseData.tag_name.trim()
        : "";

      if (!latestTag) {
        currentState = S24OtaState.IDLE;
        return null;
      }

      const cmp = compareVersions(latestTag, installedVer);
      if (cmp <= 0) {
        currentState = S24OtaState.UP_TO_DATE;
        if (manual && typeof global.showTimeLockToast === "function") {
          global.showTimeLockToast(getLocalizedStrings(installedVer, false).upToDate);
        }
        return null;
      }

      const assets = Array.isArray(releaseData.assets) ? releaseData.assets : [];
      const apkAsset = assets.find(
        (a) =>
          a &&
          typeof a.name === "string" &&
          a.name.toLowerCase().endsWith(".apk") &&
          isValidHttpsUrl(a.browser_download_url)
      );

      if (!apkAsset) {
        currentState = S24OtaState.IDLE;
        return null;
      }

      const info = {
        versionTag: latestTag,
        installedVersion: installedVer,
        apkUrl: apkAsset.browser_download_url,
        fileName: apkAsset.name,
        sizeBytes: Number(apkAsset.size) || 0,
        sha256: extractExpectedSha256(releaseData, apkAsset)
      };

      pendingUpdateInfo = info;
      currentState = S24OtaState.UPDATE_AVAILABLE;

      let cached = false;
      const bridge = getNativeBridge();
      if (bridge && typeof bridge.isVersionApkCached === "function") {
        try {
          cached = Boolean(bridge.isVersionApkCached(latestTag));
        } catch (_) {}
      }

      renderOtaBanner(info, cached);
      return info;
    } catch (_) {
      currentState = S24OtaState.ERROR;
      return null;
    }
  }

  global.onSunnahApkDownloadProgress = function (percent, statusText) {
    const pctNum = Number(percent);
    const nowTs = Date.now();

    if (Number.isFinite(pctNum) && pctNum >= 0 && pctNum < 100) {
      if (pctNum === lastProgressPct && nowTs - lastUiDispatchTs < 250) {
        return;
      }
      lastProgressPct = pctNum;
      lastUiDispatchTs = nowTs;
    }

    const banner = ensureOtaBannerNode();
    banner.style.display = "block";
    banner.classList.remove("hidden");

    const progWrap = document.getElementById("s24-update-progress-wrap");
    const progBar = document.getElementById("s24-update-progress-bar");
    const btnEl = document.getElementById("trigger-native-update-btn");
    const statusEl = document.getElementById("s24-update-status");

    if (Number.isFinite(pctNum) && pctNum >= 0) {
      const clamped = Math.max(0, Math.min(100, Math.round(pctNum)));
      if (progWrap) progWrap.style.display = "block";
      if (progBar) progBar.style.width = `${clamped}%`;
      if (btnEl && clamped < 100) {
        btnEl.disabled = true;
        btnEl.textContent = `⬇️ ${fmtNum(clamped)}%`;
      }
    }

    if (typeof statusText === "string" && statusText.length > 0 && statusEl) {
      statusEl.textContent = statusText;
    }

    if (pctNum >= 100) {
      currentState = S24OtaState.READY_TO_INSTALL;
      const info = pendingUpdateInfo || { versionTag: "latest", apkUrl: FALLBACK_APK_URL, sha256: "" };
      const strings = getLocalizedStrings(info.versionTag, true);
      const hasPerm = hasUnknownSourcePermission();
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.style.background = hasPerm ? "var(--accent-emerald,#10b981)" : "var(--accent-gold,#b45309)";
        btnEl.style.color = "#ffffff";
        btnEl.textContent = hasPerm ? strings.ctaInstall : strings.ctaAllow;
      }
    } else if (pctNum < 0) {
      currentState = S24OtaState.ERROR;
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = getLocalizedStrings(
          (pendingUpdateInfo && pendingUpdateInfo.versionTag) || "latest",
          false
        ).ctaDownload;
      }
    }
  };

  global.Sunnah24ApkUpdater = Object.freeze({
    states: S24OtaState,
    getState: () => currentState,
    compareVersions,
    getInstalledVersion,
    canSelfInstallApk,
    checkForUpdate: checkForLatestApkUpdate,
    startInstall: handleActionButtonClick
  });

  document.addEventListener("DOMContentLoaded", () => {
    const webApkBtn = document.getElementById("web-apk-download-btn");
    if (webApkBtn && !isNativeAndroidContext()) {
      webApkBtn.classList.remove("hidden");
    } else if (webApkBtn && isNativeAndroidContext()) {
      webApkBtn.classList.add("hidden");
    }

    if (canSelfInstallApk()) {
      setTimeout(() => {
        checkForLatestApkUpdate({ manual: false });
      }, 2400);
    }
  });
})(window);

