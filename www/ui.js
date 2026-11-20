// ============================================================================
// SUNNAH 24 — UI RENDERERS, SVG SCENES, INTERACTIVE MODALS, NAVIGATION STACK
// & APPLICATION BOOTSTRAPPER
// ============================================================================

// ============================================================================
// WORLD-STANDARD STRICT TIME-WINDOW LOCK, REGIONAL SEASONAL ISLAMIC PRAYER
// ASTRONOMICAL ENGINE (BANGLADESH • MIDDLE EAST • WESTERN) & SVG RINGS
// ============================================================================
const HERO_RING_CIRCUMFERENCE = 245.04;   // 2 * PI * 39 (Sleek 92x92 Hero Ring)
const TASBIH_RING_CIRCUMFERENCE = 703.72; // 2 * PI * 112
const DUA_RING_CIRCUMFERENCE = 150.8;     // 2 * PI * 24


function getHabitIconMeta(habit) {
  if (habit && HABIT_CIRCULAR_ICONS[habit.id]) {
    return HABIT_CIRCULAR_ICONS[habit.id];
  }
  const phaseIcons = {
    tahajjud_fajr: { icon: "🌌", theme: "indigo" },
    duha_work: { icon: "☀️", theme: "amber" },
    dhuhr_asr: { icon: "🌤️", theme: "emerald" },
    maghrib_isha: { icon: "🌆", theme: "purple" },
    sleep_sunnah: { icon: "🛌", theme: "teal" },
    diet_hygiene: { icon: "🍯", theme: "gold" },
    character_social: { icon: "🤝", theme: "emerald" }
  };
  return phaseIcons[habit?.phase] || { icon: "☪️", theme: "emerald" };
}

function getDuaIconMeta(dua) {
  if (dua && DUA_CIRCULAR_ICONS[dua.id]) {
    return DUA_CIRCULAR_ICONS[dua.id];
  }
  return { icon: "🤲", theme: "emerald" };
}

function formatShortWaqtClock(totalMins, locale = appState.locale) {
  const clamped = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const h24 = Math.floor(clamped / 60);
  const mins = clamped % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const hStr = localizeDigits(String(h12).padStart(2, "0"), locale);
  const mStr = localizeDigits(String(mins).padStart(2, "0"), locale);
  return `${hStr}:${mStr}`;
}

// ============================================================================
// GOOGLE DEEPMIND REAL-TIME SECOND-PRECISION WAQT COUNTDOWN ENGINE (1Hz TICKER)
// Computes exact remaining Hours, Minutes, and Seconds until the current Waqt
// or Prohibited Window ends and updates #live-waqt-remaining every 1 second
// without re-rendering the entire SVG DOM (unless a Waqt boundary is crossed).
// ============================================================================
let activeOngoingWaqtState = {
  sceneKey: "",
  winStartMins: 0,
  winEndMins: 0,
  isCrossMidnight: false,
  isProhibited: false
};

function formatLiveCountdownWithSeconds(remainingTotalSeconds, locale = appState.locale, includeSuffix = false) {
  const safeTotalSecs = Math.max(0, Math.floor(remainingTotalSeconds));
  const hrs = Math.floor(safeTotalSecs / 3600);
  const mins = Math.floor((safeTotalSecs % 3600) / 60);
  const secs = safeTotalSecs % 60;

  const pad2 = (n) => String(n).padStart(2, "0");

  if (locale === "bn") {
    const suffix = includeSuffix ? " বাকি" : "";
    const hStr = localizeDigits(hrs, "bn");
    const mStr = localizeDigits(pad2(mins), "bn");
    const sStr = localizeDigits(pad2(secs), "bn");
    if (hrs > 0) {
      return `${hStr}ঘন্টা ${mStr}মি. ${sStr}সে.${suffix}`;
    }
    if (mins > 0) {
      return `${localizeDigits(mins, "bn")}মি. ${sStr}সে.${suffix}`;
    }
    return `${sStr}সে.${suffix}`;
  }

  if (locale === "ar") {
    const prefix = includeSuffix ? "متبقي " : "";
    const hStr = localizeDigits(hrs, "ar");
    const mStr = localizeDigits(pad2(mins), "ar");
    const sStr = localizeDigits(pad2(secs), "ar");
    if (hrs > 0) {
      return `${prefix}${hStr}س ${mStr}د ${sStr}ث`;
    }
    if (mins > 0) {
      return `${prefix}${localizeDigits(mins, "ar")}د ${sStr}ث`;
    }
    return `${prefix}${sStr}ث`;
  }

  const suffixEn = includeSuffix ? " left" : "";
  if (hrs > 0) {
    return `${hrs}h ${pad2(mins)}m. ${pad2(secs)}s.${suffixEn}`;
  }
  if (mins > 0) {
    return `${mins}m. ${pad2(secs)}s.${suffixEn}`;
  }
  return `${pad2(secs)}s.${suffixEn}`;
}

function formatRemainingDurationText(remainingMins, locale = appState.locale, includeSuffix = false) {
  const totalSeconds = Math.max(0, Math.round(Number(remainingMins || 0) * 60));
  return formatLiveCountdownWithSeconds(totalSeconds, locale, includeSuffix);
}

// High-precision 1-second live countdown algorithm for "ওয়াক্ত শেষ হতে বাকি:" (#live-waqt-remaining)
function computeActiveOngoingWaqtTelemetry(now = new Date()) {
  const sched = computeSeasonalPrayerSchedule(now);
  const pWindows = sched.prohibitedWindows || {
    sunrise: { start: sched.sunrise, end: sched.sunrise + 15 },
    zawal: { start: sched.zawal, end: sched.dhuhr },
    sunset: { start: sched.sunset - 15, end: sched.sunset }
  };
  const lang = (appState && appState.locale) || "bn";
  const middayMeta = resolveMiddayWaqtMeta(now, lang);

  const nowTotalSecs =
    now.getHours() * 3600 +
    now.getMinutes() * 60 +
    now.getSeconds();
  const nowMins = nowTotalSecs / 60;

  let sceneKey = "isha";
  let winStartMins = sched.isha;
  let winEndMins = sched.fajr + 1440;
  let currentPosSecs = nowTotalSecs;
  let isProhibitedNow = false;

  if (nowMins >= sched.fajr && nowMins < pWindows.sunrise.start) {
    sceneKey = "fajr";
    winStartMins = sched.fajr;
    winEndMins = pWindows.sunrise.start;
  } else if (nowMins >= pWindows.sunrise.start && nowMins < pWindows.sunrise.end) {
    sceneKey = "prohibited_sunrise";
    winStartMins = pWindows.sunrise.start;
    winEndMins = pWindows.sunrise.end;
    isProhibitedNow = true;
  } else if (nowMins >= pWindows.sunrise.end && nowMins < pWindows.zawal.start) {
    sceneKey = "ishraq_duha";
    winStartMins = pWindows.sunrise.end;
    winEndMins = pWindows.zawal.start;
  } else if (nowMins >= pWindows.zawal.start && nowMins < pWindows.zawal.end) {
    sceneKey = "prohibited_zawal";
    winStartMins = pWindows.zawal.start;
    winEndMins = pWindows.zawal.end;
    isProhibitedNow = true;
  } else if (nowMins >= pWindows.zawal.end && nowMins < sched.asr) {
    sceneKey = middayMeta.isJumuah ? "jumuah" : "dhuhr";
    winStartMins = pWindows.zawal.end;
    winEndMins = sched.asr;
  } else if (nowMins >= sched.asr && nowMins < pWindows.sunset.start) {
    sceneKey = "asr";
    winStartMins = sched.asr;
    winEndMins = pWindows.sunset.start;
  } else if (nowMins >= pWindows.sunset.start && nowMins < sched.maghrib) {
    sceneKey = "prohibited_sunset";
    winStartMins = pWindows.sunset.start;
    winEndMins = sched.maghrib;
    isProhibitedNow = true;
  } else if (nowMins >= sched.maghrib && nowMins < sched.isha) {
    sceneKey = "maghrib";
    winStartMins = sched.maghrib;
    winEndMins = sched.isha;
  } else {
    sceneKey = "isha";
    winStartMins = sched.isha;
    winEndMins = sched.fajr + 1440;
    if (nowMins < sched.fajr) {
      currentPosSecs = nowTotalSecs + 86400;
    }
  }

  const winStartSecs = winStartMins * 60;
  const winEndSecs = winEndMins * 60;
  const totalDurationSecs = Math.max(1, winEndSecs - winStartSecs);
  const elapsedSecs = Math.max(0, Math.min(totalDurationSecs, currentPosSecs - winStartSecs));
  const remainingSecs = Math.max(0, winEndSecs - currentPosSecs);
  const pct = Math.max(4, Math.min(100, Math.round((elapsedSecs / totalDurationSecs) * 100)));

  return {
    sceneKey,
    winStartMins,
    winEndMins,
    totalDurationSecs,
    elapsedSecs,
    remainingSecs,
    pct,
    isProhibitedNow,
    formattedRemaining: formatLiveCountdownWithSeconds(remainingSecs, lang, false)
  };
}

// Lightweight 1-Second DOM Ticker for Ongoing Prayers ("ওয়াক্ত শেষ হতে বাকি:")
function tickOngoingPrayerLiveCountdown() {
  const now = new Date();
  const currentKey = getLocalDateKey(now);
  if (currentKey !== lastObservedDateKey) {
    lastObservedDateKey = currentKey;
    renderHeaderDatesAndPhase();
    renderHabits();
    renderDuas();
    return;
  }

  const telemetry = computeActiveOngoingWaqtTelemetry(now);

  // If the prayer Waqt boundary just transitioned (e.g., Dhuhr -> Asr), trigger full card & strip re-render immediately
  if (
    activeOngoingWaqtState.sceneKey &&
    (activeOngoingWaqtState.sceneKey !== telemetry.sceneKey ||
      activeOngoingWaqtState.winEndMins !== telemetry.winEndMins)
  ) {
    activeOngoingWaqtState.sceneKey = telemetry.sceneKey;
    activeOngoingWaqtState.winStartMins = telemetry.winStartMins;
    activeOngoingWaqtState.winEndMins = telemetry.winEndMins;
    activeOngoingWaqtState.isProhibited = telemetry.isProhibitedNow;
    renderHeaderDatesAndPhase();
    renderHabits();
    renderDuas();
    return;
  }

  activeOngoingWaqtState.sceneKey = telemetry.sceneKey;
  activeOngoingWaqtState.winStartMins = telemetry.winStartMins;
  activeOngoingWaqtState.winEndMins = telemetry.winEndMins;
  activeOngoingWaqtState.isProhibited = telemetry.isProhibitedNow;

  // Update the live countdown text in-place without re-creating the SVG card
  const remEl = document.getElementById("live-waqt-remaining");
  if (remEl) {
    if (!remEl.classList.contains("s24-live-countdown-ticker")) {
      remEl.classList.add("s24-live-countdown-ticker");
    }
    if (remEl.textContent !== telemetry.formattedRemaining) {
      remEl.textContent = telemetry.formattedRemaining;
    }
  }

  const fillEl = document.getElementById("live-waqt-fill");
  if (fillEl) {
    fillEl.style.width = `${telemetry.pct}%`;
  }

  // Also keep any open 5-Waqt popup countdown ticking live every second
  if (typeof activeSelectedWaqtPopupId === "string" && activeSelectedWaqtPopupId) {
    const popupValEl = document.querySelector(
      "#waqt-range-popup-wrap .countdown-single-line-row .meta-row-value"
    );
    if (popupValEl && typeof getExactWaqtPopupDetails === "function") {
      const info = getExactWaqtPopupDetails(activeSelectedWaqtPopupId, now);
      if (info) {
        const livePopupStr = formatRemainingDurationText(info.remOrStartsMins, appState.locale || "bn");
        if (popupValEl.textContent !== livePopupStr) {
          popupValEl.textContent = livePopupStr;
        }
      }
    }
  }
}

function getFardWaqtSvgIcon(waqtId) {
  switch (waqtId) {
    case "fajr":
      return `
        <svg class="fard-prayer-svg" viewBox="0 0 36 36" width="50" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fardFajrSky" x1="0" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#bae6fd"/>
              <stop offset="62%" stop-color="#fef08a"/>
              <stop offset="100%" stop-color="#22c55e"/>
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="32" height="32" rx="8" fill="url(#fardFajrSky)"/>
          <path d="M18 11V14M11 14L13 16M25 14L23 16M8 21H11M25 21H28" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M11 23C11 19.134 14.134 16 18 16C21.866 16 25 19.134 25 23H11Z" fill="#f59e0b"/>
          <path d="M2 23H34V29C34 31.7614 31.7614 34 29 34H7C4.23858 34 2 31.7614 2 29V23Z" fill="#15803d"/>
          <path d="M5 25H31" stroke="#4ade80" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.7"/>
        </svg>
      `;
    case "dhuhr":
      return `
        <svg class="fard-prayer-svg" viewBox="0 0 36 36" width="50" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#fffbeb"/>
          <circle cx="18" cy="18" r="7.2" fill="#f59e0b"/>
          <path d="M18 5.5V8.5M18 27.5V30.5M5.5 18H8.5M27.5 18H30.5M9.16 9.16L11.28 11.28M24.72 24.72L26.84 26.84M26.84 9.16L24.72 11.28M11.28 24.72L9.16 26.84" stroke="#f59e0b" stroke-width="2.1" stroke-linecap="round"/>
        </svg>
      `;
    case "asr":
      return `
        <svg class="fard-prayer-svg" viewBox="0 0 36 36" width="50" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#f8fafc"/>
          <circle cx="13.5" cy="14.5" r="5.5" fill="#f59e0b"/>
          <path d="M13.5 6.5V8M6 14.5H7.5M8.2 9.2L9.4 10.4M18.8 9.2L17.6 10.4" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M13.5 25.5H25C27.4853 25.5 29.5 23.4853 29.5 21C29.5 18.69 27.76 16.79 25.52 16.53C24.84 13.38 22.04 11 18.7 11C14.83 11 11.7 14.13 11.7 18C11.7 18.27 11.72 18.54 11.75 18.8C10.17 19.34 9 20.84 9 22.6C9 24.2 10.3 25.5 13.5 25.5Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>
      `;
    case "maghrib":
      return `
        <svg class="fard-prayer-svg" viewBox="0 0 36 36" width="50" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#fff7ed"/>
          <path d="M10 21C10 16.5817 13.5817 13 18 13C22.4183 13 26 16.5817 26 21H10Z" fill="#ea580c"/>
          <path d="M6 21H30" stroke="#9a3412" stroke-width="2" stroke-linecap="round"/>
          <path d="M9 24.5H27" stroke="#ea580c" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M13 28H23" stroke="#fb923c" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      `;
    case "isha":
    default:
      return `
        <svg class="fard-prayer-svg" viewBox="0 0 36 36" width="50" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#f8fafc"/>
          <path d="M21.8 9.2C17.2 10.4 14.5 15.1 15.7 19.7C16.9 24.3 21.6 27 26.2 25.8C22.9 28.4 18.2 28.2 15.1 25.1C12 22 11.8 17.3 14.4 14C16.2 11.7 18.9 9.9 21.8 9.2Z" fill="#facc15" stroke="#eab308" stroke-width="1.1" stroke-linejoin="round"/>
          <path d="M24.5 11.5L25.2 13.3L27 14L25.2 14.7L24.5 16.5L23.8 14.7L22 14L23.8 13.3L24.5 11.5Z" fill="#1e293b"/>
          <circle cx="27.5" cy="19.5" r="1.2" fill="#334155"/>
        </svg>
      `;
  }
}

// ============================================================================
// V11.2 GOOGLE DEEPMIND UNOBSTRUCTED MASJID AN-NABAWI ARCHITECTURAL & CELESTIAL
// VECTOR ENGINE + ONGOING PRAYER UI
// - Completely removes the Tahajjud prayer box (#live-tahajjud-subrow) and the
//   bottom Rak'ah summary line from every ongoing prayer card.
// - Positions the 3 time-based pills (Start -> End, Awwal Waqt, Remaining Time)
//   strictly BELOW the Masjid an-Nabawi Green Dome & Twin Minarets (y > 236)
//   so 100% of the Mosque architecture (Finial, Green Dome, 7 Arched Drum
//   Windows, Stepped Plinth, and Twin 3-Balcony Minarets) is completely visible
//   and never covered by the timeline pills.
// ============================================================================
function getJumuahMandalaPatternSvg() {
  let arches = "";
  for (let i = 0; i < 5; i++) {
    const x = 132 + i * 34;
    arches += `<path d="M${x - 10} 223 V208 A10 10 0 0 1 ${x + 10} 208 V223 Z" fill="#14532d" opacity="0.22" />`;
  }
  return `
    <g class="s24-celestial-anim">
      <!-- Serene Jumu'ah Morning Sky & Illuminated Mosque Courtyard Halo (No Sun) -->
      <ellipse cx="200" cy="146" rx="142" ry="86" fill="url(#s24CenterWhiteBacklight)" />
      <!-- Subtle Geometric Mihrab Arch Frame Behind Masjid an-Nabawi -->
      <path d="M104 223 V122 C104 68 148 34 200 34 C252 34 296 68 296 122 V223" fill="none" stroke="#16a34a" stroke-opacity="0.22" stroke-width="2.2" />
      <path d="M114 223 V125 C114 76 153 44 200 44 C247 44 286 76 286 125 V223" fill="none" stroke="#b48a3e" stroke-opacity="0.28" stroke-width="1.4" stroke-dasharray="4 4" />
      <!-- Delicate Jumu'ah Crescent & Star Finial Accent at Top of Mihrab Arch -->
      <path d="M203 18 C197.5 19.8 195 25.5 197 31 C199 36.5 204.7 39 210.2 37.2 C206 40.4 199.8 40.2 195.8 36.2 C191.8 32.2 191.6 26 194.8 21.8 C196.8 19.2 199.8 18 203 18 Z" fill="#15803d" opacity="0.82" />
      <circle cx="212" cy="23" r="1.8" fill="#b48a3e" opacity="0.88" />
      <!-- Soft Masjid Courtyard Arcade Colonnade Behind Main Dome -->
      <rect x="112" y="196" width="176" height="27" rx="3" fill="#dcfce7" opacity="0.55" />
      ${arches}
    </g>
  `;
}

function getSymmetricNabawiCardSvg(sceneKey) {
  const configs = {
    fajr: {
      bgTop: "#8ec5e8",
      bgMid: "#cde7f5",
      bgBottom: "#fce5a8",
      celestial: `
        <g class="s24-celestial-anim">
          <!-- Soft White-Gold Dawn Horizon Atmospheric Backlight Behind Mosque -->
          <ellipse cx="200" cy="172" rx="135" ry="78" fill="url(#s24CenterWhiteBacklight)" />
          <ellipse cx="200" cy="160" rx="92" ry="54" fill="url(#s24DawnHorizonGlow)" />
          <!-- Delicate Tapered Dawn Crepuscular Rays (Professional Volumetric Style) -->
          <g opacity="0.72" stroke="url(#s24DawnRayGrad)" stroke-linecap="round">
            <line x1="200" y1="76" x2="200" y2="112" stroke-width="2.6" />
            <line x1="168" y1="84" x2="181" y2="115" stroke-width="2.2" />
            <line x1="232" y1="84" x2="219" y2="115" stroke-width="2.2" />
            <line x1="142" y1="104" x2="167" y2="124" stroke-width="2.0" />
            <line x1="258" y1="104" x2="233" y2="124" stroke-width="2.0" />
          </g>
          <!-- Distant Photorealistic Rising Dawn Sun Orb -->
          <circle cx="200" cy="148" r="36" fill="url(#s24SunBloomWarm)" opacity="0.78" />
          <circle cx="200" cy="148" r="25" fill="url(#s24DawnSunOrb)" filter="url(#s24SoftSunGlow)" />
        </g>
      `,
      preMinaretLayer: `
        <rect x="0" y="218" width="400" height="26" fill="#126e38" />
        <rect x="0" y="244" width="400" height="60" fill="url(#s24FajrMintWash)" />
      `,
      postDomeLayer: `
        <ellipse cx="200" cy="226" rx="96" ry="18" fill="url(#s24CenterWhiteSubtle)" />
      `
    },
    ishraq_duha: {
      bgTop: "#a6d8f7",
      bgMid: "#dcf0fc",
      bgBottom: "#fcedc2",
      celestial: `
        <g class="s24-celestial-anim">
          <!-- Volumetric Morning Light Shaft & White-Mist Mosque Backlight -->
          <ellipse cx="200" cy="158" rx="122" ry="74" fill="url(#s24CenterWhiteBacklight)" />
          <polygon points="200,68 112,228 288,228" fill="url(#s24DuhaBeamGrad)" />
          <!-- Multi-Layer Photorealistic Morning Sun (High & Distant) -->
          <circle cx="200" cy="70" r="38" fill="url(#s24SunBloomWarm)" opacity="0.75" />
          <circle cx="200" cy="70" r="24" fill="#fef08a" opacity="0.42" />
          <g stroke="#fde047" stroke-width="2.2" stroke-linecap="round" opacity="0.78">
            <line x1="200" y1="36" x2="200" y2="45" />
            <line x1="200" y1="95" x2="200" y2="104" />
            <line x1="166" y1="70" x2="175" y2="70" />
            <line x1="225" y1="70" x2="234" y2="70" />
            <line x1="176" y1="46" x2="182" y2="52" />
            <line x1="218" y1="88" x2="224" y2="94" />
            <line x1="224" y1="46" x2="218" y2="52" />
            <line x1="182" y1="88" x2="176" y2="94" />
          </g>
          <circle cx="200" cy="70" r="16.5" fill="url(#s24DuhaSunCore)" filter="url(#s24SoftSunGlow)" />
        </g>
      `,
      preMinaretLayer: "",
      postDomeLayer: `
        <ellipse cx="200" cy="230" rx="82" ry="18" fill="url(#s24DomeUnderGlow)" />
      `
    },
    dhuhr: {
      bgTop: "#fcf3dc",
      bgMid: "#fae8be",
      bgBottom: "#f5dba4",
      celestial: `
        <g class="s24-celestial-anim">
          <!-- Radiant White-Gold Zenith Backlight Behind Central Mosque -->
          <ellipse cx="200" cy="152" rx="128" ry="80" fill="url(#s24CenterWhiteBacklight)" />
          <polygon points="200,64 122,226 278,226" fill="url(#s24DuhaBeamGrad)" opacity="0.65" />
          <!-- High Distant Zenith Noon Sun with Corona Halo -->
          <circle cx="200" cy="66" r="40" fill="url(#s24SunBloomWarm)" opacity="0.88" />
          <circle cx="200" cy="66" r="25" fill="#fde68a" opacity="0.52" />
          <g stroke="#f59e0b" stroke-width="2.4" stroke-linecap="round" opacity="0.72">
            <line x1="200" y1="30" x2="200" y2="40" />
            <line x1="200" y1="92" x2="200" y2="102" />
            <line x1="164" y1="66" x2="174" y2="66" />
            <line x1="226" y1="66" x2="236" y2="66" />
            <line x1="174.5" y1="40.5" x2="181.5" y2="47.5" />
            <line x1="218.5" y1="84.5" x2="225.5" y2="91.5" />
            <line x1="225.5" y1="40.5" x2="218.5" y2="47.5" />
            <line x1="181.5" y1="84.5" x2="174.5" y2="91.5" />
          </g>
          <circle cx="200" cy="66" r="17.5" fill="url(#s24NoonSunCore)" filter="url(#s24SoftSunGlow)" />
        </g>
      `,
      preMinaretLayer: "",
      postDomeLayer: `
        <ellipse cx="200" cy="230" rx="84" ry="18" fill="url(#s24DomeUnderGlow)" />
      `
    },
    jumuah: {
      bgTop: "#f4fbf6",
      bgMid: "#f9f8eb",
      bgBottom: "#eef8f0",
      celestial: getJumuahMandalaPatternSvg(),
      preMinaretLayer: "",
      postDomeLayer: `
        <rect x="0" y="223" width="400" height="7" fill="#126e38" />
        <rect x="0" y="230" width="400" height="145" fill="#ebf6ee" opacity="0.55" />
      `
    },
    asr: {
      bgTop: "#fcf0d9",
      bgMid: "#f9dfa8",
      bgBottom: "#f1ca89",
      celestial: `
        <g class="s24-celestial-anim">
          <!-- Warm Afternoon Atmospheric Haze Behind Mosque -->
          <ellipse cx="200" cy="156" rx="124" ry="74" fill="url(#s24CenterWhiteBacklight)" opacity="0.82" />
          <!-- Back Left Cloud Layer (Soft Volumetric Depth) -->
          <path d="M 0 118 Q 16 105 38 111 Q 64 78 102 91 Q 134 95 148 116 L 148 122 L 0 122 Z" fill="#d9e2ec" stroke="#9fb3c8" stroke-width="1.8" stroke-linejoin="round" opacity="0.92" />
          <path d="M 0 163 L 0 132 Q 26 125 48 138 Q 76 122 106 138 Q 132 144 146 163 Z" fill="#e2e8f0" stroke="#9fb3c8" stroke-width="1.8" stroke-linejoin="round" opacity="0.95" />
          <!-- Back Right Cloud Layer -->
          <path d="M 272 118 Q 296 92 332 97 Q 368 68 400 72 L 400 122 L 272 122 Z" fill="#d9e2ec" stroke="#9fb3c8" stroke-width="1.8" stroke-linejoin="round" opacity="0.92" />
          <path d="M 234 152 Q 254 134 282 138 Q 312 115 352 125 Q 378 120 400 130 L 400 152 Z" fill="#e2e8f0" stroke="#9fb3c8" stroke-width="1.8" stroke-linejoin="round" opacity="0.95" />
          <!-- Distant Golden-Amber Afternoon Sun Orb with Multi-Stop Glow -->
          <circle cx="201" cy="84" r="35" fill="url(#s24SunBloomWarm)" opacity="0.72" />
          <circle cx="201" cy="84" r="22.5" fill="url(#s24AsrSunOrb)" filter="url(#s24SoftSunGlow)" />
          <!-- Foreground Central Cloud Overlapping Lower Right of Sun with Silver-Gold Rim Lighting -->
          <path d="M 192 118 C 184 118 180 111 182 104 C 184 95 196 88 208 91 C 216 78 236 73 252 81 C 263 86 268 95 267 103 C 276 104 283 110 283 116 C 283 122 276 125 266 125 L 204 125 C 196 125 192 122 192 118 Z" fill="#d9e2ec" stroke="#94a3b8" stroke-width="2.0" stroke-linejoin="round" />
          <path d="M 195 116 C 189 116 186 110 188 105 C 190 97 200 92 211 94 C 218 82 236 78 250 85 C 260 89 264 98 263 105 C 271 106 277 111 277 115 C 277 120 271 122 263 122 L 205 122 C 199 122 195 120 195 116 Z" fill="#f1f5f9" />
        </g>
      `,
      preMinaretLayer: `
        <rect x="0" y="232" width="400" height="143" fill="#d5b384" />
      `,
      postDomeLayer: ""
    },
    maghrib: {
      bgTop: "#f59e0b",
      bgMid: "#ea580c",
      bgBottom: "#c2410c",
      celestial: `
        <g class="s24-celestial-anim">
          <!-- Warm Twilight Horizon Atmospheric Backlight Behind Central Mosque -->
          <ellipse cx="200" cy="148" rx="126" ry="74" fill="url(#s24TwilightHorizonGlow)" />
          <ellipse cx="200" cy="175" rx="98" ry="52" fill="url(#s24CenterWhiteBacklight)" opacity="0.55" />
          <!-- Distant Setting Crimson-Amber Twilight Sun Orb & Horizon Reflection Bands -->
          <circle cx="200" cy="96" r="42" fill="url(#s24SunBloomWarm)" opacity="0.62" />
          <path d="M170 96 A30 30 0 0 1 230 96 Z" fill="url(#s24MaghribSunOrb)" filter="url(#s24SoftSunGlow)" />
          <rect x="170" y="100.5" width="60" height="3.8" rx="1.9" fill="#fff7ed" opacity="0.78" />
          <rect x="177" y="107" width="46" height="3.5" rx="1.75" fill="#fed7aa" opacity="0.68" />
          <rect x="184" y="113" width="32" height="3.2" rx="1.6" fill="#fdba74" opacity="0.55" />
        </g>
      `,
      preMinaretLayer: `
        <rect x="0" y="223" width="400" height="152" fill="#fdba74" opacity="0.65" />
        <polygon points="106,258 140,214 260,214 294,258" fill="#edd3b2" />
        <circle cx="200" cy="232" r="6" fill="#cbb084" />
        <path d="M192.5 256 A7.5 7.5 0 0 1 207.5 256 Z" fill="#cbb084" />
      `,
      postDomeLayer: ""
    },
    isha: {
      bgTop: "#0a192f",
      bgMid: "#0f2744",
      bgBottom: "#15355a",
      celestial: `
        <g class="s24-celestial-anim">
          <!-- 1. Soft White-Mist Atmospheric Backlight at the Center of the Mosque Area Below the Moon (Matching Reference Image) -->
          <ellipse cx="200" cy="172" rx="118" ry="76" fill="url(#s24IshaMosqueWhiteMist)" />
          <ellipse cx="200" cy="194" rx="86" ry="52" fill="url(#s24IshaMosqueInnerWhite)" />

          <!-- 2. Distant Optical Lunar Halo Around the Shrunk High-Altitude Crescent Moon -->
          <circle cx="198" cy="68" r="36" fill="url(#s24LunarAtmosphericHalo)" />
          <!-- Subtle Earthshine on the Dark Limb of the Moon for Realistic 3D Astronomical Depth -->
          <circle cx="198" cy="68" r="14.5" fill="#93c5fd" opacity="0.06" />

          <!-- 3. Shrunk, Distant, Razor-Sharp Astronomical Crescent Moon (Moved Higher & Smaller for a Crisp, Professional Look) -->
          <path d="M 197.5 52.5 A 15.5 15.5 0 1 0 212.2 73.2 A 13.2 13.2 0 1 1 197.5 52.5 Z" fill="url(#s24RealisticCrescentGrad)" filter="url(#s24MoonCrispGlow)" />

          <!-- 4. Refined Multi-Depth Twinkling Starfield (Crisp Pinpoint Stars + Delicate 4-Point Celestial Glints) -->
          <circle cx="152" cy="57" r="1.45" fill="#fef9c3" opacity="0.92" />
          <path d="M225 46 L225.7 48.2 L227.9 48.9 L225.7 49.6 L225 51.8 L224.3 49.6 L222.1 48.9 L224.3 48.2 Z" fill="#fef08a" opacity="0.9" />
          <path d="M174 87 L174.6 89.0 L176.6 89.6 L174.6 90.2 L174 92.2 L173.4 90.2 L171.4 89.6 L173.4 89.0 Z" fill="#fde047" opacity="0.85" />
          <circle cx="226" cy="73" r="1.15" fill="#fef9c3" opacity="0.82" />
          <path d="M250 89 L250.5 90.7 L252.2 91.2 L250.5 91.7 L250 93.4 L249.5 91.7 L247.8 91.2 L249.5 90.7 Z" fill="#fef08a" opacity="0.8" />
          <path d="M342 68 L342.6 69.8 L344.4 70.4 L342.6 71.0 L342 72.8 L341.4 71.0 L339.6 70.4 L341.4 69.8 Z" fill="#fde047" opacity="0.78" />
          <path d="M52 112 L52.6 113.8 L54.4 114.4 L52.6 115.0 L52 116.8 L51.4 115.0 L49.6 114.4 L51.4 113.8 Z" fill="#fde047" opacity="0.75" />
          <circle cx="122" cy="88" r="1.05" fill="#e2e8f0" opacity="0.75" />
          <circle cx="144" cy="116" r="1.15" fill="#fef08a" opacity="0.72" />
          <circle cx="256" cy="118" r="1.1" fill="#fef08a" opacity="0.72" />
          <circle cx="356" cy="114" r="1.15" fill="#e2e8f0" opacity="0.75" />
          <circle cx="218" cy="96" r="0.95" fill="#f8fafc" opacity="0.7" />
          <circle cx="158" cy="134" r="0.9" fill="#f8fafc" opacity="0.65" />
        </g>
      `,
      preMinaretLayer: `
        <rect x="0" y="232" width="400" height="143" fill="#0b2940" />
      `,
      postDomeLayer: `
        <!-- Subtle Pearlescent Horizon Ambient Glow Below the Mosque Plinth & Around Center -->
        <ellipse cx="200" cy="242" rx="112" ry="30" fill="url(#s24IshaMosqueInnerWhite)" opacity="0.75" />
      `
    },

    prohibited_sunrise: {
      bgTop: "#ffe4e6",
      bgMid: "#fecdd3",
      bgBottom: "#fef2f2",
      celestial: `
        <g class="s24-celestial-anim">
          <ellipse cx="200" cy="154" rx="115" ry="68" fill="url(#s24CenterWhiteBacklight)" />
          <circle cx="200" cy="76" r="26" fill="none" stroke="#dc2626" stroke-width="2.0" stroke-dasharray="4.5 3.5" />
          <circle cx="200" cy="76" r="18" fill="#ef4444" stroke="#b91c1c" stroke-width="2.4" />
          <line x1="187" y1="89" x2="213" y2="63" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" />
        </g>
      `,
      preMinaretLayer: "",
      postDomeLayer: ""
    },
    prohibited_zawal: {
      bgTop: "#ffe4e6",
      bgMid: "#fecdd3",
      bgBottom: "#fff1f2",
      celestial: `
        <g class="s24-celestial-anim">
          <ellipse cx="200" cy="154" rx="115" ry="68" fill="url(#s24CenterWhiteBacklight)" />
          <circle cx="200" cy="74" r="25" fill="#ffffff" stroke="#b91c1c" stroke-width="3.0" />
          <circle cx="200" cy="74" r="17" fill="#ef4444" />
          <line x1="185" y1="89" x2="215" y2="59" stroke="#b91c1c" stroke-width="3.6" stroke-linecap="round" />
        </g>
      `,
      preMinaretLayer: "",
      postDomeLayer: ""
    },
    prohibited_sunset: {
      bgTop: "#ffe4e6",
      bgMid: "#fed7aa",
      bgBottom: "#ffedd5",
      celestial: `
        <g class="s24-celestial-anim">
          <ellipse cx="200" cy="154" rx="115" ry="68" fill="url(#s24CenterWhiteBacklight)" />
          <circle cx="200" cy="82" r="27" fill="none" stroke="#dc2626" stroke-width="2.0" stroke-dasharray="4.5 3.5" />
          <path d="M172 88 A28 28 0 0 1 228 88 Z" fill="#ef4444" />
          <rect x="166" y="92" width="68" height="4.2" rx="2.1" fill="#b91b1b" />
          <rect x="176" y="99.5" width="48" height="4.2" rx="2.1" fill="#dc2626" />
        </g>
      `,
      preMinaretLayer: "",
      postDomeLayer: ""
    }
  };

  const c = configs[sceneKey] || configs.dhuhr;

  const renderMinaret = (cx) => `
    <g filter="url(#s24ArchShadow)">
      <!-- Finial Spire -->
      <path d="M${cx - 2.1} 76 L${cx} 54 L${cx + 2.1} 76 Z" fill="#b59461" />
      <!-- Conical Upper Cap (2-Tone) -->
      <polygon points="${cx - 11.5},100 ${cx},76 ${cx},100" fill="#f1dfc0" />
      <polygon points="${cx},100 ${cx},76 ${cx + 11.5},100" fill="#e2caa3" />
      <!-- 1st Balcony -->
      <rect x="${cx - 14.5}" y="100" width="14.5" height="5.5" rx="1.8" fill="#d4b98e" />
      <rect x="${cx}" y="100" width="14.5" height="5.5" rx="1.8" fill="#bfa174" />
      <!-- Upper Shaft -->
      <rect x="${cx - 11.5}" y="105.5" width="11.5" height="27" fill="#f1dfc0" />
      <rect x="${cx}" y="105.5" width="11.5" height="27" fill="#e2caa3" />
      <!-- 2nd Balcony with Trapezoid Corbel -->
      <rect x="${cx - 18}" y="132.5" width="18" height="5.5" rx="1.8" fill="#d4b98e" />
      <rect x="${cx}" y="132.5" width="18" height="5.5" rx="1.8" fill="#bfa174" />
      <polygon points="${cx - 18},138 ${cx},138 ${cx},145.5 ${cx - 13.5},145.5" fill="#cbb085" />
      <polygon points="${cx},138 ${cx + 18},138 ${cx + 13.5},145.5 ${cx},145.5" fill="#b89b6f" />
      <!-- Middle Shaft -->
      <rect x="${cx - 13.5}" y="145.5" width="13.5" height="36" fill="#f1dfc0" />
      <rect x="${cx}" y="145.5" width="13.5" height="36" fill="#e2caa3" />
      <!-- 3rd Balcony with Trapezoid Corbel -->
      <rect x="${cx - 21}" y="181.5" width="21" height="5.5" rx="1.8" fill="#d4b98e" />
      <rect x="${cx}" y="181.5" width="21" height="5.5" rx="1.8" fill="#bfa174" />
      <polygon points="${cx - 21},187 ${cx},187 ${cx},195.5 ${cx - 16},195.5" fill="#cbb085" />
      <polygon points="${cx},187 ${cx + 21},187 ${cx + 16},195.5 ${cx},195.5" fill="#b89b6f" />
      <!-- Lower Main Shaft with Arched Window Resting Cleanly on the Horizon Line (y=195.5..232) -->
      <rect x="${cx - 16}" y="195.5" width="16" height="${sceneKey === "isha" || sceneKey === "asr" ? "36.5" : "72"}" fill="#f1dfc0" />
      <rect x="${cx}" y="195.5" width="16" height="${sceneKey === "isha" || sceneKey === "asr" ? "36.5" : "72"}" fill="#e2caa3" />
      <path d="M${cx - 5.2} ${sceneKey === "isha" || sceneKey === "asr" ? "232" : "222"} V207 A5.2 5.2 0 0 1 ${cx + 5.2} 207 V${sceneKey === "isha" || sceneKey === "asr" ? "232" : "222"} Z" fill="#b49669" />
    </g>
  `;

  return `
    <svg class="s24-sym-nabawi-svg" viewBox="0 0 400 375" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="s24SymSky_${sceneKey}" x1="0" y1="0" x2="0" y2="375" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${c.bgTop}" />
          <stop offset="52%" stop-color="${c.bgMid}" />
          <stop offset="100%" stop-color="${c.bgBottom}" />
        </linearGradient>

        <!-- Realistic Isha Crescent Moon Gradient & Crisp Optical Glow -->
        <linearGradient id="s24RealisticCrescentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="38%" stop-color="#fef9c3" />
          <stop offset="78%" stop-color="#fde047" />
          <stop offset="100%" stop-color="#eab308" />
        </linearGradient>
        <radialGradient id="s24LunarAtmosphericHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef9c3" stop-opacity="0.28" />
          <stop offset="48%" stop-color="#93c5fd" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#93c5fd" stop-opacity="0" />
        </radialGradient>
        <filter id="s24MoonCrispGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.2" flood-color="#fef08a" flood-opacity="0.72" />
        </filter>

        <!-- White Background Mist Effect at Center of Mosque Area Below Moon (Isha & All Scenes) -->
        <radialGradient id="s24IshaMosqueWhiteMist" cx="50%" cy="48%" r="54%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.26" />
          <stop offset="42%" stop-color="#e0f2fe" stop-opacity="0.14" />
          <stop offset="75%" stop-color="#bae6fd" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#0f2744" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="s24IshaMosqueInnerWhite" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
          <stop offset="55%" stop-color="#f0f9ff" stop-opacity="0.09" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="s24CenterWhiteBacklight" cx="50%" cy="50%" r="52%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.58" />
          <stop offset="55%" stop-color="#ffffff" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="s24CenterWhiteSubtle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>

        <!-- Photorealistic Solar Gradients & Soft Atmospheric Filters (Fajr, Duha, Dhuhr, Asr, Maghrib) -->
        <radialGradient id="s24SunBloomWarm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7" />
          <stop offset="38%" stop-color="#fde047" stop-opacity="0.42" />
          <stop offset="72%" stop-color="#f59e0b" stop-opacity="0.14" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="s24DawnHorizonGlow" cx="50%" cy="55%" r="52%">
          <stop offset="0%" stop-color="#fef9c3" stop-opacity="0.75" />
          <stop offset="55%" stop-color="#fde68a" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#fde68a" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="s24DawnRayGrad" x1="0" y1="75" x2="0" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.42" />
          <stop offset="100%" stop-color="#fcd34d" stop-opacity="0.9" />
        </linearGradient>
        <radialGradient id="s24DawnSunOrb" cx="42%" cy="38%" r="62%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="35%" stop-color="#fef08a" />
          <stop offset="78%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#f59e0b" />
        </radialGradient>
        <radialGradient id="s24DuhaSunCore" cx="40%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="42%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#f59e0b" />
        </radialGradient>
        <radialGradient id="s24NoonSunCore" cx="40%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="35%" stop-color="#fef9c3" />
          <stop offset="75%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#d97706" />
        </radialGradient>
        <radialGradient id="s24AsrSunOrb" cx="38%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#fef9c3" />
          <stop offset="45%" stop-color="#fbbf24" />
          <stop offset="82%" stop-color="#f97316" />
          <stop offset="100%" stop-color="#ea580c" />
        </radialGradient>
        <radialGradient id="s24MaghribSunOrb" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#fde047" />
          <stop offset="45%" stop-color="#f97316" />
          <stop offset="85%" stop-color="#ea580c" />
          <stop offset="100%" stop-color="#b91c1c" />
        </radialGradient>
        <radialGradient id="s24TwilightHorizonGlow" cx="50%" cy="50%" r="52%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.62" />
          <stop offset="50%" stop-color="#fb923c" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#ea580c" stop-opacity="0" />
        </radialGradient>
        <filter id="s24SoftSunGlow" x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.2" flood-color="#fbbf24" flood-opacity="0.58" />
        </filter>
        <filter id="s24ArchShadow" x="-12%" y="-10%" width="124%" height="124%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#091526" flood-opacity="0.18" />
        </filter>

        <radialGradient id="s24DomeUnderGlow" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stop-color="#15803d" stop-opacity="0.34" />
          <stop offset="100%" stop-color="#15803d" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="s24FajrMintWash" x1="0" y1="244" x2="0" y2="304" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.45" />
          <stop offset="100%" stop-color="#6ee7b7" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="s24DuhaBeamGrad" x1="200" y1="68" x2="200" y2="228" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.62" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- 1. Full Card Sky Backdrop -->
      <rect width="400" height="375" fill="url(#s24SymSky_${sceneKey})" />

      <!-- 2. Celestial & Architectural Backdrop (Sun / Moon / Jumu'ah Mosque Mihrab / Asr Cloud) -->
      ${c.celestial}

      <!-- 3. Scene Pre-Minaret Horizon or Courtyard Wall Layer -->
      ${c.preMinaretLayer || ""}

      <!-- 4. Twin Symmetrical Masjid an-Nabawi Minarets (Left cx=84, Right cx=316) -->
      ${renderMinaret(84)}
      ${renderMinaret(316)}

      <!-- 5. Iconic Central Masjid an-Nabawi Green Dome (Qubbat al-Khadra — 100% Unobstructed at y=114..229) -->
      <g filter="url(#s24ArchShadow)">
        <!-- Golden Finial Spire (Hilal Rod & Globes) -->
        <path d="M198.2 138 L200 114 L201.8 138 Z" fill="#b48a3e" />
        <ellipse cx="200" cy="132.5" rx="4" ry="1.7" fill="#c6923a" />
        <polygon points="193,139 200,133 207,139" fill="#c6923a" />
        <!-- Pointed Green Dome Left & Right Halves (2-Tone 3D Shading + Subtle Rim Highlight) -->
        <path d="M139 202 C139 166 164 146 200 138 L200 202 Z" fill="#15803d" />
        <path d="M200 138 C236 146 261 166 261 202 L200 202 Z" fill="#116932" />
        <path d="M140 201 C140 166.5 164.5 147 200 139" fill="none" stroke="#4ade80" stroke-width="0.9" stroke-opacity="0.45" />
        <!-- Drum Band & 7 Arched Windows -->
        <rect x="136" y="201" width="128" height="16" rx="2.4" fill="#126e35" />
        <rect x="200" y="201" width="64" height="16" rx="1.5" fill="#0f5c2c" />
        <path d="M145 217 V209.5 A4.4 4.4 0 0 1 153.8 209.5 V217 Z
                 M162 217 V209.5 A4.4 4.4 0 0 1 170.8 209.5 V217 Z
                 M179 217 V209.5 A4.4 4.4 0 0 1 187.8 209.5 V217 Z
                 M195.6 217 V209.5 A4.4 4.4 0 0 1 204.4 209.5 V217 Z
                 M212.2 217 V209.5 A4.4 4.4 0 0 1 221 209.5 V217 Z
                 M229.2 217 V209.5 A4.4 4.4 0 0 1 238 209.5 V217 Z
                 M246.2 217 V209.5 A4.4 4.4 0 0 1 255 209.5 V217 Z" fill="#16803c" opacity="0.88" />
        <!-- Stepped Plinth Base Resting Above the 3 Time Pills (Two-Tone Cream-Sandstone Base on Isha, Deep Green on Asr & Daytime) -->
        ${
          sceneKey === "isha"
            ? `<rect x="129" y="217" width="142" height="6.5" rx="1.5" fill="#0f5c2c" />
               <rect x="124" y="223" width="88" height="9" rx="2" fill="#f1dfc0" />
               <rect x="212" y="223" width="64" height="9" rx="2" fill="#d8bc90" />`
            : `<rect x="129" y="217" width="142" height="8" rx="2" fill="#0f5c2c" />
               <rect x="123" y="224.5" width="154" height="7.5" rx="1.5" fill="#0b4620" />`
        }
      </g>

      <!-- 6. Post-Dome Underglow or Jumu'ah Horizon Stripe -->
      ${c.postDomeLayer || ""}
    </svg>
  `;
}

