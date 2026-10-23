/**
 * SUNNAH 24 — ENTERPRISE PROPHETIC 24-HOUR LIFESTYLE & HABIT TRACKER
 * SHA-256 Tamper-Proof Cryptographic Engine + 32 Authentic Islamic Habitual Facts
 */

const STORAGE_KEY = "SUNNAH_24_ENTERPRISE_LEDGER_V24";
const LEDGER_SALT = "MKRWEB-SUNNAH-24-CORPORATE-IMMUTABLE-SALT";

// 32 Comprehensive Prophetic Habits & Islamic Habitual Facts Across 24 Hours
const SUNNAH_24_HABITS = [
  // PHASE 1: PRE-DAWN & FAJR (TAHAJJUD TO SUNRISE)
  {
    id: "s24_01_waking_dua",
    phase: "tahajjud_fajr",
    time: "04:00 AM • Awakening",
    title: "1. Waking Dua & Wiping Sleep from the Face",
    evidence: "Sahih al-Bukhari 183: The Prophet ﷺ woke up, sat down, wiped sleep from his face with his hand, recited the last 10 verses of Surah Aal-e-Imran, and said: 'Alhamdulillahilladhi ahyana ba'da ma amatana wa ilayhin-nushur.'",
    wisdom: "Immediately anchors consciousness in gratitude and clears sleep inertia naturally before any blue-light screen exposure."
  },
  {
    id: "s24_02_miswak_wudu",
    phase: "tahajjud_fajr",
    time: "04:10 AM • Oral & Spiritual Purity",
    title: "2. Using Miswak (Siwak) & Mindful Wudu",
    evidence: "Sahih al-Bukhari 887: 'Were it not that it would be too hard on my Ummah, I would have commanded them to use the Siwak at every prayer.'",
    wisdom: "Salvadora persica contains natural antibacterial compounds, silica, and fluoride that eliminate overnight oral bacteria and stimulate alertness."
  },
  {
    id: "s24_03_tahajjud",
    phase: "tahajjud_fajr",
    time: "04:20 AM • Last Third of Night",
    title: "3. Tahajjud (Qiyam al-Layl) & Pre-Dawn Istighfar",
    evidence: "Sahih Muslim 758 & Quran 51:18: Our Lord descends every night to the lowest heaven in the last third of the night asking: 'Who is calling upon Me that I may answer him?'",
    wisdom: "Quiet pre-dawn solitude builds emotional resilience, deep cognitive focus (Khushu), and inner peace."
  },
  {
    id: "s24_04_fajr_sunnah_fard",
    phase: "tahajjud_fajr",
    time: "05:00 AM • Dawn Prayer",
    title: "4. 2 Rak'ah Sunnah of Fajr + Fajr Fard on Time",
    evidence: "Sahih Muslim 725: 'The two Rak'ahs before the dawn (Fajr) prayer are better than this world and all that it contains.'",
    wisdom: "Synchronizes the human circadian clock with dawn light and places the believer under Allah's protection (Sahih Muslim 657)."
  },
  {
    id: "s24_05_post_fajr_barakah",
    phase: "tahajjud_fajr",
    time: "05:30 AM • Barakah Window",
    title: "5. Morning Adhkar, Quran Recitation & Staying Awake After Fajr",
    evidence: "Sunan Abi Dawud 2606: 'O Allah, bless my Ummah in their early mornings.' The Prophet ﷺ did not sleep immediately after Fajr.",
    wisdom: "Harnesses peak morning cortisol and dopamine levels for Quranic contemplation, study, and strategic planning."
  },
  {
    id: "s24_06_ishraq_reflection",
    phase: "tahajjud_fajr",
    time: "06:15 AM • Post-Sunrise",
    title: "6. Sunrise Remembrance & 2 Rak'ah Ishraq",
    evidence: "Jami` at-Tirmidhi 586: Whoever prays Fajr in congregation, then sits remembering Allah until the sun rises, then prays two Rak'ahs, has the reward of a complete Hajj and Umrah.",
    wisdom: "Morning sunlight exposure regulates serotonin and melatonin cycles for the entire 24-hour period."
  },

  // PHASE 2: MORNING & WORK (DUHA TO MIDDAY)
  {
    id: "s24_07_home_exit_dua",
    phase: "duha_work",
    time: "08:00 AM • Stepping Out",
    title: "7. Stepping Out with Bismillah & Tawakkul Dua",
    evidence: "Sunan Abi Dawud 5095: Whoever says upon leaving his house 'Bismillahi, tawakkaltu 'alallah, la hawla wa la quwwata illa billah' is told: 'You are guided, sufficed, and protected.'",
    wisdom: "Instills psychological calm and purposeful reliance on Allah before entering academic or professional environments."
  },
  {
    id: "s24_08_salat_duha",
    phase: "duha_work",
    time: "08:45 AM • Forenoon Prayer",
    title: "8. Salat al-Duha (Charity for All 360 Joints)",
    evidence: "Sahih Muslim 720: Every single morning charity is due upon every joint of your body; and two Rak'ahs offered in the forenoon (Duha) suffice for all 360 joints.",
    wisdom: "Serves as a mindful mid-morning reset that relieves spinal and joint tension during long study or coding sessions."
  },
  {
    id: "s24_09_halal_ihsan_work",
    phase: "duha_work",
    time: "09:00 AM • Deep Work",
    title: "9. Pursuing Knowledge & Work with Ihsan (Excellence)",
    evidence: "Sahih Muslim 1955: 'Verily, Allah has prescribed Ihsan (excellence/proficiency) in all things.' & Bukhari 2072.",
    wisdom: "Elevates secular study, legal preparation, programming, and entrepreneurship into continuous worship (Ibadah)."
  },
  {
    id: "s24_10_tayammun_right",
    phase: "duha_work",
    time: "All Day • Prophetic Mindfulness",
    title: "10. Tayammun (Beginning Noble Actions with the Right Side)",
    evidence: "Sahih al-Bukhari 168: The Prophet ﷺ loved to start from the right side when putting on shoes, combing hair, purifying himself, and in all his noble affairs.",
    wisdom: "Replaces habitual autopilot with conscious Prophetic intentionality in every physical movement."
  },

  // PHASE 3: MIDDAY & ASR (DHUHR TO SUNSET)
  {
    id: "s24_11_dhuhr_rawatib",
    phase: "dhuhr_asr",
    time: "01:15 PM • Midday Prayer",
    title: "11. Dhuhr Prayer & Rawatib Sunnahs (4 Before, 2 After)",
    evidence: "Jami` at-Tirmidhi 414: Whoever persists in performing 12 Rak'ahs from the Sunnah daily, Allah will build a house for him in Paradise.",
    wisdom: "Provides a structured spiritual pause at solar noon that detaches the heart from worldly stress."
  },
  {
    id: "s24_12_qaylulah_nap",
    phase: "dhuhr_asr",
    time: "02:00 PM • Cognitive Recovery",
    title: "12. Qaylulah (20-Minute Prophetic Power Nap)",
    evidence: "Sahih al-Jami 4431: 'Take a midday nap (Qaylulah), for the Shayatin do not take a midday nap.'",
    wisdom: "Neuroscience confirms a 15–25 minute early afternoon nap clears adenosine buildup and restores executive function."
  },
  {
    id: "s24_13_asr_prayer",
    phase: "dhuhr_asr",
    time: "04:30 PM • The Middle Prayer",
    title: "13. Guarding Salat al-Asr on Time",
    evidence: "Quran 2:238: 'Guard strictly your prayers, especially the Middle Prayer (Asr).' & Sahih al-Bukhari 553.",
    wisdom: "Prevents late-afternoon burnout and anchors the transition from work to evening tranquility."
  },
  {
    id: "s24_14_evening_adhkar",
    phase: "dhuhr_asr",
    time: "05:00 PM • Fortress of Dhikr",
    title: "14. Evening Adhkar (Adhkar al-Masa') Before Sunset",
    evidence: "Quran 33:41-42: 'O you who believe, remember Allah with much remembrance, and glorify Him morning and evening.'",
    wisdom: "Lowers evening cortisol and shields the mind from anxiety and spiritual restlessness."
  },

  // PHASE 4: EVENING & ISHA (MAGHRIB TO NIGHT)
  {
    id: "s24_15_maghrib_sunnah",
    phase: "maghrib_isha",
    time: "06:00 PM • Sunset Prayer",
    title: "15. Maghrib Prayer & 2 Rak'ah Rawatib Sunnah",
    evidence: "Sahih Muslim 728: Part of the 12 daily Rawatib Rak'ahs that build a home in Jannah.",
    wisdom: "Marks the Islamic transition to a new calendar day with immediate gratitude."
  },
  {
    id: "s24_16_family_silat_rahim",
    phase: "maghrib_isha",
    time: "06:30 PM • Family & Kinship",
    title: "16. Warmth Toward Family & Serving at Home",
    evidence: "Sahih al-Bukhari 676: The Prophet ﷺ used to be in the service of his family, and when the time for prayer came, he would go out to pray.",
    wisdom: "Strengthens family bonds and emotional warmth away from digital distractions."
  },
  {
    id: "s24_17_isha_witr",
    phase: "maghrib_isha",
    time: "08:00 PM • Night Prayer",
    title: "17. Isha Prayer in Congregation & Witr Prayer",
    evidence: "Sahih Muslim 656: 'Whoever prays Isha in congregation, it is as if he stood half the night in prayer.'",
    wisdom: "Seals the active day with peace and odd-numbered Witr devotion (Bukhari 998)."
  },
  {
    id: "s24_18_surah_mulk_baqarah",
    phase: "maghrib_isha",
    time: "09:15 PM • Night Quran",
    title: "18. Reciting Surah Al-Mulk & Last 2 Ayahs of Al-Baqarah",
    evidence: "Sahih al-Bukhari 5009: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him.' & Tirmidhi 2891 (Surah Al-Mulk).",
    wisdom: "Replaces late-night doomscrolling with tranquil revelation; the Prophet ﷺ disliked idle talk after Isha (Bukhari 568)."
  },

  // PHASE 5: PROPHETIC SLEEP PROTOCOL
  {
    id: "s24_19_sleep_wudu_dusting",
    phase: "sleep_sunnah",
    time: "10:00 PM • Bedtime Purity",
    title: "19. Sleeping in Wudu, Dusting Bed 3x & Right-Side Posture",
    evidence: "Sahih al-Bukhari 247 & 6320: 'When you go to bed, perform ablution as you do for prayer, dust off the bed three times, and lie down on your right side.'",
    wisdom: "Right-side sleeping reduces cardiac compression, improves lymphatic brain drainage, and eases digestion."
  },
  {
    id: "s24_20_kursi_3quls",
    phase: "sleep_sunnah",
    time: "10:10 PM • Night Shield",
    title: "20. Ayat al-Kursi & Cupping Hands with the 3 Quls (3x)",
    evidence: "Sahih al-Bukhari 5017: The Prophet ﷺ cupped his hands, blew into them, recited Al-Ikhlas, Al-Falaq, and An-Nas, and wiped over his head, face, and body three times.",
    wisdom: "Creates a calming tactile and spiritual wind-down routine that signals deep restorative sleep."
  },
  {
    id: "s24_21_tasbih_fatimah",
    phase: "sleep_sunnah",
    time: "10:15 PM • Energy Renewal",
    title: "21. Tasbih Fatimah Before Sleep (33-33-34)",
    evidence: "Sahih al-Bukhari 5361: Reciting 33x SubhanAllah, 33x Alhamdulillah, and 34x Allahu Akbar at bedtime is better for physical strength than having a servant.",
    wisdom: "Quiets racing thoughts and prepares the mind to wake effortlessly for Tahajjud and Fajr."
  },
  {
    id: "s24_22_forgiving_before_sleep",
    phase: "sleep_sunnah",
    time: "10:20 PM • Clean Heart",
    title: "22. Sleeping with a Heart Free of Malice (Salim al-Sadr)",
    evidence: "Musnad Ahmad 12697: The companion promised Paradise three times by the Prophet ﷺ was the one who never went to sleep holding envy or hatred toward any Muslim.",
    wisdom: "Releasing resentment before sleep lowers nighttime blood pressure and heals emotional stress."
  },

  // PHASE 6: TIBB NABAWI DIET, DRESS & FITRAH HYGIENE
  {
    id: "s24_23_one_third_stomach",
    phase: "diet_hygiene",
    time: "Every Meal • Metabolic Sunnah",
    title: "23. 1/3 Food, 1/3 Drink, 1/3 Breath + Eating with Right Hand",
    evidence: "Jami` at-Tirmidhi 2380: 'A human being fills no worse vessel than his stomach... one-third for food, one-third for drink, and one-third for breath.'",
    wisdom: "Prevents post-prandial lethargy, insulin spikes, and acid reflux while preserving mental sharpness."
  },
  {
    id: "s24_24_water_three_sips",
    phase: "diet_hygiene",
    time: "Hydration • Prophetic Etiquette",
    title: "24. Drinking Water Sitting Down in 3 Mindful Sips",
    evidence: "Sahih Muslim 2028: The Prophet ﷺ breathed three times outside the vessel while drinking and said: 'It is more quenching, healthier, and more wholesome.'",
    wisdom: "Prevents aerophagia (swallowing air) and supports gentle vagal nerve regulation."
  },
  {
    id: "s24_25_tibb_nabawi_superfoods",
    phase: "diet_hygiene",
    time: "Daily Nutrition • Tibb Nabawi",
    title: "25. Prophetic Superfoods (Black Seed, Honey, Olive Oil, Dates, Talbinah)",
    evidence: "Sahih al-Bukhari 5688: 'In the black seed (Habbatus Sauda) there is healing for every disease except death.'",
    wisdom: "Rich in thymoquinone, polyphenols, and prebiotic beta-glucans that boost immunity and gut-brain health."
  },
  {
    id: "s24_26_fitrah_grooming",
    phase: "diet_hygiene",
    time: "Personal Care • Fitrah",
    title: "26. Maintaining the 5 Practices of Fitrah, Perfume & Clean Attire",
    evidence: "Sahih al-Bukhari 5889 & Sahih Muslim 91: 'Allah is Beautiful and loves beauty.'",
    wisdom: "High personal hygiene, nail care, and pleasant scent elevate self-respect and social dignity."
  },

  // PHASE 7: AKHLAQ (CHARACTER), SOCIAL ETIQUETTE & SUNNAH DAYS
  {
    id: "s24_27_salam_smiling",
    phase: "character_social",
    time: "Social • Prophetic Warmth",
    title: "27. Initiating Salam & Smiling as Sadaqah",
    evidence: "Jami` at-Tirmidhi 1956: 'Your smiling in the face of your brother is charity (Sadaqah).'",
    wisdom: "Triggers positive mirror-neuron responses, reduces social friction, and spreads trust."
  },
  {
    id: "s24_28_guarding_tongue_anger",
    phase: "character_social",
    time: "Self-Mastery • Emotional Discipline",
    title: "28. Guarding the Tongue & Controlling Anger",
    evidence: "Sahih al-Bukhari 6018: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.' & Bukhari 6116: 'Do not become angry.'",
    wisdom: "Preserves credibility, prevents regretful conflicts, and builds executive self-control."
  },
  {
    id: "s24_29_daily_sadaqah_istighfar",
    phase: "character_social",
    time: "Wealth & Soul • Barakah",
    title: "29. Daily Sadaqah (Charity) & 100x Istighfar",
    evidence: "Sahih Muslim 2588: 'Charity does not decrease wealth.' & Bukhari 6307: 'I seek Allah's forgiveness and repent to Him more than 70 (or 100) times a day.'",
    wisdom: "Cultivates an abundance mindset and purifies the heart from spiritual rust."
  },
  {
    id: "s24_30_honoring_parents",
    phase: "character_social",
    time: "Daily Duty • Birr al-Walidayn",
    title: "30. Dutifulness, Gentle Speech & Dua for Parents",
    evidence: "Quran 17:23-24 & Sahih al-Bukhari 5970: Dutifulness to parents is among the most beloved deeds to Allah right after prayer on time.",
    wisdom: "Brings immense Barakah in lifespan, provision (Rizq), and emotional grounding."
  },
  {
    id: "s24_31_mon_thu_fasting",
    phase: "character_social",
    time: "Weekly Cycle • Mon/Thu & White Days",
    title: "31. Sunnah Fasting (Mondays, Thursdays & 13th-15th Hijri)",
    evidence: "Jami` at-Tirmidhi 747: 'Deeds are presented on Monday and Thursday, and I love that my deeds be presented while I am fasting.'",
    wisdom: "Periodic fasting stimulates cellular autophagy, insulin sensitivity, and spiritual willpower."
  },
  {
    id: "s24_32_jumuah_kahf_salawat",
    phase: "character_social",
    time: "Friday Sunnah • Jumu'ah Protocol",
    title: "32. Friday Ghusl, Early Arrival, Surah Al-Kahf & Abundant Salawat",
    evidence: "Sahih al-Bukhari 881 & Al-Hakim: Reciting Surah Al-Kahf on Friday illuminates the believer with light between the two Fridays.",
    wisdom: "Provides a weekly spiritual summit that realigns life priorities and long-term vision."
  }
];

