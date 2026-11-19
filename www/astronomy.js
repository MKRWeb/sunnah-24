// ============================================================================
// SUNNAH 24 — ASTRONOMICAL PRAYER ENGINE, GEOLOCATION DETECTOR, TIME-WINDOW
// LOCKS, HIJRI & BANGLA PONJIKA CALENDARS, PROHIBITED & NAFL SCHEDULES
// ============================================================================

// ============================================================================
// UNCRACKABLE FRIDAY (JUMU'AH) DETECTION & DYNAMIC WAQT RESOLVER ENGINE
// Automatically detects Friday (Yawm al-Jumu'ah, getDay() === 5) and resolves
// all Dhuhr Waqt labels, ongoing live prayer titles, prime time (Awwal Waqt)
// cards, 5-Waqt strip pills, Zawal next-waqt prompts, and Habit #11 into Jumu'ah
// (জুমু'আ / الجمعة / Jumu'ah) with 100% real-time accuracy.
// ============================================================================
function isFridayJumuahDay(dateObj = new Date()) {
  const safeDate =
    dateObj instanceof Date && !isNaN(dateObj.getTime()) ? dateObj : new Date();
  return safeDate.getDay() === 5;
}

function resolveMiddayWaqtMeta(dateObj = new Date(), locale = appState.locale) {
  const isJumuah = isFridayJumuahDay(dateObj);
  const lang = locale || "bn";

  if (isJumuah) {
    return {
            isJumuah: true,
      pillName:
        lang === "bn" ? "জুমু'আ" : lang === "ar" ? "الجمعة" : "Jumu'ah",
      pillIcon: "🕌",
      liveMainTitle:
        lang === "bn"
          ? "জুমু'আ"
          : lang === "ar"
          ? "الجمعة"
          : "Jumu'ah",
      primeWindowLabel:
        lang === "bn"
          ? "জুমু'আর উত্তম সময় (আউয়াল ওয়াক্ত)"
          : lang === "ar"
          ? "الوقت المختار للجمعة (أول الوقت)"
          : "Jumu'ah Prime Time (Awwal Waqt)",
      primeActiveSubtext: (endClock) =>
        lang === "bn"
          ? `খুতবা শ্রবণ, ফরজ ২ রাকাত ও সুন্নাত: পূর্বে ৪ এবং পরে ৪ (অথবা ২+২) রাকাত (জুমু'আ/যোহর আসরের পূর্ব ${endClock} পর্যন্ত জায়েয)`
          : lang === "ar"
          ? `الإنصات للخطبة وصلاة الجمعة والسنن الرواتب: ٤ قبلها و٤ (أو ٢) بعدها (يمتد الوقت حتى ${endClock})`
          : `Listen to Khutbah, 2 Rak'ah Jumu'ah Fard & Sunnah: 4 before & 4 (or 2) after (Valid until ${endClock})`,
      primeEndedSubtext: (endClock) =>
        lang === "bn"
          ? `আউয়াল ওয়াক্ত সমাপ্ত (জুমু'আ / যোহরের ওয়াক্ত আসরের পূর্ব ${endClock} পর্যন্ত জায়েয)`
          : lang === "ar"
          ? `انتهى أول الوقت (وقت الجمعة / الظهر ممتد حتى ${endClock})`
          : `Awwal Waqt ended (Jumu'ah / Dhuhr window valid until ${endClock})`,
      zawalWaitWarning:
        lang === "bn"
          ? "সূর্য ঠিক মাথার ওপরে (যাওয়াল) — জুমু'আর ওয়াক্ত শুরু হওয়া পর্যন্ত সালাত নিষিদ্ধ (সহীহ মুসলিম ৮৩১)"
          : lang === "ar"
          ? "الشمس في كبد السماء (الزوال) — تحرم الصلاة حتى يدخل وقت الجمعة (مسلم ٨٣١)"
          : "Sun at meridian zenith (Zawal) — Salah is forbidden until Jumu'ah Waqt begins",
      zawalNextWaqtLabel: (startClock) =>
        lang === "bn"
          ? `পরবর্তী ওয়াক্ত: জুমু'আ (${startClock})`
          : lang === "ar"
          ? `الصلاة القادمة: الجمعة (${startClock})`
          : `Next Waqt: Jumu'ah (${startClock})`
    };
  }

  return {
    isJumuah: false,
    pillName: t("waqt_dhuhr"),
    pillIcon: "☀️",
        liveMainTitle:
      lang === "bn"
        ? "যোহর"
        : lang === "ar"
        ? "الظهر"
        : "Dhuhr",
    primeWindowLabel:
      lang === "bn"
        ? "যোহরের উত্তম সময় (আউয়াল ওয়াক্ত)"
        : lang === "ar"
        ? "الوقت المختار للظهر (أول الوقت)"
        : "Dhuhr Prime Time (Awwal Waqt)",
    primeActiveSubtext: (endClock) =>
      lang === "bn"
        ? `প্রথম অংশ ও সুন্নাত: ফরজের পূর্বে ৪ রাকাত ও পরে ২ রাকাত (যোহর আসরের পূর্ব ${endClock} পর্যন্ত জায়েয)`
        : lang === "ar"
        ? `السنن الرواتب: ٤ قبلها و٢ بعدها (الظهر ممتد حتى ${endClock})`
        : `Rawatib Sunnah: 4 before & 2 after Fard (Valid until ${endClock})`,
    primeEndedSubtext: (endClock) =>
      lang === "bn"
        ? `আউয়াল ওয়াক্ত সমাপ্ত (যোহর আসরের পূর্ব ${endClock} পর্যন্ত জায়েয)`
        : lang === "ar"
        ? `انتهى أول الوقت (الظهر ممتد حتى ${endClock})`
        : `Awwal Waqt ended (Dhuhr valid until ${endClock})`,
    zawalWaitWarning:
      lang === "bn"
        ? "সূর্য ঠিক মাথার ওপরে (যাওয়াল) — যোহর শুরু হওয়া পর্যন্ত সালাত নিষিদ্ধ (সহীহ মুসলিম ৮৩১)"
        : lang === "ar"
        ? "الشمس في كبد السماء (الزوال) — تحرم الصلاة حتى تزول الشمس (مسلم ٨٣١)"
        : "Sun at meridian zenith (Zawal) — Salah is forbidden until Dhuhr begins",
    zawalNextWaqtLabel: (startClock) =>
      lang === "bn"
        ? `পরবর্তী ওয়াক্ত: যোহর (${startClock})`
        : lang === "ar"
        ? `الصلاة القادمة: الظهر (${startClock})`
        : `Next Waqt: Dhuhr (${startClock})`
  };
}

function getHabitTitle(habit, dateObj = new Date()) {
  if (habit && habit.id === "s24_11_dhuhr_rawatib" && isFridayJumuahDay(dateObj)) {
    if (appState.locale === "bn") {
      return "১১. জুমু'আর ফরজ সালাত ও সুন্নাতে মুয়াক্কাদাহ (পূর্বে ৪, পরে ৪ বা ২)";
    }
    if (appState.locale === "ar") {
      return "١١. صلاة الجمعة والسنن الرواتب (٤ قبلها و٤ أو ٢ بعدها)";
    }
    return "11. Jumu'ah Fard Prayer & Rawatib Sunnahs (4 Before, 4 or 2 After)";
  }
  if (appState.locale === "bn") return habit.title_bn || habit.title;
  if (appState.locale === "ar") return habit.title_ar || habit.title;
  return habit.title;
}

function getHabitTime(habit, dateObj = new Date()) {
  if (habit.isCustom) return t("custom_time_label");
  const rawLabel =
    appState.locale === "bn"
      ? habit.time_bn || habit.time
      : appState.locale === "ar"
      ? habit.time_ar || habit.time
      : habit.time;

  // Extract the descriptive subtitle after '•' and pair it with the exact live seasonal Waqt start time!
  if (typeof computeSeasonalPrayerSchedule === "function" && rawLabel && rawLabel.includes("•")) {
    const parts = rawLabel.split("•");
    let descPart = parts.slice(1).join("•").trim();
    const nowObj = dateObj instanceof Date && !isNaN(dateObj.getTime()) ? dateObj : new Date();
    if (habit.id === "s24_11_dhuhr_rawatib" && isFridayJumuahDay(nowObj)) {
      descPart =
        appState.locale === "bn"
          ? "জুমু'আর সালাত"
          : appState.locale === "ar"
          ? "صلاة الجمعة"
          : "Jumu'ah Prayer";
    }
    const rule = getDynamicSeasonalHabitWindow(habit, nowObj);
    const isClosedDayGate =
      (rule && rule.fridayOnly && nowObj.getDay() !== 5) ||
      (rule && rule.fastingDaysOnly && !evaluateSunnahFastingDayStatus(nowObj).isFastingDay);
    if (rule && !(rule.start <= 5 && rule.end >= 1430) && !isClosedDayGate) {
      const dynamicStartStr = formatMinutesToLocalizedTime(rule.start, appState.locale);
      return `${dynamicStartStr} • ${descPart}`;
    }
  }
  return rawLabel;
}

function getHabitWisdom(habit) {
  if (habit.isCustom && habit.customFact) return habit.customFact;
  if (habit.isCustom) return t("custom_default_wisdom");
  if (appState.locale === "bn") return habit.wisdom_bn || habit.wisdom;
  if (appState.locale === "ar") return habit.wisdom_ar || habit.wisdom;
  return habit.wisdom;
}

function getHabitEvidence(habit) {
  if (habit.isCustom && habit.customFact) return habit.customFact;
  if (habit.isCustom) return t("custom_default_evidence");
  if (appState.locale === "bn") return habit.evidence_bn || habit.evidence;
  if (appState.locale === "ar") return habit.evidence_ar || habit.evidence;
  return habit.evidence;
}

function getSavedMadhabOverride() {
  try {
    const saved = localStorage.getItem(MADHAB_STORAGE_KEY);
    if (saved === "hanafi" || saved === "standard") return saved;
  } catch {}
  return null;
}

function loadCachedDeviceGeoCoords() {
  if (cachedDeviceGeoCoords) return cachedDeviceGeoCoords;
  try {
    const raw = localStorage.getItem(GEO_LOCATION_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.lat === "number" &&
        typeof parsed.lon === "number" &&
        Math.abs(parsed.lat) <= 90 &&
        Math.abs(parsed.lon) <= 180
      ) {
        cachedDeviceGeoCoords = parsed;
        return parsed;
      }
    }
  } catch {}
  return null;
}

function silentlyAcquireGpsPosition() {
  if (!("geolocation" in navigator)) return;
  try {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!pos || !pos.coords) return;
        const { latitude, longitude } = pos.coords;
        if (typeof latitude === "number" && typeof longitude === "number") {
          cachedDeviceGeoCoords = {
            lat: Number(latitude.toFixed(4)),
            lon: Number(longitude.toFixed(4)),
            ts: Date.now()
          };
          try {
            localStorage.setItem(GEO_LOCATION_CACHE_KEY, JSON.stringify(cachedDeviceGeoCoords));
          } catch {}
          if (typeof syncMadhabToggleUI === "function") syncMadhabToggleUI();
          renderHeaderDatesAndPhase();
          renderHabits();
          renderDuas();
        }
      },
      () => {
        // 100% silent fallback to IANA Timezone + UTC Meridian telemetry
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 1000 * 60 * 60 * 12 // Reuse cached fix for up to 12 hours silently
      }
    );
  } catch {}
}