function getInlineSparklesSvg() {
  return `<svg class="s24-inline-meta-svg" viewBox="0 0 24 24" width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M14 3 L15.8 8.2 L21 10 L15.8 11.8 L14 17 L12.2 11.8 L7 10 L12.2 8.2 Z" fill="#f59e0b" />
    <path d="M6 14 L6.9 16.6 L9.5 17.5 L6.9 18.4 L6 21 L5.1 18.4 L2.5 17.5 L5.1 16.6 Z" fill="#fbbf24" />
    <circle cx="19" cy="18" r="1.3" fill="#f59e0b" />
  </svg>`;
}

function getInlineStopwatchSvg(isDanger = false, sceneKey = "") {
  const isIsha = sceneKey === "isha" && !isDanger;
  const isAsr = sceneKey === "asr" && !isDanger;
  const strokeCol = isDanger ? "#b91c1c" : isIsha ? "#ffffff" : isAsr ? "#0f172a" : "#0f172a";
  const circleFill = isIsha ? "none" : "#f8fafc";
  return `<svg class="s24-inline-meta-svg" viewBox="0 0 24 24" width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="9" y1="2" x2="15" y2="2" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round" />
    <line x1="12" y1="2" x2="12" y2="5" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round" />
    <line x1="18.5" y1="5.5" x2="20" y2="4" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round" />
    <circle cx="12" cy="13.5" r="8" fill="${circleFill}" stroke="${strokeCol}" stroke-width="2" />
    <path d="M12 9.5 V13.5 L14.5 15" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;
}

function renderFiveWaqtStrip(now = new Date()) {
  const gridEl = document.getElementById("five-waqt-grid");
  if (!gridEl) return;
  const sched = computeSeasonalPrayerSchedule(now);
  const nowMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const lang = appState.locale || "bn";
  const middayMeta = resolveMiddayWaqtMeta(now, lang);

  // Sync the Fard Schedule Card Heading ("ফরজ নামাজের সময়সূচী")
  const fardHeadingEl = document.getElementById("fard-schedule-heading");
  if (fardHeadingEl) {
    fardHeadingEl.textContent =
      lang === "ar"
        ? "أوقات الصلوات المفروضة"
        : lang === "en"
        ? "Fard Prayer Schedule"
        : "ফরজ নামাজের সময়সূচী";
  }

  // Authentic 3 Prohibited Salah Windows (Sahih Muslim 831) synchronized with Live Waqt Card:
  const pWindows = sched.prohibitedWindows || {
    sunrise: { start: sched.sunrise, end: sched.sunrise + 15 },
    zawal: { start: sched.zawal, end: sched.dhuhr },
    sunset: { start: sched.sunset - 15, end: sched.sunset }
  };

  // Authentic Waqt Start & End Boundaries for the 5 Fard Prayers:
  const waqts = [
    {
      id: "fajr",
      num: localizeDigits(1, lang),
      name: t("waqt_fajr"),
      icon: "🌅",
      start: sched.fajr,
      end: pWindows.sunrise.start,
      displayEnd: (pWindows.sunrise.start - 1 + 1440) % 1440,
      phase: "tahajjud_fajr"
    },
    {
      id: "dhuhr",
      num: localizeDigits(2, lang),
      name: middayMeta.pillName,
      icon: middayMeta.pillIcon,
      start: sched.dhuhr,
      end: sched.asr,
      displayEnd: (sched.asr - 1 + 1440) % 1440,
      phase: "dhuhr_asr"
    },
    {
      id: "asr",
      num: localizeDigits(3, lang),
      name: t("waqt_asr"),
      icon: "🌤️",
      start: sched.asr,
      end: pWindows.sunset.start,
      displayEnd: (pWindows.sunset.start - 1 + 1440) % 1440,
      phase: "dhuhr_asr"
    },
    {
      id: "maghrib",
      num: localizeDigits(4, lang),
      name: t("waqt_maghrib"),
      icon: "🌇",
      start: sched.maghrib,
      end: sched.isha,
      displayEnd: (sched.isha - 1 + 1440) % 1440,
      phase: "maghrib_isha"
    },
    {
      id: "isha",
      num: localizeDigits(5, lang),
      name: t("waqt_isha"),
      icon: "🌙",
      start: sched.isha,
      end: sched.fajr + 1440,
      displayEnd: (sched.fajr - 1 + 1440) % 1440,
      phase: "maghrib_isha"
    }
  ];

  // ==========================================================================
  // MASJID AN-NABAWI ONGOING WAQT DASHBOARD CARD (UNOBSTRUCTED DOME & 3 TIME PILLS)
  // - No Tahajjud sub-card inside ongoing prayers
  // - No Rak'ah summary line at the bottom of ongoing prayers
  // - All 3 time-based rows sit cleanly below the Green Dome & Twin Minarets
  // ==========================================================================
  const boxEl = document.getElementById("live-waqt-countdown-box");
  if (boxEl) {
    let activeWaqtTitle = "";
    let activeSubLabel = "";
    let winStart = 0;
    let winEnd = 0;
    let currentPos = nowMins;
    let isProhibitedNow = false;
    let exactEndDisplay = false;
    let primeLabelText =
      lang === "bn"
        ? "উত্তম সময় (আউয়াল ওয়াক্ত):"
        : lang === "ar"
        ? "الوقت المختار (أول الوقت):"
        : "Prime Window (Awwal Waqt):";
    let primeValueHtml = "";

    const startLbl = lang === "bn" ? "শুরু (START)" : lang === "ar" ? "بداية الوقت" : "STARTS AT";
    const endLbl = lang === "bn" ? "শেষ (END)" : lang === "ar" ? "نهاية الوقت" : "ENDS AT";

    if (nowMins >= sched.fajr && nowMins < pWindows.sunrise.start) {
      // 1. Fajr Fard Waqt
      activeWaqtTitle = lang === "bn" ? "ফজর" : lang === "ar" ? "الفجر" : "Fajr";
      activeSubLabel =
        lang === "bn"
          ? "সূর্যোদয়ের পূর্ব পর্যন্ত"
          : lang === "ar"
          ? "إلى قبيل الشروق"
          : "Until before Sunrise";
      winStart = sched.fajr;
      winEnd = pWindows.sunrise.start;

      const fajrStartClock = formatShortWaqtClock(sched.fajr, lang);
      const fajrPrimeEnd = Math.min(pWindows.sunrise.start - 5, sched.fajr + 38);
      const fajrPrimeClock = formatShortWaqtClock(fajrPrimeEnd, lang);

      primeValueHtml = `${fajrStartClock} – ${fajrPrimeClock}`;
    } else if (nowMins >= pWindows.sunrise.start && nowMins < pWindows.sunrise.end) {
      // 2. Prohibited Window 1: Sunrise (15 mins)
      activeWaqtTitle =
        lang === "bn"
          ? "নিষিদ্ধ সময় (সূর্যোদয়)"
          : lang === "ar"
          ? "وقت نهي (الشروق)"
          : "Forbidden (Sunrise)";
      activeSubLabel =
        lang === "bn"
          ? "সূর্যোদয়ের ১৫ মিনিট সালাত নিষিদ্ধ"
          : lang === "ar"
          ? "تحرم الصلاة أثناء الشروق"
          : "Salah forbidden during Sunrise";
      winStart = pWindows.sunrise.start;
      winEnd = pWindows.sunrise.end;
      isProhibitedNow = true;
      exactEndDisplay = true;

      const ishraqStartClock = formatShortWaqtClock(pWindows.sunrise.end, lang);
      primeLabelText =
        lang === "bn"
          ? "পরবর্তী ওয়াক্ত:"
          : lang === "ar"
          ? "الوقت القادم:"
          : "Next Waqt:";
      primeValueHtml =
        lang === "bn"
          ? `ইশরাক (${ishraqStartClock})`
          : lang === "ar"
          ? `الإشراق (${ishraqStartClock})`
          : `Ishraq (${ishraqStartClock})`;
    } else if (nowMins >= pWindows.sunrise.end && nowMins < pWindows.zawal.start) {
      // 3. Ishraq & Duha Forenoon Window
      activeWaqtTitle =
        lang === "bn"
          ? "চাশত / ইশরাক"
          : lang === "ar"
          ? "الإشراق والضحى"
          : "Ishraq / Duha";
      activeSubLabel =
        lang === "bn"
          ? "দ্বিপ্রহরের পূর্ব পর্যন্ত"
          : lang === "ar"
          ? "إلى قبيل الزوال"
          : "Until before Midday";
      winStart = pWindows.sunrise.end;
      winEnd = pWindows.zawal.start;

      const ishraqStartClock = formatShortWaqtClock(pWindows.sunrise.end, lang);
      const ishraqPrimeEnd = Math.min(pWindows.zawal.start - 15, pWindows.sunrise.end + 45);
      const ishraqPrimeClock = formatShortWaqtClock(ishraqPrimeEnd, lang);

      primeValueHtml = `${ishraqStartClock} – ${ishraqPrimeClock}`;
    } else if (nowMins >= pWindows.zawal.start && nowMins < pWindows.zawal.end) {
      // 4. Prohibited Window 2: Zawal / Solar Zenith
      activeWaqtTitle =
        lang === "bn"
          ? "নিষিদ্ধ সময় (দ্বিপ্রহর)"
          : lang === "ar"
          ? "وقت نهي (الزوال)"
          : "Forbidden (Zawal)";
      activeSubLabel =
        lang === "bn"
          ? "ঠিক দ্বিপ্রহরে সালাত নিষিদ্ধ"
          : lang === "ar"
          ? "تحرم الصلاة عند الاستواء"
          : "Salah forbidden at zenith";
      winStart = pWindows.zawal.start;
      winEnd = pWindows.zawal.end;
      isProhibitedNow = true;
      exactEndDisplay = true;

      const dhuhrStartClock = formatShortWaqtClock(pWindows.zawal.end, lang);
      primeLabelText =
        lang === "bn"
          ? "পরবর্তী ওয়াক্ত:"
          : lang === "ar"
          ? "الصلاة القادمة:"
          : "Next Waqt:";
      primeValueHtml = middayMeta.zawalNextWaqtLabel(dhuhrStartClock);
    } else if (nowMins >= pWindows.zawal.end && nowMins < sched.asr) {
      // 5. Midday Fard Waqt — "যোহর" (or "জুমু'আ" on Friday)
      activeWaqtTitle = middayMeta.isJumuah
        ? lang === "bn"
          ? "জুমু'আ"
          : lang === "ar"
          ? "الجمعة"
          : "Jumu'ah"
        : lang === "bn"
        ? "যোহর"
        : lang === "ar"
        ? "الظهر"
        : "Dhuhr";
      activeSubLabel =
        lang === "bn"
          ? "আসরের পূর্ব পর্যন্ত"
          : lang === "ar"
          ? "إلى قبيل العصر"
          : "Until before Asr";
      winStart = pWindows.zawal.end;
      winEnd = sched.asr;

      const dhuhrStartClock = formatShortWaqtClock(pWindows.zawal.end, lang);
      const dhuhrPrimeEnd = Math.min(sched.asr - 15, pWindows.zawal.end + 50);
      const dhuhrPrimeClock = formatShortWaqtClock(dhuhrPrimeEnd, lang);

      primeValueHtml = `${dhuhrStartClock} – ${dhuhrPrimeClock}`;
    } else if (nowMins >= sched.asr && nowMins < pWindows.sunset.start) {
      // 6. Asr Fard Waqt
      activeWaqtTitle = lang === "bn" ? "আসর" : lang === "ar" ? "العصر" : "Asr";
      activeSubLabel =
        lang === "bn"
          ? "সূর্যাস্তের পূর্ব পর্যন্ত"
          : lang === "ar"
          ? "إلى قبيل الغروب"
          : "Until before Sunset";
      winStart = sched.asr;
      winEnd = pWindows.sunset.start;

      const asrStartClock = formatShortWaqtClock(sched.asr, lang);
      const asrPrimeEnd = Math.max(sched.asr + 30, pWindows.sunset.start - 25);
      const asrPrimeClock = formatShortWaqtClock(asrPrimeEnd, lang);

      primeValueHtml = `${asrStartClock} – ${asrPrimeClock}`;
    } else if (nowMins >= pWindows.sunset.start && nowMins < sched.maghrib) {
      // 7. Prohibited Window 3: Sunset / Ghurub
      activeWaqtTitle =
        lang === "bn"
          ? "নিষিদ্ধ সময় (সূর্যাস্ত)"
          : lang === "ar"
          ? "وقت نهي (الغروب)"
          : "Forbidden (Sunset)";
      activeSubLabel =
        lang === "bn"
          ? "সূর্যাস্তে মাগরিব পর্যন্ত সালাত নিষিদ্ধ"
          : lang === "ar"
          ? "تحرم الصلاة عند الغروب"
          : "Salah forbidden during Sunset";
      winStart = pWindows.sunset.start;
      winEnd = sched.maghrib;
      isProhibitedNow = true;
      exactEndDisplay = true;

      const maghribStartClock = formatShortWaqtClock(sched.maghrib, lang);
      primeLabelText =
        lang === "bn"
          ? "পরবর্তী ওয়াক্ত:"
          : lang === "ar"
          ? "الصلاة القادمة:"
          : "Next Waqt:";
      primeValueHtml =
        lang === "bn"
          ? `মাগরিব (${maghribStartClock})`
          : lang === "ar"
          ? `المغرب (${maghribStartClock})`
          : `Maghrib (${maghribStartClock})`;
    } else if (nowMins >= sched.maghrib && nowMins < sched.isha) {
      // 8. Maghrib Fard Waqt
      activeWaqtTitle = lang === "bn" ? "মাগরিব" : lang === "ar" ? "المغرب" : "Maghrib";
      activeSubLabel =
        lang === "bn"
          ? "ইশার পূর্ব পর্যন্ত"
          : lang === "ar"
          ? "إلى قبيل العشاء"
          : "Until before Isha";
      winStart = sched.maghrib;
      winEnd = sched.isha;

      const maghribStartClock = formatShortWaqtClock(sched.maghrib, lang);
      const maghribPrimeEnd = Math.min(sched.isha - 5, sched.maghrib + 25);
      const maghribPrimeClock = formatShortWaqtClock(maghribPrimeEnd, lang);

      primeValueHtml = `${maghribStartClock} – ${maghribPrimeClock}`;
    } else {
      // 9. Night Isha
      winStart = sched.isha;
      winEnd = sched.fajr + 1440;
      currentPos = nowMins < sched.fajr ? nowMins + 1440 : nowMins;

      const firstThirdEndMinusOne = (sched.firstThirdEnd - 1 + 1440) % 1440;
      const ishaStartClock = formatShortWaqtClock(sched.isha, lang);
      const firstThirdClock = formatShortWaqtClock(firstThirdEndMinusOne, lang);

      activeWaqtTitle = lang === "bn" ? "ইশা" : lang === "ar" ? "العشاء" : "Isha";
      activeSubLabel =
        lang === "bn"
          ? "সুবহে সাদিকের পূর্ব পর্যন্ত"
          : lang === "ar"
          ? "يمتد إلى قبيل الفجر"
          : "Valid until before Fajr";

      primeValueHtml = `${ishaStartClock} – ${firstThirdClock}`;
    }

    const totalDuration = Math.max(1, winEnd - winStart);
    const elapsed = Math.max(0, Math.min(totalDuration, currentPos - winStart));
    const remaining = Math.max(0, winEnd - currentPos);
    const pct = Math.max(4, Math.min(100, Math.round((elapsed / totalDuration) * 100)));

    const displayEndMins = exactEndDisplay
      ? winEnd % 1440
      : (winEnd - 1 + 1440) % 1440;

    const startShortStr = formatShortWaqtClock(winStart, lang);
    const endShortStr = formatShortWaqtClock(displayEndMins, lang);
    let startFullStr = formatMinutesToLocalizedTime(winStart, lang);
    let endFullStr = formatMinutesToLocalizedTime(displayEndMins, lang);
    if (lang === "bn") {
      startFullStr = startFullStr.replace("বিকেল", "বিকাল");
      endFullStr = endFullStr.replace("বিকেল", "বিকাল");
    }
    const remainingTextStr = formatRemainingDurationText(remaining, lang);

    const statusBadgePlain = isProhibitedNow
      ? lang === "ar"
        ? "صلاة ممنوعة"
        : lang === "en"
        ? "Prohibited"
        : "সালাত নিষিদ্ধ"
      : lang === "ar"
      ? "الوقت جارٍ"
      : lang === "en"
      ? "Active Waqt"
      : "চলমান ওয়াক্ত";

    const countdownRowLabelText = isProhibitedNow
      ? lang === "bn"
        ? "নিষিদ্ধ সময় বাকি:"
        : lang === "ar"
        ? "انتهاء النهي بعد:"
        : "Forbidden Ends In:"
      : lang === "bn"
      ? "ওয়াক্ত শেষ হতে বাকি:"
      : lang === "ar"
      ? "المتبقي لانتهاء الوقت:"
      : "Waqt Ends In:";

    boxEl.classList.toggle("waqt-prohibited-active", isProhibitedNow);

    let waqtSceneKey = "isha";
    if (nowMins >= sched.fajr && nowMins < pWindows.sunrise.start) {
      waqtSceneKey = "fajr";
    } else if (nowMins >= pWindows.sunrise.start && nowMins < pWindows.sunrise.end) {
      waqtSceneKey = "prohibited_sunrise";
    } else if (nowMins >= pWindows.sunrise.end && nowMins < pWindows.zawal.start) {
      waqtSceneKey = "ishraq_duha";
    } else if (nowMins >= pWindows.zawal.start && nowMins < pWindows.zawal.end) {
      waqtSceneKey = "prohibited_zawal";
    } else if (nowMins >= pWindows.zawal.end && nowMins < sched.asr) {
      waqtSceneKey = middayMeta.isJumuah ? "jumuah" : "dhuhr";
    } else if (nowMins >= sched.asr && nowMins < pWindows.sunset.start) {
      waqtSceneKey = "asr";
    } else if (nowMins >= pWindows.sunset.start && nowMins < sched.maghrib) {
      waqtSceneKey = "prohibited_sunset";
    } else if (nowMins >= sched.maghrib && nowMins < sched.isha) {
      waqtSceneKey = "maghrib";
    }

    activeOngoingWaqtState = {
      sceneKey: waqtSceneKey,
      winStartMins: winStart,
      winEndMins: winEnd,
      isCrossMidnight: winEnd > 1440,
      isProhibited: isProhibitedNow
    };
    const fardNumMap = { fajr: 1, dhuhr: 2, asr: 3, maghrib: 4, isha: 5 };
    const numPrefix = fardNumMap[waqtSceneKey]
      ? `${localizeDigits(fardNumMap[waqtSceneKey], lang)}. `
      : "";

    boxEl.innerHTML = `
      <div class="s24-nabawi-scenic-card scene-${waqtSceneKey}">
        <!-- Full-Bleed Symmetrical Masjid an-Nabawi SVG Background -->
        <div class="s24-nabawi-scenic-bg" aria-hidden="true">
          ${getSymmetricNabawiCardSvg(waqtSceneKey)}
        </div>

        <!-- Foreground UI Layers Inside the SVG Scene -->
        <div class="s24-nabawi-scenic-content">
          <!-- Top Row: Title in Top-Left & Status Pill in Top-Right -->
          <div class="s24-nabawi-top-row">
            <div class="s24-nabawi-title-block">
              <h4 id="live-waqt-title">${numPrefix}${activeWaqtTitle}</h4>
              <small>${activeSubLabel}</small>
            </div>

            <div class="s24-nabawi-status-block">
              <span id="live-waqt-range" style="display:none;">${startShortStr} - ${endShortStr}</span>
              <div id="live-waqt-fill" style="display:none;width:${pct}%;"></div>
              <span id="live-waqt-status-label" style="display:none;">${statusBadgePlain}</span>
              <span class="waqt-popup-status-pill s24-nabawi-live-pill ${isProhibitedNow ? "status-prohibited" : "status-active"}">
                <span class="s24-status-dot ${isProhibitedNow ? "dot-danger" : "dot-active"}" aria-hidden="true"></span>
                <span>${statusBadgePlain}</span>
              </span>
            </div>
          </div>

          <!-- Dedicated Unobstructed Architectural Stage for Sun/Moon, Twin Minarets & Full Green Dome -->
          <div class="s24-nabawi-dome-clearance"></div>

          <!-- 3 Time-Based Pills Positioned Below the Green Dome & Minaret Windows -->
          <div class="s24-nabawi-bottom-stack">
            <div class="waqt-popup-time-grid ongoing-static-time-grid s24-nabawi-glass-time">
              <div class="waqt-popup-time-box start-box">
                <span class="waqt-popup-time-lbl">${startLbl}</span>
                <strong class="waqt-popup-time-val">${startFullStr}</strong>
              </div>
              <div class="waqt-popup-time-divider" aria-hidden="true">➔</div>
              <div class="waqt-popup-time-box end-box">
                <span class="waqt-popup-time-lbl">${endLbl}</span>
                <strong class="waqt-popup-time-val">${endFullStr}</strong>
              </div>
            </div>

            <div class="waqt-popup-meta-rows ongoing-static-meta-rows s24-nabawi-glass-rows">
              <div class="waqt-popup-meta-item single-line-meta-row s24-prime-inline-row">
                <span class="meta-row-label">
                  <span class="meta-row-label-text">${primeLabelText}</span>
                </span>
                <strong class="meta-row-value">${primeValueHtml}</strong>
              </div>
              <div class="waqt-popup-meta-item single-line-meta-row countdown-single-line-row s24-countdown-split-row">
                <span class="meta-row-label">
                  <span class="meta-row-label-text">${countdownRowLabelText}</span>
                </span>
                <strong id="live-waqt-remaining" class="meta-row-value s24-live-countdown-ticker">${remainingTextStr}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 5 ফরজ নামাজের সময়সূচী — VERTICAL LIST UI
  // ==========================================================================
  gridEl.innerHTML = waqts
    .map((w) => {
      const effectiveEnd = w.id === "asr" ? pWindows.sunset.start : w.end;
      const isActive =
        w.id === "isha"
          ? nowMins >= w.start || nowMins < sched.fajr
          : nowMins >= w.start && nowMins < effectiveEnd;
      const isPassed = w.id !== "isha" && nowMins >= effectiveEnd && nowMins >= sched.fajr;
      const isPopupSelected =
        typeof activeSelectedWaqtPopupId === "string" && activeSelectedWaqtPopupId === w.id;
      const startTimeStr = formatShortWaqtClock(w.start, lang);
      const endTimeStr = formatShortWaqtClock(w.displayEnd, lang);

      return `
        <div class="waqt-pill-card fard-waqt-row-item fard-waqt-vertical-card m3-interactive-waqt-pill ${isActive ? "waqt-active" : ""} ${isPassed ? "waqt-passed" : ""} ${isPopupSelected ? "waqt-popup-selected" : ""}" data-waqt-id="${w.id}" data-waqt-phase="${w.phase}" aria-expanded="${isPopupSelected ? "true" : "false"}" title="${w.name}">
          <span class="fard-status-dot ${isActive ? "active" : ""}" aria-hidden="true"></span>
          <div class="waqt-circle-logo fard-squircle-icon fard-medium-svg-wrap" aria-hidden="true">
            ${getFardWaqtSvgIcon(w.id)}
          </div>
          <div class="fard-below-svg-info">
            <span class="waqt-name fard-prayer-title">${w.name}</span>
            <strong class="waqt-time fard-time-range-pill">${startTimeStr} - ${endTimeStr}</strong>
          </div>
        </div>
      `;
    })
    .join("");

  if (typeof syncOpenWaqtPopupIfVisible === "function") {
    syncOpenWaqtPopupIfVisible(now);
  }
}