// Application State
let appState = {
  appName: "Sunnah 24",
  version: 24,
  customHabits: [],
  completionsByDate: {},
  diaryEntries: [],
  lifetimeDhikr: 0,
  signature: ""
};

let activePhase = "all";
let searchQuery = "";
let selectedMood = "Khushu (Tranquil)";
let tasbihCount = 0;
let tasbihTarget = 33;

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

// SHA-256 Web Crypto Hash for Sunnah 24 Tamper-Proof Verification
async function computeSHA256(payloadString) {
  const encoder = new TextEncoder();
  const data = encoder.encode(payloadString + "|" + LEDGER_SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getCanonicalStatePayload(stateObj) {
  return JSON.stringify({
    appName: "Sunnah 24",
    version: stateObj.version,
    customHabits: stateObj.customHabits || [],
    completionsByDate: stateObj.completionsByDate || {},
    diaryEntries: stateObj.diaryEntries || [],
    lifetimeDhikr: stateObj.lifetimeDhikr || 0
  });
}

async function saveAndSealState() {
  const payload = getCanonicalStatePayload(appState);
  appState.signature = await computeSHA256(payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  updateIntegrityUI(true);
}

async function loadAndVerifyState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    await saveAndSealState();
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    const expectedSig = await computeSHA256(getCanonicalStatePayload(parsed));
    const isIntact = parsed.signature === expectedSig;
    appState = parsed;
    updateIntegrityUI(isIntact);
  } catch (err) {
    console.error("Sunnah 24 Ledger check failed:", err);
    updateIntegrityUI(false);
  }
}

function updateIntegrityUI(isVerified) {
  const badge = document.getElementById("integrity-badge");
  const hashEl = document.getElementById("latest-hash-display");
  if (hashEl) {
    hashEl.textContent = appState.signature || "Pending signature...";
  }
  if (isVerified) {
    badge.textContent = "🛡️ S24 Verified";
    badge.className = "badge-verified";
  } else {
    badge.textContent = "⚠️ Tamper Alert";
    badge.className = "badge-verified badge-tampered";
  }
}

function renderHeaderDatesAndPhase() {
  const now = new Date();
  const greg = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  let hijri = "";
  try {
    hijri = new Intl.DateTimeFormat("en-TN-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);
  } catch {
    hijri = "Hijri Calendar Active";
  }

  document.getElementById("current-date-display").textContent = `${greg} • ${hijri}`;

  const hour = now.getHours();
  let phaseLabel = "🌌 Night & Tahajjud Window";
  if (hour >= 4 && hour < 7) phaseLabel = "🌌 Active: Pre-Dawn & Fajr Barakah";
  else if (hour >= 7 && hour < 12) phaseLabel = "☀️ Active: Duha & Ihsan Deep Work";
  else if (hour >= 12 && hour < 17) phaseLabel = "🌤️ Active: Dhuhr, Qaylulah & Asr";
  else if (hour >= 17 && hour < 21) phaseLabel = "🌆 Active: Maghrib, Family & Isha";
  else phaseLabel = "🛌 Active: Prophetic Sleep Protocol";

  document.getElementById("next-phase-banner").textContent = phaseLabel;

  const dayOfWeek = now.getDay();
  const fastBanner = document.getElementById("fasting-banner");

  if (dayOfWeek === 1 || dayOfWeek === 4) {
    fastBanner.textContent = "🌙 Today: Sunnah Fast (Mon/Thu)";
  } else if (dayOfWeek === 5) {
    fastBanner.textContent = "🕌 Jumu'ah: Surah Al-Kahf & Salawat";
  } else {
    fastBanner.textContent = "✨ Guard the 5 Fard Prayers";
  }
}

function getAllHabits() {
  return [...SUNNAH_24_HABITS, ...(appState.customHabits || [])];
}

function calculateStreak() {
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().split("T")[0];
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
  const todayKey = getTodayKey();
  const completedToday = appState.completionsByDate[todayKey] || [];
  const allHabits = getAllHabits();

  const filtered = allHabits.filter((h) => {
    const matchesPhase = activePhase === "all" || h.phase === activePhase;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      h.title.toLowerCase().includes(q) ||
      h.evidence.toLowerCase().includes(q) ||
      h.wisdom.toLowerCase().includes(q);
    return matchesPhase && matchesSearch;
  });

  document.getElementById("filter-count-label").textContent =
    `Showing ${filtered.length} of ${allHabits.length} Prophetic habits`;

  container.innerHTML = "";

  filtered.forEach((habit) => {
    const isDone = completedToday.includes(habit.id);
    const card = document.createElement("div");
    card.className = `habit-item ${isDone ? "completed" : ""}`;

    card.innerHTML = `
      <div class="habit-left">
        <div class="habit-check" data-toggle="${habit.id}">
          ${isDone ? "✓" : ""}
        </div>
        <div class="habit-info">
          <span class="habit-time">${habit.time || "Sunnah 24"}</span>
          <h4>${habit.title}</h4>
          <p class="habit-snippet">${habit.wisdom}</p>
        </div>
      </div>
      <button class="info-btn" data-info="${habit.id}">📖 Proof</button>
    `;

    container.appendChild(card);
  });

  const total = allHabits.length;
  const doneCount = completedToday.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  document.getElementById("daily-score-text").textContent = `${pct}%`;
  document.getElementById("completed-count-text").textContent =
    `${doneCount} of ${total} Prophetic habits completed today`;
  document.getElementById("daily-progress-bar").style.width = `${pct}%`;
  document.getElementById("streak-count").textContent = calculateStreak();
  renderWeeklyChart();
}

function renderWeeklyChart() {
  const chart = document.getElementById("weekly-chart");
  if (!chart) return;
  chart.innerHTML = "";
  const totalHabits = getAllHabits().length;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    const count = (appState.completionsByDate[key] || []).length;
    const pct = totalHabits > 0 ? Math.round((count / totalHabits) * 100) : 0;

    const col = document.createElement("div");
    col.className = "day-col";
    col.innerHTML = `
      <strong>${pct}%</strong>
      <small>${dayLabel}</small>
    `;
    chart.appendChild(col);
  }
}

async function toggleHabit(habitId) {
  const todayKey = getTodayKey();
  if (!appState.completionsByDate[todayKey]) {
    appState.completionsByDate[todayKey] = [];
  }
  const list = appState.completionsByDate[todayKey];
  const idx = list.indexOf(habitId);
  if (idx > -1) {
    list.splice(idx, 1);
  } else {
    list.push(habitId);
    if (navigator.vibrate) navigator.vibrate(15);
  }
  await saveAndSealState();
  renderHabits();
}

function openHabitModal(habitId) {
  const habit = getAllHabits().find((h) => h.id === habitId);
  if (!habit) return;
  document.getElementById("modal-title").textContent = habit.title;
  document.getElementById("modal-category").textContent = habit.time || "Sunnah 24 Habit";
  document.getElementById("modal-evidence").textContent = habit.evidence;
  document.getElementById("modal-wisdom").textContent = habit.wisdom;
  document.getElementById("fact-modal").classList.remove("hidden");
}

function renderDiaryHistory() {
  const listEl = document.getElementById("diary-history-list");
  listEl.innerHTML = "";
  const entries = [...(appState.diaryEntries || [])].reverse();

  if (entries.length === 0) {
    listEl.innerHTML = `<p class="muted">No Muhasabah reflections sealed yet.</p>`;
    return;
  }

  entries.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "modal-section";
    item.innerHTML = `
      <h4>📅 ${entry.date} — ${entry.mood}</h4>
      <p><strong>Shukr:</strong> ${entry.gratitude}</p>
      <p><strong>Tawbah:</strong> ${entry.shortcoming}</p>
      <p><strong>Niyyah:</strong> ${entry.niyyah}</p>
      <small style="color:#10b981;font-size:0.68rem;">SHA-256: ${entry.entryHash.slice(0, 28)}...</small>
    `;
    listEl.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadAndVerifyState();
  renderHeaderDatesAndPhase();
  renderHabits();
  renderDiaryHistory();
  document.getElementById("lifetime-dhikr-count").textContent = String(appState.lifetimeDhikr || 0);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  // Tab Navigation
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // Search Input
  document.getElementById("habit-search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderHabits();
  });

  // Reset Today's Checkmarks
  document.getElementById("reset-today-btn").addEventListener("click", async () => {
    const todayKey = getTodayKey();
    appState.completionsByDate[todayKey] = [];
    await saveAndSealState();
    renderHabits();
  });

  // Phase Chip Filtering
  document.querySelectorAll(".filter-bar .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-bar .chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activePhase = chip.dataset.phase;
      renderHabits();
    });
  });

  // Habit Toggle & Proof Modal
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

  document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("fact-modal").classList.add("hidden");
  });

  // Digital Tasbih Counter
  const selector = document.getElementById("tasbih-selector");
  selector.addEventListener("change", () => {
    const [target, label] = selector.value.split("|");
    tasbihTarget = parseInt(target, 10);
    tasbihCount = 0;
    document.getElementById("tasbih-current").textContent = "0";
    document.getElementById("tasbih-target").textContent = `/ ${tasbihTarget}`;
    document.getElementById("tasbih-label").textContent = label;
  });

  document.getElementById("tasbih-tap-area").addEventListener("click", async () => {
    tasbihCount++;
    appState.lifetimeDhikr = (appState.lifetimeDhikr || 0) + 1;
    if (navigator.vibrate) navigator.vibrate(25);
    if (tasbihCount > tasbihTarget) {
      tasbihCount = 1;
    }
    document.getElementById("tasbih-current").textContent = String(tasbihCount);
    document.getElementById("lifetime-dhikr-count").textContent = String(appState.lifetimeDhikr);
    await saveAndSealState();
  });

  document.getElementById("tasbih-reset-btn").addEventListener("click", () => {
    tasbihCount = 0;
    document.getElementById("tasbih-current").textContent = "0";
  });

  // Mood Selector
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mood-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedMood = btn.dataset.mood;
    });
  });

  // Save Muhasabah Reflection
  document.getElementById("save-diary-btn").addEventListener("click", async () => {
    const gratitude = document.getElementById("diary-gratitude").value.trim();
    const shortcoming = document.getElementById("diary-shortcoming").value.trim();
    const niyyah = document.getElementById("diary-niyyah").value.trim();

    if (!gratitude && !shortcoming && !niyyah) return;

    const date = getTodayKey();
    const entryHash = await computeSHA256(`${date}|${selectedMood}|${gratitude}|${shortcoming}|${niyyah}`);

    appState.diaryEntries.push({
      id: Date.now().toString(),
      date,
      mood: selectedMood,
      gratitude: gratitude || "Alhamdulillah",
      shortcoming: shortcoming || "Astaghfirullah",
      niyyah: niyyah || "Bismillah",
      entryHash
    });

    document.getElementById("diary-gratitude").value = "";
    document.getElementById("diary-shortcoming").value = "";
    document.getElementById("diary-niyyah").value = "";

    await saveAndSealState();
    renderDiaryHistory();
  });

  // Add Custom Habit
  document.getElementById("add-custom-habit-btn").addEventListener("click", async () => {
    const title = document.getElementById("custom-title").value.trim();
    const phase = document.getElementById("custom-phase").value;
    const fact = document.getElementById("custom-fact").value.trim();
    if (!title) return;

    appState.customHabits.push({
      id: "s24_custom_" + Date.now(),
      phase,
      time: "Custom Sunnah 24",
      title,
      evidence: fact || "Personal Sunnah 24 Goal",
      wisdom: fact || "The most beloved deeds to Allah are those done consistently, even if small (Sahih al-Bukhari 6464)."
    });

    document.getElementById("custom-title").value = "";
    document.getElementById("custom-fact").value = "";
    await saveAndSealState();
    renderHabits();
  });

  // Export Signed JSON Backup
  document.getElementById("export-backup-btn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(appState, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sunnah-24-backup-${getTodayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Restore & Verify Signed JSON Backup
  document.getElementById("import-backup-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const imported = JSON.parse(text);
      const expected = await computeSHA256(getCanonicalStatePayload(imported));
      if (imported.signature !== expected) {
        alert("⚠️ Sunnah 24 Security Alert: Backup signature mismatch! File integrity cannot be verified.");
        return;
      }
      appState = imported;
      await saveAndSealState();
      renderHabits();
      renderDiaryHistory();
      document.getElementById("lifetime-dhikr-count").textContent = String(appState.lifetimeDhikr || 0);
      alert("✅ Sunnah 24 Signed Backup Restored & Cryptographically Verified!");
    } catch {
      alert("Invalid Sunnah 24 backup file.");
    }
  });
});