// X (Twitter)-style Silent Background Multi-Tier Geographic Location Detector
// Never interrupts the user with intrusive permission dialogs:
// - Immediately resolves timezone & geographic hub via `Intl.DateTimeFormat().resolvedOptions().timeZone`
// - Checks `navigator.permissions.query({ name: 'geolocation' })` and only queries GPS silently if already granted
// - Monitors timezone shifts on app resume (`visibilitychange`) so travelling across regions updates prayer times silently
function initXStyleAutoGeographicDetector() {
  loadCachedDeviceGeoCoords();

  try {
    lastObservedTimezoneId =
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      String(new Date().getTimezoneOffset());
  } catch {}

  // Silent Permission Check: Only trigger hardware GPS if permission is already 'granted'
  if (navigator.permissions && typeof navigator.permissions.query === "function") {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permStatus) => {
        if (permStatus && permStatus.state === "granted") {
          silentlyAcquireGpsPosition();
        }
        if (permStatus) {
          permStatus.onchange = () => {
            if (permStatus.state === "granted") {
              silentlyAcquireGpsPosition();
            }
          };
        }
      })
      .catch(() => {});
  }

  // Silent Background Resume Watcher: If device changes timezone or returns to foreground, sync immediately
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      try {
        const currentTz =
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
          String(new Date().getTimezoneOffset());
        if (currentTz !== lastObservedTimezoneId) {
          lastObservedTimezoneId = currentTz;
          if (typeof syncMadhabToggleUI === "function") syncMadhabToggleUI();
          renderHeaderDatesAndPhase();
          renderHabits();
          renderDuas();
        }
      } catch {}
    }
  });
}

// Upazila-level micro-coordinate offsets so selecting a specific Upazila/Thana refines local solar transit
function computeUpazilaMicroCoordinates(districtObj, upazilaIndex, totalUpazilas) {
  if (!districtObj) return { lat: 24.0, lon: 89.85 };
  if (!upazilaIndex || upazilaIndex <= 0 || totalUpazilas <= 1) {
    return { lat: districtObj.lat, lon: districtObj.lon };
  }
  const norm = (upazilaIndex % 7) - 3;
  const latOffset = Number((norm * 0.018).toFixed(4));
  const lonOffset = Number((((upazilaIndex % 5) - 2) * 0.022).toFixed(4));
  return {
    lat: Number((districtObj.lat + latOffset).toFixed(4)),
    lon: Number((districtObj.lon + lonOffset).toFixed(4))
  };
}

function getSavedBdLocationSelection() {
  try {
    const raw = localStorage.getItem(BD_SELECTED_LOC_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.lat === "number" &&
      typeof parsed.lon === "number" &&
      parsed.divisionId &&
      parsed.districtId
    ) {
      return parsed;
    }
  } catch {}
  return null;
}

function saveBdLocationSelection(selectionObj) {
  try {
    if (!selectionObj) {
      localStorage.removeItem(BD_SELECTED_LOC_STORAGE_KEY);
      return;
    }
    localStorage.setItem(BD_SELECTED_LOC_STORAGE_KEY, JSON.stringify(selectionObj));
  } catch {}
}