function renderDuas() {
  const container = document.getElementById("duas-list-container");
  if (!container) return;
  container.innerHTML = "";

  const lang = appState.locale || "bn";
  const todayKey = getTodayKey();
  const completedDuas = (appState.duaCompletionsByDate && appState.duaCompletionsByDate[todayKey]) || [];
  const now = new Date();

  SUNNAH_24_DUAS.forEach((dua) => {
    const title = lang === "bn" ? dua.title_bn : lang === "ar" ? dua.title_ar : dua.title_en;
    const badge = lang === "bn" ? dua.badge_bn : lang === "ar" ? dua.badge_ar : dua.badge_en;
    const translit = lang === "bn" ? dua.translit_bn : lang === "en" ? dua.translit_en : "";
    const meaning = lang === "bn" ? dua.meaning_bn : lang === "ar" ? dua.meaning_ar : dua.meaning_en;
    const virtue = lang === "bn" ? dua.virtue_bn : lang === "ar" ? dua.virtue_ar : dua.virtue_en;

    const isDone = completedDuas.includes(dua.id);
    const winState = evaluateDuaTimeWindow(dua, now);
    const isLocked = !winState.canTick && !isDone;

    let btnLabel = "";
    if (isDone) {
      btnLabel = lang === "ar" ? "✓ تم الذكر اليوم" : lang === "en" ? "✓ Recited Today" : "✓ আজ পাঠ সম্পন্ন";
    } else if (winState.status === "expired") {
      btnLabel = lang === "ar" ? "🔒 انتهى الوقت" : lang === "en" ? "🔒 Window Expired" : "🔒 সময় সমাপ্ত";
    } else if (winState.status === "upcoming") {
      btnLabel = lang === "ar" ? "⏳ لم يحن الوقت" : lang === "en" ? "⏳ Window Upcoming" : "⏳ সময় শুরু হয়নি";
    } else {
      btnLabel = lang === "ar" ? "📿 تحديد كمقروء" : lang === "en" ? "📿 Mark Recited" : "📿 পাঠ সম্পন্ন করুন";
    }

    const card = document.createElement("div");
    card.className = `dua-card ${isDone ? "completed" : ""} ${isLocked ? "time-locked" : ""}`;
    const duaMeta = getDuaIconMeta(dua);
    card.innerHTML = `
      <div class="dua-header">
        <div class="dua-title-with-avatar">
          <div class="item-circle-avatar theme-${duaMeta.theme}">
            <span>${duaMeta.icon}</span>
          </div>
          <h4>${title}</h4>
        </div>
        <span class="dua-badge">${badge}</span>
      </div>
      <p class="dua-arabic">${dua.arabic}</p>
      ${translit ? `<p class="translit">${translit}</p>` : ""}
      <p class="muted-small">${meaning}</p>
      <p class="dua-virtue">${virtue}</p>
      <div class="dua-action-footer">
        <span class="time-status-badge status-${isDone ? "done" : winState.status}">${winState.windowLabel}</span>
        <button type="button" class="dua-check-btn ${isDone ? "done" : ""} ${!winState.canTick ? "locked" : ""}" data-dua-toggle="${dua.id}">
          ${btnLabel}
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  const totalDuas = SUNNAH_24_DUAS.length;
  const doneDuasCount = completedDuas.length;
  const duaPct = totalDuas > 0 ? Math.round((doneDuasCount / totalDuas) * 100) : 0;
  updateSvgCircleProgress("dua-progress-ring-circle", duaPct, DUA_RING_CIRCUMFERENCE);
  const duaLabelEl = document.getElementById("dua-progress-text");
  if (duaLabelEl) {
    duaLabelEl.textContent = `${localizeDigits(doneDuasCount, lang)}/${localizeDigits(totalDuas, lang)}`;
  }
  if (typeof syncMasterSectionsLiveProgress === 'function') syncMasterSectionsLiveProgress();
}

function applyLanguageToDOM() {
  const langConfig = I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn;
  document.documentElement.lang = appState.locale;
  document.documentElement.dir = langConfig.dir;

  const switcher = document.getElementById("lang-switcher");
  if (switcher) switcher.value = appState.locale;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", t(key));
  });

  renderTasbihOptions();
  renderDuas();
  renderHeaderDatesAndPhase();
  renderHabits();
  if (typeof renderCustomHabitsManageList === "function") renderCustomHabitsManageList();
  if (typeof syncMasterSectionsLiveProgress === "function") syncMasterSectionsLiveProgress();
  if (typeof syncTwoBlessingsCardLocale === "function") syncTwoBlessingsCardLocale();
  if (typeof syncFourQualitiesCardLocale === "function") syncFourQualitiesCardLocale();
  updateIntegrityUI(true);
}

function renderHeaderDatesAndPhase() {
  const now = new Date();
  const localeTag = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).localeTag;

  const gregFull = now.toLocaleDateString(localeTag, {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).replace(/\s+/g, "\u00A0");

  const hijriDetails = getMoonBasedHijriDetails(now, appState.locale);
  const banglaDetails = getBanglaPonjikaDetails(now, appState.locale);
  const sched = computeSeasonalPrayerSchedule(now);

  // If legacy #current-date-display exists, keep it empty/hidden since date is now in the 2nd-top Date Card
  const headerDateEl = document.getElementById("current-date-display");
  if (headerDateEl) {
    headerDateEl.textContent = "";
  }

  // Unified 2nd-Top Date Card: Line 1 = Moon-Sighting Hijri + Yawm + Crescent; Line 2 = Weekday, Bangla Date + Season • Gregorian Date
  const lunarHeadlineEl = document.getElementById("lunar-hijri-headline");
  const banglaSublineEl = document.getElementById("bangla-ponjika-subline");
  if (lunarHeadlineEl) {
    lunarHeadlineEl.innerHTML = hijriDetails.cardHeadlineHtml;
  }
    if (banglaSublineEl) {
    banglaSublineEl.innerHTML = `${banglaDetails.fullSubline} • <span style="white-space: nowrap;">${gregFull}</span>`;
  }

  const nowMins = now.getHours() * 60 + now.getMinutes();
  let phaseLabel = t("phase_banner_night");
  let activeWaqtWindow = "";

  if (nowMins >= sched.lastThirdStart && nowMins < sched.sunrise + 20) {
    phaseLabel = t("phase_banner_fajr");
    activeWaqtWindow = `${formatMinutesToLocalizedTime(sched.fajr)} – ${formatMinutesToLocalizedTime(sched.sunrise)}`;
  } else if (nowMins >= sched.sunrise + 20 && nowMins < sched.dhuhr) {
    phaseLabel = t("phase_banner_duha");
    activeWaqtWindow = `${formatMinutesToLocalizedTime(sched.duhaStart)} – ${formatMinutesToLocalizedTime(sched.zawal)}`;
  } else if (nowMins >= sched.dhuhr && nowMins < sched.maghrib) {
    phaseLabel = t("phase_banner_dhuhr");
    activeWaqtWindow = `${formatMinutesToLocalizedTime(sched.dhuhr)} – ${formatMinutesToLocalizedTime(sched.sunset)}`;
  } else if (nowMins >= sched.maghrib && nowMins < sched.isha + 90) {
    phaseLabel = t("phase_banner_maghrib");
    activeWaqtWindow = `${formatMinutesToLocalizedTime(sched.maghrib)} – ${formatMinutesToLocalizedTime(sched.isha)}`;
  } else {
    phaseLabel = t("phase_banner_sleep");
    activeWaqtWindow = `${formatMinutesToLocalizedTime(sched.isha)} – ${formatMinutesToLocalizedTime(sched.fajr)}`;
  }

  // Null-safe update in case #next-phase-banner is replaced by the Live Waqt Countdown Bar
  const nextPhaseBannerEl = document.getElementById("next-phase-banner");
  if (nextPhaseBannerEl) {
    nextPhaseBannerEl.textContent = `${phaseLabel} (${activeWaqtWindow})`;
  }

  const dayOfWeek = now.getDay();
  const fastBanner = document.getElementById("fasting-banner");
  if (fastBanner) {
    const fastStatus = evaluateSunnahFastingDayStatus(now);
    if (fastStatus.isFastingDay) {
      const fastReasonLabel = fastStatus.isMonOrThu
        ? t("fast_mon_thu")
        : appState.locale === "ar"
        ? "🌙 اليوم: صيام الأيام البيض (١٣-١٥)"
        : appState.locale === "en"
        ? "🌙 Today: Sunnah Fast (13th–15th White Days)"
        : "🌙 আজ: আইয়ামে বীজের সুন্নাহ রোজা (১৩-১৫ তারিখ)";
      fastBanner.textContent = `${fastReasonLabel} • ইফতার/Maghrib: ${formatMinutesToLocalizedTime(sched.maghrib)}`;
    } else if (dayOfWeek === 5) {
      fastBanner.textContent = t("fast_jumuah");
    } else {
      fastBanner.textContent = t("fast_default");
    }
  }

  if (typeof renderFiveWaqtStrip === "function") {
    renderFiveWaqtStrip(now);
  }
  if (typeof renderProhibitedSalahTimes === "function") {
    renderProhibitedSalahTimes();
  }
  if (typeof renderNaflPrayerTimes === "function") {
    renderNaflPrayerTimes(now);
  }
}

function getAllHabits() {
  return [...SUNNAH_24_HABITS, ...(appState.customHabits || [])];
}

// Resilient Streak Calculation Using Local Timezone Keys
// (If today is 0% because the day just started, streak continues from yesterday!)
function calculateStreak() {
  let streak = 0;
  const cursor = new Date();
  const todayKey = getLocalDateKey(cursor);
  const doneToday = (appState.completionsByDate[todayKey] || []).length;

  if (doneToday === 0) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = getLocalDateKey(cursor);
    const done = appState.completionsByDate[key] || [];
    if (done.length > 0) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function renderHabits() {
  const container = document.getElementById("habit-list-container");
  if (!container) return;
  const allHabits = getAllHabits();
  const now = new Date();

  let openCount = 0;
  let expiredMissedCount = 0;
  let activeCycleDoneCount = 0;

  allHabits.forEach((h) => {
    const isDone = isHabitCompletedInActiveCycle(h, now);
    if (isDone) activeCycleDoneCount++;
    const win = evaluateHabitTimeWindow(h, now);
    if (win.status === "open") openCount++;
    if (win.status === "expired" && !isDone) expiredMissedCount++;
  });

  const lockSummaryEl = document.getElementById("time-lock-summary");
  if (lockSummaryEl) {
    const openStr = localizeDigits(openCount, appState.locale);
    const expStr = localizeDigits(expiredMissedCount, appState.locale);
    const sched = computeSeasonalPrayerSchedule(now);
    const seasonBadge =
      sched.seasonType === "winter"
        ? appState.locale === "ar"
          ? "❄️ الشتاء"
          : appState.locale === "en"
          ? "❄️ Winter Waqt"
          : "❄️ শীতকালীন ওয়াক্ত"
        : sched.seasonType === "summer"
        ? appState.locale === "ar"
          ? "☀️ الصيف"
          : appState.locale === "en"
          ? "☀️ Summer Waqt"
          : "☀️ গ্রীষ্মকালীন ওয়াক্ত"
        : appState.locale === "ar"
        ? "🌿 معتدل"
        : appState.locale === "en"
        ? "🌿 Seasonal Waqt"
        : "🌿 ঋতুভিত্তিক ওয়াক্ত";

    lockSummaryEl.textContent =
      appState.locale === "ar"
        ? `${seasonBadge} • متاح: ${openStr} | انتهى: ${expStr}`
        : appState.locale === "en"
        ? `${seasonBadge} • Open: ${openStr} | Expired: ${expStr}`
        : `${seasonBadge} • চলমান: ${openStr}টি | সমাপ্ত: ${expStr}টি`;
  }

  const filtered = allHabits.filter((h) => {
    return activePhase === "all" || h.phase === activePhase;
  });

  const filterCountEl = document.getElementById("filter-count-label");
  if (filterCountEl) {
    filterCountEl.textContent = t("showing_habits", {
      shown: localizeDigits(filtered.length, appState.locale),
      total: localizeDigits(allHabits.length, appState.locale)
    });
  }

  container.innerHTML = "";

  filtered.forEach((habit) => {
    const isDone = isHabitCompletedInActiveCycle(habit, now);
    const winState = evaluateHabitTimeWindow(habit, now);

    let itemStateClass = "";
    let checkStateClass = "";
    let checkSymbol = "";
    let statusBadgeHtml = "";

    if (isDone) {
      itemStateClass = "completed";
      checkSymbol = "✓";
      const doneBadgeTxt =
        appState.locale === "ar"
          ? "✓ تم في وقته"
          : appState.locale === "en"
          ? "✓ Completed on Time"
          : "✓ যথাসময়ে সম্পন্ন";
      statusBadgeHtml = `<span class="time-status-badge status-done">${doneBadgeTxt}</span>`;
    } else if (winState.status === "expired") {
      itemStateClass = "time-expired";
      checkStateClass = "locked-expired";
      checkSymbol = "🔒";
      statusBadgeHtml = `<span class="time-status-badge status-expired">${winState.badgeText}</span>`;
    } else if (winState.status === "upcoming") {
      itemStateClass = "time-upcoming";
      checkStateClass = "locked-upcoming";
      checkSymbol = "⏳";
      statusBadgeHtml = `<span class="time-status-badge status-upcoming">${winState.badgeText}</span>`;
    } else {
      statusBadgeHtml = `<span class="time-status-badge status-open">${winState.badgeText}</span>`;
    }

    const card = document.createElement("div");
    card.className = `habit-item ${itemStateClass}`;

    const iconMeta = getHabitIconMeta(habit);
    card.innerHTML = `
      <div class="habit-left">
        <div class="item-circle-avatar theme-${iconMeta.theme}" data-info="${habit.id}" title="${t("proof_btn")}">
          <span>${iconMeta.icon}</span>
          ${isDone ? '<span class="avatar-done-dot">✓</span>' : ""}
        </div>
        <div class="habit-info">
          <div class="habit-time-row">
            <span class="habit-time">${escapeHtml(getHabitTime(habit))}</span>
            ${statusBadgeHtml}
          </div>
          <h4>${escapeHtml(getHabitTitle(habit))}</h4>
          <p class="habit-snippet">${escapeHtml(getHabitWisdom(habit))}</p>
        </div>
      </div>
      <div class="habit-right-actions">
        <div class="habit-check ${checkStateClass}" data-toggle="${habit.id}" role="button" aria-label="Toggle Habit">
          ${checkSymbol || "○"}
        </div>
        <button class="info-btn" data-info="${habit.id}">${t("proof_btn")}</button>
      </div>
    `;

    container.appendChild(card);
  });

  const total = allHabits.length;
  const doneCount = activeCycleDoneCount;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const dailyScoreEl = document.getElementById("daily-score-text");
  if (dailyScoreEl) dailyScoreEl.textContent = `${localizeDigits(pct, appState.locale)}%`;
  const completedCountEl = document.getElementById("completed-count-text");
  if (completedCountEl) {
    completedCountEl.textContent = t("completed_habits", {
      done: localizeDigits(doneCount, appState.locale),
      total: localizeDigits(total, appState.locale)
    });
  }
  const dailyProgBarEl = document.getElementById("daily-progress-bar");
  if (dailyProgBarEl) dailyProgBarEl.style.width = `${pct}%`;
  updateSvgCircleProgress("hero-progress-ring-circle", pct, HERO_RING_CIRCUMFERENCE);
  const streakCountEl = document.getElementById("streak-count");
  if (streakCountEl) {
    streakCountEl.textContent = localizeDigits(
      calculateStreak(),
      appState.locale
    );
  }

  renderWeeklyChart();
  renderLongTermArchive();
}

// Renders the 7 Native Phase Horizontal Progress Bar Graph + Lowest Phase Improvement Recommendation
function renderCategoryBreakdownGraph(dateKeysArray, barsContainerId, adviceContainerId) {
  const barsContainer = document.getElementById(barsContainerId);
  const adviceContainer = document.getElementById(adviceContainerId);
  if (!barsContainer) return;

  const lang = appState.locale || "bn";
  const allHabits = getAllHabits();

  // Filter dateKeysArray to active days that actually have at least 1 completion in this specific period
  const activeDateKeys = (dateKeysArray || []).filter((k) => {
    const hDone = (appState.completionsByDate[k] || []).length;
    const dDone = ((appState.duaCompletionsByDate && appState.duaCompletionsByDate[k]) || []).length;
    return hDone > 0 || dDone > 0;
  });

  // Never fallback to [getTodayKey()] when an unused month/range has 0 active days
  const hasActiveData = activeDateKeys.length > 0;
  const numDays = hasActiveData ? activeDateKeys.length : 1;

  const categoryResults = CATEGORY_GRAPH_DEFINITIONS.map((cat) => {
    if (!hasActiveData) {
      return {
        ...cat,
        label: t(cat.titleKey),
        pct: 0
      };
    }

    const phaseHabitIds = allHabits
      .filter((h) => h.phase === cat.phaseKey)
      .map((h) => h.id);

    const morningDuaIds = cat.includeMorningDuas
      ? ["dua_10_subhanallahi_adada", "dua_11_ilman_nafia", "dua_14_ayatul_kursi"]
      : [];
    const eveningDuaIds = cat.includeEveningDuas
      ? ["dua_01_kalimat_tammat", "dua_15_baqarah_last2"]
      : [];
    const trackedDuaIds = [...morningDuaIds, ...eveningDuaIds];

    let totalPossible = 0;
    let totalCompleted = 0;

    activeDateKeys.forEach((dKey) => {
      const completedH = appState.completionsByDate[dKey] || [];
      const completedD = (appState.duaCompletionsByDate && appState.duaCompletionsByDate[dKey]) || [];
      const hasDuaActivityThatDay = completedD.length > 0;
      totalPossible += phaseHabitIds.length + (hasDuaActivityThatDay ? trackedDuaIds.length : 0);
      phaseHabitIds.forEach((hId) => {
        if (completedH.includes(hId)) totalCompleted++;
      });
      if (hasDuaActivityThatDay) {
        trackedDuaIds.forEach((dId) => {
          if (completedD.includes(dId)) totalCompleted++;
        });
      }
    });
    totalPossible = Math.max(1, totalPossible);

    const pct = Math.min(100, Math.round((totalCompleted / totalPossible) * 100));
    return {
      ...cat,
      label: t(cat.titleKey),
      pct
    };
  });

  barsContainer.innerHTML = categoryResults
    .map((item) => {
      const pctLocalized = localizeDigits(item.pct, lang);
      return `
        <div class="cat-graph-row" style="cursor:default;pointer-events:none;" aria-disabled="true">
          <div class="cat-icon-squircle" style="background:${item.bgSoft};">
            ${item.svgIcon}
          </div>
          <div class="cat-bar-content">
            <div class="cat-bar-top-row">
              <span class="cat-bar-title">${item.label}</span>
              <strong class="cat-bar-pct">${pctLocalized}%</strong>
            </div>
            <div class="cat-bar-track">
              <div class="cat-bar-fill" style="width:${item.pct}%;background:${item.barColor};"></div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  if (adviceContainer) {
    if (!hasActiveData) {
      adviceContainer.innerHTML = `ℹ️ ${t("archive_empty")}`;
      adviceContainer.className = "category-advice-comment empty-archive-notice";
      return;
    }

    const overallAvg = Math.round(
      categoryResults.reduce((acc, c) => acc + c.pct, 0) / categoryResults.length
    );
    const sortedByLowest = [...categoryResults].sort((a, b) => a.pct - b.pct);
    const lowest = sortedByLowest[0];

    if (lowest && lowest.pct < 100) {
      adviceContainer.innerHTML = t("advice_prefix_improve", {
        overall: localizeDigits(overallAvg, lang),
        category: lowest.label,
        pct: localizeDigits(lowest.pct, lang)
      });
      adviceContainer.className = "category-advice-comment needs-focus";
    } else {
      adviceContainer.innerHTML = t("advice_all_perfect");
      adviceContainer.className = "category-advice-comment all-perfect";
    }
  }
}

// 7-Day Consistency Matrix Using Local Timezone Date Keys + Weekly Category Breakdown Graph
function renderWeeklyChart() {
  const chart = document.getElementById("weekly-chart");
  if (!chart) return;
  chart.innerHTML = "";
  const totalHabits = getAllHabits().length;
  const localeTag = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).localeTag;
  const todayKey = getTodayKey();
  const weekDateKeys = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getLocalDateKey(d);
    weekDateKeys.push(key);
    const dayLabel = d.toLocaleDateString(localeTag, { weekday: "short" });
    const dayNum = localizeDigits(d.getDate(), appState.locale);
    const count = (appState.completionsByDate[key] || []).length;
    const pct = totalHabits > 0 ? Math.round((count / totalHabits) * 100) : 0;

    const col = document.createElement("div");
    col.className = `day-col ${key === todayKey ? "today-active" : ""} ${count > 0 ? "has-progress" : ""}`;
    col.style.cursor = "pointer";
    col.setAttribute("data-date-inspect", key);
    col.innerHTML = `
      <strong>${localizeDigits(pct, appState.locale)}%</strong>
      <small>${dayLabel}</small>
      <span class="day-date-num">${dayNum}</span>
    `;
    chart.appendChild(col);
  }

  renderCategoryBreakdownGraph(weekDateKeys, "weekly-category-bars", "weekly-category-advice");
}

let archiveFilterBySpecificMonth = true;

// Multi-Month Archive (Default 30 Days / 1M, Current Month Selected by Default, Click Any Month to Switch)
function renderLongTermArchive() {
  const monthlyEl = document.getElementById("monthly-summary-list");
  const historyListEl = document.getElementById("longterm-history-list");
  if (!monthlyEl || !historyListEl) return;

  monthlyEl.innerHTML = "";
  historyListEl.innerHTML = "";

  const totalHabits = getAllHabits().length || 32;
  const localeTag = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).localeTag;
  const currentMonthKey = getTodayKey().slice(0, 7);

  // Sync range pill active state (30D default, 90D, 180D, 365D)
  document.querySelectorAll(".range-pill-btn").forEach((btn) => {
    const days = parseInt(btn.getAttribute("data-range-days"), 10);
    btn.classList.toggle("active", days === historyRangeDays);
  });

  const monthlyStats = {};
  const allRangeDateKeys = [];

  // Ensure current month always exists first
  {
    const now = new Date();
    const curMonthLabel = now.toLocaleDateString(localeTag, { month: "long", year: "numeric" });
    monthlyStats[currentMonthKey] = {
      monthKey: currentMonthKey,
      label: curMonthLabel,
      activeDays: 0,
      totalPct: 0,
      dateKeys: [],
      recordedRows: []
    };
  }

  for (let i = 0; i < historyRangeDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getLocalDateKey(d);
    allRangeDateKeys.push(key);
    const monthKey = key.slice(0, 7); // YYYY-MM
    const doneList = appState.completionsByDate[key] || [];
    const duaList = (appState.duaCompletionsByDate && appState.duaCompletionsByDate[key]) || [];
    const count = doneList.length;

    if (!monthlyStats[monthKey]) {
      const monthLabel = d.toLocaleDateString(localeTag, { month: "long", year: "numeric" });
      monthlyStats[monthKey] = {
        monthKey,
        label: monthLabel,
        activeDays: 0,
        totalPct: 0,
        dateKeys: [],
        recordedRows: []
      };
    }

    monthlyStats[monthKey].dateKeys.push(key);

    if (count > 0 || duaList.length > 0) {
      const pct = Math.min(100, Math.round((count / totalHabits) * 100));
      if (count > 0) {
        monthlyStats[monthKey].activeDays += 1;
        monthlyStats[monthKey].totalPct += pct;
      }

      const readableDate = d.toLocaleDateString(localeTag, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      monthlyStats[monthKey].recordedRows.push({
        key,
        readableDate,
        count,
        pct
      });
    }
  }

  const monthKeys = Object.keys(monthlyStats).sort().reverse();
  if (!selectedArchiveMonthKey || !monthlyStats[selectedArchiveMonthKey]) {
    selectedArchiveMonthKey = currentMonthKey;
  }

  monthKeys.forEach((mKey) => {
    const st = monthlyStats[mKey];
    const avg = st.activeDays > 0 ? Math.round(st.totalPct / st.activeDays) : 0;
    const isSelected = mKey === selectedArchiveMonthKey;
    const card = document.createElement("button");
    card.type = "button";
    card.className = `month-summary-card ${isSelected ? "selected-month-card" : ""}`;
    card.setAttribute("data-select-month", mKey);
    card.innerHTML = `
      <div class="month-card-top">
        <h4>🗓️ ${st.label}</h4>
        ${isSelected ? '<span class="month-selected-dot">●</span>' : ""}
      </div>
      <p>${t("archive_active_days")} <strong>${localizeDigits(st.activeDays, appState.locale)}</strong></p>
      <p>${t("archive_avg_score")} <strong>${localizeDigits(avg, appState.locale)}%</strong></p>
      <small class="month-tap-hint">${t("tap_month_hint")}</small>
    `;
    monthlyEl.appendChild(card);
  });

  const activeMonthObj = monthlyStats[selectedArchiveMonthKey] || monthlyStats[currentMonthKey];
  const monthlyHeadingEl = document.getElementById("monthly-cat-heading");
  const selectedMonthLabelEl = document.getElementById("selected-month-records-label");
  const monthlyBreakdownPanel = document.querySelector(".monthly-breakdown-panel");

  if (monthlyHeadingEl && activeMonthObj) {
    monthlyHeadingEl.textContent = `${t("cat_monthly_title")} — ${activeMonthObj.label}`;
  }
  if (selectedMonthLabelEl && activeMonthObj) {
    selectedMonthLabelEl.textContent = `${t("selected_month_records")} (${activeMonthObj.label})`;
  }

  // Strictly bind the monthly graph to the selected month's own dateKeys
  const graphDateKeys = activeMonthObj ? activeMonthObj.dateKeys : [];

  // Hide the monthly category breakdown graph when the selected month has 0 active days
  if (monthlyBreakdownPanel) {
    if (!activeMonthObj || activeMonthObj.activeDays === 0) {
      monthlyBreakdownPanel.style.display = "none";
    } else {
      monthlyBreakdownPanel.style.display = "block";
    }
  }

  renderCategoryBreakdownGraph(
    graphDateKeys,
    "monthly-category-bars",
    "monthly-category-advice"
  );

  // Daily history list always shows the selected month's records
  const rowsToShow = activeMonthObj ? activeMonthObj.recordedRows : [];
  if (rowsToShow.length === 0) {
    historyListEl.innerHTML = `<p class="muted">${t("archive_empty")}</p>`;
    return;
  }

  rowsToShow.forEach((row) => {
    const item = document.createElement("div");
    item.className = "history-day-row";
    item.style.cursor = "pointer";
    item.setAttribute("data-date-inspect", row.key);
    item.innerHTML = `
      <span>📅 ${row.readableDate}</span>
      <strong>${localizeDigits(row.count, appState.locale)}/${localizeDigits(totalHabits, appState.locale)} (${localizeDigits(row.pct, appState.locale)}%)</strong>
    `;
    historyListEl.appendChild(item);
  });
}

// Inspect Any Past Day's Completed Habits in a Compact Scrollable Modal
function openDayHistoryModal(dateKey) {
  const doneIds = appState.completionsByDate[dateKey] || [];
  const allHabits = getAllHabits();
  const completedHabits = doneIds
    .map((id) => allHabits.find((h) => h.id === id))
    .filter(Boolean);

  document.getElementById("modal-title").textContent = `${t("day_detail_title")} ${localizeDigits(dateKey, appState.locale)}`;
  document.getElementById("modal-category").textContent = `${localizeDigits(doneIds.length, appState.locale)} / ${localizeDigits(allHabits.length, appState.locale)} (${localizeDigits(Math.round((doneIds.length / (allHabits.length || 32)) * 100), appState.locale)}%)`;

  const evidenceEl = document.getElementById("modal-evidence");
  const evidenceHeadingEl = evidenceEl?.parentElement?.querySelector("h4");
  if (evidenceHeadingEl) {
    evidenceHeadingEl.textContent =
      appState.locale === "ar"
        ? "✅ السنن والأعمال المنجزة في هذا اليوم"
        : appState.locale === "en"
        ? "✅ Completed Sunnah Deeds on This Day"
        : "✅ এই দিনে সম্পন্নকৃত সুন্নাহ আমলসমূহ";
  }

  const wisdomSection = document.getElementById("modal-wisdom")?.parentElement;
  if (wisdomSection) wisdomSection.style.display = "none";

  if (completedHabits.length > 0) {
    evidenceEl.innerHTML = `<div class="compact-history-grid">${completedHabits
      .map((h) => `<div class="compact-history-item">✓ ${escapeHtml(getHabitTitle(h))}</div>`)
      .join("")}</div>`;
  } else {
    evidenceEl.textContent = t("day_detail_none");
  }

  document.getElementById("fact-modal").classList.remove("hidden");
  if (typeof pushAppHistoryState === "function") pushAppHistoryState("modal");
}

async function toggleHabit(habitId) {
  const habit = getAllHabits().find((h) => h.id === habitId);
  if (!habit) return;

  const now = new Date();
  const targetKey = resolveHabitLedgerDateKey(habit, now);
  const todayKey = getLocalDateKey(now);
  if (!appState.completionsByDate[targetKey]) {
    appState.completionsByDate[targetKey] = [];
  }
  const list = appState.completionsByDate[targetKey];
  const isDone = isHabitCompletedInActiveCycle(habit, now);
  const winState = evaluateHabitTimeWindow(habit, now);

  // 1. Block ticking if daily time window has expired
  if (!isDone && winState.status === "expired") {
    const expiredMsg =
      appState.locale === "ar"
        ? `🔒 انتهى وقت هذه السنة اليوم (${winState.windowLabel}) — لا يمكن تأشيرها بعد انتهاء الوقت!`
        : appState.locale === "en"
        ? `🔒 Daily time window finished (${winState.windowLabel}) — cannot mark completed after time expires!`
        : `🔒 এই আমলের আজকের নির্ধারিত সময় (${winState.windowLabel}) শেষ হয়ে গেছে! সময় শেষ হওয়ার পর টিক দেওয়া অসম্ভব।`;
    showTimeLockToast(expiredMsg);
    return;
  }

  // 2. Block ticking if daily time window has not started yet
  if (!isDone && winState.status === "upcoming") {
    const upcomingMsg =
      appState.locale === "ar"
        ? `⏳ لم يبدأ وقت هذه السنة بعد (${winState.windowLabel})`
        : appState.locale === "en"
        ? `⏳ Time window has not started yet (${winState.windowLabel})`
        : `⏳ এই আমলের সময় এখনও শুরু হয়নি (${winState.windowLabel})`;
    showTimeLockToast(upcomingMsg);
    return;
  }

  // 3. Seal completed habit once its window finishes so past window records cannot be tampered with
  if (isDone && !winState.canTick) {
    const sealedMsg =
      appState.locale === "ar"
        ? `🛡️ تم ختم هذه السنة في وقتها (${winState.windowLabel}) ولا يمكن إلغاؤها بعد انتهاء الوقت`
        : appState.locale === "en"
        ? `🛡️ Completed deed is cryptographically sealed after its time window (${winState.windowLabel})`
        : `🛡️ যথাসময়ে সম্পন্ন আমলটি সময় শেষ হওয়ার পর লক ও সিল করা হয়েছে (${winState.windowLabel})`;
    showTimeLockToast(sealedMsg);
    return;
  }

  if (isDone) {
    const idxTarget = list.indexOf(habitId);
    if (idxTarget > -1) list.splice(idxTarget, 1);
    if (targetKey !== todayKey && Array.isArray(appState.completionsByDate[todayKey])) {
      const idxToday = appState.completionsByDate[todayKey].indexOf(habitId);
      if (idxToday > -1) appState.completionsByDate[todayKey].splice(idxToday, 1);
    }
  } else {
    if (!list.includes(habitId)) {
      list.push(habitId);
    }
    if (navigator.vibrate) navigator.vibrate(18);
  }
  await saveAndSealState();
  renderHabits();
}