// Automatically resolves the user's exact geographic calculation authority, coordinates,
// Region-Matched Asr Default (asrShadowFactor: 2 for South/Central Asia & Turkey; asrShadowFactor: 1
// for Middle East, Africa, Southeast Asia, and Western profiles), and applies the user's Madhab Toggle choice.
// Prioritizes user's selected Bangladesh Division -> District (all 64 Zilas) -> Upazila/Thana coordinates (BD_SELECTED_LOC_STORAGE_KEY):
function resolveActiveRegionalProfile(dateObj = new Date()) {
  const localTzOffsetHours = -dateObj.getTimezoneOffset() / 60;
  let tzName = "";
  try {
    tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {}

  const tzLower = tzName.toLowerCase();
  const gps = loadCachedDeviceGeoCoords();

  const savedBdLoc =
    typeof getSavedGlobalOrBdLocation === "function"
      ? getSavedGlobalOrBdLocation()
      : getSavedBdLocationSelection();

  // Finalize profile by prioritizing saved Global or Bangladesh location coordinates,
  // then overlaying consistent GPS coordinates, and applying user's Madhab Toggle preference
  const finalizeProfileWithGpsAndMadhab = (profileObj) => {
    if (savedBdLoc && typeof savedBdLoc.lat === "number" && typeof savedBdLoc.lon === "number") {
      profileObj.regionCode = savedBdLoc.regionCode || "BD";
      profileObj.subRegion = savedBdLoc.subRegion || "SOUTH_ASIA";
      profileObj.lat = savedBdLoc.lat;
      profileObj.lon = savedBdLoc.lon;
      profileObj.tzHours =
        typeof savedBdLoc.tzHours === "number" ? savedBdLoc.tzHours : 6.0;
      profileObj.fajrAngle =
        typeof savedBdLoc.fajrAngle === "number" ? savedBdLoc.fajrAngle : 18.0;
      profileObj.ishaAngle =
        typeof savedBdLoc.ishaAngle === "number" ? savedBdLoc.ishaAngle : 18.0;
      profileObj.ishaFixedMins =
        typeof savedBdLoc.ishaFixedMins === "number" ? savedBdLoc.ishaFixedMins : 0;
      profileObj.asrShadowFactor = savedBdLoc.asrShadowFactor === 1 ? 1 : 2;
      profileObj.bdLocationMeta = savedBdLoc;
      profileObj.geoSource = "GLOBAL_OR_BD_SELECTOR";
    } else if (gps && typeof gps.lat === "number" && typeof gps.lon === "number") {
      const expectedLon = localTzOffsetHours * 15;
      if (Math.abs(gps.lon - expectedLon) <= 38) {
        profileObj.lat = gps.lat;
        profileObj.lon = gps.lon;
        profileObj.geoSource = "GPS+IANA";
      } else {
        profileObj.geoSource = "IANA_TZ";
      }
    } else {
      profileObj.geoSource = "IANA_TZ";
    }

    // Store the automatic Region-Matched Default before checking user's manual Madhab Toggle override
    const regionalDefaultFactor = profileObj.asrShadowFactor === 1 ? 1 : 2;
    profileObj.regionalDefaultAsrFactor = regionalDefaultFactor;

    const userMadhabOverride = getSavedMadhabOverride();
    if (userMadhabOverride === "hanafi") {
      profileObj.asrShadowFactor = 2;
      profileObj.madhabSource = "USER_HANAFI";
    } else if (userMadhabOverride === "standard") {
      profileObj.asrShadowFactor = 1;
      profileObj.madhabSource = "USER_STANDARD";
    } else {
      profileObj.asrShadowFactor = regionalDefaultFactor;
      profileObj.madhabSource = "REGION_AUTO";
    }
    return profileObj;
  };

  // Tier 0: Explicit Global Country/City OR Bangladesh 64 District/Upazila Selection
  if (savedBdLoc && typeof savedBdLoc.lat === "number" && typeof savedBdLoc.lon === "number") {
    const baseProfile =
      savedBdLoc.regionCode === "ME"
        ? REGIONAL_PRAYER_PROFILES.ar
        : savedBdLoc.regionCode === "WEST"
        ? REGIONAL_PRAYER_PROFILES.en
        : REGIONAL_PRAYER_PROFILES.bn;
    const customProfile = {
      ...baseProfile,
      regionCode: savedBdLoc.regionCode || "BD",
      subRegion: savedBdLoc.subRegion || "SOUTH_ASIA",
      lat: savedBdLoc.lat,
      lon: savedBdLoc.lon,
      tzHours: typeof savedBdLoc.tzHours === "number" ? savedBdLoc.tzHours : 6.0,
      fajrAngle: typeof savedBdLoc.fajrAngle === "number" ? savedBdLoc.fajrAngle : 18.0,
      ishaAngle: typeof savedBdLoc.ishaAngle === "number" ? savedBdLoc.ishaAngle : 18.0,
      ishaFixedMins: typeof savedBdLoc.ishaFixedMins === "number" ? savedBdLoc.ishaFixedMins : 0,
      asrShadowFactor: savedBdLoc.asrShadowFactor === 1 ? 1 : 2,
      bdLocationMeta: savedBdLoc
    };
    return finalizeProfileWithGpsAndMadhab(customProfile);
  }

  // Tier 1: Exact IANA Timezone Match from Global Registry (Preserves exact Region-Matched asrShadowFactor: 2 or 1)
  if (tzLower && IANA_GEO_TIMEZONE_REGISTRY[tzLower]) {
    const regEntry = IANA_GEO_TIMEZONE_REGISTRY[tzLower];
    const baseLocaleProfile =
      regEntry.regionCode === "BD"
        ? REGIONAL_PRAYER_PROFILES.bn
        : regEntry.regionCode === "ME"
        ? REGIONAL_PRAYER_PROFILES.ar
        : REGIONAL_PRAYER_PROFILES.en;
    const matched = {
      ...baseLocaleProfile,
      ...regEntry,
      tzHours: localTzOffsetHours
    };
    return finalizeProfileWithGpsAndMadhab(matched);
  }

  // Tier 2: South & Central Asia + Turkey Automatic Catcher -> Region-Matched Default: Hanafi (asrShadowFactor = 2)
  if (
    tzLower.includes("dhaka") ||
    tzLower.includes("dacca") ||
    tzLower.includes("kolkata") ||
    tzLower.includes("calcutta") ||
    tzLower.includes("karachi") ||
    tzLower.includes("colombo") ||
    tzLower.includes("kathmandu") ||
    tzLower.includes("katmandu") ||
    tzLower.includes("maldives") ||
    tzLower.includes("thimphu") ||
    tzLower.includes("kabul") ||
    tzLower.includes("rangoon") ||
    tzLower.includes("yangon") ||
    tzLower.includes("tashkent") ||
    tzLower.includes("almaty") ||
    tzLower.includes("bishkek") ||
    tzLower.includes("dushanbe") ||
    tzLower.includes("ashgabat") ||
    tzLower.includes("samarkand") ||
    tzLower.includes("baku") ||
    tzLower.includes("istanbul") ||
    (localTzOffsetHours >= 4.5 && localTzOffsetHours <= 6.6)
  ) {
    const isTurkeyOrCaucasus = tzLower.includes("istanbul") || tzLower.includes("baku");
    const saProfile = {
      ...REGIONAL_PRAYER_PROFILES.bn,
      regionCode: isTurkeyOrCaucasus ? "ME" : "BD",
      subRegion: isTurkeyOrCaucasus ? "TURKEY" : "SOUTH_ASIA",
      tzHours: localTzOffsetHours,
      fajrAngle: 18.0,
      ishaAngle: isTurkeyOrCaucasus ? 17.0 : 18.0,
      ishaFixedMins: 0,
      asrShadowFactor: 2 // Region-Matched Default: Hanafi (Mithl-e-Thani, 2x shadow)
    };

    if (Math.abs(localTzOffsetHours - 6.0) < 0.15) {
      saProfile.lat = 24.0;
      saProfile.lon = 89.85;
    } else if (Math.abs(localTzOffsetHours - 5.5) < 0.15) {
      saProfile.lat = 22.5726;
      saProfile.lon = 82.5;
    } else if (Math.abs(localTzOffsetHours - 5.0) < 0.15) {
      saProfile.lat = 24.8607;
      saProfile.lon = 67.0011;
    } else if (Math.abs(localTzOffsetHours - 5.75) < 0.15) {
      saProfile.lat = 27.7172;
      saProfile.lon = 85.324;
    } else if (Math.abs(localTzOffsetHours - 4.5) < 0.15) {
      saProfile.lat = 34.5553;
      saProfile.lon = 69.2075;
    } else {
      saProfile.lon = localTzOffsetHours * 15;
    }
    return finalizeProfileWithGpsAndMadhab(saProfile);
  }

  // Tier 3: Southeast Asia Automatic Catcher (Malaysia, Indonesia, Singapore, Brunei) -> Region-Matched Default: Standard (asrShadowFactor = 1)
  if (
    tzLower.includes("kuala_lumpur") ||
    tzLower.includes("singapore") ||
    tzLower.includes("jakarta") ||
    tzLower.includes("makassar") ||
    tzLower.includes("jayapura") ||
    tzLower.includes("pontianak") ||
    tzLower.includes("brunei") ||
    tzLower.includes("manila") ||
    tzLower.includes("bangkok") ||
    (localTzOffsetHours >= 7.0 && localTzOffsetHours <= 9.0 && !tzLower.startsWith("australia/"))
  ) {
    const seBase = {
      ...REGIONAL_PRAYER_PROFILES.ar,
      regionCode: "ME",
      subRegion: "SE_ASIA",
      lat: 3.139,
      lon: localTzOffsetHours * 15,
      tzHours: localTzOffsetHours,
      fajrAngle: 20.0,
      ishaAngle: 18.0,
      ishaFixedMins: 0,
      asrShadowFactor: 1 // Region-Matched Default: Standard Shafi'i (1x shadow)
    };
    return finalizeProfileWithGpsAndMadhab(seBase);
  }

  // Tier 4: Middle East & Africa Automatic Catcher -> Region-Matched Default: Standard / Shafi'i, Maliki, Hanbali (asrShadowFactor = 1)
  if (
    tzLower.startsWith("africa/") ||
    tzLower.includes("riyadh") ||
    tzLower.includes("makkah") ||
    tzLower.includes("mecca") ||
    tzLower.includes("dubai") ||
    tzLower.includes("muscat") ||
    tzLower.includes("kuwait") ||
    tzLower.includes("qatar") ||
    tzLower.includes("bahrain") ||
    tzLower.includes("baghdad") ||
    tzLower.includes("amman") ||
    tzLower.includes("jerusalem") ||
    tzLower.includes("gaza") ||
    tzLower.includes("hebron") ||
    tzLower.includes("beirut") ||
    tzLower.includes("damascus") ||
    tzLower.includes("cairo") ||
    tzLower.includes("aden") ||
    (localTzOffsetHours >= 2.5 && localTzOffsetHours <= 4.2)
  ) {
    const meBase = {
      ...REGIONAL_PRAYER_PROFILES.ar,
      regionCode: "ME",
      subRegion: tzLower.startsWith("africa/") ? "AFRICA" : "MIDDLE_EAST",
      tzHours: localTzOffsetHours,
      asrShadowFactor: 1 // Region-Matched Default: Standard / Jumhur (1x shadow)
    };
    if (tzLower.includes("dubai") || tzLower.includes("muscat") || Math.abs(localTzOffsetHours - 4.0) < 0.15) {
      meBase.lat = 25.2048;
      meBase.lon = 55.2708;
      meBase.fajrAngle = 18.2;
      meBase.ishaAngle = 18.2;
      meBase.ishaFixedMins = 0;
    } else if (tzLower.includes("cairo") || Math.abs(localTzOffsetHours - 2.0) < 0.15) {
      meBase.lat = 30.0444;
      meBase.lon = 31.2357;
      meBase.fajrAngle = 19.5;
      meBase.ishaAngle = 17.5;
      meBase.ishaFixedMins = 0;
    } else if (tzLower.startsWith("africa/")) {
      meBase.lat = 9.082;
      meBase.lon = localTzOffsetHours * 15;
      meBase.fajrAngle = 18.0;
      meBase.ishaAngle = 17.0;
      meBase.ishaFixedMins = 0;
    } else {
      meBase.lon = localTzOffsetHours * 15 - 5;
    }
    return finalizeProfileWithGpsAndMadhab(meBase);
  }

  // Tier 5: Western Countries Automatic Catcher (North/South America, UK/Europe, Australia/New Zealand) -> Region-Matched Default: Standard (asrShadowFactor = 1)
  if (
    tzLower.startsWith("europe/") ||
    tzLower.startsWith("america/") ||
    tzLower.startsWith("australia/") ||
    tzLower.startsWith("pacific/") ||
    tzLower.startsWith("atlantic/") ||
    localTzOffsetHours <= 2.0 ||
    localTzOffsetHours >= 9.5
  ) {
    const westBase = {
      ...REGIONAL_PRAYER_PROFILES.en,
      regionCode: "WEST",
      tzHours: localTzOffsetHours,
      asrShadowFactor: 1 // Region-Matched Default: Standard / Jumhur (1x shadow)
    };
    if (tzLower.startsWith("europe/")) {
      westBase.subRegion = "WESTERN_EUROPE";
      westBase.lat = 51.5074;
      westBase.lon = localTzOffsetHours * 15;
      westBase.fajrAngle = 18.0;
      westBase.ishaAngle = 17.0;
    } else if (tzLower.startsWith("america/")) {
      westBase.subRegion = "NORTH_AMERICA";
      westBase.lat = 40.7128;
      westBase.lon = localTzOffsetHours * 15;
      westBase.fajrAngle = 15.0;
      westBase.ishaAngle = 15.0;
    } else if (tzLower.startsWith("australia/") || tzLower.startsWith("pacific/")) {
      westBase.subRegion = "OCEANIA";
      westBase.lat = -33.8688;
      westBase.lon = localTzOffsetHours * 15;
      westBase.fajrAngle = 18.0;
      westBase.ishaAngle = 17.0;
    } else {
      westBase.lon = localTzOffsetHours * 15;
    }
    return finalizeProfileWithGpsAndMadhab(westBase);
  }

  // Tier 6: Fallback to selected locale profile with its Region-Matched Default
  const lang = appState.locale || "bn";
  const fallbackProfile = {
    ...(REGIONAL_PRAYER_PROFILES[lang] || REGIONAL_PRAYER_PROFILES.bn)
  };
  return finalizeProfileWithGpsAndMadhab(fallbackProfile);
}

// Astronomical Solar Declination & Equation of Time Calculator (NOAA / Jean Meeus High-Precision)
function computeSeasonalPrayerSchedule(dateObj = new Date()) {
  const profile = resolveActiveRegionalProfile(dateObj);

  // Compute exact day of year (1..366) in local calendar
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const dayOfYear = Math.floor(
    (Date.UTC(year, month, day) - Date.UTC(year, 0, 0)) / 86400000
  );

  const deg2rad = (d) => (d * Math.PI) / 180;
  const rad2deg = (r) => (r * 180) / Math.PI;

  // Fractional year gamma (radians) evaluated at local solar noon
  const gamma = ((2 * Math.PI) / 365.25) * (dayOfYear - 1 + 0.5);

  // Equation of time (in minutes)
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Solar declination angle (in radians & degrees)
  const declRad =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const latRad = deg2rad(profile.lat);

  // Exact Solar Noon (Istiwa / Meridian Transit) in local minutes from 00:00
  const solarNoonMins = Math.round(720 - 4 * profile.lon - eqTime + profile.tzHours * 60);

  // Sunrise & Sunset (-0.833° atmospheric refraction + solar limb radius)
  function getSolarElevationMinutes(altitudeDeg, fallbackPortionOfNight = null, nightLen = 660) {
    const altRad = deg2rad(altitudeDeg);
    const cosH =
      (Math.sin(altRad) - Math.sin(latRad) * Math.sin(declRad)) /
      (Math.cos(latRad) * Math.cos(declRad));

    // High-latitude seasonal protection (UK/Europe/Canada summer nights where twilight persists)
    if (cosH < -0.985 || cosH > 0.985) {
      if (fallbackPortionOfNight !== null) {
        return Math.round(nightLen * fallbackPortionOfNight);
      }
      return 240;
    }
    const hDeg = rad2deg(Math.acos(Math.max(-1, Math.min(1, cosH))));
    return Math.round(hDeg * 4);
  }

  const sunHalfDayMins = getSolarElevationMinutes(-0.833);
  const sunriseMins = solarNoonMins - sunHalfDayMins;
  const sunsetMins = solarNoonMins + sunHalfDayMins;
  const nightDuration = 1440 - (sunsetMins - sunriseMins);

  // Subh Sadiq / Fajr (with 1/7th night high-latitude seasonal protection for Western summer)
  const fajrOffsetFromNoon = getSolarElevationMinutes(-profile.fajrAngle, null, nightDuration);
  const maxSafeFajrOffset = sunHalfDayMins + Math.round(nightDuration / 7) + 35;
  const fajrMins = Math.max(
    120,
    solarNoonMins - Math.min(fajrOffsetFromNoon, maxSafeFajrOffset)
  );

  // Authentic Prohibited & Nafl Windows around Sunrise & Solar Noon (Sahih Muslim 831):
  // 1. Sunrise Prohibited Window: From Sunrise until +15 mins after sunrise (Ishraq start)
  // 2. Zawal (Istiwa) Prohibited Window: From 6 mins before Solar Noon until Dhuhr start (+3 mins after Solar Noon)
  // 3. Sunset Prohibited Window: From 15 mins before Sunset until Sunset (Maghrib start)
  const ishraqMins = sunriseMins + 15;
  const duhaStartMins = sunriseMins + 20;
  const zawalStartMins = solarNoonMins - 6;
  const dhuhrMins = solarNoonMins + 3; // Dhuhr begins right after sun passes meridian zenith

  // Asr Calculation (Non-Contradictory Dual-Madhab Engine: Hanafi factor = 2 vs Standard/Shafi'i factor = 1):
  const zenithDiffRad = Math.abs(latRad - declRad);
  const asrShafiiAltDeg = rad2deg(Math.atan(1 / (1 + Math.tan(zenithDiffRad))));
  const asrHanafiAltDeg = rad2deg(Math.atan(1 / (2 + Math.tan(zenithDiffRad))));
  const asrShafiiMins = solarNoonMins + getSolarElevationMinutes(asrShafiiAltDeg);
  const asrHanafiMins = solarNoonMins + getSolarElevationMinutes(asrHanafiAltDeg);
  const asrMins = profile.asrShadowFactor === 2 ? asrHanafiMins : asrShafiiMins;

  // Maghrib begins immediately after Sunset (+2 mins precaution)
  const maghribMins = sunsetMins + 2;

  // Isha Calculation
  let ishaMins;
  if (profile.ishaFixedMins > 0) {
    ishaMins = maghribMins + profile.ishaFixedMins;
  } else {
    const ishaOffsetFromNoon = getSolarElevationMinutes(-profile.ishaAngle, null, nightDuration);
    const maxSafeIshaOffset = sunHalfDayMins + Math.round(nightDuration / 7) + 35;
    ishaMins = Math.min(
      23 * 60,
      solarNoonMins + Math.min(ishaOffsetFromNoon, maxSafeIshaOffset)
    );
  }

  // World-Standard Islamic Night Divisions (Sunset/Maghrib to Fajr / Subh Sadiq):
  // - 1st Third End (Prime / Mustahabb Isha time ends — Sahih Muslim 638)
  // - Islamic Midnight (Nisf al-Layl)
  // - Last Third Start (Al-Thuluth al-Akhir — Golden Tahajjud Window — Sahih Bukhari 1145)
  const totalNightMins = 1440 - sunsetMins + fajrMins;
  const firstThirdEnd = ((Math.round(sunsetMins + totalNightMins / 3) % 1440) + 1440) % 1440;
  const islamicMidnight = ((Math.round(sunsetMins + totalNightMins / 2) % 1440) + 1440) % 1440;
  const lastThirdStart = ((Math.round(fajrMins - totalNightMins / 3) % 1440) + 1440) % 1440;

  // Season indicator (Winter, Summer, Equinox)
  const isNorthern = profile.lat >= 0;
  let seasonType = "equinox";
  if (month >= 10 || month <= 1) {
    seasonType = isNorthern ? "winter" : "summer";
  } else if (month >= 4 && month <= 7) {
    seasonType = isNorthern ? "summer" : "winter";
  }

  return {
    profile,
    seasonType,
    solarNoon: solarNoonMins,
    firstThirdEnd,
    islamicMidnight,
    lastThirdStart,
    fajr: fajrMins,
    sunrise: sunriseMins,
    ishraq: ishraqMins,
    duhaStart: duhaStartMins,
    zawal: zawalStartMins,
    dhuhr: dhuhrMins,
    asrShafii: asrShafiiMins,
    asrHanafi: asrHanafiMins,
    asr: asrMins,
    sunset: sunsetMins,
    maghrib: maghribMins,
    isha: ishaMins,
    prohibitedWindows: {
      sunrise: { start: sunriseMins, end: sunriseMins + 15 },
      zawal: { start: zawalStartMins, end: dhuhrMins },
      sunset: { start: sunsetMins - 15, end: sunsetMins }
    }
  };
}

// Formats minute-of-day (0..1439) into localized 12-hour time string (e.g., ভোর ০৪:৫২, ٠٤:٥٢ ص, 04:52 AM)
function formatMinutesToLocalizedTime(totalMins, locale = appState.locale) {
  const clamped = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const h24 = Math.floor(clamped / 60);
  const mins = clamped % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const hStr = localizeDigits(String(h12).padStart(2, "0"), locale);
  const mStr = localizeDigits(String(mins).padStart(2, "0"), locale);

  if (locale === "bn") {
    let period = "রাত";
    if (h24 >= 4 && h24 < 6) period = "ভোর";
    else if (h24 >= 6 && h24 < 12) period = "সকাল";
    else if (h24 >= 12 && h24 < 15) period = "দুপুর";
    else if (h24 >= 15 && h24 < 18) period = "বিকেল";
    else if (h24 >= 18 && h24 < 20) period = "সন্ধ্যা";
    return `${period} ${hStr}:${mStr}`;
  }

  if (locale === "ar") {
    const suffix = h24 < 12 ? "ص" : "م";
    return `${hStr}:${mStr} ${suffix}`;
  }

  const suffix = h24 < 12 ? "AM" : "PM";
  return `${hStr}:${mStr} ${suffix}`;
}

function formatWindowRangeLabel(startMins, endMins, locale = appState.locale) {
  if (startMins <= 5 && endMins >= 1430) {
    if (locale === "ar") return "طوال اليوم";
    if (locale === "en") return "Open All Day";
    return "সারাদিন উন্মুক্ত";
  }
  return `${formatMinutesToLocalizedTime(startMins, locale)} – ${formatMinutesToLocalizedTime(endMins, locale)}`;
}

// Dynamically computes the exact seasonal start & end minutes for each of the 32 Prophetic habits
function getDynamicSeasonalHabitWindow(habit, now = new Date()) {
  const s = computeSeasonalPrayerSchedule(now);

  switch (habit.id) {
    case "s24_01_waking_dua":
      return { start: Math.max(60, s.lastThirdStart - 45), end: s.sunrise + 150 };
    case "s24_02_miswak_wudu":
      return { start: 0, end: 1439 }; // Open across all 5 daily prayers
    case "s24_03_tahajjud":
      return { start: s.lastThirdStart, end: s.fajr - 1, earlyStart: s.firstThirdEnd };
    case "s24_04_fajr_sunnah_fard":
      return { start: s.fajr, end: s.sunrise - 2 };
    case "s24_05_post_fajr_barakah":
      return { start: s.fajr + 15, end: s.sunrise + 60 };
    case "s24_06_ishraq_reflection":
      return { start: s.ishraq, end: s.zawal - 1 };
    case "s24_07_home_exit_dua":
      return { start: s.fajr, end: 22 * 60 };
    case "s24_08_salat_duha":
      return { start: s.duhaStart, end: s.zawal - 1 };
    case "s24_09_halal_ihsan_work":
      return { start: s.sunrise, end: 22 * 60 + 30 };
    case "s24_10_tayammun_right":
      return { start: 0, end: 1439 };
    case "s24_11_dhuhr_rawatib":
      return { start: s.dhuhr, end: s.asr - 2 };
    case "s24_12_qaylulah_nap":
      return { start: s.dhuhr + 15, end: s.asr - 10 };
    case "s24_13_asr_prayer":
      return { start: s.asr, end: s.sunset - 16 };
    case "s24_14_evening_adhkar":
      return { start: s.asr, end: s.maghrib + 75 };
    case "s24_15_maghrib_sunnah":
      return { start: s.maghrib, end: s.isha - 2 };
    case "s24_16_family_silat_rahim":
      return { start: s.maghrib, end: 23 * 60 + 45 };
    case "s24_17_isha_witr":
      return { start: s.isha, end: s.fajr - 1, crossesMidnight: true };
    case "s24_18_surah_mulk_baqarah":
      return { start: s.isha, end: s.fajr - 1, crossesMidnight: true };
    case "s24_19_sleep_wudu_dusting":
    case "s24_20_kursi_3quls":
    case "s24_21_tasbih_fatimah":
    case "s24_22_forgiving_before_sleep":
      return { start: Math.max(s.isha, 20 * 60), end: 23 * 60 + 59 };
    case "s24_31_mon_thu_fasting":
      return { start: s.fajr - 30, end: s.maghrib + 90, fastingDaysOnly: true };
    case "s24_32_jumuah_kahf_salawat":
      return { start: s.fajr, end: s.maghrib, fridayOnly: true };
    default: {
      // Custom habits or general diet/character habits mapped to seasonal Waqt phases
      if (habit.phase === "tahajjud_fajr") return { start: Math.max(60, s.lastThirdStart), end: s.sunrise + 60 };
      if (habit.phase === "duha_work") return { start: s.duhaStart, end: s.dhuhr };
      if (habit.phase === "dhuhr_asr") return { start: s.dhuhr, end: s.sunset };
      if (habit.phase === "maghrib_isha") return { start: s.maghrib, end: 23 * 60 + 59 };
      if (habit.phase === "sleep_sunnah") return { start: s.isha, end: 23 * 60 + 59 };
      return { start: 0, end: 1439 };
    }
  }
}

// Computes the daytime (Suhoor-to-Iftar) Hijri day/month/year for any solar date,
// respecting the regional moon-sighting offset (Bangladesh/South Asia vs Makkah/Global).
function getDaytimeHijriPartsForSolarDate(dateObj = new Date()) {
  const sched = computeSeasonalPrayerSchedule(dateObj);
  const isBangladeshOrSouthAsia = sched.profile && sched.profile.regionCode === "BD";
  const regionalMoonOffsetDays = isBangladeshOrSouthAsia ? -1 : 0;
  const baseSolarDate = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate() + regionalMoonOffsetDays
  );
  return extractRawHijriParts(baseSolarDate);
}