function openHabitModal(habitId) {
  const habit = getAllHabits().find((h) => h.id === habitId);
  if (!habit) return;
  const evidenceEl = document.getElementById("modal-evidence");
  const evidenceHeadingEl = evidenceEl?.parentElement?.querySelector("h4");
  if (evidenceHeadingEl) {
    evidenceHeadingEl.textContent = t("modal_evidence_heading");
  }
  const wisdomSection = document.getElementById("modal-wisdom")?.parentElement;
  if (wisdomSection) wisdomSection.style.display = "block";

  document.getElementById("modal-title").textContent = getHabitTitle(habit);
  document.getElementById("modal-category").textContent = getHabitTime(habit);
  evidenceEl.textContent = getHabitEvidence(habit);
  document.getElementById("modal-wisdom").textContent = getHabitWisdom(habit);
  document.getElementById("fact-modal").classList.remove("hidden");
  if (typeof pushAppHistoryState === "function") pushAppHistoryState("modal");
}

// Muhasabah UI helpers removed (appState.diaryEntries preserved for SHA-256 backup compatibility)

document.addEventListener("DOMContentLoaded", async () => {
  await loadAndVerifyState();
  initXStyleAutoGeographicDetector();
  applyLanguageToDOM();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  // Real-Time 1-Second Live Countdown Ticker for Ongoing Prayers ("ওয়াক্ত শেষ হতে বাকি:" section)
  tickOngoingPrayerLiveCountdown();
  setInterval(() => {
    try {
      tickOngoingPrayerLiveCountdown();
    } catch (err) {
      console.warn("Live countdown tick warning:", err);
    }
  }, 1000);

  // Automatic Real-Time Waqt Lock, Habit Window & Midnight Rollover Watcher (Refreshes every 15s)
  setInterval(() => {
    try {
      const currentKey = getTodayKey();
      if (currentKey !== lastObservedDateKey) {
        lastObservedDateKey = currentKey;
      }
      renderHeaderDatesAndPhase();
      renderHabits();
      renderDuas();
    } catch (err) {
      console.warn("Periodic UI sync warning:", err);
    }
  }, 15000);

  const langSwitcher = document.getElementById("lang-switcher");
  if (langSwitcher) {
    langSwitcher.addEventListener("change", async (e) => {
      const requestedLang = e.target.value;
      if (!I18N_DICTIONARIES[requestedLang]) return;

      const currentDigest = await computeI18nDictionaryHash();
      if (currentDigest !== verifiedI18nDigest || !Object.isFrozen(I18N_DICTIONARIES)) {
        updateIntegrityUI(false);
        alert(t("alert_tamper"));
        return;
      }

      appState.locale = requestedLang;
      applyLanguageToDOM();
      await saveAndSealState();
    });
  }

  const rangePillsContainer = document.getElementById("archive-range-pills");
  if (rangePillsContainer) {
    rangePillsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-range-days]");
      if (!btn) return;
      historyRangeDays = parseInt(btn.getAttribute("data-range-days"), 10) || 30;
      archiveFilterBySpecificMonth = true;
      if (historyRangeDays === 30) {
        selectedArchiveMonthKey = getTodayKey().slice(0, 7);
      }
      if (navigator.vibrate) navigator.vibrate(10);
      renderLongTermArchive();
    });
  }

  const resetTodayBtnEl = document.getElementById("reset-today-btn");
  if (resetTodayBtnEl) resetTodayBtnEl.addEventListener("click", async () => {
    const now = new Date();
    const todayKey = getLocalDateKey(now);
    const prevKey = getPreviousSolarDateKey(now);
    const allHabits = getAllHabits();

    // Keep deeds whose time window has already expired (sealed) and only reset currently open windows
    const currentList = appState.completionsByDate[todayKey] || [];
    appState.completionsByDate[todayKey] = currentList.filter((hId) => {
      const h = allHabits.find((item) => item.id === hId);
      if (!h) return false;
      return !evaluateHabitTimeWindow(h, now).canTick;
    });

    // If post-midnight (00:00 -> Fajr - 1), also allow resetting open cross-midnight habits from the active Islamic night
    if (Array.isArray(appState.completionsByDate[prevKey])) {
      appState.completionsByDate[prevKey] = appState.completionsByDate[prevKey].filter((hId) => {
        const h = allHabits.find((item) => item.id === hId);
        if (!h) return true;
        const targetKey = resolveHabitLedgerDateKey(h, now);
        if (targetKey === prevKey && evaluateHabitTimeWindow(h, now).canTick) {
          return false;
        }
        return true;
      });
    }

    await saveAndSealState();
    renderHabits();
  });

  document.querySelectorAll(".filter-bar .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-bar .chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activePhase = chip.dataset.phase;
      renderHabits();
    });
  });

  document.getElementById("habit-list-container").addEventListener("click", (e) => {
    const checkEl = e.target.closest("[data-toggle]");
    if (checkEl) {
      toggleHabit(checkEl.dataset.toggle);
      return;
    }
    const infoEl = e.target.closest("[data-info]");
    if (infoEl) {
      openHabitModal(infoEl.dataset.info);
    }
  });

  // Click on any Month card to switch month archive, or click a day row (Category Bar rows are strictly non-clickable)
  document.getElementById("tab-vault").addEventListener("click", (e) => {
    const monthCard = e.target.closest("[data-select-month]");
    if (monthCard) {
      selectedArchiveMonthKey = monthCard.getAttribute("data-select-month");
      archiveFilterBySpecificMonth = true;
      if (navigator.vibrate) navigator.vibrate(12);
      renderLongTermArchive();
      return;
    }
    const dayEl = e.target.closest("[data-date-inspect]");
    if (dayEl) {
      openDayHistoryModal(dayEl.getAttribute("data-date-inspect"));
    }
  });

  const closeModalBtnEl = document.getElementById("close-modal-btn");
  const factModalEl = document.getElementById("fact-modal");
  if (closeModalBtnEl && factModalEl) {
    closeModalBtnEl.addEventListener("click", () => {
      factModalEl.classList.add("hidden");
    });
    factModalEl.addEventListener("click", (e) => {
      if (e.target === factModalEl) factModalEl.classList.add("hidden");
    });
  }

  const selector = document.getElementById("tasbih-selector");
  if (selector) {
    selector.addEventListener("change", () => {
      const options = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).tasbih_options;
      const chosenIdx = parseInt(selector.value, 10);
      const chosen = options[chosenIdx] || options[0];
      tasbihTarget = chosen.target || 33;
      tasbihCount = 0;
      document.getElementById("tasbih-current").textContent = localizeDigits(0, appState.locale);
      document.getElementById("tasbih-target").textContent = `/ ${localizeDigits(tasbihTarget, appState.locale)}`;
      document.getElementById("tasbih-label").textContent = chosen.label;
      updateTasbihCircularUI();
    });
  }

  const tapArea = document.getElementById("tasbih-tap-area");
  if (tapArea) {
    tapArea.addEventListener("click", async () => {
      tasbihCount++;
      appState.lifetimeDhikr = (appState.lifetimeDhikr || 0) + 1;
      if (tasbihCount === tasbihTarget) {
        if (navigator.vibrate) navigator.vibrate([40, 60, 80]);
      } else if (navigator.vibrate) {
        navigator.vibrate(25);
      }
      if (tasbihCount > tasbihTarget) {
        tasbihCount = 1;
      }
      document.getElementById("tasbih-current").textContent = localizeDigits(
        tasbihCount,
        appState.locale
      );
      document.getElementById("lifetime-dhikr-count").textContent = localizeDigits(
        appState.lifetimeDhikr,
        appState.locale
      );
      updateTasbihCircularUI();
      if (window.__s24TasbihSaveTimer) clearTimeout(window.__s24TasbihSaveTimer);
      window.__s24TasbihSaveTimer = setTimeout(() => {
        saveAndSealState().catch(() => {});
      }, 250);
    });
  }

  const resetTasbihBtn = document.getElementById("tasbih-reset-btn");
  if (resetTasbihBtn) {
    resetTasbihBtn.addEventListener("click", () => {
      tasbihCount = 0;
      const currentEl = document.getElementById("tasbih-current");
      if (currentEl) {
        currentEl.textContent = localizeDigits(0, appState.locale);
      }
      updateTasbihCircularUI();
      if (navigator.vibrate) navigator.vibrate(15);
    });
  }

  const duasContainer = document.getElementById("duas-list-container");
  if (duasContainer) {
    duasContainer.addEventListener("click", (e) => {
      const duaBtn = e.target.closest("[data-dua-toggle]");
      if (duaBtn) {
        toggleDuaCompletion(duaBtn.getAttribute("data-dua-toggle"));
      }
    });
  }

  // Muhasabah Diary & combined 24H Routine sections removed per v5.0 Master Section UI architecture

  document.getElementById("add-custom-habit-btn").addEventListener("click", async () => {
    const titleInput = document.getElementById("custom-title");
    const phaseSelect = document.getElementById("custom-phase");
    const factInput = document.getElementById("custom-fact");
    const title = titleInput ? titleInput.value.trim().slice(0, 200) : "";
    const rawPhase = phaseSelect ? phaseSelect.value : "tahajjud_fajr";
    const phase = PHASE_KEY_TO_TITLE_I18N[rawPhase] ? rawPhase : "tahajjud_fajr";
    const fact = factInput ? factInput.value.trim().slice(0, 500) : "";

    if (!title) {
      if (titleInput) titleInput.focus();
      const emptyMsg =
        appState.locale === "ar"
          ? "⚠️ يرجى كتابة اسم السنة أو العمل أولاً"
          : appState.locale === "en"
          ? "⚠️ Please enter a habit title first"
          : "⚠️ অনুগ্রহ করে প্রথমে আমলের নাম লিখুন";
      showTimeLockToast(emptyMsg);
      return;
    }

    const newHabitObj = {
      id: "s24_custom_" + Date.now(),
      isCustom: true,
      phase,
      title,
      title_bn: title,
      title_ar: title,
      customFact: fact
    };

    appState.customHabits.push(newHabitObj);

    if (titleInput) titleInput.value = "";
    if (factInput) factInput.value = "";
    await saveAndSealState();
    renderHabits();
    if (typeof renderCustomHabitsManageList === "function") {
      renderCustomHabitsManageList();
    }
    if (typeof syncMasterSectionsLiveProgress === "function") {
      syncMasterSectionsLiveProgress();
    }
    showCustomHabitAddedModal(newHabitObj);
  });

  document.getElementById("export-backup-btn").addEventListener("click", async () => {
    await saveAndSealState();
    const timeStamp = new Date().toTimeString().slice(0, 8).replace(/:/g, "-");
    const fileName = `sunnah-24-backup-${getTodayKey()}-${timeStamp}.json`;
    const jsonString = JSON.stringify(appState, null, 2);

    const getSuccessMessage = (savedLocation) => {
      if (appState.locale === "ar") {
        return `✅ تم حفظ النسخة الاحتياطية في جهازك بنجاح!\n📁 المسار: ${savedLocation}`;
      }
      if (appState.locale === "en") {
        return `✅ Backup saved directly to your device!\n📁 Location: ${savedLocation}`;
      }
      return `✅ সুন্নাহ ২৪ ব্যাকআপ আপনার ফোনে সংরক্ষিত হয়েছে!\n📁 ফোল্ডার: ${savedLocation}`;
    };

    if (
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.saveJsonToDownloads === "function"
    ) {
      const result = window.AndroidDownloader.saveJsonToDownloads(fileName, jsonString);
      if (result && !String(result).startsWith("ERROR:")) {
        alert(getSuccessMessage(result));
        return;
      }
    }

    try {
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        if (a.parentNode) document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 60000);
    } catch {
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(jsonString);
      const a = document.createElement("a");
      a.href = dataUri;
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });

  document.getElementById("import-backup-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const imported = JSON.parse(text);
      if (!imported || typeof imported !== "object" || !imported.completionsByDate) {
        alert(t("alert_invalid"));
        e.target.value = "";
        return;
      }
      if (!imported.locale) imported.locale = "bn";
      if (!imported.i18nHash) imported.i18nHash = verifiedI18nDigest;

      if (imported.signature) {
        const expectedSig = await computeSHA256(getCanonicalStatePayload(imported, false));
        const legacySig = await computeSHA256(getCanonicalStatePayload(imported, true));
        if (expectedSig !== imported.signature && legacySig !== imported.signature) {
          updateIntegrityUI(false);
          alert(t("alert_tamper"));
          e.target.value = "";
          return;
        }
      }

      // Validate & sanitize imported customHabits against allowed phase keys to prevent corrupted/malicious payloads
      const allowedPhases = new Set([
        "tahajjud_fajr",
        "duha_work",
        "dhuhr_asr",
        "maghrib_isha",
        "sleep_sunnah",
        "diet_hygiene",
        "character_social"
      ]);
      if (Array.isArray(imported.customHabits)) {
        imported.customHabits = imported.customHabits
          .filter((ch) => ch && typeof ch === "object" && typeof ch.id === "string" && typeof ch.title === "string")
          .map((ch) => ({
            id: String(ch.id).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) || ("s24_custom_" + Date.now()),
            isCustom: true,
            phase: allowedPhases.has(ch.phase) ? ch.phase : "tahajjud_fajr",
            title: String(ch.title).trim().slice(0, 200),
            title_bn: String(ch.title_bn || ch.title).trim().slice(0, 200),
            title_ar: String(ch.title_ar || ch.title).trim().slice(0, 200),
            customFact: ch.customFact ? String(ch.customFact).trim().slice(0, 500) : ""
          }));
      }

      // Deep-merge imported backup with existing history so importing never wipes other days
      const merged = mergeHistoryStates([imported, appState]);
      if (merged) {
        merged.locale = imported.locale || appState.locale || "bn";
        appState = merged;
      }
      await saveAndSealState();
      applyLanguageToDOM();
      alert(t("alert_restored"));
    } catch {
      alert(t("alert_invalid"));
    }
    e.target.value = "";
  });
});

// ============================================================================
// SMART ANDROID APK & PWA BACK-BUTTON NAVIGATION ENGINE (NEVER EXITS ABRUPTLY)
// ============================================================================
let lastBackTapTime = 0;

function pushAppHistoryState(contextTag = "nav") {
  try {
    history.pushState({ sunnah24: contextTag, ts: Date.now() }, "");
  } catch {}
}

function showExitToast() {
  let toast = document.getElementById("s24-exit-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "s24-exit-toast";
    toast.className = "exit-toast";
    document.body.appendChild(toast);
  }
  toast.textContent =
    appState.locale === "ar"
      ? "اضغط رجوع مرة أخرى للخروج من التطبيق"
      : appState.locale === "en"
      ? "Press back again to exit Sunnah 24"
      : "অ্যাপ থেকে বের হতে পুনরায় ব্যাক বাটন চাপুন";
  toast.style.opacity = "1";
  setTimeout(() => {
    if (toast) toast.style.opacity = "0";
  }, 2000);
}

// Superseded legacy handleSunnahBackNavigation #1 consolidated into unifiedLIFO modal & view handler

document.addEventListener("DOMContentLoaded", () => {
  // Seed initial history state so back button is intercepted by WebView
  pushAppHistoryState("root-guard");

  // Tab clicks are tracked & scroll-preserved via switchTabProgrammatically

  // Track Phase chip clicks
  document.querySelectorAll(".filter-bar .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.dataset.phase !== "all") {
        pushAppHistoryState("phase-" + chip.dataset.phase);
      }
    });
  });

  window.addEventListener("popstate", () => {
    window.handleSunnahBackNavigation();
  });
});