// Evaluates whether today is an authentic Sunnah Fasting day:
// - Monday (dayOfWeek === 1)
// - Thursday (dayOfWeek === 4)
// - 13th, 14th, or 15th of the Month (Ayyam al-Beed Hijri 13-15 OR Gregorian 13-15)
function evaluateSunnahFastingDayStatus(now = new Date()) {
  const dayOfWeek = now.getDay();
  const isMonOrThu = dayOfWeek === 1 || dayOfWeek === 4;
  const daytimeHijri = getDaytimeHijriPartsForSolarDate(now);
  const hDay = daytimeHijri.hDay;
  const gDay = now.getDate();

  // Forbidden Eid / Tashreeq fasting days safeguard (1 Shawwal, 10-13 Dhu al-Hijjah)
  const isEidAlFitr = daytimeHijri.hMonth === 10 && hDay === 1;
  const isEidOrTashreeq = daytimeHijri.hMonth === 12 && hDay >= 10 && hDay <= 13;

  const isHijriWhiteDay = hDay >= 13 && hDay <= 15 && !isEidOrTashreeq;
  const isGregorianMidMonth = gDay >= 13 && gDay <= 15 && !isEidAlFitr && !isEidOrTashreeq;
  const isFastingDay = !isEidAlFitr && !isEidOrTashreeq && (isMonOrThu || isHijriWhiteDay || isGregorianMidMonth);

  return {
    isFastingDay,
    isMonOrThu,
    isHijriWhiteDay,
    isGregorianMidMonth,
    hDay,
    gDay
  };
}

// ============================================================================
// CROSS-MIDNIGHT ISLAMIC NIGHT LEDGER ENGINE (ISHA, WITR & SURAH MULK/BAQARAH)
// Keeps a single unified Isha-to-Fajr completion state across 12:00 AM midnight
// so habits #17 and #18 ticked before midnight remain ticked after 12:00 AM,
// and late-night completions (00:00 -> Fajr - 1) attribute to that Islamic night.
// ============================================================================
function getPreviousSolarDateKey(now = new Date()) {
  const prev = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  return getLocalDateKey(prev);
}

function resolveHabitLedgerDateKey(habit, now = new Date()) {
  const todayKey = getLocalDateKey(now);
  if (!habit) return todayKey;
  const rule = getDynamicSeasonalHabitWindow(habit, now);
  if (rule && rule.crossesMidnight) {
    const nowMins = now.getHours() * 60 + now.getMinutes();
    if (nowMins <= rule.end) {
      return getPreviousSolarDateKey(now);
    }
  }
  return todayKey;
}

function isHabitCompletedInActiveCycle(habit, now = new Date()) {
  if (!habit) return false;
  const targetKey = resolveHabitLedgerDateKey(habit, now);
  const targetList = (appState.completionsByDate && appState.completionsByDate[targetKey]) || [];
  if (targetList.includes(habit.id)) return true;

  // Backward-compatible fallback if already stored under current solar date key during post-midnight window
  const todayKey = getLocalDateKey(now);
  if (targetKey !== todayKey) {
    const todayList = (appState.completionsByDate && appState.completionsByDate[todayKey]) || [];
    if (todayList.includes(habit.id)) return true;
  }
  return false;
}