// ============================================================================
// WEBSITE-ONLY 1-CLICK LATEST APK INSTALLER ENGINE (HIDDEN INSIDE APK)
// ============================================================================
function initWebsiteOnlyApkInstaller() {
  const apkBtn = document.getElementById("web-apk-download-btn");
  if (!apkBtn) return;

  // 1. Detect if running inside the installed Android APK / Capacitor Native Shell
  const isInsideNativeApk =
    Boolean(window.AndroidDownloader) ||
    Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ||
    window.location.protocol === "capacitor:" ||
    window.location.protocol === "file:" ||
    (window.location.hostname === "localhost" && Boolean(window.Capacitor));

  // If inside the APK, keep the button strictly hidden
  if (isInsideNativeApk) {
    apkBtn.classList.add("hidden");
    return;
  }

  // 2. Running on the Website (https://mkrweb.github.io/sunnah-24/) -> Show Button!
  apkBtn.classList.remove("hidden");

    const updateApkButtonLabel = () => {
    const span = apkBtn.querySelector("span");
    if (span) span.textContent = "Install App";
  };

  updateApkButtonLabel();
  const langSwitcher = document.getElementById("lang-switcher");
  if (langSwitcher) {
    langSwitcher.addEventListener("change", updateApkButtonLabel);
  }

  // 3. Dynamically fetch the exact latest .apk asset URL from GitHub Releases API
  // so 1-click download always grabs the newest APK regardless of version number
  fetch("https://api.github.com/repos/MKRWeb/sunnah-24/releases/latest")
    .then((res) => (res.ok ? res.json() : null))
    .then((releaseData) => {
      if (!releaseData || !Array.isArray(releaseData.assets)) return;
      const apkAsset = releaseData.assets.find(
        (asset) => asset.name && asset.name.toLowerCase().endsWith(".apk")
      );
      if (apkAsset && apkAsset.browser_download_url) {
        apkBtn.href = apkAsset.browser_download_url;
        apkBtn.setAttribute("title", `Download ${apkAsset.name}`);
      }
    })
    .catch(() => {
      apkBtn.href = "https://github.com/MKRWeb/sunnah-24/releases/latest/download/Sunnah-24-v4.2-Enterprise-Signed.apk";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initWebsiteOnlyApkInstaller();
});

// ============================================================================
// PLAY-STORE COMPLIANT VERSION BADGE & SIDELOAD-ONLY UPDATE ENGINE (v4.2)
// Google Play Device & Network Abuse Policy Guarantee:
// - Release Play Store AAB (`isSelfUpdateSupported() === false`) NEVER queries
//   GitHub Releases or downloads external APKs; updates are handled 100% by Google Play.
// - Sideloaded Debug APK (`isSelfUpdateSupported() === true`) retains full
//   in-app update checking and installation.
// ============================================================================
let latestRemoteApkUrl = "";
let latestRemoteVersionTag = "";

function isSideloadSelfUpdateEnabled() {
  try {
    if (
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.isSelfUpdateSupported === "function"
    ) {
      return Boolean(window.AndroidDownloader.isSelfUpdateSupported());
    }
    // Backward compatibility only if native bridge explicitly exposes downloadAndAutoInstallVersionApk
    if (
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.downloadAndAutoInstallVersionApk === "function"
    ) {
      return true;
    }
  } catch {}
  return false;
}

function getInstalledAppVersionTag() {
  try {
    if (
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.getInstalledVersionName === "function"
    ) {
      const nativeVer = window.AndroidDownloader.getInstalledVersionName();
      if (nativeVer) return nativeVer.startsWith("v") ? nativeVer : `v${nativeVer}`;
    }
  } catch {}
  return "v4.2.0";
}

function renderInstalledVersionBadge() {
  const badge = document.getElementById("integrity-badge");
  if (badge && window.AndroidDownloader) {
    badge.textContent = `🛡️ S24 • ${getInstalledAppVersionTag()}`;
  }
}

function initInAppUpdateChecker(manualTrigger = false) {
  // Strictly disabled inside Play Store Release AAB builds to satisfy Google Play Device & Network Abuse Policy
  if (!isSideloadSelfUpdateEnabled()) return;

  const isInsideNativeApk =
    Boolean(window.AndroidDownloader) ||
    Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ||
    window.location.protocol === "capacitor:" ||
    window.location.protocol === "file:";

  if (!isInsideNativeApk && !manualTrigger) return;

  const installedTag = getInstalledAppVersionTag();

  fetch("https://api.github.com/repos/MKRWeb/sunnah-24/releases/latest", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((release) => {
      if (!release || !release.tag_name) return;
      const latestTag = release.tag_name.trim();

      if (latestTag !== installedTag) {
        const apkAsset = (release.assets || []).find(
          (a) => a.name && a.name.toLowerCase().endsWith(".apk")
        );
        if (!apkAsset || !apkAsset.browser_download_url) return;

        latestRemoteApkUrl = apkAsset.browser_download_url;
        latestRemoteVersionTag = latestTag;

        let alreadyOnDevice = false;
        if (
          window.AndroidDownloader &&
          typeof window.AndroidDownloader.isVersionApkCached === "function"
        ) {
          alreadyOnDevice = Boolean(window.AndroidDownloader.isVersionApkCached(latestTag));
        }

        showUpdateNotificationBanner(latestTag, alreadyOnDevice);
      } else if (manualTrigger) {
        alert(
          appState.locale === "bn"
            ? `✅ আলহামদুলিল্লাহ! আপনি সর্বশেষ সংস্করণ (${installedTag}) ব্যবহার করছেন।`
            : `✅ Alhamdulillah! You are on the latest version (${installedTag}).`
        );
      }
    })
    .catch(() => {});
}

function showUpdateNotificationBanner(newVersion, isAlreadyOnDevice) {
  if (!isSideloadSelfUpdateEnabled()) return;

  const existing = document.getElementById("s24-update-banner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "s24-update-banner";
  banner.className = "update-banner-card";
  banner.setAttribute("data-cached", isAlreadyOnDevice ? "true" : "false");

  const safeVersion = escapeHtml(newVersion);
  const msgText =
    appState.locale === "ar"
      ? `✨ تحديث جديد (${safeVersion}) متاح لتطبيق سنة ٢٤!`
      : appState.locale === "en"
      ? `✨ Update (${safeVersion}) Available for Sunnah 24!`
      : `✨ সুন্নাহ ২৪-এর নতুন আপডেট (${safeVersion}) প্রস্তুত!`;

  const subText = isAlreadyOnDevice
    ? appState.locale === "bn"
      ? "আপডেট ফাইলটি আপনার ফোনে প্রস্তুত আছে। সরাসরি ইনস্টল করুন।"
      : "Update APK is already saved on your phone. Tap to install."
    : appState.locale === "bn"
    ? "ডাউনলোড শেষ হওয়ার সাথে সাথেই স্বয়ংক্রিয়ভাবে ইনস্টলার চালু হবে।"
    : "Automatically triggers the package installer right after download finishes.";

  const btnText = isAlreadyOnDevice
    ? appState.locale === "bn"
      ? "📦 এখনই ইনস্টল করুন"
      : "📦 Install Now"
    : appState.locale === "bn"
    ? "🚀 আপডেট করুন"
    : "🚀 Update Now";

  const dismissText =
    appState.locale === "ar" ? "لاحقاً" : appState.locale === "en" ? "Later" : "পরে";

  banner.innerHTML = `
    <div class="update-banner-content">
      <span>🚀</span>
      <div style="flex:1;">
        <strong id="s24-update-title">${msgText}</strong>
        <small id="s24-update-status">${subText}</small>
        <div id="s24-update-progress-wrap" class="progress-track" style="display:none;height:6px;margin:6px 0 2px;">
          <div id="s24-update-progress-bar" class="progress-fill" style="width:0%;"></div>
        </div>
      </div>
    </div>
    <div class="update-banner-actions">
      <button id="trigger-native-update-btn" class="btn-update-action" style="background:var(--accent-gold);color:#05130e;font-weight:800;">${btnText}</button>
      <button class="btn-update-dismiss" onclick="document.getElementById('s24-update-banner').remove()">${dismissText}</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById("trigger-native-update-btn").addEventListener("click", () => {
    const btn = document.getElementById("trigger-native-update-btn");
    const statusEl = document.getElementById("s24-update-status");
    const progWrap = document.getElementById("s24-update-progress-wrap");

    if (banner.getAttribute("data-cached") === "true") {
      if (
        window.AndroidDownloader &&
        typeof window.AndroidDownloader.installCachedVersionApk === "function"
      ) {
        window.AndroidDownloader.installCachedVersionApk(latestRemoteVersionTag);
        return;
      }
      if (
        window.AndroidDownloader &&
        typeof window.AndroidDownloader.installLocalApk === "function"
      ) {
        window.AndroidDownloader.installLocalApk();
        return;
      }
    }

    if (
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.downloadAndAutoInstallVersionApk === "function"
    ) {
      btn.disabled = true;
      btn.textContent = appState.locale === "bn" ? "⏳ ০% ডাউনলোড হচ্ছে..." : "⏳ Downloading 0%...";
      if (progWrap) progWrap.style.display = "block";
      if (statusEl) {
        statusEl.textContent =
          appState.locale === "bn"
            ? "ডাউনলোড শেষ হলে স্বয়ংক্রিয়ভাবে ইনস্টল স্ক্রিন ওপেন হবে..."
            : "Package installer will launch automatically at 100%...";
      }
      window.AndroidDownloader.downloadAndAutoInstallVersionApk(
        latestRemoteApkUrl,
        latestRemoteVersionTag
      );
      return;
    }

    if (
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.downloadAndInstallApk === "function"
    ) {
      btn.disabled = true;
      if (progWrap) progWrap.style.display = "block";
      window.AndroidDownloader.downloadAndInstallApk(latestRemoteApkUrl);
    }
  });
}

// Live Progress Bar & Automatic Installer Trigger Callback
window.onSunnahApkDownloadProgress = function (percent, statusText) {
  const btn = document.getElementById("trigger-native-update-btn");
  const statusEl = document.getElementById("s24-update-status");
  const banner = document.getElementById("s24-update-banner");
  const progWrap = document.getElementById("s24-update-progress-wrap");
  const progBar = document.getElementById("s24-update-progress-bar");

  if (progWrap && percent >= 0) {
    progWrap.style.display = "block";
  }
  if (progBar && percent >= 0) {
    progBar.style.width = `${Math.min(100, percent)}%`;
  }

  if (btn && percent >= 0 && percent < 100) {
    btn.textContent = `⬇️ ${localizeDigits(percent, appState.locale)}%`;
  }
  if (statusEl && statusText) {
    statusEl.textContent = statusText;
  }

  if (percent >= 100) {
    if (banner) banner.setAttribute("data-cached", "true");
    if (progBar) progBar.style.width = "100%";
    const needsSourcePerm =
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.canRequestPackageInstalls === "function" &&
      !window.AndroidDownloader.canRequestPackageInstalls();

    if (btn) {
      btn.disabled = false;
      btn.style.background = "var(--accent-emerald)";
      btn.style.color = "#ffffff";
      btn.textContent = needsSourcePerm
        ? appState.locale === "bn"
          ? "⚙️ ইনস্টল অনুমতি দিন"
          : "⚙️ Allow & Install"
        : appState.locale === "bn"
        ? "📦 এখনই ইনস্টল করুন"
        : "📦 Install Now";
    }
    if (statusEl && !statusText) {
      statusEl.textContent = needsSourcePerm
        ? appState.locale === "bn"
          ? "⚙️ সেটিংস থেকে 'Allow from this source' চালু করলেই স্বয়ংক্রিয়ভাবে ইনস্টল হবে।"
          : "⚙️ Enable 'Allow from this source' in Settings to auto-launch installer."
        : appState.locale === "bn"
        ? "✅ ডাউনলোড সম্পন্ন! স্বয়ংক্রিয়ভাবে ইনস্টলার চালু হয়েছে।"
        : "✅ Download complete! Package installer launched automatically.";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderInstalledVersionBadge();
  if (isSideloadSelfUpdateEnabled()) {
    setTimeout(() => initInAppUpdateChecker(false), 2500);
  }

  const STANDARD_INTRO_HOLD_MS = 3250;
  const SESSION_INTRO_SHOWN_KEY = "SUNNAH_24_SESSION_INTRO_SHOWN_V1";
  let splashHideTimer = null;
  let splashFadeTimer = null;

  function hideIntroSplashImmediately() {
    if (splashHideTimer) clearTimeout(splashHideTimer);
    if (splashFadeTimer) clearTimeout(splashFadeTimer);
    const splash = document.getElementById("s24-startup-splash");
    if (splash) {
      splash.classList.add("splash-hidden");
      splash.style.display = "none";
    }
  }

  function hasActiveSessionAlreadyShownIntro() {
    if (window.__S24_ACTIVE_SESSION_INTRO_DONE === true) return true;
    try {
      return sessionStorage.getItem(SESSION_INTRO_SHOWN_KEY) === "1";
    } catch {
      return false;
    }
  }

  function markActiveSessionIntroShown() {
    window.__S24_ACTIVE_SESSION_INTRO_DONE = true;
    try {
      sessionStorage.setItem(SESSION_INTRO_SHOWN_KEY, "1");
    } catch {}
  }

  function triggerStandardIntroSplash(holdMs = STANDARD_INTRO_HOLD_MS) {
    let splash = document.getElementById("s24-startup-splash");
    if (!splash) {
      splash = document.createElement("div");
      splash.id = "s24-startup-splash";
      splash.className = "startup-splash";
      splash.innerHTML = `
        <div class="splash-inner">
          <img src="icon.svg" alt="Sunnah 24" class="splash-logo" />
          <h2>সুন্নাহ ২৪ • Sunnah 24</h2>
          <p>Enterprise Prophetic 24-Hour Lifestyle</p>
        </div>
      `;
      document.body.prepend(splash);
    } else {
      splash.style.display = "flex";
      splash.classList.remove("splash-hidden");
    }

    if (splashHideTimer) clearTimeout(splashHideTimer);
    if (splashFadeTimer) clearTimeout(splashFadeTimer);

    splashHideTimer = setTimeout(() => {
      splash.classList.add("splash-hidden");
      splashFadeTimer = setTimeout(() => {
        if (splash) splash.style.display = "none";
      }, 450);
    }, holdMs);
  }

  // Strictly show entrance animation ONLY on a brand-new app session.
  // Never re-trigger when resuming from background or BFCache while active in background.
  if (!hasActiveSessionAlreadyShownIntro()) {
    markActiveSessionIntroShown();
    triggerStandardIntroSplash(STANDARD_INTRO_HOLD_MS);
  } else {
    hideIntroSplashImmediately();
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted || hasActiveSessionAlreadyShownIntro()) {
      hideIntroSplashImmediately();
    }
  });
});

// ============================================================================
// MUSLIM BANGLA / MUSLIM'S DAY 5-WAQT STRIP SMART TIME-RANGE POPUP ENGINE
// Clicking any of the 5 prayer time cards (Fajr, Dhuhr/Jumu'ah, Asr, Maghrib, Isha)
// pops up a high-contrast window showing the exact Start–End Time Range,
// Prime (Awwal) Window, Live Countdown/Status, and Sunnah/Fard Rak'ah summary.
// ============================================================================
let activeSelectedWaqtPopupId = null;

function ensureWaqtPopupContainer() {
  let popupWrap = document.getElementById("waqt-range-popup-wrap");
  if (popupWrap) return popupWrap;

  const stripCard = document.querySelector(".waqt-strip-card");
  if (!stripCard) return null;

  popupWrap = document.createElement("div");
  popupWrap.id = "waqt-range-popup-wrap";
  popupWrap.className = "waqt-range-popup-wrap hidden";
  popupWrap.setAttribute("role", "region");
  popupWrap.setAttribute("aria-live", "polite");
  stripCard.appendChild(popupWrap);
  return popupWrap;
}

function getExactWaqtPopupDetails(waqtId, now = new Date()) {
  const sched = computeSeasonalPrayerSchedule(now);
  const lang = appState.locale || "bn";
  const middayMeta = resolveMiddayWaqtMeta(now, lang);
  const nowMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const pWindows = sched.prohibitedWindows || {
    sunrise: { start: sched.sunrise, end: sched.sunrise + 15 },
    zawal: { start: sched.zawal, end: sched.dhuhr },
    sunset: { start: sched.sunset - 15, end: sched.sunset }
  };

  const isHanafi = sched.profile && sched.profile.asrShadowFactor === 2;
  let meta = null;

  if (waqtId === "fajr") {
    const startMins = sched.fajr;
    const endMins = (pWindows.sunrise.start - 1 + 1440) % 1440;
    const primeEndMins = Math.min(pWindows.sunrise.start - 5, sched.fajr + 38);
    const isActive = nowMins >= sched.fajr && nowMins < pWindows.sunrise.start;
    const isPassed = nowMins >= pWindows.sunrise.start;
    const remOrStartsMins = isActive
      ? pWindows.sunrise.start - nowMins
      : nowMins < sched.fajr
      ? sched.fajr - nowMins
      : 1440 - nowMins + sched.fajr;

    meta = {
      id: "fajr",
      phase: "tahajjud_fajr",
      icon: "🌅",
      title: lang === "bn" ? "ফজর সালাতের ওয়াক্ত" : lang === "ar" ? "وقت صلاة الفجر" : "Fajr Prayer Waqt",
      subLabel:
        lang === "bn"
          ? "সুবহে সাদিক থেকে সূর্যোদয়ের পূর্ব পর্যন্ত"
          : lang === "ar"
          ? "من طلوع الفجر الصادق إلى قبيل الشروق"
          : "From Subh Sadiq until just before Sunrise",
      startMins,
      endMins,
      primeRangeStr: `${formatShortWaqtClock(startMins, lang)} – ${formatShortWaqtClock(primeEndMins, lang)}`,
      rakahNote:
        lang === "bn"
          ? "🕌 ২ রাকাত সুন্নাতে মুয়াক্কাদাহ + ২ রাকাত ফরজ"
          : lang === "ar"
          ? "🕌 ركعتا سنة الفجر + ركعتان فرض"
          : "🕌 2 Rak'ah Sunnah Mu'akkadah + 2 Rak'ah Fard",
      isActive,
      isPassed,
      remOrStartsMins
    };
  } else if (waqtId === "dhuhr") {
    const startMins = sched.dhuhr;
    const endMins = (sched.asr - 1 + 1440) % 1440;
    const primeEndMins = Math.min(sched.asr - 15, sched.dhuhr + 50);
    const isActive = nowMins >= sched.dhuhr && nowMins < sched.asr;
    const isPassed = nowMins >= sched.asr;
    const remOrStartsMins = isActive
      ? sched.asr - nowMins
      : nowMins < sched.dhuhr
      ? sched.dhuhr - nowMins
      : 1440 - nowMins + sched.dhuhr;

    meta = {
      id: "dhuhr",
      phase: "dhuhr_asr",
      icon: middayMeta.pillIcon,
      title: middayMeta.isJumuah
        ? lang === "bn"
          ? "জুমু'আর সালাতের ওয়াক্ত"
          : lang === "ar"
          ? "وقت صلاة الجمعة"
          : "Jumu'ah Prayer Waqt"
        : lang === "bn"
        ? "যোহর সালাতের ওয়াক্ত"
        : lang === "ar"
        ? "وقت صلاة الظهر"
        : "Dhuhr Prayer Waqt",
      subLabel:
        lang === "bn"
          ? "যাওয়াল (দ্বিপ্রহর) শেষে আসরের পূর্ব পর্যন্ত"
          : lang === "ar"
          ? "بعد الزوال إلى قبيل دخول وقت العصر"
          : "After midday zenith (Zawal) until before Asr",
      startMins,
      endMins,
      primeRangeStr: `${formatShortWaqtClock(startMins, lang)} – ${formatShortWaqtClock(primeEndMins, lang)}`,
      rakahNote: middayMeta.isJumuah
        ? lang === "bn"
          ? "🕌 পূর্বে ৪ সুন্নাত + খুতবা ও ২ ফরজ + পরে ৪ (বা ২) সুন্নাত"
          : lang === "ar"
          ? "🕌 ٤ سنة قبلية + الخطبة وركعتا الجمعة + ٤ (أو ٢) بعدية"
          : "🕌 4 Sunnah Before + Khutbah & 2 Fard + 4 (or 2) Sunnah After"
        : lang === "bn"
        ? "🕌 পূর্বে ৪ রাকাত সুন্নাত + ৪ ফরজ + পরে ২ রাকাত সুন্নাত"
        : lang === "ar"
        ? "🕌 ٤ ركعات سنة قبلية + ٤ فرض + ركعتان سنة بعدية"
        : "🕌 4 Rak'ah Sunnah Before + 4 Fard + 2 Rak'ah Sunnah After",
      isActive,
      isPassed,
      remOrStartsMins
    };
  } else if (waqtId === "asr") {
    const startMins = sched.asr;
    const endMins = (pWindows.sunset.start - 1 + 1440) % 1440;
    const primeEndMins = Math.max(sched.asr + 30, pWindows.sunset.start - 25);
    const isActive = nowMins >= sched.asr && nowMins < pWindows.sunset.start;
    const isPassed = nowMins >= pWindows.sunset.start;
    const remOrStartsMins = isActive
      ? pWindows.sunset.start - nowMins
      : nowMins < sched.asr
      ? sched.asr - nowMins
      : 1440 - nowMins + sched.asr;

    meta = {
      id: "asr",
      phase: "dhuhr_asr",
      icon: "🌤️",
      title: isHanafi
        ? lang === "bn"
          ? "আসর সালাতের ওয়াক্ত (হানাফী)"
          : lang === "ar"
          ? "وقت صلاة العصر (حنفي)"
          : "Asr Prayer Waqt (Hanafi)"
        : lang === "bn"
        ? "আসর সালাতের ওয়াক্ত (শাফিঈ/জমহুর)"
        : lang === "ar"
        ? "وقت صلاة العصر (جمهور/شافعي)"
        : "Asr Prayer Waqt (Standard/Shafi'i)",
      subLabel:
        lang === "bn"
          ? `সূর্যাস্তের নিষিদ্ধ সময়ের (${formatShortWaqtClock(pWindows.sunset.start, lang)}) পূর্ব পর্যন্ত (মাকরূহ মুক্ত)`
          : lang === "ar"
          ? `يمتد الوقت المختار إلى قبيل وقت النهي (${formatShortWaqtClock(pWindows.sunset.start, lang)})`
          : `Valid until before Sunset prohibited window (${formatShortWaqtClock(pWindows.sunset.start, lang)})`,
      startMins,
      endMins,
      primeRangeStr: `${formatShortWaqtClock(startMins, lang)} – ${formatShortWaqtClock(primeEndMins, lang)}`,
      rakahNote:
        lang === "bn"
          ? "🕌 ৪ রাকাত ফরজ (পূর্বে ৪ রাকাত সুন্নাতে গায়রে মুয়াক্কাদাহ)"
          : lang === "ar"
          ? "🕌 ٤ ركعات فرض (ويستحب ٤ ركعات قبلها)"
          : "🕌 4 Rak'ah Fard (4 Rak'ah Sunnah before is Mustahabb)",
      isActive,
      isPassed,
      remOrStartsMins
    };
  } else if (waqtId === "maghrib") {
    const startMins = sched.maghrib;
    const endMins = (sched.isha - 1 + 1440) % 1440;
    const primeEndMins = Math.min(sched.isha - 5, sched.maghrib + 25);
    const isActive = nowMins >= sched.maghrib && nowMins < sched.isha;
    const isPassed = nowMins >= sched.isha;
    const remOrStartsMins = isActive
      ? sched.isha - nowMins
      : nowMins < sched.maghrib
      ? sched.maghrib - nowMins
      : 1440 - nowMins + sched.maghrib;

    meta = {
      id: "maghrib",
      phase: "maghrib_isha",
      icon: "🌇",
      title: lang === "bn" ? "মাগরিব সালাতের ওয়াক্ত" : lang === "ar" ? "وقت صلاة المغرب" : "Maghrib Prayer Waqt",
      subLabel:
        lang === "bn"
          ? "সূর্যাস্তের পর থেকে ইশার ওয়াক্তের পূর্ব পর্যন্ত"
          : lang === "ar"
          ? "من بعد غروب الشمس إلى قبيل دخول العشاء"
          : "From after Sunset until just before Isha",
      startMins,
      endMins,
      primeRangeStr: `${formatShortWaqtClock(startMins, lang)} – ${formatShortWaqtClock(primeEndMins, lang)}`,
      rakahNote:
        lang === "bn"
          ? "🕌 ৩ রাকাত ফরজ + ২ রাকাত সুন্নাতে মুয়াক্কাদাহ"
          : lang === "ar"
          ? "🕌 ٣ ركعات فرض + ركعتان سنة راتبة"
          : "🕌 3 Rak'ah Fard + 2 Rak'ah Sunnah Mu'akkadah",
      isActive,
      isPassed,
      remOrStartsMins
    };
  } else {
    // Isha Waqt (Crosses Midnight until Fajr - 1)
    const startMins = sched.isha;
    const endMins = (sched.fajr - 1 + 1440) % 1440;
    const primeEndMins = (sched.firstThirdEnd - 1 + 1440) % 1440;
    const isActive = nowMins >= sched.isha || nowMins < sched.fajr;
    const isPassed = false;
    const currentPos = nowMins < sched.fajr ? nowMins + 1440 : nowMins;
    const remOrStartsMins = isActive
      ? sched.fajr + 1440 - currentPos
      : sched.isha - nowMins;

    meta = {
      id: "isha",
      phase: "maghrib_isha",
      icon: "🌙",
      title: lang === "bn" ? "ইশা ও বিতর সালাতের ওয়াক্ত" : lang === "ar" ? "وقت صلاة العشاء والوتر" : "Isha & Witr Prayer Waqt",
      subLabel:
        lang === "bn"
          ? `রাতের ১ম প্রহর (${formatShortWaqtClock(primeEndMins, lang)}) উত্তম • সুবহে সাদিকের পূর্ব পর্যন্ত জায়েয`
          : lang === "ar"
          ? `الوقت المختار إلى الثلث الأول (${formatShortWaqtClock(primeEndMins, lang)}) ويمتد للفجر`
          : `Prime until 1st Third (${formatShortWaqtClock(primeEndMins, lang)}) • Valid until Fajr`,
      startMins,
      endMins,
      primeRangeStr: `${formatShortWaqtClock(startMins, lang)} – ${formatShortWaqtClock(primeEndMins, lang)}`,
      rakahNote:
        lang === "bn"
          ? "🕌 ৪ রাকাত ফরজ + ২ রাকাত সুন্নাত + বিতর সালাত"
          : lang === "ar"
          ? "🕌 ٤ ركعات فرض + ركعتان سنة + صلاة الوتر"
          : "🕌 4 Rak'ah Fard + 2 Rak'ah Sunnah + Witr Prayer",
      isActive,
      isPassed,
      remOrStartsMins
    };
  }

  return meta;
}

function positionWaqtPopupArrow(waqtId) {
  const arrowEl = document.getElementById("waqt-popup-arrow");
  const wrapEl = document.getElementById("waqt-range-popup-wrap");
  const infoBtnEl = document.querySelector(`.waqt-pill-card[data-waqt-id="${waqtId}"] [data-waqt-info-btn]`);
  const pillEl = infoBtnEl || document.querySelector(`.waqt-pill-card[data-waqt-id="${waqtId}"]`);
  if (!arrowEl || !wrapEl || !pillEl) return;

  const wrapRect = wrapEl.getBoundingClientRect();
  const pillRect = pillEl.getBoundingClientRect();
  if (wrapRect.width <= 0) return;

  const centerOffset = pillRect.left + pillRect.width / 2 - wrapRect.left;
  const clampedPx = Math.max(24, Math.min(wrapRect.width - 24, centerOffset));
  arrowEl.style.left = `${Math.round(clampedPx)}px`;
}

function renderWaqtTimeRangePopup(waqtId, now = new Date()) {
  const popupWrap = ensureWaqtPopupContainer();
  if (!popupWrap) return;

  if (!waqtId) {
    popupWrap.classList.add("hidden");
    popupWrap.innerHTML = "";
    document.querySelectorAll(".waqt-pill-card").forEach((btn) => {
      btn.classList.remove("waqt-popup-selected");
      btn.setAttribute("aria-expanded", "false");
    });
    return;
  }

  const info = getExactWaqtPopupDetails(waqtId, now);
  if (!info) return;

  const lang = appState.locale || "bn";
  const startClockFull = formatMinutesToLocalizedTime(info.startMins, lang);
  const endClockFull = formatMinutesToLocalizedTime(info.endMins, lang);
  const startShort = formatShortWaqtClock(info.startMins, lang);
  const endShort = formatShortWaqtClock(info.endMins, lang);

  let statusClass = "status-upcoming";
  let statusBadgeText = "";
  let countdownLabel = "";
  let countdownVal = formatRemainingDurationText(info.remOrStartsMins, lang);

  if (info.isActive) {
    statusClass = "status-active";
    statusBadgeText =
      lang === "bn" ? "🟢 চলমান ওয়াক্ত" : lang === "ar" ? "🟢 الوقت جارٍ" : "🟢 Active Now";
    countdownLabel =
      lang === "bn"
        ? "ওয়াক্ত শেষ হতে বাকি:"
        : lang === "ar"
        ? "المتبقي لانتهاء الوقت:"
        : "Waqt Ends In:";
  } else if (info.isPassed) {
    statusClass = "status-passed";
    statusBadgeText =
      lang === "bn" ? "✓ আজ সমাপ্ত" : lang === "ar" ? "✓ انقضى اليوم" : "✓ Completed Today";
    countdownLabel =
      lang === "bn"
        ? "ওয়াক্ত শুরু হতে বাকি:"
        : lang === "ar"
        ? "يبدأ غداً بعد:"
        : "Starts Tomorrow In:";
  } else {
    statusClass = "status-upcoming";
    statusBadgeText =
      lang === "bn" ? "⏳ আসন্ন ওয়াক্ত" : lang === "ar" ? "⏳ صلاة قادمة" : "⏳ Upcoming Waqt";
    countdownLabel =
      lang === "bn"
        ? "ওয়াক্ত শুরু হতে বাকি:"
        : lang === "ar"
        ? "يتبقى على دخول الوقت:"
        : "Waqt Starts In:";
  }

  const startLbl = lang === "bn" ? "শুরু (Start)" : lang === "ar" ? "بداية الوقت" : "Starts At";
  const endLbl = lang === "bn" ? "শেষ (End)" : lang === "ar" ? "نهاية الوقت" : "Ends At";
  const primeLbl =
    lang === "bn"
      ? "✨ উত্তম সময় (আউয়াল ওয়াক্ত):"
      : lang === "ar"
      ? "✨ الوقت المختار (أول الوقت):"
      : "✨ Prime Window (Awwal Waqt):";
  const filterBtnTxt =
    lang === "bn"
      ? "এই ওয়াক্তের সুন্নাহ দেখুন ➔"
      : lang === "ar"
      ? "عرض سنن هذا الوقت ➔"
      : "Filter Phase Sunnahs ➔";

  popupWrap.innerHTML = `
    <div id="waqt-popup-arrow" class="waqt-popup-arrow"></div>
    <div class="waqt-range-popup-card">
      <div class="waqt-popup-head">
        <div class="waqt-popup-title-group">
          <div class="waqt-popup-avatar">${info.icon}</div>
          <div class="waqt-popup-title-text">
            <h4>${info.title} (${startShort} – ${endShort})</h4>
            <small>${info.subLabel}</small>
          </div>
        </div>
        <div class="waqt-popup-head-right">
          <span class="waqt-popup-status-pill ${statusClass}">${statusBadgeText}</span>
          <button type="button" id="waqt-popup-close-btn" class="waqt-popup-close-btn" aria-label="Close Waqt Popup">✕</button>
        </div>
      </div>

      <div class="waqt-popup-time-grid">
        <div class="waqt-popup-time-box start-box">
          <span class="waqt-popup-time-lbl">${startLbl}</span>
          <strong class="waqt-popup-time-val">${startClockFull}</strong>
        </div>
        <div class="waqt-popup-time-divider" aria-hidden="true">➔</div>
        <div class="waqt-popup-time-box end-box">
          <span class="waqt-popup-time-lbl">${endLbl}</span>
          <strong class="waqt-popup-time-val">${endClockFull}</strong>
        </div>
      </div>

      <div class="waqt-popup-meta-rows">
        <div class="waqt-popup-meta-item single-line-meta-row">
          <span class="meta-row-label">${primeLbl}</span>
          <strong class="meta-row-value">${info.primeRangeStr}</strong>
        </div>
        <div class="waqt-popup-meta-item single-line-meta-row countdown-single-line-row">
          <span class="meta-row-label">⏱️ ${countdownLabel}</span>
          <strong class="meta-row-value" style="color:${info.isActive ? "var(--danger, #dc2626)" : "var(--accent-emerald-dark)"};">${countdownVal}</strong>
        </div>
      </div>

      <div class="waqt-popup-sunnah-note">
        <span>${info.rakahNote}</span>
        <button type="button" class="waqt-popup-filter-btn" data-popup-filter-phase="${info.phase}">${filterBtnTxt}</button>
      </div>
    </div>
  `;

  popupWrap.classList.remove("hidden");

  document.querySelectorAll(".waqt-pill-card").forEach((btn) => {
    const isTarget = btn.getAttribute("data-waqt-id") === waqtId;
    btn.classList.toggle("waqt-popup-selected", isTarget);
    btn.setAttribute("aria-expanded", isTarget ? "true" : "false");
  });

  requestAnimationFrame(() => positionWaqtPopupArrow(waqtId));
}

function syncOpenWaqtPopupIfVisible(now = new Date()) {
  if (!activeSelectedWaqtPopupId) return;
  renderWaqtTimeRangePopup(activeSelectedWaqtPopupId, now);
}

document.addEventListener("DOMContentLoaded", () => {
  const waqtGrid = document.getElementById("five-waqt-grid");
  if (waqtGrid) {
    waqtGrid.addEventListener("click", (e) => {
      // Strictly require clicking on the `i` button itself to open/toggle the 5-Waqt popup window
      const infoBtn = e.target.closest("[data-waqt-info-btn], .waqt-info-micro-badge");
      if (!infoBtn) return;
      const pillBtn = infoBtn.closest(".waqt-pill-card[data-waqt-id]");
      const clickedId =
        infoBtn.getAttribute("data-waqt-info-btn") ||
        (pillBtn && pillBtn.getAttribute("data-waqt-id"));
      if (!clickedId) return;
      if (navigator.vibrate) navigator.vibrate(14);

      if (activeSelectedWaqtPopupId === clickedId) {
        activeSelectedWaqtPopupId = null;
        renderWaqtTimeRangePopup(null);
      } else {
        activeSelectedWaqtPopupId = clickedId;
        renderWaqtTimeRangePopup(clickedId, new Date());
        if (typeof pushAppHistoryState === "function") {
          pushAppHistoryState("waqt-popup-" + clickedId);
        }
      }
    });
  }

  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("#waqt-popup-close-btn");
    if (closeBtn) {
      activeSelectedWaqtPopupId = null;
      renderWaqtTimeRangePopup(null);
      return;
    }

    const filterBtn = e.target.closest("[data-popup-filter-phase]");
    if (filterBtn) {
      const targetPhase = filterBtn.getAttribute("data-popup-filter-phase");
      if (targetPhase) {
        activeSelectedWaqtPopupId = null;
        renderWaqtTimeRangePopup(null);
        if (typeof openMasterSection === "function") {
          openMasterSection("sec-" + targetPhase, true);
        }
      }
      return;
    }

    // Dismiss popup automatically when tapping outside the 5-Waqt card
    if (activeSelectedWaqtPopupId && !e.target.closest(".waqt-strip-card")) {
      activeSelectedWaqtPopupId = null;
      renderWaqtTimeRangePopup(null);
    }
  });

  window.addEventListener("resize", () => {
    if (activeSelectedWaqtPopupId) {
      positionWaqtPopupArrow(activeSelectedWaqtPopupId);
    }
  });
});

// ============================================================================
// STANDALONE THEME MANAGEMENT ENGINE (LIGHT / DARK PERSISTENCE & META SYNC)
// ============================================================================
const THEME_STORAGE_KEY = "SUNNAH_24_THEME_PREF_V1";

function applyAppTheme(themeMode) {
  const cleanTheme = themeMode === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", cleanTheme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, cleanTheme);
  } catch {}
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", cleanTheme === "dark" ? "#0b221a" : "#ffffff");
  }
  document.querySelectorAll("[data-theme-mode]").forEach((btn) => {
    const isSelected = btn.getAttribute("data-theme-mode") === cleanTheme;
    btn.classList.toggle("active", isSelected);
    btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
  return cleanTheme;
}

function initAppTheme() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {}
  const initialTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : document.documentElement.getAttribute("data-theme") || "light";
  return applyAppTheme(initialTheme);
}

// ============================================================================
// UNIVERSAL ASR MADHAB TOGGLE ENGINE (HANAFI 2x SHADOW <-> STANDARD/SHAFI'I 1x SHADOW)
// Replaces the header theme switch with a 1-click Asr Madhab Toggle that
// defaults to the user's Region-Matched Madhab and lets users anywhere in the
// world switch between Hanafi (Mithl-e-Thani) and Standard / Shafi'i, Maliki,
// Hanbali (Mithl-e-Awwal) with 100% real-time non-contradiction across all
// prayer strips, countdowns, Dhuhr/Asr boundaries, habits, and Evening Adhkar.
// ============================================================================
function getActiveMadhabMode(dateObj = new Date()) {
  const profile = resolveActiveRegionalProfile(dateObj);
  return profile && profile.asrShadowFactor === 1 ? "standard" : "hanafi";
}

function syncMadhabToggleUI() {
  initAppTheme();

  const activeMode = getActiveMadhabMode(new Date());
  const btnEl = document.getElementById("madhab-toggle-btn");
  const iconEl = document.getElementById("madhab-toggle-icon");
  const labelEl = document.getElementById("madhab-toggle-label");

  if (!btnEl || !iconEl || !labelEl) return;

  btnEl.setAttribute("data-madhab", activeMode);
  if (activeMode === "hanafi") {
    iconEl.textContent = "🕌";
    labelEl.setAttribute("data-i18n", "madhab_hanafi_btn");
    labelEl.textContent = t("madhab_hanafi_btn");
    btnEl.title =
      appState.locale === "ar"
        ? "المذهب الحالي للعصر: حنفي (اضغط للتبديل إلى الجمهور/الشافعي)"
        : appState.locale === "en"
        ? "Active Asr Timing: Hanafi 2x Shadow (Tap to switch to Standard/Shafi'i 1x)"
        : "চলমান আসর ওয়াক্ত: হানাফী ২ গুণ ছায়া (শাফিঈ/জমহুর ১ গুণ ছায়ায় পরিবর্তন করতে ট্যাপ করুন)";
  } else {
    iconEl.textContent = "🕋";
    labelEl.setAttribute("data-i18n", "madhab_standard_btn");
    labelEl.textContent = t("madhab_standard_btn");
    btnEl.title =
      appState.locale === "ar"
        ? "المذهب الحالي للعصر: شافعي/جمهور (اضغط للتبديل إلى الحنفي)"
        : appState.locale === "en"
        ? "Active Asr Timing: Standard/Shafi'i 1x Shadow (Tap to switch to Hanafi 2x)"
        : "চলমান আসর ওয়াক্ত: শাফিঈ/জমহুর ১ গুণ ছায়া (হানাফী ২ গুণ ছায়ায় পরিবর্তন করতে ট্যাপ করুন)";
  }
}

function applyMadhabPreference(mode, showFeedback = true) {
  const cleanMode = mode === "standard" ? "standard" : "hanafi";
  try {
    localStorage.setItem(MADHAB_STORAGE_KEY, cleanMode);
  } catch {}

  syncMadhabToggleUI();
  renderHeaderDatesAndPhase();
  renderHabits();
  renderDuas();

  if (showFeedback && typeof showTimeLockToast === "function") {
    const sched = computeSeasonalPrayerSchedule(new Date());
    const asrClock = formatMinutesToLocalizedTime(sched.asr, appState.locale);
    const baseMsg =
      cleanMode === "hanafi" ? t("madhab_hanafi_toast") : t("madhab_standard_toast");
    showTimeLockToast(`${baseMsg} (${asrClock})`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initAppTheme();
  syncMadhabToggleUI();

  document.querySelectorAll("[data-theme-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTheme = btn.getAttribute("data-theme-mode");
      applyAppTheme(targetTheme);
      if (navigator.vibrate) navigator.vibrate(12);
    });
  });

  const madhabBtn = document.getElementById("madhab-toggle-btn");
  if (madhabBtn) {
    madhabBtn.addEventListener("click", () => {
      const currentMode = getActiveMadhabMode(new Date());
      const nextMode = currentMode === "hanafi" ? "standard" : "hanafi";
      applyMadhabPreference(nextMode, true);
      if (navigator.vibrate) navigator.vibrate(14);
    });
  }

  const langSwitcher = document.getElementById("lang-switcher");
  if (langSwitcher) {
    langSwitcher.addEventListener("change", () => {
      setTimeout(() => syncMadhabToggleUI(), 20);
    });
  }
});

// ============================================================================
// FULL-BLEED STICKY MARGIN-BAR HEADER SCROLL ELEVATION GUARD
// Ensures scrolling content strictly passes underneath the solid top header bar
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.querySelector(".app-header");
  if (!headerEl) return;
  const syncHeaderScrollState = () => {
    headerEl.classList.toggle("is-scrolled", (window.scrollY || window.pageYOffset || 0) > 4);
  };
  window.addEventListener("scroll", syncHeaderScrollState, { passive: true });
  syncHeaderScrollState();
});

// ============================================================================
// INTERACTIVE BANGLADESH DIVISION → DISTRICT (ALL 64 ZILAS) → UPAZILA/THANA
// HEADER SELECTOR UI (JUST BELOW MADHAB TOGGLE) & REAL-TIME WAQT ENGINE
// - Default Location: Dhaka Division -> Dhaka District -> Dhaka ("📍 ঢাকা ▾")
// - Selecting any Division immediately loads its Districts (Zilas)
// - Selecting any District immediately loads its Upazilas/Thanas
// - Updates 5-Waqt prayer strip, live ongoing countdown, prohibited Salah windows,
//   and habit/Adhkar locks in real time.
// ============================================================================
function getDefaultDhakaSelection() {
  const divObj = BD_GEO_HIERARCHY[0]; // Dhaka Division
  const distObj = divObj.districts[0]; // Dhaka District
  const upzName = (distObj.upazilas && distObj.upazilas[0]) || "ঢাকা সদর (Dhaka)";
  return {
    divisionId: divObj.id,
    divisionName_bn: divObj.name_bn,
    divisionName_en: divObj.name_en,
    districtId: distObj.id,
    districtName_bn: distObj.name_bn,
    districtName_en: distObj.name_en,
    upazilaName: upzName,
    upazilaIndex: 0,
    lat: distObj.lat,
    lon: distObj.lon,
    isDefaultDhaka: true
  };
}

function getEffectiveBdLocationSelection() {
  const saved = getSavedBdLocationSelection();
  if (saved) return saved;
  return getDefaultDhakaSelection();
}

function getLocalizedBdDivisionName(divObj, locale = appState.locale) {
  if (!divObj) return "";
  if (locale === "ar") return divObj.name_ar || divObj.name_en;
  if (locale === "en") return divObj.name_en;
  return divObj.name_bn;
}

function getLocalizedBdDistrictName(distObj, locale = appState.locale) {
  if (!distObj) return "";
  if (locale === "en" || locale === "ar") return distObj.name_en;
  return distObj.name_bn;
}

function getLocalizedUpazilaName(rawUpazila, locale = appState.locale) {
  if (!rawUpazila) return "";
  if (locale === "en" || locale === "ar") {
    const match = rawUpazila.match(/\(([^)]+)\)/);
    return match ? match[1].trim() : rawUpazila;
  }
  return rawUpazila.replace(/\s*\([^)]*\)/g, "").trim();
}

// BD Location selector styles are loaded directly from style.css

function triggerFullWaqtAndLockRefresh(showToast = false) {
  if (typeof syncMadhabToggleUI === "function") syncMadhabToggleUI();
  renderHeaderDatesAndPhase();
  renderHabits();
  renderDuas();
  syncBdLocationBannerText();

  if (showToast && typeof showTimeLockToast === "function") {
    const activeLoc = getEffectiveBdLocationSelection();
    const sched = computeSeasonalPrayerSchedule(new Date());
    const fajrStr = formatShortWaqtClock(sched.fajr, appState.locale);
    const maghribStr = formatShortWaqtClock(sched.maghrib, appState.locale);
    const upzClean = getLocalizedUpazilaName(activeLoc.upazilaName, appState.locale);
    const msg =
      appState.locale === "ar"
        ? `📍 تم تحديث المواقيت لـ ${activeLoc.districtName_en} (${upzClean}) • الفجر: ${fajrStr} | المغرب: ${maghribStr}`
        : appState.locale === "en"
        ? `📍 Location set to ${activeLoc.districtName_en} (${upzClean}) • Fajr: ${fajrStr} | Maghrib: ${maghribStr}`
        : `📍 অবস্থান: ${activeLoc.districtName_bn} (${upzClean}) • ফজর: ${fajrStr} | মাগরিব: ${maghribStr}`;
    showTimeLockToast(msg);
  }
}

function syncBdLocationBannerText() {
  const summaryLabelEl = document.getElementById("bd-loc-active-label");
  const coordsPillEl = document.getElementById("bd-loc-coords-pill");
  const resetAutoBtn = document.getElementById("bd-loc-reset-auto-btn");
  const doneBtn = document.getElementById("bd-loc-done-btn");
  const popTitleEl = document.getElementById("bd-loc-popover-title");
  const lblDiv = document.getElementById("bd-lbl-division");
  const lblDist = document.getElementById("bd-lbl-district");
  const lblUpz = document.getElementById("bd-lbl-upazila");
  if (!summaryLabelEl) return;

  if (typeof getSavedGlobalOrBdLocation === "function") {
    const savedGlobal = getSavedGlobalOrBdLocation();
    if (savedGlobal && savedGlobal.countryCode && savedGlobal.countryCode !== "BD") {
      if (typeof updateHeaderLocationPillUI === "function") {
        updateHeaderLocationPillUI();
      }
      return;
    }
  }

  const lang = appState.locale || "bn";
  const activeLoc = getEffectiveBdLocationSelection();
  const divObj = BD_GEO_HIERARCHY.find((d) => d.id === activeLoc.divisionId) || BD_GEO_HIERARCHY[0];
  const distObj = divObj.districts.find((z) => z.id === activeLoc.districtId) || divObj.districts[0];

  const isDefaultDhaka =
    activeLoc.divisionId === "dhaka" &&
    activeLoc.districtId === "dhaka" &&
    (!activeLoc.upazilaIndex || activeLoc.upazilaIndex === 0);

  if (isDefaultDhaka) {
    summaryLabelEl.textContent =
      lang === "ar"
        ? "دكا ▾"
        : lang === "en"
        ? "Dhaka ▾"
        : "ঢাকা ▾";
  } else {
    const distShort = getLocalizedBdDistrictName(distObj, lang);
    const upzShort = getLocalizedUpazilaName(activeLoc.upazilaName, lang);
    // Keep header pill super clean and concise
    if (!upzShort || upzShort === distShort || upzShort.includes("সদর") || upzShort.toLowerCase().includes("sadar")) {
      summaryLabelEl.textContent = `${distShort} ▾`;
    } else {
      summaryLabelEl.textContent = `${upzShort}, ${distShort} ▾`;
    }
  }

  if (coordsPillEl) {
    coordsPillEl.textContent = `${localizeDigits(activeLoc.lat.toFixed(2), lang)}°N, ${localizeDigits(activeLoc.lon.toFixed(2), lang)}°E`;
  }
  if (popTitleEl) {
    popTitleEl.textContent =
      lang === "ar"
        ? " اختر الموقع (دكا افتراضياً)"
        : lang === "en"
        ? " Select Location (Dhaka Default)"
        : " অবস্থান নির্বাচন (ঢাকা ডিফল্ট)";
  }
  if (lblDiv) {
    lblDiv.textContent =
      lang === "ar" ? "القسم (Division)" : lang === "en" ? "Division" : "বিভাগ (Division)";
  }
  if (lblDist) {
    lblDist.textContent =
      lang === "ar" ? "المنطقة / المحافظة (District)" : lang === "en" ? "District (Zila)" : "জেলা (District)";
  }
  if (lblUpz) {
    lblUpz.textContent =
      lang === "ar" ? "المنطقة الفرعية (Upazila)" : lang === "en" ? "Upazila / Thana" : "উপজেলা / থানা (Upazila)";
  }
  if (resetAutoBtn) {
    resetAutoBtn.textContent =
      lang === "ar"
        ? "🔄 دكا (افتراضي)"
        : lang === "en"
        ? "🔄 Dhaka (Default)"
        : "🔄 ঢাকা (ডিফল্ট)";
  }
  if (doneBtn) {
    doneBtn.textContent =
      lang === "ar" ? "✓ تم" : lang === "en" ? "✓ Done" : "✓ সম্পন্ন";
  }
}

function initBdLocationSelectorEngine() {
  // CSS is already cleanly loaded in style.css (avoiding duplicate <style> injection)

  // Ensure default Dhaka selection is initialized if no saved location exists yet
  if (!getSavedBdLocationSelection()) {
    saveBdLocationSelection(getDefaultDhakaSelection());
  }

  const toggleBtn = document.getElementById("bd-loc-toggle-btn");
  const panelEl = document.getElementById("bd-loc-cascading-panel");
  const divSelect = document.getElementById("bd-division-select");
  const distSelect = document.getElementById("bd-district-select");
  const upzSelect = document.getElementById("bd-upazila-select");
  const resetBtn = document.getElementById("bd-loc-reset-auto-btn");
  const doneBtn = document.getElementById("bd-loc-done-btn");

  if (!divSelect || !distSelect || !upzSelect) return;

  const populateDivisions = (selectedDivId) => {
    const lang = appState.locale || "bn";
    divSelect.innerHTML = "";
    BD_GEO_HIERARCHY.forEach((div) => {
      const opt = document.createElement("option");
      opt.value = div.id;
      opt.textContent = getLocalizedBdDivisionName(div, lang);
      if (div.id === selectedDivId) opt.selected = true;
      divSelect.appendChild(opt);
    });
  };

  const populateDistricts = (divisionId, selectedDistId) => {
    const lang = appState.locale || "bn";
    const divObj = BD_GEO_HIERARCHY.find((d) => d.id === divisionId) || BD_GEO_HIERARCHY[0];
    distSelect.innerHTML = "";
    divObj.districts.forEach((dist) => {
      const opt = document.createElement("option");
      opt.value = dist.id;
      opt.textContent = getLocalizedBdDistrictName(dist, lang);
      if (dist.id === selectedDistId) opt.selected = true;
      distSelect.appendChild(opt);
    });
  };

  const populateUpazilas = (divisionId, districtId, selectedUpazila) => {
    const lang = appState.locale || "bn";
    const divObj = BD_GEO_HIERARCHY.find((d) => d.id === divisionId) || BD_GEO_HIERARCHY[0];
    const distObj = divObj.districts.find((z) => z.id === districtId) || divObj.districts[0];
    upzSelect.innerHTML = "";
    (distObj.upazilas || []).forEach((upz, idx) => {
      const opt = document.createElement("option");
      opt.value = upz;
      opt.setAttribute("data-upz-index", String(idx));
      opt.textContent = getLocalizedUpazilaName(upz, lang);
      if (selectedUpazila ? upz === selectedUpazila : idx === 0) {
        opt.selected = true;
      }
      upzSelect.appendChild(opt);
    });
  };

  const persistCurrentDropdownSelection = (showToast = true) => {
    const divId = divSelect.value;
    const distId = distSelect.value;
    const upzName = upzSelect.value;
    const upzIdx = upzSelect.selectedIndex >= 0 ? upzSelect.selectedIndex : 0;

    const divObj = BD_GEO_HIERARCHY.find((d) => d.id === divId) || BD_GEO_HIERARCHY[0];
    const distObj = divObj.districts.find((z) => z.id === distId) || divObj.districts[0];
    const coords = computeUpazilaMicroCoordinates(
      distObj,
      upzIdx,
      (distObj.upazilas || []).length
    );

    const payload = {
      divisionId: divObj.id,
      divisionName_bn: divObj.name_bn,
      divisionName_en: divObj.name_en,
      districtId: distObj.id,
      districtName_bn: distObj.name_bn,
      districtName_en: distObj.name_en,
      upazilaName: upzName || (distObj.upazilas && distObj.upazilas[0]) || distObj.name_bn,
      upazilaIndex: upzIdx,
      lat: coords.lat,
      lon: coords.lon,
      updatedAt: Date.now()
    };

    saveBdLocationSelection(payload);
    triggerFullWaqtAndLockRefresh(showToast);
  };

  const syncDropdownsFromStorage = () => {
    const activeLoc = getEffectiveBdLocationSelection();
    const defaultDivId = activeLoc.divisionId || "dhaka";
    const defaultDistId = activeLoc.districtId || "dhaka";
    const defaultUpz = activeLoc.upazilaName || "";

    populateDivisions(defaultDivId);
    populateDistricts(defaultDivId, defaultDistId);
    populateUpazilas(defaultDivId, defaultDistId, defaultUpz);
    syncBdLocationBannerText();
  };

  syncDropdownsFromStorage();
  triggerFullWaqtAndLockRefresh(false);

  const closePopover = () => {
    if (panelEl && panelEl.classList.contains("is-open")) {
      panelEl.classList.remove("is-open");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    }
  };

  if (toggleBtn && panelEl && !document.getElementById("s24-loc-modal-overlay")) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = panelEl.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (navigator.vibrate) navigator.vibrate(10);
    });
  }

  if (doneBtn) {
    doneBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closePopover();
    });
  }

  // Close popover when tapping outside
  document.addEventListener("click", (e) => {
    if (!panelEl || !panelEl.classList.contains("is-open")) return;
    const stackEl = document.getElementById("bd-loc-selector-bar");
    if (stackEl && !stackEl.contains(e.target)) {
      closePopover();
    }
  });

  // 1. Selecting a Division immediately updates the Districts under that Division and its Upazilas
  divSelect.addEventListener("change", () => {
    const newDivId = divSelect.value;
    const divObj = BD_GEO_HIERARCHY.find((d) => d.id === newDivId) || BD_GEO_HIERARCHY[0];
    const firstDistId = divObj.districts[0].id;
    populateDistricts(newDivId, firstDistId);
    populateUpazilas(newDivId, firstDistId, "");
    persistCurrentDropdownSelection(true);
  });

  // 2. Selecting a District immediately updates the Upazilas under that District
  distSelect.addEventListener("change", () => {
    const curDivId = divSelect.value;
    const newDistId = distSelect.value;
    populateUpazilas(curDivId, newDistId, "");
    persistCurrentDropdownSelection(true);
  });

  // 3. Selecting an Upazila immediately updates the micro-coordinates & prayer schedule
  upzSelect.addEventListener("change", () => {
    persistCurrentDropdownSelection(true);
  });

  // Reset button restores Dhaka Division -> Dhaka District -> Dhaka default
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const dhakaDef = getDefaultDhakaSelection();
      saveBdLocationSelection(dhakaDef);
      syncDropdownsFromStorage();
      triggerFullWaqtAndLockRefresh(true);
      closePopover();
    });
  }

  const langSwitcher = document.getElementById("lang-switcher");
  if (langSwitcher) {
    langSwitcher.addEventListener("change", () => {
      setTimeout(() => {
        const curDiv = divSelect.value;
        const curDist = distSelect.value;
        const curUpz = upzSelect.value;
        populateDivisions(curDiv);
        populateDistricts(curDiv, curDist);
        populateUpazilas(curDiv, curDist, curUpz);
        syncBdLocationBannerText();
      }, 25);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initBdLocationSelectorEngine();
});

function getSavedGlobalOrBdLocation() {
  try {
    const rawGlobal = localStorage.getItem(GLOBAL_SELECTED_LOC_STORAGE_KEY);
    if (rawGlobal) {
      const parsed = JSON.parse(rawGlobal);
      if (parsed && typeof parsed.lat === "number" && typeof parsed.lon === "number") {
        return parsed;
      }
    }
  } catch {}
  return getSavedBdLocationSelection();
}

function saveGlobalOrBdLocation(locObj) {
  try {
    localStorage.setItem(GLOBAL_SELECTED_LOC_STORAGE_KEY, JSON.stringify(locObj));
    if (locObj.countryCode === "BD") {
      saveBdLocationSelection(locObj);
    } else {
      localStorage.removeItem(BD_SELECTED_LOC_STORAGE_KEY);
    }
  } catch {}
}

function getActiveLocationShortLabel() {
  const saved = getSavedGlobalOrBdLocation();
  if (!saved) {
    return appState.locale === "en" ? "Dhaka" : appState.locale === "ar" ? "دكا" : "ঢাকা";
  }
  if (saved.countryCode === "BD") {
    if (saved.upazilaCleanBn && appState.locale === "bn") return saved.upazilaCleanBn;
    if (saved.districtNameBn && appState.locale === "bn") return saved.districtNameBn;
    return saved.districtNameEn || "Dhaka";
  }
  return saved.cityName || "Dhaka";
}

function updateHeaderLocationPillUI() {
  const labelEl = document.getElementById("bd-loc-active-label");
  if (!labelEl) return;
  const shortName = getActiveLocationShortLabel();
  labelEl.textContent = `${shortName} ▾`;
}

function initMuslimBanglaSearchLocationModal() {
  const triggerBtn = document.getElementById("bd-loc-toggle-btn");
  const overlay = document.getElementById("s24-loc-modal-overlay");
  const promptCard = document.getElementById("s24-loc-prompt-card");
  const openSearchBtn = document.getElementById("s24-loc-open-search-btn");
  const pickerCard = document.getElementById("s24-loc-picker-card");
  const closeBtn = document.getElementById("s24-loc-close-btn");
  const backBtn = document.getElementById("s24-loc-back-btn");
  const titleEl = document.getElementById("s24-loc-picker-title");
  const searchInput = document.getElementById("s24-loc-search-input");
  const listContainer = document.getElementById("s24-loc-list-container");

  if (!triggerBtn || !overlay) return;

  let currentStep = "country"; // "country" | "bd-district" | "bd-upazila" | "global-city"
  let selectedCountry = null;
  let selectedBdDistrict = null;

  updateHeaderLocationPillUI();

  function closeLocModal() {
    overlay.classList.add("hidden");
    triggerBtn.setAttribute("aria-expanded", "false");
  }

  function applyChosenLocation(locPayload) {
    saveGlobalOrBdLocation(locPayload);
    updateHeaderLocationPillUI();
    closeLocModal();
    if (typeof syncMadhabToggleUI === "function") syncMadhabToggleUI();
    renderHeaderDatesAndPhase();
    renderHabits();
    renderDuas();
    const toastName = getActiveLocationShortLabel();
    showTimeLockToast(
      appState.locale === "bn"
        ? `📍 অবস্থান সেট করা হয়েছে: ${toastName}`
        : `📍 Location updated: ${toastName}`
    );
  }

  function renderCurrentList(filterText = "") {
    const q = filterText.trim().toLowerCase();
    listContainer.innerHTML = "";

    // STEP 1: Country List (Active Country Pinned First, rest Alphabetical)
    if (currentStep === "country") {
      backBtn.classList.add("hidden");
      titleEl.textContent =
        appState.locale === "en" ? "Select Country" : appState.locale === "ar" ? "اختر الدولة" : "দেশ শনাক্ত করুন";

      const saved = getSavedGlobalOrBdLocation();
      const activeCountryCode = saved?.countryCode || "BD";

      const sortedCountries = [...GLOBAL_COUNTRIES_DIRECTORY].sort((a, b) => {
        if (a.code === activeCountryCode) return -1;
        if (b.code === activeCountryCode) return 1;
        return a.name.localeCompare(b.name);
      });

      sortedCountries
        .filter((c) => !q || c.name.toLowerCase().includes(q))
        .forEach((country) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `s24-loc-item-btn ${country.code === activeCountryCode ? "is-active-loc" : ""}`;
          btn.textContent = country.name;
          btn.addEventListener("click", () => {
            selectedCountry = country;
            searchInput.value = "";
            currentStep = country.isBangladeshSpecial ? "bd-district" : "global-city";
            renderCurrentList("");
          });
          listContainer.appendChild(btn);
        });
      return;
    }

    // STEP 2A: Bangladesh -> All 64 Districts (সকল ৬৪ জেলা)
    if (currentStep === "bd-district") {
      backBtn.classList.remove("hidden");
      titleEl.textContent = "Bangladesh";

      const allDistricts = [];
      BD_GEO_HIERARCHY.forEach((div) => {
        div.districts.forEach((dist) => {
          allDistricts.push({ ...dist, divisionId: div.id });
        });
      });

      allDistricts
        .filter((d) => !q || d.name_bn.toLowerCase().includes(q) || d.name_en.toLowerCase().includes(q))
        .forEach((dist) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "s24-loc-item-btn";
          btn.textContent = appState.locale === "en" ? dist.name_en : dist.name_bn;
          btn.addEventListener("click", () => {
            selectedBdDistrict = dist;
            searchInput.value = "";
            currentStep = "bd-upazila";
            renderCurrentList("");
          });
          listContainer.appendChild(btn);
        });
      return;
    }

    // STEP 2B: Bangladesh -> Selected District's Upazilas/Thanas
    if (currentStep === "bd-upazila" && selectedBdDistrict) {
      backBtn.classList.remove("hidden");
      titleEl.textContent = appState.locale === "en" ? selectedBdDistrict.name_en : selectedBdDistrict.name_bn;

      const upazilas = selectedBdDistrict.upazilas || [];
      upazilas
        .map((u, idx) => ({ raw: u, idx }))
        .filter((item) => !q || item.raw.toLowerCase().includes(q))
        .forEach(({ raw, idx }) => {
          const cleanBn = raw.split("(")[0].trim();
          const coords = computeUpazilaMicroCoordinates(selectedBdDistrict, idx, upazilas.length);
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "s24-loc-item-btn";
          btn.textContent = appState.locale === "en" ? raw : cleanBn;
          btn.addEventListener("click", () => {
            applyChosenLocation({
              countryCode: "BD",
              countryName: "Bangladesh",
              regionCode: "BD",
              subRegion: "SOUTH_ASIA",
              divisionId: selectedBdDistrict.divisionId,
              districtId: selectedBdDistrict.id,
              districtNameBn: selectedBdDistrict.name_bn,
              districtNameEn: selectedBdDistrict.name_en,
              upazilaRaw: raw,
              upazilaCleanBn: cleanBn,
              lat: coords.lat,
              lon: coords.lon,
              tzHours: 6.0,
              fajrAngle: 18.0,
              ishaAngle: 18.0,
              ishaFixedMins: 0,
              asrShadowFactor: 2
            });
          });
          listContainer.appendChild(btn);
        });
      return;
    }

    // STEP 2C: Global Country -> Cities
    if (currentStep === "global-city" && selectedCountry) {
      backBtn.classList.remove("hidden");
      titleEl.textContent = selectedCountry.name;

      (selectedCountry.cities || [])
        .filter((city) => !q || city.name.toLowerCase().includes(q))
        .forEach((city) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "s24-loc-item-btn";
          btn.textContent = city.name;
          btn.addEventListener("click", () => {
            applyChosenLocation({
              countryCode: selectedCountry.code,
              countryName: selectedCountry.name,
              cityName: city.name,
              regionCode: selectedCountry.regionCode,
              subRegion: selectedCountry.subRegion,
              lat: city.lat,
              lon: city.lon,
              tzHours: typeof city.tzHours === "number" ? city.tzHours : selectedCountry.tzHours,
              fajrAngle: selectedCountry.fajrAngle,
              ishaAngle: selectedCountry.ishaAngle,
              ishaFixedMins: selectedCountry.ishaFixedMins,
              asrShadowFactor: selectedCountry.asrShadowFactor
            });
          });
          listContainer.appendChild(btn);
        });
    }
  }

  // 1. Clicking Header Pill opens the "অবস্থান অনুসন্ধান করুন" prompt card with localized labels
  triggerBtn.addEventListener("click", () => {
    const mainTxtEl = document.getElementById("s24-loc-trigger-main-text");
    const subTxtEl = document.getElementById("s24-loc-trigger-sub-text");
    if (mainTxtEl) {
      mainTxtEl.textContent =
        appState.locale === "ar"
          ? "ابحث عن الموقع"
          : appState.locale === "en"
          ? "Search Location"
          : "অবস্থান অনুসন্ধান করুন";
    }
    if (subTxtEl) {
      subTxtEl.textContent =
        appState.locale === "ar"
          ? "اضغط هنا لتغيير الدولة أو المدينة أو المنطقة"
          : appState.locale === "en"
          ? "Tap here to select your Country, City, District or Upazila"
          : "দেশ, জেলা বা উপজেলা পরিবর্তন করতে এখানে ট্যাপ করুন";
    }
    if (promptCard) promptCard.classList.remove("hidden");
    pickerCard.classList.add("hidden");
    overlay.classList.remove("hidden");
    triggerBtn.setAttribute("aria-expanded", "true");
    if (typeof pushAppHistoryState === "function") pushAppHistoryState("loc-modal");
  });

  // 2. Clicking "অবস্থান অনুসন্ধান করুন" opens the Country/City/District Picker
  if (openSearchBtn) {
    openSearchBtn.addEventListener("click", () => {
      promptCard.classList.add("hidden");
      pickerCard.classList.remove("hidden");
      currentStep = "country";
      searchInput.value = "";
      renderCurrentList("");
      setTimeout(() => searchInput.focus(), 80);
    });
  }

  // 3. Back Button inside Picker Header
  backBtn.addEventListener("click", () => {
    searchInput.value = "";
    if (currentStep === "bd-upazila") {
      currentStep = "bd-district";
    } else {
      currentStep = "country";
    }
    renderCurrentList("");
  });

  // 4. Live Search Filter
  searchInput.addEventListener("input", (e) => {
    renderCurrentList(e.target.value);
  });

  // 5. Close Modal on ✕ or Backdrop Tap
  closeBtn.addEventListener("click", closeLocModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLocModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMuslimBanglaSearchLocationModal();
});

// ============================================================================
// GOOGLE MATERIAL 3 FULL-SCREEN MASTER SECTION & EXTENSIBLE HUB ENGINE (v5.0)
// - Elevates each of the 7 Prophetic Phases + separated Adhkar, Digital Tasbih,
//   and Vault & Info into independent Full-Screen Master Sections.
// - Hides #home-dashboard-view completely when any section is opened so the
//   clicked section is the 100% full-screen master view.
// - Provides Back-to-Home button & hardware back-key integration.
// - Exposes window.Sunnah24SectionEngine for registering future independent
//   sections or sub-sections dynamically.
// ============================================================================

const MASTER_SECTION_REGISTRY = {
  "sec-tahajjud_fajr": {
    id: "sec-tahajjud_fajr",
    type: "habit-phase",
    phaseKey: "tahajjud_fajr",
    titleKey: "phase_tahajjud",
    descKey: "desc_tahajjud",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hdr_sec_tahajjud_fajr_tfSky" x1="12" y1="8" x2="84" y2="88" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#0f172a"/> <stop offset="55%" stop-color="#1e1b4b"/> <stop offset="100%" stop-color="#311042"/> </linearGradient> <radialGradient id="hdr_sec_tahajjud_fajr_tfGlow" cx="65%" cy="28%" r="45%"> <stop offset="0%" stop-color="#fde047" stop-opacity="0.55"/> <stop offset="100%" stop-color="#fde047" stop-opacity="0"/> </radialGradient> <linearGradient id="hdr_sec_tahajjud_fajr_tfMoon" x1="48" y1="18" x2="72" y2="44" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="50%" stop-color="#facc15"/> <stop offset="100%" stop-color="#ca8a04"/> </linearGradient> <linearGradient id="hdr_sec_tahajjud_fajr_tfDome" x1="26" y1="42" x2="70" y2="84" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#34d399"/> <stop offset="55%" stop-color="#059669"/> <stop offset="100%" stop-color="#064e3b"/> </linearGradient> <linearGradient id="hdr_sec_tahajjud_fajr_tfArch" x1="48" y1="6" x2="48" y2="90" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fbbf24"/> <stop offset="100%" stop-color="#92400e"/> </linearGradient> </defs> <g> <path d="M18 84V42C18 22 32 10 48 10C64 10 78 22 78 42V84H18Z" fill="url(#hdr_sec_tahajjud_fajr_tfSky)" stroke="url(#hdr_sec_tahajjud_fajr_tfArch)" stroke-width="3.2"/> <path d="M18 84V42C18 22 32 10 48 10C64 10 78 22 78 42V84H18Z" fill="url(#hdr_sec_tahajjud_fajr_tfGlow)"/> <path d="M56 21C50.5 23.2 48 29.5 50.2 35C52.4 40.5 58.7 43 64.2 40.8C59.8 44.2 53.4 44 49.2 39.8C45 35.6 44.8 29.2 48.2 24.8C50.3 22.1 53.1 20.9 56 21Z" fill="url(#hdr_sec_tahajjud_fajr_tfMoon)"/> <circle cx="33" cy="27" r="2" fill="#fef08a"/> <circle cx="28" cy="39" r="1.4" fill="#fde047"/> <circle cx="65" cy="23" r="1.5" fill="#fef08a"/> <ellipse cx="48" cy="74" rx="26" ry="10" fill="#f59e0b" fill-opacity="0.28"/> <path d="M27 72C27 59 36.4 50 48 50C59.6 50 69 59 69 72V82.5H27V72Z" fill="url(#hdr_sec_tahajjud_fajr_tfDome)"/> <path d="M48 43V50" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/> <path d="M41 82.5V70C41 66.1 44.1 63 48 63C51.9 63 55 66.1 55 70V82.5H41Z" fill="url(#hdr_sec_tahajjud_fajr_tfMoon)"/> <rect x="14" y="81" width="68" height="6" rx="3" fill="url(#hdr_sec_tahajjud_fajr_tfArch)"/> </g> </svg>`
  },
  "sec-duha_work": {
    id: "sec-duha_work",
    type: "habit-phase",
    phaseKey: "duha_work",
    titleKey: "phase_duha",
    descKey: "desc_duha",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <radialGradient id="hdr_sec_duha_work_dwSun" cx="38%" cy="35%" r="65%"> <stop offset="0%" stop-color="#fef9c3"/> <stop offset="45%" stop-color="#facc15"/> <stop offset="100%" stop-color="#ea580c"/> </radialGradient> <linearGradient id="hdr_sec_duha_work_dwCase" x1="16" y1="42" x2="80" y2="86" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#10b981"/> <stop offset="55%" stop-color="#047857"/> <stop offset="100%" stop-color="#064e3b"/> </linearGradient> <linearGradient id="hdr_sec_duha_work_dwFlap" x1="16" y1="40" x2="80" y2="64" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#34d399"/> <stop offset="100%" stop-color="#059669"/> </linearGradient> <linearGradient id="hdr_sec_duha_work_dwGold" x1="40" y1="54" x2="56" y2="68" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="100%" stop-color="#d97706"/> </linearGradient> </defs> <g> <circle cx="48" cy="28" r="16" fill="#fde047" fill-opacity="0.25"/> <path d="M48 7V12M48 44V48M27 28H32M64 28H69M33.2 13.2L36.8 16.8M59.2 39.2L62.8 42.8M62.8 13.2L59.2 16.8M36.8 39.2L33.2 42.8" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/> <circle cx="48" cy="28" r="12.5" fill="url(#hdr_sec_duha_work_dwSun)"/> <path d="M37 44V39C37 36.2 39.2 34 42 34H54C56.8 34 59 36.2 59 39V44" stroke="#065f46" stroke-width="4" stroke-linecap="round"/> <rect x="16" y="43" width="64" height="41" rx="9" fill="url(#hdr_sec_duha_work_dwCase)"/> <path d="M16 52C16 47 20 43 25 43H71C76 43 80 47 80 52V58C80 61 77 63 74 63H22C19 63 16 61 16 58V52Z" fill="url(#hdr_sec_duha_work_dwFlap)"/> <path d="M23 47H73" stroke="#a7f3d0" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.6"/> <rect x="41" y="56" width="14" height="11" rx="3.5" fill="url(#hdr_sec_duha_work_dwGold)" stroke="#064e3b" stroke-width="1.5"/> </g> </svg>`
  },
  "sec-dhuhr_asr": {
    id: "sec-dhuhr_asr",
    type: "habit-phase",
    phaseKey: "dhuhr_asr",
    titleKey: "phase_dhuhr",
    descKey: "desc_dhuhr",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hdr_sec_dhuhr_asr_daClockBg" x1="28" y1="24" x2="84" y2="84" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#e0f2fe"/> <stop offset="55%" stop-color="#7dd3fc"/> <stop offset="100%" stop-color="#0284c7"/> </linearGradient> <linearGradient id="hdr_sec_dhuhr_asr_daClockRim" x1="26" y1="22" x2="86" y2="86" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#38bdf8"/> <stop offset="100%" stop-color="#0369a1"/> </linearGradient> <linearGradient id="hdr_sec_dhuhr_asr_daMosque" x1="10" y1="14" x2="48" y2="56" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#34d399"/> <stop offset="100%" stop-color="#047857"/> </linearGradient> <radialGradient id="hdr_sec_dhuhr_asr_daSun" cx="35%" cy="35%" r="65%"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="100%" stop-color="#d97706"/> </radialGradient> </defs> <g> <circle cx="55" cy="54" r="29" fill="url(#hdr_sec_dhuhr_asr_daClockRim)"/> <circle cx="55" cy="54" r="24" fill="url(#hdr_sec_dhuhr_asr_daClockBg)"/> <circle cx="55" cy="54" r="20" fill="#f0f9ff"/> <circle cx="55" cy="38" r="1.8" fill="#0369a1"/> <circle cx="71" cy="54" r="1.8" fill="#0369a1"/> <circle cx="55" cy="70" r="1.8" fill="#0369a1"/> <circle cx="39" cy="54" r="1.8" fill="#0369a1"/> <path d="M55 42V54L64 59" stroke="#0284c7" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/> <circle cx="55" cy="54" r="3" fill="#f59e0b"/> <circle cx="28" cy="31" r="18" fill="#ffffff" stroke="#10b981" stroke-width="2.5"/> <path d="M16 41V31C16 24.4 21.4 19 28 19C34.6 19 40 24.4 40 31V41H16Z" fill="url(#hdr_sec_dhuhr_asr_daMosque)"/> <path d="M28 14V19" stroke="#d97706" stroke-width="2.2" stroke-linecap="round"/> <rect x="24.5" y="32" width="7" height="9" rx="3.5" fill="url(#hdr_sec_dhuhr_asr_daSun)"/> <circle cx="75" cy="23" r="9.5" fill="url(#hdr_sec_dhuhr_asr_daSun)" stroke="#ffffff" stroke-width="2"/> </g> </svg>`
  },
  "sec-maghrib_isha": {
    id: "sec-maghrib_isha",
    type: "habit-phase",
    phaseKey: "maghrib_isha",
    titleKey: "phase_maghrib",
    descKey: "desc_maghrib",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hdr_sec_maghrib_isha_miSky" x1="16" y1="10" x2="80" y2="62" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#3b0764"/> <stop offset="50%" stop-color="#7e22ce"/> <stop offset="100%" stop-color="#f97316"/> </linearGradient> <radialGradient id="hdr_sec_maghrib_isha_miSun" cx="50%" cy="40%" r="55%"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="55%" stop-color="#fb923c"/> <stop offset="100%" stop-color="#dc2626"/> </radialGradient> <linearGradient id="hdr_sec_maghrib_isha_miPages" x1="18" y1="44" x2="78" y2="74" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fffbeb"/> <stop offset="100%" stop-color="#fde68a"/> </linearGradient> <linearGradient id="hdr_sec_maghrib_isha_miWood" x1="24" y1="66" x2="72" y2="88" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#d97706"/> <stop offset="100%" stop-color="#78350f"/> </linearGradient> </defs> <g> <rect x="16" y="12" width="64" height="48" rx="16" fill="url(#hdr_sec_maghrib_isha_miSky)"/> <circle cx="48" cy="40" r="14" fill="url(#hdr_sec_maghrib_isha_miSun)"/> <path d="M65 18C61.8 19.4 60.4 23 61.8 26.2C63.2 29.4 66.8 30.8 70 29.4C67.4 31.4 63.6 31.2 61.2 28.8C58.8 26.4 58.6 22.6 60.6 20C61.8 18.5 63.4 17.9 65 18Z" fill="#fef08a"/> <circle cx="30" cy="23" r="1.6" fill="#fef08a"/> <path d="M18 46L48 53L78 46V68L48 75L18 68V46Z" fill="url(#hdr_sec_maghrib_isha_miPages)" stroke="#92400e" stroke-width="2.2" stroke-linejoin="round"/> <path d="M48 53V75" stroke="#b45309" stroke-width="2.2"/> <path d="M25 53L42 57M25 59L42 63M71 53L54 57M71 59L54 63" stroke="#d97706" stroke-width="2" stroke-linecap="round"/> <path d="M26 86L48 73L70 86M34 75L48 83L62 75" stroke="url(#hdr_sec_maghrib_isha_miWood)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/> </g> </svg>`
  },
  "sec-sleep_sunnah": {
    id: "sec-sleep_sunnah",
    type: "habit-phase",
    phaseKey: "sleep_sunnah",
    titleKey: "phase_sleep",
    descKey: "desc_sleep",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hdr_sec_sleep_sunnah_slNight" x1="16" y1="10" x2="80" y2="56" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#0f172a"/> <stop offset="100%" stop-color="#1e3a8a"/> </linearGradient> <linearGradient id="hdr_sec_sleep_sunnah_slBlanket" x1="36" y1="52" x2="82" y2="80" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#2dd4bf"/> <stop offset="55%" stop-color="#0d9488"/> <stop offset="100%" stop-color="#115e59"/> </linearGradient> <linearGradient id="hdr_sec_sleep_sunnah_slWood" x1="12" y1="38" x2="84" y2="86" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#b45309"/> <stop offset="100%" stop-color="#78350f"/> </linearGradient> </defs> <g> <circle cx="56" cy="28" r="18" fill="url(#hdr_sec_sleep_sunnah_slNight)"/> <path d="M58 16C53.2 18 51 23.5 53 28.2C55 33 60.5 35.2 65.2 33.2C61.4 36.2 55.8 36 52.2 32.4C48.6 28.8 48.4 23.2 51.4 19.4C53.2 17.1 55.6 16 58 16Z" fill="#fde047"/> <circle cx="45" cy="22" r="1.6" fill="#fef08a"/> <path d="M22 22H29L22 30H29M33 14H38L33 20H38" stroke="#0d9488" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M14 40V82M82 50V82" stroke="url(#hdr_sec_sleep_sunnah_slWood)" stroke-width="5" stroke-linecap="round"/> <rect x="19" y="46" width="21" height="12" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.8"/> <rect x="14" y="56" width="68" height="16" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.8"/> <path d="M38 56H76C79.3 56 82 58.7 82 62V72H38V56Z" fill="url(#hdr_sec_sleep_sunnah_slBlanket)"/> <path d="M12 72H84" stroke="url(#hdr_sec_sleep_sunnah_slWood)" stroke-width="4.5" stroke-linecap="round"/> </g> </svg>`
  },
  "sec-diet_hygiene": {
    id: "sec-diet_hygiene",
    type: "habit-phase",
    phaseKey: "diet_hygiene",
    titleKey: "phase_diet",
    descKey: "desc_diet",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hdr_sec_diet_hygiene_dhHoney" x1="22" y1="28" x2="64" y2="84" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fde047"/> <stop offset="45%" stop-color="#f59e0b"/> <stop offset="100%" stop-color="#b45309"/> </linearGradient> <linearGradient id="hdr_sec_diet_hygiene_dhLid" x1="26" y1="16" x2="60" y2="26" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#d97706"/> <stop offset="100%" stop-color="#78350f"/> </linearGradient> <linearGradient id="hdr_sec_diet_hygiene_dhWater" x1="62" y1="42" x2="84" y2="78" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#7dd3fc"/> <stop offset="55%" stop-color="#0ea5e9"/> <stop offset="100%" stop-color="#0369a1"/> </linearGradient> </defs> <g> <rect x="27" y="16" width="32" height="9" rx="4" fill="url(#hdr_sec_diet_hygiene_dhLid)"/> <path d="M22 33C22 28.6 25.6 25 30 25H56C60.4 25 64 28.6 64 33V74C64 79.5 59.5 84 54 84H32C26.5 84 22 79.5 22 74V33Z" fill="url(#hdr_sec_diet_hygiene_dhHoney)"/> <path d="M27 33V72" stroke="#fef9c3" stroke-width="3" stroke-linecap="round" stroke-opacity="0.65"/> <rect x="29" y="43" width="28" height="24" rx="5" fill="#fffbeb" stroke="#b45309" stroke-width="1.5"/> <path d="M43 47C48 51 50 55 50 58.5C50 62.4 46.9 65.5 43 65.5C39.1 65.5 36 62.4 36 58.5C36 55 38 51 43 47Z" fill="#10b981"/> <path d="M73 42C79 50 83 56 83 61.5C83 67 78.5 71.5 73 71.5C67.5 71.5 63 67 63 61.5C63 56 67 50 73 42Z" fill="url(#hdr_sec_diet_hygiene_dhWater)" stroke="#ffffff" stroke-width="2"/> </g> </svg>`
  },
  "sec-character_social": {
    id: "sec-character_social",
    type: "habit-phase",
    phaseKey: "character_social",
    titleKey: "phase_character",
    descKey: "desc_character",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hdr_sec_character_social_csHand" x1="20" y1="14" x2="58" y2="32" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fde68a"/> <stop offset="100%" stop-color="#f59e0b"/> </linearGradient> <radialGradient id="hdr_sec_character_social_csCoin" cx="35%" cy="35%" r="65%"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="55%" stop-color="#facc15"/> <stop offset="100%" stop-color="#ca8a04"/> </linearGradient> <linearGradient id="hdr_sec_character_social_csBox" x1="18" y1="52" x2="78" y2="86" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#34d399"/> <stop offset="55%" stop-color="#059669"/> <stop offset="100%" stop-color="#064e3b"/> </linearGradient> <linearGradient id="hdr_sec_character_social_csHeart" x1="38" y1="60" x2="58" y2="80" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fb7185"/> <stop offset="100%" stop-color="#e11d48"/> </linearGradient> </defs> <g> <path d="M22 16H46C50.4 16 54 19.6 54 24V26H30C25.6 26 22 22.4 22 18V16Z" fill="url(#hdr_sec_character_social_csHand)"/> <rect x="14" y="14" width="10" height="14" rx="3" fill="#059669"/> <circle cx="48" cy="39" r="10.5" fill="url(#hdr_sec_character_social_csCoin)" stroke="#92400e" stroke-width="1.6"/> <path d="M48 33.5V44.5M44 39H52" stroke="#78350f" stroke-width="2.2" stroke-linecap="round"/> <rect x="18" y="53" width="60" height="31" rx="8" fill="url(#hdr_sec_character_social_csBox)"/> <rect x="15" y="49" width="66" height="7" rx="3.5" fill="#fbbf24"/> <rect x="37" y="51" width="22" height="3.5" rx="1.7" fill="#064e3b"/> <path d="M48 78.5C48 78.5 36.5 71.5 36.5 64C36.5 60.4 39.4 57.5 43 57.5C45.2 57.5 47.1 58.6 48 60.3C48.9 58.6 50.8 57.5 53 57.5C56.6 57.5 59.5 60.4 59.5 64C59.5 71.5 48 78.5 48 78.5Z" fill="url(#hdr_sec_character_social_csHeart)" stroke="#ffffff" stroke-width="1.5"/> </g> </svg>`
  },
  "sec-adhkar": {
    id: "sec-adhkar",
    type: "standalone",
    panelId: "sec-adhkar",
    titleKey: "sec_adhkar_title",
    descKey: "sec_adhkar_desc",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <radialGradient id="hdr_sec_adhkar_adHalo" cx="50%" cy="35%" r="50%"> <stop offset="0%" stop-color="#fde047" stop-opacity="0.45"/> <stop offset="100%" stop-color="#10b981" stop-opacity="0"/> </radialGradient> <linearGradient id="hdr_sec_adhkar_adSkin" x1="18" y1="24" x2="78" y2="74" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="50%" stop-color="#fcd34d"/> <stop offset="100%" stop-color="#d97706"/> </linearGradient> <linearGradient id="hdr_sec_adhkar_adCuff" x1="20" y1="70" x2="76" y2="86" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#10b981"/> <stop offset="100%" stop-color="#065f46"/> </linearGradient> </defs> <g> <circle cx="48" cy="42" r="34" fill="url(#hdr_sec_adhkar_adHalo)"/> <path d="M48 11V18M34 15L37 21M62 15L59 21" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/> <path d="M20 48V33C20 30.8 21.8 29 24 29C26.2 29 28 30.8 28 33V43V28C28 25.8 29.8 24 32 24C34.2 24 36 25.8 36 28V43V31C36 28.8 37.8 27 40 27C42.2 27 44 28.8 44 31V62C44 68.6 38.6 74 32 74H30C24.5 74 20 69.5 20 64V48Z" fill="url(#hdr_sec_adhkar_adSkin)" stroke="#78350f" stroke-width="1.8" stroke-linejoin="round"/> <path d="M76 48V33C76 30.8 74.2 29 72 29C69.8 29 68 30.8 68 33V43V28C68 25.8 66.2 24 64 24C61.8 24 60 25.8 60 28V43V31C60 28.8 58.2 27 56 27C53.8 27 52 28.8 52 31V62C52 68.6 57.4 74 64 74H66C71.5 74 76 69.5 76 64V48Z" fill="url(#hdr_sec_adhkar_adSkin)" stroke="#78350f" stroke-width="1.8" stroke-linejoin="round"/> <rect x="21" y="71" width="22" height="11" rx="4" fill="url(#hdr_sec_adhkar_adCuff)"/> <rect x="53" y="71" width="22" height="11" rx="4" fill="url(#hdr_sec_adhkar_adCuff)"/> </g> </svg>`
  },
  "sec-tasbih": {
    id: "sec-tasbih",
    type: "standalone",
    panelId: "sec-tasbih",
    titleKey: "sec_tasbih_title",
    descKey: "sec_tasbih_desc",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <radialGradient id="hdr_sec_tasbih_tbBead" cx="35%" cy="30%" r="65%"> <stop offset="0%" stop-color="#6ee7b7"/> <stop offset="50%" stop-color="#10b981"/> <stop offset="100%" stop-color="#064e3b"/> </radialGradient> <radialGradient id="hdr_sec_tasbih_tbGoldBead" cx="35%" cy="30%" r="65%"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="55%" stop-color="#facc15"/> <stop offset="100%" stop-color="#b45309"/> </radialGradient> <linearGradient id="hdr_sec_tasbih_tbHand" x1="36" y1="22" x2="76" y2="46" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fde68a"/> <stop offset="100%" stop-color="#d97706"/> </linearGradient> </defs> <g> <path d="M38 26H66C70.4 26 74 29.6 74 34V40C74 44.4 70.4 48 66 48H42L32 41V32C32 28.7 34.7 26 38 26Z" fill="url(#hdr_sec_tasbih_tbHand)" stroke="#78350f" stroke-width="1.8" stroke-linejoin="round"/> <rect x="68" y="24" width="13" height="26" rx="4" fill="#059669"/> <circle cx="32" cy="36" r="5.5" fill="url(#hdr_sec_tasbih_tbGoldBead)"/> <circle cx="24" cy="43" r="5.2" fill="url(#hdr_sec_tasbih_tbBead)"/> <circle cx="20" cy="53" r="5.2" fill="url(#hdr_sec_tasbih_tbBead)"/> <circle cx="22" cy="64" r="5.2" fill="url(#hdr_sec_tasbih_tbBead)"/> <circle cx="30" cy="72" r="5.2" fill="url(#hdr_sec_tasbih_tbBead)"/> <circle cx="41" cy="75" r="5.5" fill="url(#hdr_sec_tasbih_tbGoldBead)"/> <circle cx="51" cy="70" r="5.2" fill="url(#hdr_sec_tasbih_tbBead)"/> <circle cx="56" cy="60" r="5.2" fill="url(#hdr_sec_tasbih_tbBead)"/> <circle cx="54" cy="49" r="5.2" fill="url(#hdr_sec_tasbih_tbBead)"/> <path d="M41 80V88M36 88H46" stroke="#b45309" stroke-width="3.6" stroke-linecap="round"/> </g> </svg>`
  },
  "sec-vault": {
    id: "sec-vault",
    type: "standalone",
    panelId: "tab-vault",
    titleKey: "tab_vault",
    descKey: "sec_vault_desc",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hdr_sec_vault_vtBoard" x1="16" y1="14" x2="68" y2="84" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#ffffff"/> <stop offset="100%" stop-color="#e2e8f0"/> </linearGradient> <linearGradient id="hdr_sec_vault_vtShield" x1="48" y1="38" x2="84" y2="86" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="50%" stop-color="#facc15"/> <stop offset="100%" stop-color="#b45309"/> </linearGradient> <linearGradient id="hdr_sec_vault_vtClip" x1="30" y1="10" x2="54" y2="24" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#34d399"/> <stop offset="100%" stop-color="#047857"/> </linearGradient> </defs> <g> <rect x="16" y="16" width="50" height="66" rx="8" fill="url(#hdr_sec_vault_vtBoard)" stroke="#059669" stroke-width="2.4"/> <rect x="30" y="10" width="22" height="11" rx="4" fill="url(#hdr_sec_vault_vtClip)"/> <rect x="24" y="30" width="9" height="9" rx="2.5" fill="#10b981"/> <rect x="37" y="32" width="21" height="5" rx="2.5" fill="#059669"/> <rect x="24" y="45" width="9" height="9" rx="2.5" fill="#10b981"/> <rect x="37" y="47" width="16" height="5" rx="2.5" fill="#0ea5e9"/> <rect x="24" y="60" width="9" height="9" rx="2.5" fill="#f59e0b"/> <rect x="37" y="62" width="12" height="5" rx="2.5" fill="#d97706"/> <path d="M66 42L84 49V62C84 74 76.2 83.5 66 87C55.8 83.5 48 74 48 62V49L66 42Z" fill="url(#hdr_sec_vault_vtShield)" stroke="#78350f" stroke-width="2" stroke-linejoin="round"/> <path d="M59.5 64L64 68.5L73.5 59" stroke="#064e3b" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/> </g> </svg>`
  },
  "sec-custom_habit": {
    id: "sec-custom_habit",
    type: "standalone",
    panelId: "sec-custom_habit",
    titleKey: "sec_custom_habit_short",
    descKey: "sec_custom_habit_desc",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hdr_sec_custom_chScroll" x1="16" y1="14" x2="68" y2="84" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fffbeb"/> <stop offset="55%" stop-color="#fef3c7"/> <stop offset="100%" stop-color="#fde68a"/> </linearGradient> <linearGradient id="hdr_sec_custom_chBorder" x1="16" y1="12" x2="72" y2="86" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#f59e0b"/> <stop offset="100%" stop-color="#92400e"/> </linearGradient> <radialGradient id="hdr_sec_custom_chPlusOrb" cx="35%" cy="30%" r="68%"> <stop offset="0%" stop-color="#6ee7b7"/> <stop offset="50%" stop-color="#10b981"/> <stop offset="100%" stop-color="#047857"/> </radialGradient> <linearGradient id="hdr_sec_custom_chQuill" x1="48" y1="10" x2="84" y2="48" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="50%" stop-color="#f59e0b"/> <stop offset="100%" stop-color="#b45309"/> </linearGradient> </defs> <g> <rect x="16" y="15" width="50" height="66" rx="10" fill="url(#hdr_sec_custom_chScroll)" stroke="url(#hdr_sec_custom_chBorder)" stroke-width="2.4"/> <path d="M25 29H46" stroke="#b45309" stroke-width="3" stroke-linecap="round"/> <path d="M25 40H54" stroke="#d97706" stroke-width="2.6" stroke-linecap="round"/> <path d="M25 50H48" stroke="#d97706" stroke-width="2.6" stroke-linecap="round"/> <path d="M25 60H40" stroke="#10b981" stroke-width="2.6" stroke-linecap="round"/> <path d="M74 14C64 16 55 25 52 36L48 44L56 40C67 37 76 28 78 18L74 14Z" fill="url(#hdr_sec_custom_chQuill)" stroke="#78350f" stroke-width="1.6" stroke-linejoin="round"/> <circle cx="65" cy="65" r="18" fill="url(#hdr_sec_custom_chPlusOrb)" stroke="#ffffff" stroke-width="2.5"/> <path d="M65 56.5V73.5M56.5 65H73.5" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round"/> </g> </svg>`
  },
  "sec-crypto_vault": {
    id: "sec-crypto_vault",
    type: "standalone",
    panelId: "sec-crypto_vault",
    titleKey: "sec_crypto_vault_short",
    descKey: "sec_crypto_vault_desc",
    logoHtml: `<svg viewBox="0 0 96 96" width="52" height="52" style="filter:drop-shadow(0 4px 6px rgba(15,23,42,0.24));display:block;" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hdr_sec_crypto_cvLayer3" x1="16" y1="54" x2="80" y2="84" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#0f172a"/> <stop offset="100%" stop-color="#1e293b"/> </linearGradient> <linearGradient id="hdr_sec_crypto_cvLayer2" x1="16" y1="36" x2="80" y2="66" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#047857"/> <stop offset="100%" stop-color="#064e3b"/> </linearGradient> <linearGradient id="hdr_sec_crypto_cvLayer1" x1="16" y1="18" x2="80" y2="48" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#34d399"/> <stop offset="100%" stop-color="#059669"/> </linearGradient> <linearGradient id="hdr_sec_crypto_cvShield" x1="38" y1="28" x2="84" y2="86" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="#fef08a"/> <stop offset="50%" stop-color="#facc15"/> <stop offset="100%" stop-color="#b45309"/> </linearGradient> </defs> <g> <rect x="14" y="56" width="54" height="18" rx="6" fill="url(#hdr_sec_crypto_cvLayer3)" stroke="#475569" stroke-width="1.6"/> <circle cx="24" cy="65" r="2.5" fill="#38bdf8"/> <rect x="14" y="37" width="54" height="18" rx="6" fill="url(#hdr_sec_crypto_cvLayer2)" stroke="#10b981" stroke-width="1.6"/> <circle cx="24" cy="46" r="2.5" fill="#fde047"/> <rect x="14" y="18" width="54" height="18" rx="6" fill="url(#hdr_sec_crypto_cvLayer1)" stroke="#a7f3d0" stroke-width="1.6"/> <circle cx="24" cy="27" r="2.5" fill="#ffffff"/> <path d="M62 32L84 40.5V56.5C84 70.5 74.6 81.5 62 86C49.4 81.5 40 70.5 40 56.5V40.5L62 32Z" fill="url(#hdr_sec_crypto_cvShield)" stroke="#78350f" stroke-width="2.2" stroke-linejoin="round"/> <rect x="54.5" y="54" width="15" height="13" rx="3.2" fill="#064e3b"/> <path d="M57.5 54V50C57.5 47.5 59.5 45.5 62 45.5C64.5 45.5 66.5 47.5 66.5 50V54" stroke="#064e3b" stroke-width="3" stroke-linecap="round"/> <circle cx="62" cy="60.5" r="2" fill="#fef08a"/> </g> </svg>`
  }
};

function applyCornerPillState(badgeEl, doneCount, totalCount) {
  if (!badgeEl) return;
  badgeEl.classList.remove(
    "pill-state-zero",
    "pill-state-progress",
    "pill-state-complete",
    "pill-state-utility"
  );
  const parentCard = badgeEl.closest(".section-launcher-card");
  if (parentCard) parentCard.classList.remove("card-state-complete");

  if (totalCount > 0 && doneCount >= totalCount) {
    badgeEl.classList.add("pill-state-complete");
    if (parentCard) parentCard.classList.add("card-state-complete");
  } else if (doneCount > 0) {
    badgeEl.classList.add("pill-state-progress");
  } else {
    badgeEl.classList.add("pill-state-zero");
  }
}

function syncMasterSectionsLiveProgress() {
  const now = new Date();
  const lang = appState.locale || "bn";
  const allHabits = getAllHabits();
  const phaseKeys = [
    "tahajjud_fajr",
    "duha_work",
    "dhuhr_asr",
    "maghrib_isha",
    "sleep_sunnah",
    "diet_hygiene",
    "character_social"
  ];

  let totalHabitsAllPhases = 0;
  let totalDoneAllPhases = 0;

  phaseKeys.forEach((pKey) => {
    const phaseHabits = allHabits.filter((h) => h.phase === pKey);
    const total = phaseHabits.length;
    const done = phaseHabits.filter((h) => isHabitCompletedInActiveCycle(h, now)).length;
    totalHabitsAllPhases += total;
    totalDoneAllPhases += done;

    const badgeEl = document.getElementById(`badge-count-${pKey}`);
    if (badgeEl) {
      const doneStr = localizeDigits(done, lang);
      const totalStr = localizeDigits(total, lang);
      badgeEl.textContent =
        total > 0 && done >= total ? `✓ ${doneStr}/${totalStr}` : `${doneStr}/${totalStr}`;
      applyCornerPillState(badgeEl, done, total);
    }
  });

  // Sync Unified Hub Header Summary Pill ("১২/৩২ সুন্নাহ সম্পন্ন")
  const hubSummaryPillEl = document.getElementById("sections-hub-summary-pill");
  if (hubSummaryPillEl) {
    const doneAllStr = localizeDigits(totalDoneAllPhases, lang);
    const totalAllStr = localizeDigits(totalHabitsAllPhases, lang);
    const isAllComplete = totalHabitsAllPhases > 0 && totalDoneAllPhases >= totalHabitsAllPhases;
    const checkPrefix = isAllComplete ? "✓ " : "";
    hubSummaryPillEl.textContent =
      lang === "ar"
        ? `${checkPrefix}${doneAllStr}/${totalAllStr} سنة مكتملة`
        : lang === "en"
        ? `${checkPrefix}${doneAllStr}/${totalAllStr} Sunnah Done`
        : `${checkPrefix}${doneAllStr}/${totalAllStr} সুন্নাহ সম্পন্ন`;
    hubSummaryPillEl.classList.toggle("all-completed", isAllComplete);
  }

  // Sync Masnoon Adhkar launcher card progress (3-state color-coded pill)
  const todayKey = getTodayKey();
  const completedDuas = (appState.duaCompletionsByDate && appState.duaCompletionsByDate[todayKey]) || [];
  const totalDuas = SUNNAH_24_DUAS.length;
  const doneDuas = completedDuas.length;

  const adhkarBadgeEl = document.getElementById("badge-count-adhkar");
  if (adhkarBadgeEl) {
    const doneDuasStr = localizeDigits(doneDuas, lang);
    const totalDuasStr = localizeDigits(totalDuas, lang);
    adhkarBadgeEl.textContent =
      totalDuas > 0 && doneDuas >= totalDuas
        ? `✓ ${doneDuasStr}/${totalDuasStr}`
        : `${doneDuasStr}/${totalDuasStr}`;
    applyCornerPillState(adhkarBadgeEl, doneDuas, totalDuas);
  }

  // Sync Tasbih launcher card badge (Micro-icon prefix for instant recognition)
  const tasbihBadgeEl = document.getElementById("badge-count-tasbih");
  if (tasbihBadgeEl) {
    tasbihBadgeEl.classList.remove("pill-state-zero", "pill-state-progress", "pill-state-complete");
    tasbihBadgeEl.classList.add("pill-state-utility");
    tasbihBadgeEl.textContent = `📿 ${localizeDigits(appState.lifetimeDhikr || 0, lang)}`;
  }

  // Sync Personal Custom Habit launcher card badge
  const customHabitBadgeEl = document.getElementById("badge-count-custom_habit");
  if (customHabitBadgeEl) {
    customHabitBadgeEl.classList.remove("pill-state-zero", "pill-state-progress", "pill-state-complete");
    customHabitBadgeEl.classList.add("pill-state-utility");
    const customCount = Array.isArray(appState.customHabits) ? appState.customHabits.length : 0;
    const countStr = localizeDigits(customCount, lang);
    customHabitBadgeEl.textContent =
      lang === "ar"
        ? `➕ ${countStr}`
        : lang === "en"
        ? `➕ ${countStr}`
        : `➕ ${countStr}টি`;
  }

  // Sync SHA-256 Crypto Vault launcher card badge
  const cryptoVaultBadgeEl = document.getElementById("badge-count-crypto_vault");
  if (cryptoVaultBadgeEl) {
    cryptoVaultBadgeEl.classList.remove("pill-state-zero", "pill-state-progress", "pill-state-complete");
    cryptoVaultBadgeEl.classList.add("pill-state-utility");
    cryptoVaultBadgeEl.textContent =
      lang === "ar" ? "🛡️ آمن" : lang === "en" ? "🛡️ Secured" : "🛡️ সুরক্ষিত";
  }

  // Sync Vault & Analytics launcher card badge
  const vaultBadgeEl = document.getElementById("badge-count-vault");
  if (vaultBadgeEl) {
    vaultBadgeEl.classList.remove("pill-state-zero", "pill-state-progress", "pill-state-complete");
    vaultBadgeEl.classList.add("pill-state-utility");
    const activeDaysTotal = Object.keys(appState.completionsByDate || {}).filter(
      (k) => (appState.completionsByDate[k] || []).length > 0
    ).length;
    const daysStr = localizeDigits(activeDaysTotal, lang);
    vaultBadgeEl.textContent =
      lang === "ar"
        ? `🔥 ${daysStr} يوم`
        : lang === "en"
        ? `🔥 ${daysStr}d`
        : `🔥 ${daysStr} দিন`;
  }

  // Sync Active Master Topbar & Phase Banner if a Master Section is currently open
  if (activeMasterSectionId && MASTER_SECTION_REGISTRY[activeMasterSectionId]) {
    updateActiveMasterHeaderUI(activeMasterSectionId);
  }
}

function updateActiveMasterHeaderUI(sectionId) {
  const meta = MASTER_SECTION_REGISTRY[sectionId];
  if (!meta) return;

  const now = new Date();
  const lang = appState.locale || "bn";
  const logoEl = document.getElementById("master-active-logo");
  const titleEl = document.getElementById("master-active-title");
  const subEl = document.getElementById("master-active-subtitle");
  const badgeEl = document.getElementById("master-active-badge");

  if (logoEl && meta.logoHtml) logoEl.innerHTML = meta.logoHtml;
  if (titleEl) titleEl.textContent = meta.customTitle || t(meta.titleKey);
  if (subEl) subEl.textContent = meta.customDesc || t(meta.descKey);

  if (meta.type === "habit-phase") {
    const phaseHabits = getAllHabits().filter((h) => h.phase === meta.phaseKey);
    const total = phaseHabits.length;
    const done = phaseHabits.filter((h) => isHabitCompletedInActiveCycle(h, now)).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    if (badgeEl) {
      badgeEl.textContent = `${localizeDigits(done, lang)}/${localizeDigits(total, lang)}`;
    }

    const phaseHeadlineEl = document.getElementById("master-phase-headline");
    if (phaseHeadlineEl) phaseHeadlineEl.textContent = meta.customTitle || t(meta.titleKey);

    const phaseScoreEl = document.getElementById("master-phase-score-pill");
    if (phaseScoreEl) phaseScoreEl.textContent = `${localizeDigits(pct, lang)}%`;

    const countLblEl = document.getElementById("filter-count-label");
    if (countLblEl) {
      countLblEl.textContent =
        lang === "ar"
          ? `تم إتمام ${localizeDigits(done, "ar")} من أصل ${localizeDigits(total, "ar")} سنة في هذا القسم`
          : lang === "en"
          ? `${done} of ${total} Prophetic Sunnahs completed in this section`
          : `এই বিভাগের ${localizeDigits(total, "bn")}টি সুন্নাহর মধ্যে ${localizeDigits(done, "bn")}টি সম্পন্ন হয়েছে`;
    }
  } else if (sectionId === "sec-adhkar") {
    const todayKey = getTodayKey();
    const doneDuas = ((appState.duaCompletionsByDate && appState.duaCompletionsByDate[todayKey]) || []).length;
    const totalDuas = SUNNAH_24_DUAS.length;
    if (badgeEl) {
      badgeEl.textContent = `${localizeDigits(doneDuas, lang)}/${localizeDigits(totalDuas, lang)}`;
    }
  } else if (sectionId === "sec-tasbih") {
    if (badgeEl) {
      badgeEl.textContent = `📿 ${localizeDigits(tasbihCount, lang)}/${localizeDigits(tasbihTarget, lang)}`;
    }
  } else if (sectionId === "sec-custom_habit") {
    const customCount = Array.isArray(appState.customHabits) ? appState.customHabits.length : 0;
    if (badgeEl) {
      badgeEl.textContent = `➕ ${localizeDigits(customCount, lang)}`;
    }
  } else if (sectionId === "sec-crypto_vault") {
    if (badgeEl) {
      badgeEl.textContent = "🔐 SHA-256";
    }
  } else {
    if (badgeEl) {
      badgeEl.textContent = "📊 S24";
    }
  }
}

function openMasterSection(sectionId, recordHistory = true) {
  const meta = MASTER_SECTION_REGISTRY[sectionId];
  if (!meta) return;

  const homeView = document.getElementById("home-dashboard-view");
  const masterView = document.getElementById("master-section-view");
  if (!homeView || !masterView) return;

  // Save Home scroll position before leaving Home Dashboard
  if (!activeMasterSectionId) {
    homeDashboardScrollY = window.scrollY || window.pageYOffset || 0;
  }

  activeMasterSectionId = sectionId;
  document.body.setAttribute("data-active-view", sectionId);

  // Hide Home Dashboard completely & show Full-Screen Master View
  homeView.classList.add("hidden");
  masterView.classList.remove("hidden");

  // Hide all master panels first
  document.querySelectorAll("#master-section-view .master-screen-panel").forEach((p) => {
    p.classList.add("hidden");
  });

  if (meta.type === "habit-phase") {
    activePhase = meta.phaseKey;
    const habitPanel = document.getElementById("master-panel-habit-phase");
    if (habitPanel) habitPanel.classList.remove("hidden");

    document.querySelectorAll(".master-phase-switcher .chip").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-phase") === meta.phaseKey);
    });

    renderHabits();
  } else {
    const targetPanel = document.getElementById(meta.panelId);
    if (targetPanel) targetPanel.classList.remove("hidden");
    if (sectionId === "sec-adhkar") renderDuas();
    if (sectionId === "sec-tasbih") renderTasbihOptions();
    if (sectionId === "sec-vault") {
      renderWeeklyChart();
      renderLongTermArchive();
    }
    if (sectionId === "sec-custom_habit") {
      renderCustomHabitsManageList();
    }
    if (sectionId === "sec-crypto_vault") {
      updateIntegrityUI(true);
    }
  }

  updateActiveMasterHeaderUI(sectionId);

  if (recordHistory && typeof pushAppHistoryState === "function") {
    pushAppHistoryState("master-" + sectionId);
  }

  if (navigator.vibrate) navigator.vibrate(12);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function closeMasterSectionToHome() {
  const homeView = document.getElementById("home-dashboard-view");
  const masterView = document.getElementById("master-section-view");
  if (!homeView || !masterView) return;

  activeMasterSectionId = null;
  document.body.setAttribute("data-active-view", "home");

  masterView.classList.add("hidden");
  homeView.classList.remove("hidden");

  syncMasterSectionsLiveProgress();

  requestAnimationFrame(() => {
    window.scrollTo({ top: homeDashboardScrollY || 0, behavior: "instant" });
  });
}

// Superseded legacy handleSunnahBackNavigation #2 consolidated into unified LIFO modal & view handler

// Public Extensible API for registering future independent sections or sub-sections
window.Sunnah24SectionEngine = {
  openSection: openMasterSection,
  backToHome: closeMasterSectionToHome,
  registerIndependentSection: function ({ id, title, subtitle, badgeText, logoSvg, panelHtml }) {
    if (!id || MASTER_SECTION_REGISTRY[id]) return;
    const panelId = `custom-panel-${id}`;
    MASTER_SECTION_REGISTRY[id] = {
      id,
      type: "standalone",
      panelId,
      customTitle: title,
      customDesc: subtitle,
      logoHtml: logoSvg || "✨"
    };

    const gridSlot = document.getElementById("custom-independent-sections-slot");
    if (gridSlot) {
      const cardBtn = document.createElement("button");
      cardBtn.type = "button";
      cardBtn.className = "section-launcher-card theme-emerald";
      cardBtn.setAttribute("data-open-section", id);
      cardBtn.innerHTML = `
        <div class="section-card-top">
          <div class="section-world-logo logo-emerald">${logoSvg || "✨"}</div>
          <span class="section-live-pill">${escapeHtml(badgeText || "নতুন")}</span>
        </div>
        <div class="section-card-body">
          <h4 class="section-card-title">${escapeHtml(title)}</h4>
          <p class="section-card-desc">${escapeHtml(subtitle || "")}</p>
        </div>
      `;
      gridSlot.appendChild(cardBtn);
    }

    const panelsSlot = document.getElementById("extensible-master-panels-slot");
    if (panelsSlot) {
      const mainEl = document.createElement("main");
      mainEl.id = panelId;
      mainEl.className = "master-screen-panel hidden";
      mainEl.innerHTML = panelHtml || `<div class="card"><h3>${title}</h3><p class="muted">${subtitle || ""}</p></div>`;
      panelsSlot.appendChild(mainEl);
    }
  },
  registerSubSection: function (targetSlotId, htmlContent) {
    const slotEl = document.getElementById(targetSlotId);
    if (!slotEl) return;
    const wrapper = document.createElement("div");
    wrapper.className = "card extensible-subsection-card";
    wrapper.innerHTML = htmlContent;
    slotEl.appendChild(wrapper);
  }
};

const PHASE_KEY_TO_TITLE_I18N = deepFreeze({
  tahajjud_fajr: "phase_tahajjud",
  duha_work: "phase_duha",
  dhuhr_asr: "phase_dhuhr",
  maghrib_isha: "phase_maghrib",
  sleep_sunnah: "phase_sleep",
  diet_hygiene: "phase_diet",
  character_social: "phase_character"
});

function getPhaseLocalizedName(phaseKey) {
  const i18nKey = PHASE_KEY_TO_TITLE_I18N[phaseKey] || "phase_tahajjud";
  return t(i18nKey);
}

let lastAddedCustomHabitPhase = "tahajjud_fajr";

function showCustomHabitAddedModal(habitObj) {
  const modalEl = document.getElementById("custom-habit-added-modal");
  if (!modalEl || !habitObj) return;

  const phaseKey = habitObj.phase || "tahajjud_fajr";
  lastAddedCustomHabitPhase = phaseKey;
  const sectionName = getPhaseLocalizedName(phaseKey);
  const habitTitle = getHabitTitle(habitObj);

  const titleEl = document.getElementById("custom-added-modal-title");
  const chipEl = document.getElementById("custom-added-modal-phase-chip");
  const habitNameEl = document.getElementById("custom-added-habit-name");
  const msgEl = document.getElementById("custom-added-modal-msg");
  const gotoBtn = document.getElementById("custom-added-goto-section-btn");
  const closeBtn = document.getElementById("custom-added-close-btn");

  if (titleEl) titleEl.textContent = t("popup_added_title");
  if (chipEl) chipEl.textContent = `🕌 ${sectionName}`;
  if (habitNameEl) habitNameEl.textContent = `✨ ${habitTitle}`;
  if (msgEl) {
    msgEl.textContent = t("popup_added_msg", {
      habit: habitTitle,
      section: sectionName
    });
  }
  if (gotoBtn) {
    gotoBtn.textContent = `${t("popup_goto_section_btn")} (${sectionName})`;
  }
  if (closeBtn) {
    closeBtn.textContent = t("popup_ok_btn");
  }

  modalEl.classList.remove("hidden");
  if (navigator.vibrate) navigator.vibrate([25, 45, 30]);
  if (typeof pushAppHistoryState === "function") {
    pushAppHistoryState("custom-habit-added-modal");
  }
}

function renderCustomHabitsManageList() {
  const listEl = document.getElementById("custom-habits-manage-list");
  const totalPillEl = document.getElementById("custom-habits-total-pill");
  if (!listEl) return;

  const lang = appState.locale || "bn";
  const customList = Array.isArray(appState.customHabits) ? appState.customHabits : [];

  if (totalPillEl) {
    const countStr = localizeDigits(customList.length, lang);
    totalPillEl.textContent =
      lang === "ar"
        ? `${countStr} سنة`
        : lang === "en"
        ? `${countStr} Added`
        : `${countStr}টি আমল`;
  }

  if (customList.length === 0) {
    listEl.innerHTML = `<p class="muted" style="text-align:center;padding:10px 4px;">${t("custom_list_empty")}</p>`;
    return;
  }

  const now = new Date();
  listEl.innerHTML = "";
  [...customList].reverse().forEach((habit) => {
    const sectionName = getPhaseLocalizedName(habit.phase);
    const isDone = isHabitCompletedInActiveCycle(habit, now);
    const iconMeta = getHabitIconMeta(habit);

    const item = document.createElement("div");
    item.className = `habit-item ${isDone ? "completed" : ""}`;
    item.innerHTML = `
      <div class="habit-left">
        <div class="item-circle-avatar theme-${iconMeta.theme}">
          <span>${iconMeta.icon}</span>
          ${isDone ? '<span class="avatar-done-dot">✓</span>' : ""}
        </div>
        <div class="habit-info">
          <div class="habit-time-row">
            <span class="habit-time">${escapeHtml(t("custom_time_label"))}</span>
            <span class="time-status-badge status-open">📂 ${escapeHtml(sectionName)}</span>
          </div>
          <h4>${escapeHtml(getHabitTitle(habit))}</h4>
          <p class="habit-snippet">${escapeHtml(getHabitWisdom(habit))}</p>
        </div>
      </div>
      <div class="habit-right-actions">
        <button type="button" class="info-btn" data-open-custom-phase="sec-${escapeHtml(habit.phase)}">
          📂 ${escapeHtml(sectionName)}
        </button>
      </div>
    `;
    listEl.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const customAddedModal = document.getElementById("custom-habit-added-modal");
  const gotoSecBtn = document.getElementById("custom-added-goto-section-btn");
  const closeAddedBtn = document.getElementById("custom-added-close-btn");

  if (closeAddedBtn && customAddedModal) {
    closeAddedBtn.addEventListener("click", () => {
      customAddedModal.classList.add("hidden");
    });
  }

  if (gotoSecBtn && customAddedModal) {
    gotoSecBtn.addEventListener("click", () => {
      customAddedModal.classList.add("hidden");
      const targetSecId = "sec-" + (lastAddedCustomHabitPhase || "tahajjud_fajr");
      if (MASTER_SECTION_REGISTRY[targetSecId]) {
        openMasterSection(targetSecId, true);
      }
    });
  }

  if (customAddedModal) {
    customAddedModal.addEventListener("click", (e) => {
      if (e.target === customAddedModal) {
        customAddedModal.classList.add("hidden");
      }
    });
  }

  const customManageListEl = document.getElementById("custom-habits-manage-list");
  if (customManageListEl) {
    customManageListEl.addEventListener("click", (e) => {
      const openPhaseBtn = e.target.closest("[data-open-custom-phase]");
      if (!openPhaseBtn) return;
      const targetSec = openPhaseBtn.getAttribute("data-open-custom-phase");
      if (targetSec && MASTER_SECTION_REGISTRY[targetSec]) {
        openMasterSection(targetSec, true);
      }
    });
  }

  renderCustomHabitsManageList();
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Click on any Section Card in the Home Master Launcher Grid
  const sectionsGrid = document.getElementById("master-sections-grid");
  if (sectionsGrid) {
    sectionsGrid.addEventListener("click", (e) => {
      const cardBtn = e.target.closest("[data-open-section]");
      if (!cardBtn) return;
      const targetSecId = cardBtn.getAttribute("data-open-section");
      if (targetSecId) {
        openMasterSection(targetSecId, true);
      }
    });
  }

  // Allow tapping top-left App Brand Logo/Title to return to Home Dashboard from any Master Section
  const headerLeftEl = document.querySelector(".header-left");
  if (headerLeftEl) {
    headerLeftEl.style.cursor = "pointer";
    headerLeftEl.addEventListener("click", () => {
      if (activeMasterSectionId) {
        if (navigator.vibrate) navigator.vibrate(10);
        closeMasterSectionToHome();
      }
    });
  }

  // 3. Click on Quick Phase Switcher Chips inside Master Habit Phase View
  document.querySelectorAll(".master-phase-switcher .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const targetPhase = chip.getAttribute("data-phase");
      if (targetPhase && MASTER_SECTION_REGISTRY[`sec-${targetPhase}`]) {
        openMasterSection(`sec-${targetPhase}`, false);
      }
    });
  });

  // 4. Keep Master Topbar Tasbih Counter in sync when tapping Tasbih ring
  const tapAreaEl = document.getElementById("tasbih-tap-area");
  if (tapAreaEl) {
    tapAreaEl.addEventListener("click", () => {
      if (activeMasterSectionId === "sec-tasbih") {
        updateActiveMasterHeaderUI("sec-tasbih");
      }
      syncMasterSectionsLiveProgress();
    });
  }

  // Initial sync of all 10 section cards on Home Grid
  setTimeout(() => {
    syncMasterSectionsLiveProgress();
  }, 60);
});

// ============================================================================
// V8.0 FULL LIFO TAB/VIEW HISTORY STACK & STRICT HOME-PAGE-ONLY EXIT ENGINE
// + INDEPENDENT SUNNAH GRID PAGE + HOME PAGE POPUP/ACCORDION AUTO-ADJUST
// + SETTINGS MODAL & STICKY 4-TAB BOTTOM NAVIGATION CONTROLLER
// - Every tab/view transition (Home <-> Sunnah Grid <-> Tasbeeh <-> Stats <->
//   Any of the 12 Master Sections) is recorded in `s24ViewHistoryStack` along
//   with its exact scroll position (`s24ViewScrollPositions`).
// - Pressing the Back button ALWAYS brings the user back to the exact previous
//   tab/screen they visited before the current one.
// - The user MUST be on the Home Page (`#home-dashboard-view`) to exit the app
//   (via double-back press within 2 seconds). If the history stack ever empties
//   while on a non-Home tab, Back brings the user to the Home Page first!
// - Preserves 100% of all previous updates and SHA-256 dictionary hashes.
// ============================================================================
let isSunnahGridPageOpen = false;
let sunnahGridScrollY = 0;
let masterSectionOriginPage = "home"; // "home" | "grid"

// LIFO Tab & View History Stack: Always starts anchored at "home"
// View IDs: "home" | "grid" | "sec-tahajjud_fajr" | "sec-duha_work" | "sec-dhuhr_asr" |
//           "sec-maghrib_isha" | "sec-sleep_sunnah" | "sec-diet_hygiene" |
//           "sec-character_social" | "sec-adhkar" | "sec-tasbih" | "sec-vault" |
//           "sec-custom_habit" | "sec-crypto_vault"
let s24ViewHistoryStack = ["home"];
const s24ViewScrollPositions = {
  home: 0,
  grid: 0
};