// Evaluates whether a habit is currently "open", "upcoming", or "expired" based on seasonal Waqt
function evaluateHabitTimeWindow(habit, now = new Date()) {
  const rule = getDynamicSeasonalHabitWindow(habit, now);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const winLabel = formatWindowRangeLabel(rule.start, rule.end, appState.locale);

  // Special check for Friday-only Sunnah (Surah Al-Kahf & Jumu'ah protocol)
  if (rule.fridayOnly && now.getDay() !== 5) {
    return {
      status: "upcoming",
      canTick: false,
      windowLabel:
        appState.locale === "ar"
          ? "يوم الجمعة فقط"
          : appState.locale === "en"
          ? "Fridays Only"
          : "শুধুমাত্র জুমু'আর দিন",
      badgeText:
        appState.locale === "ar"
          ? "🕌 متاح يوم الجمعة فقط"
          : appState.locale === "en"
          ? "🕌 Active on Fridays Only"
          : "🕌 শুধুমাত্র জুমু'আর দিন উন্মুক্ত"
    };
  }

  // Special check for Sunnah Fasting (Habit #31): Strictly locked unless today is Monday, Thursday, or 13th–15th of the month!
  if (rule.fastingDaysOnly) {
    const fastStatus = evaluateSunnahFastingDayStatus(now);
    if (!fastStatus.isFastingDay) {
      return {
        status: "upcoming",
        canTick: false,
        windowLabel:
          appState.locale === "ar"
            ? "الإثنين / الخميس و ١٣-١٥ فقط"
            : appState.locale === "en"
            ? "Mon, Thu & 13th–15th Only"
            : "শুধুমাত্র সোম, বৃহস্পতি ও ১৩-১৫ তারিখ",
        badgeText:
          appState.locale === "ar"
            ? "🌙 متاح يوم الإثنين والخميس و ١٣-١٥ فقط"
            : appState.locale === "en"
            ? "🌙 Active on Mon, Thu & 13th–15th Only"
            : "🌙 শুধুমাত্র সোম, বৃহস্পতি ও ১৩-১৫ তারিখে উন্মুক্ত"
      };
    }
  }

  // Support cross-midnight windows (e.g., Isha & Witr from Isha start until Fajr - 1)
  if (rule.crossesMidnight) {
    const isOpenNow = nowMins >= rule.start || nowMins <= rule.end;
    if (isOpenNow) {
      return {
        status: "open",
        canTick: true,
        windowLabel: winLabel,
        badgeText:
          appState.locale === "ar"
            ? `🟢 متاح الآن (${winLabel})`
            : appState.locale === "en"
            ? `🟢 Active Window (${winLabel})`
            : `🟢 চলমান ওয়াক্ত (${winLabel})`
      };
    }
    return {
      status: "upcoming",
      canTick: false,
      windowLabel: winLabel,
      badgeText:
        appState.locale === "ar"
          ? `⏳ يبدأ قريباً (${winLabel})`
          : appState.locale === "en"
          ? `⏳ Upcoming (${winLabel})`
          : `⏳ সময় শুরু হয়নি (${winLabel})`
    };
  }

  // Support Tahajjud early-night opening (after 1st third of the night) + Golden Last Third
  if (typeof rule.earlyStart === "number") {
    const inEarlyNight =
      rule.earlyStart > rule.end
        ? nowMins >= rule.earlyStart || nowMins <= rule.end
        : nowMins >= rule.earlyStart && nowMins <= rule.end;
    if (inEarlyNight) {
      return {
        status: "open",
        canTick: true,
        windowLabel: winLabel,
        badgeText:
          appState.locale === "ar"
            ? `🟢 متاح الآن • أفضل وقته: ${winLabel}`
            : appState.locale === "en"
            ? `🟢 Open Now • Best Last 1/3: ${winLabel}`
            : `🟢 চলমান ওয়াক্ত • শ্রেষ্ঠ শেষ ১/৩: ${winLabel}`
      };
    }
  }

  if (nowMins < rule.start) {
    return {
      status: "upcoming",
      canTick: false,
      windowLabel: winLabel,
      badgeText:
        appState.locale === "ar"
          ? `⏳ يبدأ قريباً (${winLabel})`
          : appState.locale === "en"
          ? `⏳ Upcoming (${winLabel})`
          : `⏳ সময় শুরু হয়নি (${winLabel})`
    };
  }

  if (nowMins > rule.end) {
    return {
      status: "expired",
      canTick: false,
      windowLabel: winLabel,
      badgeText:
        appState.locale === "ar"
          ? `🔒 انتهى الوقت (${winLabel})`
          : appState.locale === "en"
          ? `🔒 Time Expired (${winLabel})`
          : `🔒 সময় সমাপ্ত (${winLabel})`
    };
  }

  return {
    status: "open",
    canTick: true,
    windowLabel: winLabel,
    badgeText:
      appState.locale === "ar"
        ? `🟢 متاح الآن (${winLabel})`
        : appState.locale === "en"
        ? `🟢 Active Window (${winLabel})`
        : `🟢 চলমান ওয়াক্ত (${winLabel})`
  };
}

// Evaluates Morning/Evening Masnoon Dua Time Windows using seasonal Fajr, Zawal, Asr & Isha
function evaluateDuaTimeWindow(dua, now = new Date()) {
  const s = computeSeasonalPrayerSchedule(now);
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const morningStart = s.fajr;
  const morningEnd = s.zawal;
  const eveningStart = s.asr;
  const eveningEnd = 23 * 60 + 59;

  // Morning-only Duas (dua_10_subhanallahi_adada, dua_11_ilman_nafia)
  if (dua.id === "dua_10_subhanallahi_adada" || dua.id === "dua_11_ilman_nafia") {
    const lbl = formatWindowRangeLabel(morningStart, morningEnd, appState.locale);
    if (nowMins < morningStart) return { status: "upcoming", canTick: false, windowLabel: lbl };
    if (nowMins > morningEnd) return { status: "expired", canTick: false, windowLabel: lbl };
    return { status: "open", canTick: true, windowLabel: lbl };
  }

  // Evening/Night-only Duas (dua_01_kalimat_tammat, dua_15_baqarah_last2)
  if (dua.id === "dua_01_kalimat_tammat" || dua.id === "dua_15_baqarah_last2") {
    const lbl = formatWindowRangeLabel(eveningStart, eveningEnd, appState.locale);
    if (nowMins < eveningStart) return { status: "upcoming", canTick: false, windowLabel: lbl };
    return { status: "open", canTick: true, windowLabel: lbl };
  }

  // Ayat al-Kursi (dua_14_ayatul_kursi) — Recited Morning, Evening, Bedtime & After Every Fard Salah (Open from Fajr to Midnight)
  if (dua.id === "dua_14_ayatul_kursi") {
    const lbl = formatWindowRangeLabel(morningStart, eveningEnd, appState.locale);
    if (nowMins < morningStart) return { status: "upcoming", canTick: false, windowLabel: lbl };
    return { status: "open", canTick: true, windowLabel: lbl };
  }

  // Morning & Evening Duas (Open during Seasonal Morning Fajr..Zawal OR Seasonal Evening Asr..Midnight)
  const inMorning = nowMins >= morningStart && nowMins <= morningEnd;
  const inEvening = nowMins >= eveningStart && nowMins <= eveningEnd;

  if (inMorning) {
    return {
      status: "open",
      canTick: true,
      windowLabel: formatWindowRangeLabel(morningStart, morningEnd, appState.locale)
    };
  }
  if (inEvening) {
    return {
      status: "open",
      canTick: true,
      windowLabel: formatWindowRangeLabel(eveningStart, eveningEnd, appState.locale)
    };
  }
  if (nowMins < morningStart) {
    return {
      status: "upcoming",
      canTick: false,
      windowLabel: formatWindowRangeLabel(morningStart, morningEnd, appState.locale)
    };
  }
  // Between Zawal and Asr -> Morning window expired, Evening window opens at Asr
  const nextAsrTime = formatMinutesToLocalizedTime(eveningStart, appState.locale);
  const midDayLbl =
    appState.locale === "ar"
      ? `انتهى الصباح • المساء عند ${nextAsrTime}`
      : appState.locale === "en"
      ? `Morning Ended • Evening at ${nextAsrTime}`
      : `সকালের ওয়াক্ত শেষ • সন্ধ্যা শুরু ${nextAsrTime}`;
  return { status: "expired", canTick: false, windowLabel: midDayLbl };
}

function showTimeLockToast(message) {
  let toast = document.getElementById("s24-exit-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "s24-exit-toast";
    toast.className = "exit-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  setTimeout(() => {
    if (toast) toast.style.opacity = "0";
  }, 2900);
}