function getCurrentActiveViewId() {
  if (activeMasterSectionId) return activeMasterSectionId;
  if (isSunnahGridPageOpen) return "grid";
  return "home";
}

function saveCurrentActiveViewScrollPosition() {
  const curId = getCurrentActiveViewId();
  const y = window.scrollY || window.pageYOffset || 0;
  s24ViewScrollPositions[curId] = y;
  if (curId === "home") homeDashboardScrollY = y;
  if (curId === "grid") sunnahGridScrollY = y;
}

function recordViewTransitionInStack(targetViewId) {
  if (!targetViewId) return;
  saveCurrentActiveViewScrollPosition();

  // Ensure "home" is always at the bottom of the stack so the user ALWAYS lands on Home before exiting
  if (s24ViewHistoryStack.length === 0 || s24ViewHistoryStack[0] !== "home") {
    s24ViewHistoryStack.unshift("home");
  }

  const topView = s24ViewHistoryStack[s24ViewHistoryStack.length - 1];
  if (topView !== targetViewId) {
    s24ViewHistoryStack.push(targetViewId);
    if (typeof pushAppHistoryState === "function") {
      pushAppHistoryState("view-" + targetViewId);
    }
  }
}

function syncSettingsAndBottomNavLocalization() {
  const lang = (appState && appState.locale) || "bn";

  // Settings Modal Labels
  const modalTitle = document.getElementById("s24-settings-modal-title");
  const langLbl = document.getElementById("s24-settings-lang-lbl");
  const madhabLbl = document.getElementById("s24-settings-madhab-lbl");
  const madhabSub = document.getElementById("s24-settings-madhab-sub");
  const doneBtn = document.getElementById("s24-settings-done-btn");

  if (modalTitle) {
    modalTitle.textContent =
      lang === "ar"
        ? "الإعدادات والتفضيلات"
        : lang === "en"
        ? "Settings & Preferences"
        : "সেটিংস ও পছন্দসমূহ";
  }
  if (langLbl) {
    langLbl.textContent =
      lang === "ar"
        ? "🌐 لغة التطبيق (Language)"
        : lang === "en"
        ? "🌐 App Language"
        : "🌐 অ্যাপের ভাষা (Language)";
  }
  if (madhabLbl) {
    madhabLbl.textContent =
      lang === "ar"
        ? "🕌 مذهب وقت العصر (Asr Madhab)"
        : lang === "en"
        ? "🕌 Asr Prayer Calculation (Madhab)"
        : "🕌 আসরের ওয়াক্ত মাযহাব (Asr Madhab)";
  }
  if (madhabSub) {
    madhabSub.textContent =
      lang === "ar"
        ? "التبديل بين المذهب الحنفي (ظل مضاعف) ومذهب الجمهور/الشافعي (ظل مثل واحد)"
        : lang === "en"
        ? "Switch between Hanafi (2x shadow) and Standard Shafi'i/Jumhur (1x shadow)"
        : "হানাফী (২ গুণ ছায়া) অথবা শাফিঈ/জমহুর (১ গুণ ছায়া) পরিবর্তন করুন";
  }
  if (doneBtn) {
    doneBtn.textContent = t("popup_ok_btn");
  }

  // Bottom Navigation Bar Labels (Home, Sunnah Grid, Tasbeeh, Stats)
  const bHome = document.getElementById("bnav-lbl-home");
  const bGrid = document.getElementById("bnav-lbl-grid");
  const bTasbih = document.getElementById("bnav-lbl-tasbih");
  const bStats = document.getElementById("bnav-lbl-stats");

  if (bHome) {
    bHome.textContent =
      lang === "ar" ? "الرئيسية" : lang === "en" ? "Home" : "হোম";
  }
  if (bGrid) {
    bGrid.textContent =
      lang === "ar" ? "شبكة السنن" : lang === "en" ? "Sunnah Grid" : "সুন্নাহ গ্রিড";
  }
  if (bTasbih) {
    bTasbih.textContent =
      lang === "ar" ? "السبحة" : lang === "en" ? "Tasbeeh" : "তাসবীহ";
  }
  if (bStats) {
    bStats.textContent =
      lang === "ar" ? "الإحصائيات" : lang === "en" ? "Stats" : "পরিসংখ্যান";
  }

  // Ensure any residual crescent badge inside the date card stays removed
  document.querySelectorAll(".lunar-ponjika-card .crescent-badge").forEach((el) => {
    el.remove();
  });
}

function setBottomNavActiveTab(tabKey) {
  document.querySelectorAll("#s24-bottom-nav .s24-bnav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-bnav") === tabKey);
  });
}

function syncBottomNavWithCurrentView() {
  if (!activeMasterSectionId) {
    if (isSunnahGridPageOpen) {
      setBottomNavActiveTab("grid");
    } else {
      setBottomNavActiveTab("home");
    }
    return;
  }
  if (activeMasterSectionId === "sec-tasbih") {
    setBottomNavActiveTab("tasbih");
  } else if (activeMasterSectionId === "sec-vault") {
    setBottomNavActiveTab("stats");
  } else {
    setBottomNavActiveTab("grid");
  }
}

// Open the Independent Sunnah Grid Page (#sunnah-grid-view)
function openSunnahGridPage(recordHistory = true, restoreScroll = false) {
  const homeView = document.getElementById("home-dashboard-view");
  const gridView = document.getElementById("sunnah-grid-view");
  const masterView = document.getElementById("master-section-view");
  if (!homeView || !gridView || !masterView) return;

  if (recordHistory) {
    recordViewTransitionInStack("grid");
  } else {
    saveCurrentActiveViewScrollPosition();
  }

  activeMasterSectionId = null;
  isSunnahGridPageOpen = true;
  document.body.setAttribute("data-active-view", "sunnah-grid");

  homeView.classList.add("hidden");
  masterView.classList.add("hidden");
  gridView.classList.remove("hidden");

  if (typeof syncMasterSectionsLiveProgress === "function") {
    syncMasterSectionsLiveProgress();
  }
  setBottomNavActiveTab("grid");

  requestAnimationFrame(() => {
    const targetY = restoreScroll ? (s24ViewScrollPositions.grid || sunnahGridScrollY || 0) : 0;
    window.scrollTo({
      top: targetY,
      behavior: "instant"
    });
  });
}

// Open the Independent Home Page (#home-dashboard-view)
function openHomeDashboardPage(restoreScroll = true, recordHistory = false) {
  const homeView = document.getElementById("home-dashboard-view");
  const gridView = document.getElementById("sunnah-grid-view");
  const masterView = document.getElementById("master-section-view");
  if (!homeView || !gridView || !masterView) return;

  if (recordHistory) {
    recordViewTransitionInStack("home");
  } else {
    saveCurrentActiveViewScrollPosition();
  }

  activeMasterSectionId = null;
  isSunnahGridPageOpen = false;
  document.body.setAttribute("data-active-view", "home");

  gridView.classList.add("hidden");
  masterView.classList.add("hidden");
  homeView.classList.remove("hidden");

  if (typeof syncMasterSectionsLiveProgress === "function") {
    syncMasterSectionsLiveProgress();
  }
  setBottomNavActiveTab("home");
  syncHomeExpandedBreathingSpace();

  requestAnimationFrame(() => {
    const targetY = restoreScroll ? (s24ViewScrollPositions.home || homeDashboardScrollY || 0) : 0;
    window.scrollTo({
      top: targetY,
      behavior: "instant"
    });
  });
}

// Smoothly adjusts Home Page bottom breathing space & viewport scroll when 5-Waqt Popup
// or Prohibited Salah Accordion expands so the user never feels cramped at the bottom
function syncHomeExpandedBreathingSpace(expandedElement = null) {
  const popupWrap = document.getElementById("waqt-range-popup-wrap");
  const prohibitedCard = document.getElementById("prohibited-salah-card");

  const isPopupOpen = Boolean(popupWrap && !popupWrap.classList.contains("hidden"));
  const isProhibitedOpen = Boolean(
    prohibitedCard && !prohibitedCard.classList.contains("is-collapsed")
  );

  document.body.classList.toggle(
    "home-popup-expanded",
    isPopupOpen || isProhibitedOpen
  );

  if (
    expandedElement &&
    !activeMasterSectionId &&
    !isSunnahGridPageOpen
  ) {
    setTimeout(() => {
      const rect = expandedElement.getBoundingClientRect();
      const bottomNavEl = document.getElementById("s24-bottom-nav");
      const navHeight = bottomNavEl
        ? bottomNavEl.getBoundingClientRect().height
        : 68;
      const visibleBottomLimit = window.innerHeight - navHeight - 10;

      if (rect.bottom > visibleBottomLimit) {
        const delta = rect.bottom - visibleBottomLimit + 10;
        window.scrollBy({ top: delta, behavior: "smooth" });
      }
    }, 90);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  syncSettingsAndBottomNavLocalization();

  // Re-sync localized labels whenever language switcher changes
  const langSwitcherEl = document.getElementById("lang-switcher");
  if (langSwitcherEl) {
    langSwitcherEl.addEventListener("change", () => {
      setTimeout(syncSettingsAndBottomNavLocalization, 20);
    });
  }

  // 1. Settings & Preferences Modal Drawer Open / Close Logic
  const settingsOpenBtn = document.getElementById("s24-settings-open-btn");
  const settingsModal = document.getElementById("s24-settings-modal");
  const settingsCloseBtn = document.getElementById("s24-settings-close-btn");
  const settingsDoneBtn = document.getElementById("s24-settings-done-btn");

  const openSettingsModal = () => {
    if (!settingsModal) return;
    const locPanel = document.getElementById("bd-loc-cascading-panel");
    if (locPanel && locPanel.classList.contains("is-open")) {
      locPanel.classList.remove("is-open");
    }
    syncSettingsAndBottomNavLocalization();
    if (typeof syncMadhabToggleUI === "function") syncMadhabToggleUI();
    settingsModal.classList.remove("hidden");
    if (settingsOpenBtn) settingsOpenBtn.setAttribute("aria-expanded", "true");
    if (navigator.vibrate) navigator.vibrate(10);
    if (typeof pushAppHistoryState === "function") pushAppHistoryState("settings-modal");
  };

  const closeSettingsModal = () => {
    if (!settingsModal) return;
    settingsModal.classList.add("hidden");
    if (settingsOpenBtn) settingsOpenBtn.setAttribute("aria-expanded", "false");
  };

  if (settingsOpenBtn) {
    settingsOpenBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openSettingsModal();
    });
  }
  if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener("click", closeSettingsModal);
  }
  if (settingsDoneBtn) {
    settingsDoneBtn.addEventListener("click", closeSettingsModal);
  }
  if (settingsModal) {
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        closeSettingsModal();
      }
    });
  }

  // 2. Sticky 4-Tab Bottom Navigation Bar Click Routing (Home, Sunnah Grid, Tasbeeh, Stats)
  // Every tab click records in `s24ViewHistoryStack` so pressing Back always returns to the previous tab!
  const bottomNav = document.getElementById("s24-bottom-nav");
  if (bottomNav) {
    bottomNav.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-bnav]");
      if (!btn) return;
      const target = btn.getAttribute("data-bnav");
      if (navigator.vibrate) navigator.vibrate(10);

      const currentViewId = getCurrentActiveViewId();

      if (target === "home") {
        if (currentViewId === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          openHomeDashboardPage(false, true);
        }
      } else if (target === "grid") {
        if (currentViewId === "grid") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          openSunnahGridPage(true, false);
        }
      } else if (target === "tasbih") {
        if (currentViewId === "sec-tasbih") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          openMasterSection("sec-tasbih", true);
          setBottomNavActiveTab("tasbih");
        }
      } else if (target === "stats") {
        if (currentViewId === "sec-vault") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          openMasterSection("sec-vault", true);
          setBottomNavActiveTab("stats");
        }
      }
    });
  }

  // Allow tapping top-left App Brand Logo/Title to return to Home Page from any tab/view
  const headerLeftEl = document.querySelector(".header-left");
  if (headerLeftEl) {
    headerLeftEl.addEventListener("click", (e) => {
      const curId = getCurrentActiveViewId();
      if (curId !== "home") {
        e.stopImmediatePropagation();
        if (navigator.vibrate) navigator.vibrate(10);
        openHomeDashboardPage(false, true);
      }
    }, true);
  }

  // 3. Auto-adjust Home Page when 5-Waqt Popup or Prohibited Salah Accordion expands
  if (typeof renderWaqtTimeRangePopup === "function") {
    const origRenderWaqtPopup = renderWaqtTimeRangePopup;
    renderWaqtTimeRangePopup = function (waqtId, now = new Date()) {
      const wasOpen = Boolean(
        document.getElementById("waqt-range-popup-wrap") &&
          !document.getElementById("waqt-range-popup-wrap").classList.contains("hidden")
      );
      origRenderWaqtPopup(waqtId, now);
      const popupWrap = document.getElementById("waqt-range-popup-wrap");
      syncHomeExpandedBreathingSpace(waqtId && !wasOpen ? popupWrap : null);
    };
  }

  const prohibitedBtn = document.getElementById("prohibited-toggle-btn");
  const prohibitedCard = document.getElementById("prohibited-salah-card");
  if (prohibitedBtn && prohibitedCard) {
    prohibitedBtn.addEventListener("click", () => {
      setTimeout(() => {
        const isExpanded = !prohibitedCard.classList.contains("is-collapsed");
        syncHomeExpandedBreathingSpace(isExpanded ? prohibitedCard : null);
      }, 60);
    });
  }

  // 4. Wrap openMasterSection and closeMasterSectionToHome so every Master Section transition
  // is tracked in `s24ViewHistoryStack` and restores scroll position when navigating back
  const origOpenMasterSection = openMasterSection;
  openMasterSection = function (sectionId, recordHistory = true, restoreScroll = false) {
    const gridView = document.getElementById("sunnah-grid-view");

    if (recordHistory) {
      recordViewTransitionInStack(sectionId);
    } else {
      saveCurrentActiveViewScrollPosition();
    }

    isSunnahGridPageOpen = false;
    if (gridView) gridView.classList.add("hidden");

    // Pass recordHistory=false to origOpenMasterSection because recordViewTransitionInStack already pushed history
    origOpenMasterSection(sectionId, false);
    syncBottomNavWithCurrentView();

    if (restoreScroll && s24ViewScrollPositions[sectionId] > 0) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: s24ViewScrollPositions[sectionId],
          behavior: "instant"
        });
      });
    }
  };
  if (window.Sunnah24SectionEngine) {
    window.Sunnah24SectionEngine.openSection = openMasterSection;
  }

  const origCloseMasterSectionToHome = closeMasterSectionToHome;
  closeMasterSectionToHome = function () {
    const gridView = document.getElementById("sunnah-grid-view");
    if (gridView) gridView.classList.add("hidden");
    isSunnahGridPageOpen = false;
    s24ViewHistoryStack = ["home"];
    origCloseMasterSectionToHome();
    syncBottomNavWithCurrentView();
  };
  if (window.Sunnah24SectionEngine) {
    window.Sunnah24SectionEngine.backToHome = closeMasterSectionToHome;
  }

  // Helper to navigate directly to any view ID from `s24ViewHistoryStack` without re-pushing to stack
  const navigateToStackView = (targetViewId) => {
    if (!targetViewId || targetViewId === "home") {
      openHomeDashboardPage(true, false);
      return;
    }
    if (targetViewId === "grid") {
      openSunnahGridPage(false, true);
      return;
    }
    if (MASTER_SECTION_REGISTRY && MASTER_SECTION_REGISTRY[targetViewId]) {
      openMasterSection(targetViewId, false, true);
      return;
    }
    openHomeDashboardPage(true, false);
  };

  // 5. UNIFIED BACK-BUTTON NAVIGATION ENGINE:
  // - Closes open modals/popovers first
  // - Pops `s24ViewHistoryStack` so EVERY tab/screen brings the user back to the exact previous tab/screen
  // - Guarantees the user MUST be at the Home Page (`getCurrentActiveViewId() === "home"`) to exit the app!
  window.handleSunnahBackNavigation = function () {
    // 1A-0. Close Four Qualities or Two Blessings Article Modals if open
    const qualitiesArticleModal = document.getElementById("four-qualities-article-modal");
    if (qualitiesArticleModal && !qualitiesArticleModal.classList.contains("hidden")) {
      qualitiesArticleModal.classList.add("hidden");
      return true;
    }

    const blessingsArticleModal = document.getElementById("two-blessings-article-modal");
    if (blessingsArticleModal && !blessingsArticleModal.classList.contains("hidden")) {
      blessingsArticleModal.classList.add("hidden");
      return true;
    }

    // 1A. Close Settings Modal if open
    if (settingsModal && !settingsModal.classList.contains("hidden")) {
      closeSettingsModal();
      return true;
    }

    // 1B. Close Custom Habit Added Confirmation Modal if open
    const customAddedModal = document.getElementById("custom-habit-added-modal");
    if (customAddedModal && !customAddedModal.classList.contains("hidden")) {
      customAddedModal.classList.add("hidden");
      return true;
    }

    // 1C. Close Fact / Day History Modal if open
    const factModal = document.getElementById("fact-modal");
    if (factModal && !factModal.classList.contains("hidden")) {
      factModal.classList.add("hidden");
      return true;
    }

    // 2A. Close Searchable Location Modal if open
    const locOverlay = document.getElementById("s24-loc-modal-overlay");
    const locToggleBtn = document.getElementById("bd-loc-toggle-btn");
    if (locOverlay && !locOverlay.classList.contains("hidden")) {
      locOverlay.classList.add("hidden");
      if (locToggleBtn) locToggleBtn.setAttribute("aria-expanded", "false");
      return true;
    }

    // 2B. Close Header Location Popover if open
    const locPanel = document.getElementById("bd-loc-cascading-panel");
    if (locPanel && locPanel.classList.contains("is-open")) {
      locPanel.classList.remove("is-open");
      if (locToggleBtn) locToggleBtn.setAttribute("aria-expanded", "false");
      return true;
    }

    // 2C. Close 5-Waqt Prayer Time Range Popup on Home Page if open
    if (typeof activeSelectedWaqtPopupId === "string" && activeSelectedWaqtPopupId) {
      activeSelectedWaqtPopupId = null;
      if (typeof renderWaqtTimeRangePopup === "function") {
        renderWaqtTimeRangePopup(null);
      }
      return true;
    }

    // 3. Pop the LIFO Tab/View History Stack (`s24ViewHistoryStack`) to return to the previous tab!
    const currentViewId = getCurrentActiveViewId();

    // Remove any trailing entries matching the current view
    while (
      s24ViewHistoryStack.length > 0 &&
      s24ViewHistoryStack[s24ViewHistoryStack.length - 1] === currentViewId
    ) {
      s24ViewHistoryStack.pop();
    }

    if (s24ViewHistoryStack.length > 0) {
      const previousViewId = s24ViewHistoryStack[s24ViewHistoryStack.length - 1];
      navigateToStackView(previousViewId);
      // Keep browser history armed so subsequent Back presses continue to be intercepted
      if (typeof pushAppHistoryState === "function") {
        pushAppHistoryState("back-to-" + previousViewId);
      }
      return true;
    }

    // 4. STRICT HOME-PAGE-ONLY EXIT RULE:
    // If stack is empty but the user is NOT on the Home Page (e.g., on Sunnah Grid, Tasbeeh, Stats, or any section),
    // bring them to the Home Page first and re-seed ["home"]! Never exit from a non-Home tab.
    if (currentViewId !== "home") {
      s24ViewHistoryStack = ["home"];
      openHomeDashboardPage(true, false);
      if (typeof pushAppHistoryState === "function") {
        pushAppHistoryState("home-root-guard");
      }
      return true;
    }

    // 5. User is now on the Home Page (`currentViewId === "home"`) with no previous tabs left in the stack:
    // Require double back-press within 2s on the Home Page to exit the app.
    s24ViewHistoryStack = ["home"];
    const now = Date.now();
    if (now - lastBackTapTime < 2000) {
      return false; // Allow native APK / PWA exit on second back press from Home Page
    }
    lastBackTapTime = now;
    showExitToast();
    if (typeof pushAppHistoryState === "function") {
      pushAppHistoryState("root-guard");
    }
    return true;
  };
});

function renderNaflPrayerTimes(now = new Date()) {
  const listEl = document.getElementById("nafl-salah-list");
  if (!listEl) return;

  const lang = (appState && appState.locale) || "bn";
  const titleEl = document.getElementById("nafl-card-title");

  if (titleEl) {
    titleEl.textContent =
      lang === "ar"
        ? "أوقات صلاة النافلة"
        : lang === "en"
        ? "Nafl Prayer Schedule"
        : "নফল নামাজের সময়সূচী";
  }

  const items = getNaflPrayersScheduleList(now);

  listEl.innerHTML = items
    .map((item) => {
      return `
        <div class="nafl-minimal-row ${item.isActive ? "is-active-nafl" : ""}" data-nafl-id="${item.id}">
          <div class="nafl-minimal-left">
            <span class="nafl-minimal-dot ${item.isActive ? "active" : ""}" aria-hidden="true"></span>
            <span class="nafl-minimal-label">${item.title}</span>
          </div>
          <div class="nafl-minimal-right">
            <strong class="prohibited-time-pill nafl-minimal-time-pill">${item.timeRangeText}</strong>
            <button type="button" class="nafl-corner-info-btn" data-nafl-proof="${item.id}" aria-label="Hadith Proof" title="Hadith Proof">i</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function openNaflHadithModal(naflId) {
  const items = getNaflPrayersScheduleList(new Date());
  const item = items.find((i) => i.id === naflId);
  if (!item) return;

  const evidenceEl = document.getElementById("modal-evidence");
  const evidenceHeadingEl = evidenceEl?.parentElement?.querySelector("h4");
  if (evidenceHeadingEl) {
    evidenceHeadingEl.textContent = t("modal_evidence_heading");
  }
  const wisdomSection = document.getElementById("modal-wisdom")?.parentElement;
  if (wisdomSection) wisdomSection.style.display = "block";

  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-category").textContent = `${item.timeRangeText} • ${item.rakahBadge}`;
  if (evidenceEl) evidenceEl.textContent = item.evidenceFull;
  const wisdomEl = document.getElementById("modal-wisdom");
  if (wisdomEl) wisdomEl.textContent = item.wisdomFull;

  document.getElementById("fact-modal").classList.remove("hidden");
  if (typeof pushAppHistoryState === "function") pushAppHistoryState("modal");
}

document.addEventListener("DOMContentLoaded", () => {
  renderNaflPrayerTimes(new Date());

  const naflCardEl = document.getElementById("nafl-salah-card");
  if (naflCardEl) {
    naflCardEl.addEventListener("click", (e) => {
      // Strictly require clicking on the `i` button itself to open the Nafl Hadith modal
      const proofBtn = e.target.closest("button.nafl-corner-info-btn[data-nafl-proof]");
      if (!proofBtn) return;
      e.stopPropagation();
      const naflId = proofBtn.getAttribute("data-nafl-proof");
      if (!naflId) return;
      if (navigator.vibrate) navigator.vibrate(12);
      openNaflHadithModal(naflId);
    });
  }
});

function syncTwoBlessingsCardLocale() {
  const lang = TWO_BLESSINGS_CONTENT[appState.locale] ? appState.locale : "bn";
  const data = TWO_BLESSINGS_CONTENT[lang];
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setTxt("blessings-card-narrator", data.narrator);
  setTxt("blessings-card-headline", data.headline);
  const subEl = document.getElementById("blessings-card-subline");
  if (subEl) {
    subEl.innerHTML = `${data.sublinePrefix} <span class="s24-blessings-highlight">${data.sublineHighlight}</span>`;
  }
  setTxt("blessings-tile-health", data.tileHealth);
  setTxt("blessings-tile-freetime", data.tileFreeTime);
  setTxt("blessings-card-source", data.source);
  const ctaEl = document.getElementById("blessings-card-cta");
  if (ctaEl && ctaEl.firstElementChild) {
    ctaEl.firstElementChild.textContent = data.cta;
  }
}

function openTwoBlessingsArticleModal() {
  const modal = document.getElementById("two-blessings-article-modal");
  if (!modal) return;
  const lang = TWO_BLESSINGS_CONTENT[appState.locale] ? appState.locale : "bn";
  const data = TWO_BLESSINGS_CONTENT[lang];

  const badgeEl = document.getElementById("blessings-article-badge");
  const titleEl = document.getElementById("blessings-article-title");
  const subEl = document.getElementById("blessings-article-subtitle");
  const bodyEl = document.getElementById("blessings-article-scroll-body");

  if (badgeEl) badgeEl.textContent = data.articleBadge;
  if (titleEl) titleEl.textContent = data.articleTitle;
  if (subEl) subEl.textContent = data.articleSubtitle;

  if (bodyEl) {
    bodyEl.innerHTML = data.blocks
      .map((blk) => {
        const blockClass =
          blk.type === "quran"
            ? "block-quran"
            : blk.type === "hadith"
            ? "block-hadith"
            : "block-action";
        const arabicHtml = blk.arabic
          ? `<div class="s24-article-arabic">${blk.arabic}</div>`
          : "";
        const bodyContentHtml = blk.takeaways
          ? `<ul class="s24-article-takeaway-list">${blk.takeaways
              .map((item) => `<li>${item}</li>`)
              .join("")}</ul>`
          : `<p class="s24-article-text">${blk.text}</p>`;

        return `
          <article class="s24-article-block ${blockClass}">
            <div class="s24-article-block-head">
              <h4>${blk.title}</h4>
              <span class="s24-article-ref-tag">${blk.ref}</span>
            </div>
            ${arabicHtml}
            ${bodyContentHtml}
          </article>
        `;
      })
      .join("");
    bodyEl.scrollTop = 0;
  }

  modal.classList.remove("hidden");
  if (navigator.vibrate) navigator.vibrate(14);
  if (typeof pushAppHistoryState === "function") pushAppHistoryState("modal");
}

function closeTwoBlessingsArticleModal() {
  const modal = document.getElementById("two-blessings-article-modal");
  if (modal) modal.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  syncTwoBlessingsCardLocale();

  function bindTwoBlessingsCtaOnlyTrigger() {
    const ctaBtn = document.getElementById("blessings-card-cta");
    if (!ctaBtn || ctaBtn.dataset.s24CtaBound === "1") return;
    ctaBtn.dataset.s24CtaBound = "1";

    ctaBtn.addEventListener("click", (e) => {
      const targetTrigger = e.target.closest("#blessings-card-cta[data-open-blessings-article='true']");
      if (!targetTrigger) return;
      e.stopPropagation();
      openTwoBlessingsArticleModal();
    });
  }

  bindTwoBlessingsCtaOnlyTrigger();

  const closeTopBtn = document.getElementById("close-blessings-article-top-btn");
  const closeBottomBtn = document.getElementById("close-blessings-article-btn");
  const modalOverlay = document.getElementById("two-blessings-article-modal");

  if (closeTopBtn) closeTopBtn.addEventListener("click", closeTwoBlessingsArticleModal);
  if (closeBottomBtn) closeBottomBtn.addEventListener("click", closeTwoBlessingsArticleModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeTwoBlessingsArticleModal();
    });
  }

  const langSwitcher = document.getElementById("lang-switcher");
  if (langSwitcher) {
    langSwitcher.addEventListener("change", (e) => {
      if (e && e.target && e.target.value && I18N_DICTIONARIES[e.target.value]) {
        appState.locale = e.target.value;
      }
      syncTwoBlessingsCardLocale();
    });
  }
});

function syncFourQualitiesCardLocale() {
  const lang = FOUR_QUALITIES_CONTENT[appState.locale] ? appState.locale : "bn";
  const data = FOUR_QUALITIES_CONTENT[lang];
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setTxt("qualities-card-narrator", data.narrator);
  setTxt("qualities-card-num", data.numText);
  setTxt("qualities-card-word", data.wordText);
  setTxt("qualities-card-statement", data.statement);
  setTxt("qualities-tile-amanah", data.tileAmanah);
  setTxt("qualities-tile-sidq", data.tileSidq);
  setTxt("qualities-tile-khuluq", data.tileKhuluq);
  setTxt("qualities-tile-halal", data.tileHalal);
  setTxt("qualities-card-source", data.source);
  const ctaEl = document.getElementById("qualities-card-cta");
  if (ctaEl && ctaEl.firstElementChild) {
    ctaEl.firstElementChild.textContent = data.cta;
  }
}

function openFourQualitiesArticleModal() {
  const modal = document.getElementById("four-qualities-article-modal");
  if (!modal) return;
  const lang = FOUR_QUALITIES_CONTENT[appState.locale] ? appState.locale : "bn";
  const data = FOUR_QUALITIES_CONTENT[lang];

  const badgeEl = document.getElementById("qualities-article-badge");
  const titleEl = document.getElementById("qualities-article-title");
  const subEl = document.getElementById("qualities-article-subtitle");
  const bodyEl = document.getElementById("qualities-article-scroll-body");

  if (badgeEl) badgeEl.textContent = data.articleBadge;
  if (titleEl) titleEl.textContent = data.articleTitle;
  if (subEl) subEl.textContent = data.articleSubtitle;

  if (bodyEl) {
    bodyEl.innerHTML = data.blocks
      .map((blk) => {
        const blockClass =
          blk.type === "quran"
            ? "block-quran"
            : blk.type === "hadith"
            ? "block-hadith"
            : "block-action";
        const arabicHtml = blk.arabic
          ? `<div class="s24-article-arabic">${blk.arabic}</div>`
          : "";
        const bodyContentHtml = blk.takeaways
          ? `<ul class="s24-article-takeaway-list">${blk.takeaways
              .map((item) => `<li>${item}</li>`)
              .join("")}</ul>`
          : `<p class="s24-article-text">${blk.text}</p>`;

        return `
          <article class="s24-article-block ${blockClass}">
            <div class="s24-article-block-head">
              <h4>${blk.title}</h4>
              <span class="s24-article-ref-tag">${blk.ref}</span>
            </div>
            ${arabicHtml}
            ${bodyContentHtml}
          </article>
        `;
      })
      .join("");
    bodyEl.scrollTop = 0;
  }

  modal.classList.remove("hidden");
  if (navigator.vibrate) navigator.vibrate(14);
  if (typeof pushAppHistoryState === "function") pushAppHistoryState("modal");
}

function closeFourQualitiesArticleModal() {
  const modal = document.getElementById("four-qualities-article-modal");
  if (modal) modal.classList.add("hidden");
}

function bindFourQualitiesCtaOnlyTrigger() {
  const ctaBtn = document.getElementById("qualities-card-cta");
  if (!ctaBtn || ctaBtn.dataset.s24QualitiesCtaBound === "1") return;
  ctaBtn.dataset.s24QualitiesCtaBound = "1";

  ctaBtn.addEventListener("click", (e) => {
    const targetTrigger = e.target.closest("#qualities-card-cta[data-open-qualities-article='true']");
    if (!targetTrigger) return;
    e.stopPropagation();
    openFourQualitiesArticleModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  syncFourQualitiesCardLocale();
  bindFourQualitiesCtaOnlyTrigger();

  const closeTopBtn = document.getElementById("close-qualities-article-top-btn");
  const closeBottomBtn = document.getElementById("close-qualities-article-btn");
  const modalOverlay = document.getElementById("four-qualities-article-modal");

  if (closeTopBtn) closeTopBtn.addEventListener("click", closeFourQualitiesArticleModal);
  if (closeBottomBtn) closeBottomBtn.addEventListener("click", closeFourQualitiesArticleModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeFourQualitiesArticleModal();
    });
  }

  const langSwitcher = document.getElementById("lang-switcher");
  if (langSwitcher) {
    langSwitcher.addEventListener("change", () => {
      setTimeout(syncFourQualitiesCardLocale, 20);
    });
  }
});