function updateSvgCircleProgress(circleId, pct, circumference) {
  const circle = document.getElementById(circleId);
  if (!circle) return;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = circumference - (clamped / 100) * circumference;
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${offset.toFixed(2)}`;
}

function updateTasbihCircularUI() {
  const pct = tasbihTarget > 0 ? Math.min(100, Math.round((tasbihCount / tasbihTarget) * 100)) : 0;
  updateSvgCircleProgress("tasbih-progress-ring-circle", pct, TASBIH_RING_CIRCUMFERENCE);
  const badge = document.getElementById("tasbih-cycle-badge");
  if (badge) {
    const pctStr = localizeDigits(pct, appState.locale);
    badge.textContent =
      appState.locale === "ar"
        ? `${pctStr}% مكتمل`
        : appState.locale === "en"
        ? `${pctStr}% Cycle`
        : `${pctStr}% সম্পন্ন`;
  }
}

function renderTasbihOptions() {
  const selector = document.getElementById("tasbih-selector");
  if (!selector) return;
  const currentIdx = selector.selectedIndex >= 0 ? selector.selectedIndex : 0;
  const options = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).tasbih_options;

  selector.innerHTML = "";
  options.forEach((opt, idx) => {
    const optionEl = document.createElement("option");
    optionEl.value = String(idx);
    optionEl.textContent = opt.text;
    selector.appendChild(optionEl);
  });

  const safeIdx = currentIdx >= 0 && currentIdx < options.length ? currentIdx : 0;
  selector.selectedIndex = safeIdx;
  const chosen = options[safeIdx] || options[0];
  tasbihTarget = chosen.target || 33;

  const currentEl = document.getElementById("tasbih-current");
  const targetEl = document.getElementById("tasbih-target");
  const labelEl = document.getElementById("tasbih-label");
  const lifetimeEl = document.getElementById("lifetime-dhikr-count");

  if (currentEl) currentEl.textContent = localizeDigits(tasbihCount, appState.locale);
  if (targetEl) targetEl.textContent = `/ ${localizeDigits(tasbihTarget, appState.locale)}`;
  if (labelEl) labelEl.textContent = chosen.label;
  if (lifetimeEl) {
    lifetimeEl.textContent = localizeDigits(appState.lifetimeDhikr || 0, appState.locale);
  }
  updateTasbihCircularUI();
}

async function toggleDuaCompletion(duaId) {
  const dua = SUNNAH_24_DUAS.find((d) => d.id === duaId);
  if (!dua) return;
  const todayKey = getTodayKey();
  if (!appState.duaCompletionsByDate) appState.duaCompletionsByDate = {};
  if (!appState.duaCompletionsByDate[todayKey]) appState.duaCompletionsByDate[todayKey] = [];

  const list = appState.duaCompletionsByDate[todayKey];
  const isDone = list.includes(duaId);
  const winState = evaluateDuaTimeWindow(dua, new Date());

  if (!winState.canTick) {
    const lockMsg =
      appState.locale === "ar"
        ? `🔒 لا يمكن تعديل هذا الذكر خارج وقته المحدد (${winState.windowLabel})`
        : appState.locale === "en"
        ? `🔒 Locked outside valid Adhkar time window (${winState.windowLabel})`
        : `🔒 নির্ধারিত সময়ের বাইরে এই দোয়াটি টিক বা পরিবর্তন করা যাবে না (${winState.windowLabel})`;
    showTimeLockToast(lockMsg);
    return;
  }

  if (isDone) {
    list.splice(list.indexOf(duaId), 1);
  } else {
    list.push(duaId);
    if (navigator.vibrate) navigator.vibrate(20);
  }
  await saveAndSealState();
  renderDuas();
  renderWeeklyChart();
  renderLongTermArchive();
  if (typeof syncMasterSectionsLiveProgress === 'function') syncMasterSectionsLiveProgress();
}

// ============================================================================
// MOON-SIGHTING (HILAL) HIJRI ENGINE WITH MAGHRIB SUNSET ROLLOVER &
// BANGLADESH / SOUTH ASIA VS MIDDLE EAST / GLOBAL REGIONAL ADJUSTMENT
// + REVISED BANGLA ACADEMY PONJIKA (বঙ্গাব্দ ও ৬ ঋতু) ENGINE
// ============================================================================
function extractRawHijriParts(targetDateObj) {
  let hDay = 1;
  let hMonth = 1;
  let hYear = 1448;
  let extracted = false;

  const calendars = ["islamic-umalqura", "islamic-civil", "islamic"];
  for (const cal of calendars) {
    try {
      const parts = new Intl.DateTimeFormat(`en-u-ca-${cal}-nu-latn`, {
        day: "numeric",
        month: "numeric",
        year: "numeric"
      }).formatToParts(targetDateObj);

      const d = parseInt(parts.find((p) => p.type === "day")?.value, 10);
      const m = parseInt(parts.find((p) => p.type === "month")?.value, 10);
      const y = parseInt(parts.find((p) => p.type === "year")?.value, 10);

      if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y < 1700 && m >= 1 && m <= 12) {
        hDay = d;
        hMonth = m;
        hYear = y;
        extracted = true;
        break;
      }
    } catch {}
  }

  if (!extracted) {
    const jd = Math.floor(targetDateObj.getTime() / 86400000) + 2440588;
    let l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    const j =
      Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
      Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
    l =
      l -
      Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
      29;
    hMonth = Math.floor((24 * l) / 709);
    hDay = l - Math.floor((709 * hMonth) / 24);
    hYear = 30 * n + j - 30;
  }

  return { hDay, hMonth, hYear };
}

function getMoonBasedHijriDetails(dateObj = new Date(), locale = appState.locale) {
  const hijriMonths = {
    bn: [
      "মুহাররম",
      "সফর",
      "রবিউল আউয়াল",
      "রবিউস সানি",
      "জুমাদাল উলা",
      "জুমাদাল আখিরাহ",
      "রজব",
      "শাবান",
      "রমজান",
      "শাওয়াল",
      "জিলকদ",
      "জিলহজ"
    ],
    ar: [
      "محرم",
      "صفر",
      "ربيع الأول",
      "ربيع الآخر",
      "جمادى الأولى",
      "جمادى الآخرة",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة"
    ],
    en: [
      "Muharram",
      "Safar",
      "Rabi' al-Awwal",
      "Rabi' al-Thani",
      "Jumada al-Ula",
      "Jumada al-Akhirah",
      "Rajab",
      "Sha'ban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qi'dah",
      "Dhu al-Hijjah"
    ]
  };

  const arabicWeekdays = {
    bn: [
      "ইয়াওমুল আহাদ",
      "ইয়াওমুল ইছনাইন",
      "ইয়াওমুল ছুলাছা",
      "ইয়াওমুল আরবিয়া",
      "ইয়াওমুল খামীস",
      "ইয়াওমুল জুমু'আহ",
      "ইয়াওমুস সাবত"
    ],
    ar: [
      "يوم الأحد",
      "يوم الإثنين",
      "يوم الثلاثاء",
      "يوم الأربعاء",
      "يوم الخميس",
      "يوم الجمعة",
      "يوم السبت"
    ],
    en: [
      "Yawm al-Ahad",
      "Yawm al-Ithnayn",
      "Yawm al-Thulatha",
      "Yawm al-Arbi'a",
      "Yawm al-Khamis",
      "Yawm al-Jumu'ah",
      "Yawm al-Sabt"
    ]
  };

  const sched = computeSeasonalPrayerSchedule(dateObj);
  const nowMins = dateObj.getHours() * 60 + dateObj.getMinutes();

  // In Islamic Lunar Jurisprudence, the new Hijri date & Yawm begin at Sunset / Maghrib!
  // Also, in Bangladesh / South Asia (regionCode === "BD"), local moon sighting (Hilal)
  // starts 1 day after Umm al-Qura Saudi Arabia calendar.
  const isBangladeshOrSouthAsia = sched.profile && sched.profile.regionCode === "BD";
  const regionalMoonOffsetDays = isBangladeshOrSouthAsia ? -1 : 0;
  const isAfterMaghrib = nowMins >= sched.sunset;

  const baseSolarDate = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate() + regionalMoonOffsetDays
  );
  const daytimeHijri = extractRawHijriParts(baseSolarDate);

  let activeHijri = daytimeHijri;
  let prevDaytimeHijri = null;

  if (isAfterMaghrib) {
    const nextLunarDate = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate() + regionalMoonOffsetDays + 1
    );
    activeHijri = extractRawHijriParts(nextLunarDate);
    prevDaytimeHijri = daytimeHijri;
  }

  // Islamic Yawm also rolls over to the next weekday at Maghrib!
  const islamicWeekdayIndex = isAfterMaghrib
    ? (dateObj.getDay() + 1) % 7
    : dateObj.getDay();

  const lang = hijriMonths[locale] ? locale : "bn";
  const monthName = hijriMonths[lang][activeHijri.hMonth - 1] || hijriMonths.bn[0];
  const dayStr = localizeDigits(activeHijri.hDay, lang);
  const yearStr = localizeDigits(activeHijri.hYear, lang);
  const yawmStr = (arabicWeekdays[lang] || arabicWeekdays.bn)[islamicWeekdayIndex];

  let shortHeaderText = "";
  let cardHeadlineHtml = "";

  if (lang === "bn") {
    shortHeaderText = `${dayStr} ${monthName}, ${yearStr} হি.`;
    if (isAfterMaghrib && prevDaytimeHijri && prevDaytimeHijri.hDay !== activeHijri.hDay) {
      const prevDayStr = localizeDigits(prevDaytimeHijri.hDay, lang);
      cardHeadlineHtml = `<s class="prev-hijri-day">${prevDayStr}</s>, ${dayStr} ${monthName} ${yearStr} হি. ${yawmStr}`;
    } else {
      cardHeadlineHtml = `${dayStr} ${monthName} ${yearStr} হি. ${yawmStr}`;
    }
  } else if (lang === "ar") {
    shortHeaderText = `${dayStr} ${monthName} ${yearStr} هـ`;
    if (isAfterMaghrib && prevDaytimeHijri && prevDaytimeHijri.hDay !== activeHijri.hDay) {
      const prevDayStr = localizeDigits(prevDaytimeHijri.hDay, lang);
      cardHeadlineHtml = `<s class="prev-hijri-day">${prevDayStr}</s> ، ${dayStr} ${monthName} ${yearStr} هـ • ${yawmStr}`;
    } else {
      cardHeadlineHtml = `${dayStr} ${monthName} ${yearStr} هـ • ${yawmStr}`;
    }
  } else {
    shortHeaderText = `${dayStr} ${monthName} ${yearStr} AH`;
    if (isAfterMaghrib && prevDaytimeHijri && prevDaytimeHijri.hDay !== activeHijri.hDay) {
      cardHeadlineHtml = `<s class="prev-hijri-day">${prevDaytimeHijri.hDay}</s>, ${dayStr} ${monthName} ${yearStr} AH • ${yawmStr}`;
    } else {
      cardHeadlineHtml = `${dayStr} ${monthName} ${yearStr} AH • ${yawmStr}`;
    }
  }

  return {
    shortHeaderText,
    cardHeadlineHtml,
    isAfterMaghrib
  };
}

function getAccurateHijriDate(dateObj, locale) {
  return getMoonBasedHijriDetails(dateObj, locale).shortHeaderText;
}

// Official Revised Bangla Academy Calendar (বঙ্গাব্দ, বাংলা মাস ও ৬ ঋতু)
function getBanglaPonjikaDetails(dateObj = new Date(), locale = appState.locale) {
  const banglaMonths = {
    bn: [
      "বৈশাখ",
      "জ্যৈষ্ঠ",
      "আষাঢ়",
      "শ্রাবণ",
      "ভাদ্র",
      "আশ্বিন",
      "কার্তিক",
      "অগ্রহায়ণ",
      "পৌষ",
      "মাঘ",
      "ফাল্গুন",
      "চৈত্র"
    ],
    ar: [
      "بويشاخ",
      "جويشثو",
      "آشار",
      "شرابون",
      "بهادرو",
      "آشين",
      "كارتيك",
      "أغروهايون",
      "بوش",
      "ماغ",
      "فالغون",
      "تشويترو"
    ],
    en: [
      "Boishakh",
      "Jyoishtho",
      "Asharh",
      "Shrabon",
      "Bhadro",
      "Ashwin",
      "Kartik",
      "Ogrohayon",
      "Poush",
      "Magh",
      "Falgun",
      "Choitro"
    ]
  };

  const banglaSeasons = {
    bn: ["গ্রীষ্মকাল", "বর্ষাকাল", "শরৎকাল", "হেমন্তকাল", "শীতকাল", "বসন্তকাল"],
    ar: ["فصل الصيف", "فصل الأمطار", "فصل الخريف", "فصل الخريف المتأخر", "فصل الشتاء", "فصل الربيع"],
    en: ["Grishmo (Summer)", "Borsha (Monsoon)", "Shorot (Autumn)", "Hemonto (Late Autumn)", "Sheet (Winter)", "Bosonto (Spring)"]
  };

  const banglaWeekdays = {
    bn: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"],
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };

  const gYear = dateObj.getFullYear();
  const isLeap = (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;

  // Revised Bangla Academy Month Lengths:
  // First 6 months (Boishakh..Ashwin) = 31 days; Kartik..Choitro = 30 days (Falgun = 29 in non-leap, 30 in leap year)
  const monthLengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeap ? 30 : 29, 30];

  const startOfBoishakhThisYear = Date.UTC(gYear, 3, 14); // April 14
  const currentUtcMidnight = Date.UTC(gYear, dateObj.getMonth(), dateObj.getDate());
  let dayDiff = Math.floor((currentUtcMidnight - startOfBoishakhThisYear) / 86400000);

  let bYear = gYear - 593;
  if (dayDiff < 0) {
    bYear = gYear - 594;
    const prevYear = gYear - 1;
    const prevLeap = (prevYear % 4 === 0 && prevYear % 100 !== 0) || prevYear % 400 === 0;
    const prevYearTotalDays = prevLeap ? 366 : 365;
    dayDiff = prevYearTotalDays + dayDiff;
    monthLengths[10] = prevLeap ? 30 : 29;
  }

  let bMonthIndex = 0;
  let remainingDays = dayDiff;
  for (let i = 0; i < 12; i++) {
    if (remainingDays < monthLengths[i]) {
      bMonthIndex = i;
      break;
    }
    remainingDays -= monthLengths[i];
  }
  const bDay = remainingDays + 1;
  const seasonIndex = Math.floor(bMonthIndex / 2);

  const lang = banglaMonths[locale] ? locale : "bn";
  const weekdayName = (banglaWeekdays[lang] || banglaWeekdays.bn)[dateObj.getDay()];
  const bDayStr = localizeDigits(bDay, lang);
  const bYearStr = localizeDigits(bYear, lang);
  const bMonthName = (banglaMonths[lang] || banglaMonths.bn)[bMonthIndex];
  const seasonName = (banglaSeasons[lang] || banglaSeasons.bn)[seasonIndex];

  if (lang === "bn") {
    return {
      shortText: `${bDayStr} ${bMonthName} ${bYearStr}`,
      fullSubline: `${weekdayName}, ${bDayStr} ${bMonthName} ${bYearStr} বঙ্গাব্দ, ${seasonName}`
    };
  }
  if (lang === "ar") {
    return {
      shortText: `${bDayStr} ${bMonthName} ${bYearStr}`,
      fullSubline: `${weekdayName}، ${bDayStr} ${bMonthName} ${bYearStr} بنغالي • ${seasonName}`
    };
  }
  return {
    shortText: `${bDayStr} ${bMonthName} ${bYearStr}`,
    fullSubline: `${weekdayName}, ${bDayStr} ${bMonthName} ${bYearStr} BS, ${seasonName}`
  };
}

// ============================================================================
// STANDALONE STATIC PROHIBITED TIME FOR SALAH ENGINE (SAHIH MUSLIM 831)
// Automatically computes and displays the 3 daily seasonal prohibited prayer
// windows (Sunrise, Midday Zenith/Zawal, Sunset) from computeSeasonalPrayerSchedule()
// along with the warning box and Sahih Muslim 831 Hadith proof—without redundant
// active-window alerts (since Live Ongoing Prayers already handles live states).
// ============================================================================
let userToggledProhibitedCard = false;

function formatProhibitedClockRange(startMins, endMins, locale = appState.locale) {
  const formatShortClock = (totalMinutes) => {
    const clamped = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
    const h24 = Math.floor(clamped / 60);
    const m = clamped % 60;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const hStr = localizeDigits(String(h12).padStart(2, "0"), locale);
    const mStr = localizeDigits(String(m).padStart(2, "0"), locale);
    return `${hStr}:${mStr}`;
  };
  return `${formatShortClock(startMins)} - ${formatShortClock(endMins)}`;
}

function renderProhibitedSalahTimes() {
  const card = document.getElementById("prohibited-salah-card");
  if (!card) return;

  const now = new Date();
  const lang = appState.locale || "bn";
  const sched = computeSeasonalPrayerSchedule(now);

  const windows = sched.prohibitedWindows || {
    sunrise: { start: sched.sunrise, end: sched.sunrise + 15 },
    zawal: { start: sched.zawal, end: sched.dhuhr },
    sunset: { start: sched.sunset - 15, end: sched.sunset }
  };

  const srEl = document.getElementById("time-slot-sunrise");
  const zwEl = document.getElementById("time-slot-zawal");
  const ssEl = document.getElementById("time-slot-sunset");

  if (srEl) srEl.textContent = formatProhibitedClockRange(windows.sunrise.start, windows.sunrise.end, lang);
  if (zwEl) zwEl.textContent = formatProhibitedClockRange(windows.zawal.start, windows.zawal.end, lang);
  if (ssEl) ssEl.textContent = formatProhibitedClockRange(windows.sunset.start, windows.sunset.end, lang);
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("prohibited-toggle-btn");
  const card = document.getElementById("prohibited-salah-card");

  if (toggleBtn && card) {
    toggleBtn.addEventListener("click", () => {
      userToggledProhibitedCard = true;
      const isNowCollapsed = card.classList.toggle("is-collapsed");
      toggleBtn.setAttribute("aria-expanded", isNowCollapsed ? "false" : "true");
      if (navigator.vibrate) navigator.vibrate(12);
    });
  }

  renderProhibitedSalahTimes();
});

// ============================================================================
// V8.3 GOOGLE MINIMAL নফল নামাজের সময়সূচী (NAFL SALAH WAQT) ENGINE (#nafl-salah-card)
// Minimal, at-a-glance layout with exact Waqt / time-of-day labels instead of Rakah counts,
// and Hadith proof (plus Rakah details) inside the far-right corner `i` button modal:
// 1. ইশরাক (সকাল — সূর্যোদয়ের পর)
// 2. চাশত / দুহা (সকাল — মধ্যপ্রহর)
// 3. আওয়াবীন (সন্ধ্যা — মাগরিব–ইশা)
// 4. তাহাজ্জুদ (শেষ রাত — ফজর পূর্ব)
// 5. সালাতুত তাসবীহ ও তাহিয়্যাতুল অযু (দিন-রাত — নিষিদ্ধ সময় ছাড়া)
// ============================================================================
function getNaflPrayersScheduleList(now = new Date()) {
  const sched = computeSeasonalPrayerSchedule(now);
  const lang = (appState && appState.locale) || "bn";
  const nowMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const pWindows = sched.prohibitedWindows || {
    sunrise: { start: sched.sunrise, end: sched.sunrise + 15 },
    zawal: { start: sched.zawal, end: sched.dhuhr },
    sunset: { start: sched.sunset - 15, end: sched.sunset }
  };

  // 1. Ishraq: Sunrise + 15m -> Sunrise + 45m
  const ishraqStart = sched.sunrise + 15;
  const ishraqEnd = sched.sunrise + 45;
  const isIshraqActive = nowMins >= ishraqStart && nowMins <= ishraqEnd;

  // 2. Chasht / Duha: Sunrise + 20m -> Zawal - 1m
  const duhaStart = sched.sunrise + 20;
  const duhaEnd = sched.zawal - 1;
  const isDuhaActive = nowMins >= duhaStart && nowMins <= duhaEnd;

  // 3. Awwabin: Maghrib + 10m -> Isha - 1m
  const awwabinStart = sched.maghrib + 10;
  const awwabinEnd = sched.isha - 1;
  const isAwwabinActive = nowMins >= awwabinStart && nowMins <= awwabinEnd;

  // 4. Tahajjud: Last Third Start -> Fajr - 1m
  const tahajjudStart = sched.lastThirdStart;
  const tahajjudEnd = (sched.fajr - 1 + 1440) % 1440;
  const firstThirdClock = formatShortWaqtClock(sched.firstThirdEnd, lang);
  const inLastThird =
    tahajjudStart > tahajjudEnd
      ? nowMins >= tahajjudStart || nowMins <= tahajjudEnd
      : nowMins >= tahajjudStart && nowMins <= tahajjudEnd;
  const inEarlyQiyam =
    sched.firstThirdEnd > tahajjudEnd
      ? nowMins >= sched.firstThirdEnd || nowMins <= tahajjudEnd
      : nowMins >= sched.firstThirdEnd && nowMins <= tahajjudEnd;

  // 5. Salat al-Tasbih & Tahiyyatul Wudu: Open all day except the 3 prohibited windows
  const inProhibitedNow =
    (nowMins >= pWindows.sunrise.start && nowMins < pWindows.sunrise.end) ||
    (nowMins >= pWindows.zawal.start && nowMins < pWindows.zawal.end) ||
    (nowMins >= pWindows.sunset.start && nowMins < pWindows.sunset.end);
  const isTasbihWuduActive = !inProhibitedNow;

  return [
    {
      id: "nafl_ishraq",
      phase: "tahajjud_fajr",
      title:
        lang === "bn"
          ? "১. ইশরাক (সূর্যোদয়ের পর)"
          : lang === "ar"
          ? "١. الإشراق (بعد الشروق)"
          : "1. Ishraq (After Sunrise)",
      rakahBadge:
        lang === "bn"
          ? "সকাল • ২–৪ রাকাত"
          : lang === "ar"
          ? "صباحاً • ٢–٤ ركعات"
          : "Morning • 2–4 Rak'ah",
      timeRangeText: `${formatShortWaqtClock(ishraqStart, lang)} - ${formatShortWaqtClock(ishraqEnd, lang)}`,
      evidenceFull:
        lang === "bn"
          ? `⏰ ওয়াক্ত (সকাল — সূর্যোদয়ের পর): সূর্যোদয়ের ১৫ মিনিট পর থেকে ৪৫ মিনিট পর্যন্ত (${formatMinutesToLocalizedTime(ishraqStart, lang)} – ${formatMinutesToLocalizedTime(ishraqEnd, lang)}) • রাকাত: ২–৪ রাকাত।\n\n📖 দলিল (জামে তিরমিযী ৫৮৬): রাসূলুল্লাহ ﷺ বলেছেন, 'যে ব্যক্তি জামাতে ফজরের সালাত আদায় করে সূর্যোদয় পর্যন্ত বসে আল্লাহর যিকির করে এবং এরপর দুই রাকাত সালাত (ইশরাক) আদায় করে, তার জন্য একটি পরিপূর্ণ হজ ও পরিপূর্ণ উমরার সওয়াব রয়েছে।'`
          : lang === "ar"
          ? `⏰ الوقت (صباحاً — بعد الشروق): بعد الشروق بـ ١٥ إلى ٤٥ دقيقة (${formatMinutesToLocalizedTime(ishraqStart, lang)} – ${formatMinutesToLocalizedTime(ishraqEnd, lang)}) • ٢–٤ ركعات.\n\n📖 الدليل (جامع الترمذي ٥٨٦): «من صلى الغداة في جماعة ثم قعد يذكر الله حتى تطلع الشمس ثم صلى ركعتين كانت له كأجر حجة وعمرة تامة تامة تامة».`
          : `⏰ Waqt (Morning — Post-Sunrise): 15m to 45m after Sunrise (${formatMinutesToLocalizedTime(ishraqStart, lang)} – ${formatMinutesToLocalizedTime(ishraqEnd, lang)}) • 2–4 Rak'ahs.\n\n📖 Proof (Jami\` at-Tirmidhi 586): Whoever prays Fajr in congregation, sits remembering Allah until the sun rises, and then prays two Rak'ahs (Ishraq), receives the reward of a complete Hajj and Umrah.`,
      wisdomFull:
        lang === "bn"
          ? "ভোরের মৃদু সূর্যালোক ও একাগ্র যিকির মস্তিষ্কে সেরোটোনিন হরমোনের ভারসাম্য আনে এবং সারাদিন আত্মিক প্রশান্তি ও কর্মশক্তি বজায় রাখে।"
          : lang === "ar"
          ? "التعرض لضوء الصباح الباكر مع الذكر ينظم الساعة البيولوجية ويمنح القلب طمأنينة ونشاطاً طوال اليوم."
          : "Early morning light exposure after Fajr remembrance regulates circadian rhythms and anchors the mind in tranquility.",
      isActive: isIshraqActive
    },
    {
      id: "nafl_duha",
      phase: "duha_work",
      title:
        lang === "bn"
          ? "২. চাশত / দুহা (মধ্যপ্রহর পর্যন্ত)"
          : lang === "ar"
          ? "٢. الضحى (حتى منتصف النهار)"
          : "2. Chasht / Duha (Until Midday)",
      rakahBadge:
        lang === "bn"
          ? "সকাল–দ্বিপ্রহর পূর্ব • ২–৮ রাকাত"
          : lang === "ar"
          ? "الضحى • ٢–٨ ركعات"
          : "Forenoon • 2–8 Rak'ah",
      timeRangeText: `${formatShortWaqtClock(duhaStart, lang)} - ${formatShortWaqtClock(duhaEnd, lang)}`,
      evidenceFull:
        lang === "bn"
          ? `⏰ ওয়াক্ত (সকাল — দ্বিপ্রহর পূর্ব): সূর্যোদয়ের ২০ মিনিট পর থেকে দ্বিপ্রহর (যাওয়াল)-এর ১ মিনিট পূর্ব পর্যন্ত (${formatMinutesToLocalizedTime(duhaStart, lang)} – ${formatMinutesToLocalizedTime(duhaEnd, lang)}) • রাকাত: ২–৮ রাকাত।\n\n📖 দলিল (সহীহ মুসলিম ৭২০): প্রতিদিন সকালে মানুষের দেহের ৩৬০টি অস্থিসন্ধির (জোড়ার) ওপর সদকা ওয়াজিব হয়, আর চাশতের (দুহার) দুই রাকাত সালাত সেগুলোর সবগুলোর সদকা হিসেবে যথেষ্ট হয়ে যায়।`
          : lang === "ar"
          ? `⏰ الوقت (الصباح — قبل الزوال): من بعد الشروق بـ ٢٠ دقيقة إلى قبيل الزوال (${formatMinutesToLocalizedTime(duhaStart, lang)} – ${formatMinutesToLocalizedTime(duhaEnd, lang)}) • ٢–٨ ركعات.\n\n📖 الدليل (صحيح مسلم ٧٢٠): «يصبح على كل سلامى من أحدكم صدقة... ويجزئ من ذلك ركعتان يركعهما من الضحى».`
          : `⏰ Waqt (Forenoon — Pre-Zawal): 20m post-Sunrise until 1m before Zawal (${formatMinutesToLocalizedTime(duhaStart, lang)} – ${formatMinutesToLocalizedTime(duhaEnd, lang)}) • 2–8 Rak'ahs.\n\n📖 Proof (Sahih Muslim 720): Charity is due upon every joint of your body every morning, and two Rak'ahs offered in the forenoon (Duha) suffice for all 360 joints.`,
      wisdomFull:
        lang === "bn"
          ? "সকালের ব্যস্ত কর্মঘণ্টার মাঝে চাশতের সালাত মেরুদণ্ড ও অস্থিসন্ধির জড়তা দূর করে এবং রিজিক ও কাজে বরকত আনে।"
          : lang === "ar"
          ? "استراحة روحية وحركية في منتصف الصباح تجدد النشاط وتجلب البركة في الرزق والعمل."
          : "Provides a mindful mid-morning spiritual pause that relieves physical tension and brings Barakah to daily work.",
      isActive: isDuhaActive
    },
    {
      id: "nafl_awwabin",
      phase: "maghrib_isha",
      title:
        lang === "bn"
          ? "৩. আওয়াবীন (মাগরিবের পর)"
          : lang === "ar"
          ? "٣. الأوابين (بعد المغرب)"
          : "3. Awwabin (After Maghrib)",
      rakahBadge:
        lang === "bn"
          ? "সন্ধ্যা (মাগরিব–ইশা) • ৬–২০ রাকাত"
          : lang === "ar"
          ? "بين المغرب والعشاء • ٦–٢٠ ركعة"
          : "Maghrib–Isha • 6–20 Rak'ah",
      timeRangeText: `${formatShortWaqtClock(awwabinStart, lang)} - ${formatShortWaqtClock(awwabinEnd, lang)}`,
      evidenceFull:
        lang === "bn"
          ? `⏰ ওয়াক্ত (সন্ধ্যা — মাগরিব ও ইশার মধ্যবর্তী): মাগরিবের ফরজ ও সুন্নাতের পর থেকে ইশার ১ মিনিট পূর্ব পর্যন্ত (${formatMinutesToLocalizedTime(awwabinStart, lang)} – ${formatMinutesToLocalizedTime(awwabinEnd, lang)}) • রাকাত: ৬–২০ রাকাত।\n\n📖 দলিল (জামে তিরমিযী ৪৩৫ ও মুসনাদে আহমাদ ২৩৩৭৮): সাহাবী ও তাবেঈগণ মাগরিব ও ইশার মধ্যবর্তী সময়ে নফল সালাতে মাশগুল থাকতেন। হুযাইফা (রা.) বর্ণনা করেন, নবীজি ﷺ মাগরিবের পর ইশা পর্যন্ত নফল সালাত আদায় করেছেন।`
          : lang === "ar"
          ? `⏰ الوقت (مساءً — بين المغرب والعشاء): بعد المغرب بـ ١٠ دقائق حتى قبيل العشاء (${formatMinutesToLocalizedTime(awwabinStart, lang)} – ${formatMinutesToLocalizedTime(awwabinEnd, lang)}) • ٦–٢٠ ركعة.\n\n📖 الدليل (جامع الترمذي ٤٣٥ ومسند أحمد ٢٣٣٧٨): استحباب التطوع بين المغرب والعشاء وإحياء ما بين العشاءين.`
          : `⏰ Waqt (Evening — Maghrib to Isha): Maghrib + 10m until 1m before Isha (${formatMinutesToLocalizedTime(awwabinStart, lang)} – ${formatMinutesToLocalizedTime(awwabinEnd, lang)}) • 6–20 Rak'ahs.\n\n📖 Proof (Jami\` at-Tirmidhi 435 & Musnad Ahmad 23378): Praying voluntary Rak'ahs between Maghrib and Isha illuminates the evening with devotion.`,
      wisdomFull:
        lang === "bn"
          ? "সন্ধ্যার পর অহেতুক আড্ডা ও স্ক্রিন আসক্তি থেকে মনকে ফিরিয়ে ঘরকে কুরআন ও সালাতের নূরে আলোকিত করে।"
          : lang === "ar"
          ? "تحيي المساء بالسكينة والذكر في البيت بعيداً عن المشتتات."
          : "Transforms the post-sunset transition into a peaceful sanctuary of remembrance at home.",
      isActive: isAwwabinActive
    },
    {
      id: "nafl_tahajjud",
      phase: "tahajjud_fajr",
      title:
        lang === "bn"
          ? "৪. তাহাজ্জুদ (ইশার পর)"
          : lang === "ar"
          ? "٤. التهجد (بعد العشاء)"
          : "4. Tahajjud (After Isha)",
      rakahBadge:
        lang === "bn"
          ? "শেষ রাত (ফজর পূর্ব) • ২–৮+ রাকাত"
          : lang === "ar"
          ? "الثلث الأخير • ٢–٨+ ركعات"
          : "Last 1/3 Night • 2–8+ Rak'ah",
      timeRangeText: `${formatShortWaqtClock(tahajjudStart, lang)} - ${formatShortWaqtClock(tahajjudEnd, lang)}`,
      evidenceFull:
        lang === "bn"
          ? `⏰ শ্রেষ্ঠ সময় (শেষ রাত — ফজর পূর্ব): ${formatMinutesToLocalizedTime(tahajjudStart, lang)} – ${formatMinutesToLocalizedTime(tahajjudEnd, lang)} (রাতের ১ম প্রহর ${firstThirdClock} শেষেও কিয়াম জায়েয) • রাকাত: ২–৮+ রাকাত।\n\n📖 দলিল (সহীহ বুখারী ১১৪৫ ও মুসলিম ৭৫৮): প্রতি রাতের শেষ তৃতীয়াংশ অবশিষ্ট থাকতে আমাদের রব দুনিয়ার আকাশে অবতরণ করে বলেন: 'কে আছো আমাকে ডাকবে, আমি তার ডাকে সাড়া দেবো? কে আছো আমার কাছে চাইবে, আমি তাকে দান করব? কে আছো আমার কাছে ক্ষমা চাইবে, আমি তাকে ক্ষমা করব?'`
          : lang === "ar"
          ? `⏰ أفضل وقته (آخر الليل — قبل الفجر): ${formatMinutesToLocalizedTime(tahajjudStart, lang)} – ${formatMinutesToLocalizedTime(tahajjudEnd, lang)} (ويصح القيام بعد الثلث الأول ${firstThirdClock}) • ٢–٨+ ركعات.\n\n📖 الدليل (صحيح البخاري ١١٤٥ ومسلم ٧٥٨): ينزل ربنا تبارك وتعالى كل ليلة إلى السماء الدنيا حين يبقى ثلث الليل الآخر فيقول: «من يدعوني فأستجيب له؟».`
          : `⏰ Golden Last 1/3 (Late Night — Pre-Fajr): ${formatMinutesToLocalizedTime(tahajjudStart, lang)} – ${formatMinutesToLocalizedTime(tahajjudEnd, lang)} (Early Qiyam valid after 1st Third ${firstThirdClock}) • 2–8+ Rak'ahs.\n\n📖 Proof (Sahih Bukhari 1145 & Muslim 758): Our Lord descends every night during the last third of the night saying: 'Who is calling upon Me that I may answer him?'`,
      wisdomFull:
        lang === "bn"
          ? "ফরজ সালাতের পর সর্বোত্তম সালাত হলো রাতের সালাত (সহীহ মুসলিম ১১৬৩)। ভোররাতের নির্জন সিজদা আত্মিক শক্তি ও একাগ্রতা বহুগুণ বৃদ্ধি করে।"
          : lang === "ar"
          ? "أفضل الصلاة بعد الفريضة صلاة الليل (مسلم ١١٦٣)، وهي شرف المؤمن ومصدر القوة الروحية."
          : "The most virtuous prayer after the obligatory prayers is the night prayer (Sahih Muslim 1163), building unmatched spiritual resilience.",
      isActive: inLastThird || inEarlyQiyam
    },
    {
      id: "nafl_tasbih_wudu",
      phase: "tahajjud_fajr",
      title:
        lang === "bn"
          ? "৫. সালাতুত তাসবীহ ও তাহিয়্যাতুল অযু (দিন-রাত)"
          : lang === "ar"
          ? "٥. صلاة التسبيح وتحية الوضوء (ليلاً ونهاراً)"
          : "5. Salat al-Tasbih & Tahiyyatul Wudu (Day & Night)",
      rakahBadge:
        lang === "bn"
          ? "৪ রাকাত (তাসবীহ) • ২ রাকাত (অযু)"
          : lang === "ar"
          ? "٤ ركعات (التسبيح) • ركعتا الوضوء"
          : "4 Rak'ah (Tasbih) • 2 Rak'ah (Wudu)",
      timeRangeText:
        lang === "bn"
          ? "নিষিদ্ধ ৩ সময় ব্যতীত"
          : lang === "ar"
          ? "عدا أوقات النهي الـ ٣"
          : "Except 3 Forbidden Times",
      evidenceFull:
        lang === "bn"
          ? "⏰ ওয়াক্ত (দিন-রাত যেকোনো সময়): সূর্যোদয় (১৫ মি.), ঠিক দ্বিপ্রহর (যাওয়াল) ও সূর্যাস্ত (১৫ মি.) — এই ৩টি নিষিদ্ধ সময় ছাড়া দিন-রাতের যেকোনো সময় আদায় করা যায় • রাকাত: ৪ রাকাত (সালাতুত তাসবীহ) / ২ রাকাত (তাহিয়্যাতুল অযু)।\n\n📖 দলিল (সহীহ মুসলিম ২৩৪ ও আবু দাউদ ১২৯৭): বেলাল (রা.) প্রতিবার অযুর পর ২ রাকাত তাহিয়্যাতুল অযু আদায় করতেন, যার ফলে নবীজি ﷺ জান্নাতে তাঁর পায়ের আওয়াজ শুনতে পেয়েছেন। আর সালাতুত তাসবীহ (৪ রাকাতে ৩০০ বার তাসবীহ) গুনাহ মাফের বিশেষ মাধ্যম।"
          : lang === "ar"
          ? "⏰ الوقت (ليلاً ونهاراً): تُصلى في أي وقت من الليل والنهار ما عدا أوقات النهي الثلاثة • ٤ ركعات (التسبيح) / ركعتان (تحية الوضوء).\n\n📖 الدليل (صحيح مسلم ٢٣٤ وسنن أبي داود ١٢٩٧): محافظة بلال رضي الله عنه على ركعتي الوضوء، وصلاة التسبيح ٤ ركعات بـ ٣٠٠ تسبيحة."
          : "⏰ Waqt (Day & Night): Permitted at any time of day or night outside the 3 prohibited windows (Sunrise, Zawal, Sunset) • 4 Rak'ahs (Salat al-Tasbih) / 2 Rak'ahs (Tahiyyatul Wudu).\n\n📖 Proof (Sahih Muslim 234 & Sunan Abi Dawud 1297): Bilal (RA) consistently prayed 2 Rak'ahs after every Wudu, and Salat al-Tasbih (4 Rak'ahs with 300 Tasbihat) expiates sins.",
      wisdomFull:
        lang === "bn"
          ? "প্রতিবার অযুর পর ২ রাকাত তাহিয়্যাতুল অযু মুমিনকে সারাদিন পবিত্রতা ও সালাতের সাথে যুক্ত রাখে।"
          : lang === "ar"
          ? "تربط المؤمن بالطهارة والصلاة على مدار اليوم والليلة."
          : "Keeps the believer in a state of continuous spiritual purity and mindfulness throughout the 24-hour cycle.",
      isActive: isTasbihWuduActive
    }
  ];
}

