/**
 * SUNNAH 24 — ENTERPRISE PROPHETIC 24-HOUR LIFESTYLE & HABIT TRACKER
 * SHA-256 Tamper-Proof Cryptographic Engine + Multi-Language (EN/BN/AR) Immutable Packs
 */

const STORAGE_KEY = "SUNNAH_24_ENTERPRISE_LEDGER_V24";
const LEDGER_SALT = "MKRWEB-SUNNAH-24-CORPORATE-IMMUTABLE-SALT";
const I18N_SALT = "MKRWEB-SUNNAH-24-I18N-DICTIONARY-IMMUTABLE-SALT-V24";

// Deep-Freeze Utility to Prevent Runtime Prototype Pollution or Tampering of Translations
function deepFreeze(obj) {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => deepFreeze(obj[prop]));
  }
  return obj;
}

// Deterministic Canonical JSON Serializer for Cryptographic Hashing
function canonicalizeObject(value) {
  if (Array.isArray(value)) {
    return "[" + value.map(canonicalizeObject).join(",") + "]";
  }
  if (value && typeof value === "object") {
    return (
      "{" +
      Object.keys(value)
        .sort()
        .map((k) => JSON.stringify(k) + ":" + canonicalizeObject(value[k]))
        .join(",") +
      "}"
    );
  }
  return JSON.stringify(value);
}

// Immutable Multi-Language UI Dictionary (English, Bengali, Arabic)
const I18N_DICTIONARIES = deepFreeze({
  en: {
    dir: "ltr",
    localeTag: "en-US",
    app_title: "Sunnah 24",
    badge_verified: "🛡️ S24 Verified",
    badge_tampered: "⚠️ Tamper Alert",
    hero_mastery_label: "DAILY SUNNAH 24 MASTERY",
    day_streak: "Day Streak",
    tab_routine: "🕒 24H Routine",
    tab_adhkar: "📿 Adhkar",
    tab_diary: "📖 Muhasabah",
    tab_vault: "🔐 Vault & Info",
    search_placeholder: "🔍 Search 32+ Prophetic habits, Hadiths, Duas, or benefits...",
    phase_all: "All 24H",
    phase_tahajjud: "🌌 Pre-Dawn & Fajr",
    phase_duha: "☀️ Morning & Work",
    phase_dhuhr: "🌤️ Midday & Asr",
    phase_maghrib: "🌆 Evening & Isha",
    phase_sleep: "🛌 Prophetic Sleep",
    phase_diet: "🍯 Tibb Nabawi & Fitrah",
    phase_character: "🤝 Akhlaq & Sunnah Days",
    reset_today: "Reset Today",
    proof_btn: "📖 Proof",
    showing_habits: "Showing {shown} of {total} Prophetic habits",
    completed_habits: "{done} of {total} Prophetic habits completed today",
    phase_banner_night: "🌌 Night & Tahajjud Window",
    phase_banner_fajr: "🌌 Active: Pre-Dawn & Fajr Barakah",
    phase_banner_duha: "☀️ Active: Duha & Ihsan Deep Work",
    phase_banner_dhuhr: "🌤️ Active: Dhuhr, Qaylulah & Asr",
    phase_banner_maghrib: "🌆 Active: Maghrib, Family & Isha",
    phase_banner_sleep: "🛌 Active: Prophetic Sleep Protocol",
    fast_mon_thu: "🌙 Today: Sunnah Fast (Mon/Thu)",
    fast_jumuah: "🕌 Jumu'ah: Surah Al-Kahf & Salawat",
    fast_default: "✨ Guard the 5 Fard Prayers",
    tasbih_title: "📿 Sunnah 24 Haptic Digital Tasbih",
    tasbih_subtitle: "Select an authentic Prophetic Dhikr and tap the golden ring to count.",
    lifetime_dhikr: "Lifetime Verified Dhikr Count:",
    reset_cycle: "Reset Cycle",
    duas_heading: "🤲 Essential Daily Prophetic Duas",
    dua_wake_title: "🌅 Upon Waking Up (Bukhari 6312)",
    dua_wake_meaning: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    dua_istighfar_title: "🛡️ Sayyidul Istighfar — Chief Prayer for Forgiveness (Bukhari 6306)",
    dua_istighfar_meaning: "Whoever recites this with conviction in the morning and evening is guaranteed Paradise.",
    dua_sleep_title: "🛌 Before Sleeping (Bukhari 6324)",
    dua_sleep_meaning: "In Your Name my Lord, I lie down and in Your Name I rise.",
    diary_title: "📖 Daily Muhasabah (Self-Accountability)",
    diary_quote: "\"Hold yourselves accountable before you are held accountable, and weigh your deeds before they are weighed for you.\" — Umar ibn Al-Khattab (RA)",
    diary_mood_label: "Spiritual State of the Heart Today",
    mood_khushu: "😌 Khushu",
    mood_shukr: "🤲 Shukr",
    mood_sabr: "🌿 Sabr",
    mood_tawbah: "💧 Tawbah",
    diary_q1: "1. Blessing (Ni'mah) I am most grateful for today:",
    diary_q2: "2. Shortcomings to repent from & guard against:",
    diary_q3: "3. Sincere Intention (Niyyah) for tomorrow:",
    diary_save_btn: "💾 Cryptographically Seal Reflection",
    diary_ledger_title: "📜 Sealed Muhasabah Ledger",
    diary_empty: "No Muhasabah reflections sealed yet.",
    vault_matrix_title: "📊 7-Day Sunnah Consistency Matrix",
    vault_matrix_sub: "Your daily habit completion momentum across the past 7 days.",
    vault_custom_title: "➕ Add Personal Habit to Sunnah 24",
    custom_title_ph: "Habit Title (e.g., Memorize 5 Ayahs after Fajr)",
    custom_fact_ph: "Hadith Reference / Personal Benefit",
    custom_add_btn: "Add to Sunnah 24 Routine",
    vault_crypto_title: "🔐 SHA-256 Tamper-Proof Cryptographic Vault",
    vault_crypto_sub: "Every habit completion, Tasbih count, Muhasabah reflection, and language pack is chained with a SHA-256 cryptographic signature.",
    vault_hash_label: "ACTIVE SUNNAH 24 LEDGER DIGEST (SHA-256):",
    vault_i18n_hash_label: "TAMPER-PROOF MULTI-LANGUAGE PACK DIGEST (SHA-256):",
    export_btn: "⬇️ Export Signed JSON",
    import_btn: "⬆️ Restore Signed JSON",
    vault_compliance_title: "🏛️ Corporate & Google Play Compliance",
    vault_compliance_sub: "Sunnah 24 operates 100% offline with zero third-party trackers, zero ads, and full local data sovereignty.",
    privacy_policy_btn: "📄 View Privacy Policy",
    modal_evidence_heading: "📖 Authentic Prophetic Evidence (Quran & Sunnah)",
    modal_wisdom_heading: "🧠 Physiological, Psychological & Spiritual Wisdom",
    modal_close_btn: "Alhamdulillah, Understood"
  },
  bn: {
    dir: "ltr",
    localeTag: "bn-BD",
    app_title: "সুন্নাহ ২৪",
    badge_verified: "🛡️ S24 যাচাইকৃত",
    badge_tampered: "⚠️ টেম্পার সতর্কতা",
    hero_mastery_label: "দৈনিক সুন্নাহ ২৪ অনুশীলন",
    day_streak: "দিনের ধারাবাহিকতা",
    tab_routine: "🕒 ২৪ ঘণ্টা রুটিন",
    tab_adhkar: "📿 আযকার ও তাসবীহ",
    tab_diary: "📖 মুহাসাবা ডায়েরি",
    tab_vault: "🔐 ভল্ট ও তথ্য",
    search_placeholder: "🔍 ৩২+ সুন্নাহ আমল, হাদিস, দোয়া বা উপকারিতা খুঁজুন...",
    phase_all: "সব ২৪ ঘণ্টা",
    phase_tahajjud: "🌌 তাহাজ্জুদ ও ফজর",
    phase_duha: "☀️ সকাল ও কর্মক্ষেত্র",
    phase_dhuhr: "🌤️ যোহর, কাইলুলা ও আসর",
    phase_maghrib: "🌆 মাগরিব ও ইশা",
    phase_sleep: "🛌 সুন্নাহ সম্মত ঘুম",
    phase_diet: "🍯 তিব্বে নববী ও ফিতরাত",
    phase_character: "🤝 আখলাক ও সুন্নাহ দিবস",
    reset_today: "আজকের রিসেট",
    proof_btn: "📖 দলিল",
    showing_habits: "{total}টি নববী সুন্নাহর মধ্যে {shown}টি প্রদর্শিত হচ্ছে",
    completed_habits: "আজ {total}টি নববী সুন্নাহর মধ্যে {done}টি সম্পন্ন হয়েছে",
    phase_banner_night: "🌌 রাত ও তাহাজ্জুদের সময়",
    phase_banner_fajr: "🌌 চলমান: শেষ রাত ও ফজরের বরকত",
    phase_banner_duha: "☀️ চলমান: চাশত ও ইহসান ভিত্তিক কাজ",
    phase_banner_dhuhr: "🌤️ চলমান: যোহর, কাইলুলা ও আসর",
    phase_banner_maghrib: "🌆 চলমান: মাগরিব, পরিবার ও ইশা",
    phase_banner_sleep: "🛌 চলমান: নববী ঘুমের সুন্নাহ",
    fast_mon_thu: "🌙 আজ: সুন্নাহ রোজা (সোম/বৃহস্পতি)",
    fast_jumuah: "🕌 জুমু'আ: সূরা কাহফ ও দরূদ পাঠ",
    fast_default: "✨ ৫ ওয়াক্ত ফরজ সালাত হেফাজত করুন",
    tasbih_title: "📿 সুন্নাহ ২৪ ডিজিটাল তাসবীহ",
    tasbih_subtitle: "একটি সহীহ যিকির নির্বাচন করুন এবং গণনা করতে সোনালী বৃত্তে ট্যাপ করুন।",
    lifetime_dhikr: "মোট যাচাইকৃত যিকির গণনা:",
    reset_cycle: "পুনরায় শুরু করুন",
    duas_heading: "🤲 প্রতিদিনের জরুরি মাসনূন দোয়া",
    dua_wake_title: "🌅 ঘুম থেকে ওঠার দোয়া (বুখারী ৬৩১২)",
    dua_wake_meaning: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদেরকে মৃত করার পর জীবিত করেছেন এবং তাঁর কাছেই পুনরুত্থান।",
    dua_istighfar_title: "🛡️ সাইয়্যিদুল ইস্তিগফার (বুখারী ৬৩০৬)",
    dua_istighfar_meaning: "যে ব্যক্তি দৃঢ় বিশ্বাসের সাথে সকালে ও সন্ধ্যায় এটি পাঠ করবে সে জান্নাতবাসী হবে।",
    dua_sleep_title: "🛌 ঘুমানোর পূর্বে দোয়া (বুখারী ৬৩২৪)",
    dua_sleep_meaning: "হে আমার রব! আপনার নামেই আমি বিছানায় পার্শ্বদেশ রাখলাম এবং আপনার নামেই আবার উঠব।",
    diary_title: "📖 দৈনিক মুহাসাবা (আত্মসমালোচনা)",
    diary_quote: "\"তোমাদের হিসাব নেওয়ার আগেই নিজেদের হিসাব নাও এবং আমল ওজন করার আগেই তা ওজন করে দেখো।\" — উমর ইবনুল খাত্তাব (রা.)",
    diary_mood_label: "আজ অন্তরের আধ্যাত্মিক অবস্থা",
    mood_khushu: "😌 খুশু (প্রশান্ত)",
    mood_shukr: "🤲 শোকর (কৃতজ্ঞ)",
    mood_sabr: "🌿 সবর (ধৈর্যশীল)",
    mood_tawbah: "💧 তাওবাহ (অনুতপ্ত)",
    diary_q1: "১. আজকের যে নিয়ামতের জন্য আমি সবচেয়ে বেশি কৃতজ্ঞ:",
    diary_q2: "২. যে ভুলত্রুটি থেকে তাওবাহ ও সতর্ক থাকতে চাই:",
    diary_q3: "৩. আগামীকালের জন্য একনিষ্ঠ নিয়ত (Niyyah):",
    diary_save_btn: "💾 ক্রিপ্টোগ্রাফিক সিগনেচারসহ সংরক্ষণ করুন",
    diary_ledger_title: "📜 সংরক্ষিত মুহাসাবা লেজার",
    diary_empty: "এখনও কোনো মুহাসাবা ডায়েরি সংরক্ষণ করা হয়নি।",
    vault_matrix_title: "📊 ৭-দিনের সুন্নাহ ধারাবাহিকতা ম্যাট্রিক্স",
    vault_matrix_sub: "গত ৭ দিনে আপনার দৈনিক সুন্নাহ পালনের অগ্রগতি।",
    vault_custom_title: "➕ ব্যক্তিগত সুন্নাহ আমল যুক্ত করুন",
    custom_title_ph: "আমলের নাম (যেমন: ফজরের পর ৫ আয়াত হিফজ)",
    custom_fact_ph: "হাদিস সূত্র / উপকারিতা",
    custom_add_btn: "সুন্নাহ ২৪ রুটিনে যুক্ত করুন",
    vault_crypto_title: "🔐 SHA-256 টেম্পার-প্রুফ ক্রিপ্টোগ্রাফিক ভল্ট",
    vault_crypto_sub: "প্রতিটি আমল, তাসবীহ গণনা, মুহাসাবা ডায়েরি এবং ভাষা প্যাক SHA-256 ক্রিপ্টোগ্রাফিক স্বাক্ষর দ্বারা সুরক্ষিত।",
    vault_hash_label: "সক্রিয় সুন্নাহ ২৪ লেজার ডাইজেস্ট (SHA-256):",
    vault_i18n_hash_label: "টেম্পার-প্রুফ মাল্টি-ল্যাঙ্গুয়েজ প্যাক ডাইজেস্ট (SHA-256):",
    export_btn: "⬇️ ব্যাকআপ ডাউনলোড (JSON)",
    import_btn: "⬆️ ব্যাকআপ রিস্টোর (JSON)",
    vault_compliance_title: "🏛️ কর্পোরেট ও গুগল প্লে কমপ্লায়েন্স",
    vault_compliance_sub: "সুন্নাহ ২৪ সম্পূর্ণ অফলাইনে চলে—কোনো থার্ড-পার্টি ট্র্যাকার বা বিজ্ঞাপন নেই।",
    privacy_policy_btn: "📄 প্রাইভেসি পলিসি দেখুন",
    modal_evidence_heading: "📖 সহীহ কুরআন ও সুন্নাহর দলিল",
    modal_wisdom_heading: "🧠 শারীরিক, মানসিক ও আধ্যাত্মিক হিকমত",
    modal_close_btn: "আলহামদুলিল্লাহ, বুঝেছি"
  },
  ar: {
    dir: "rtl",
    localeTag: "ar-SA",
    app_title: "سنة ٢٤",
    badge_verified: "🛡️ موثق S24",
    badge_tampered: "⚠️ تنبيه تلاعب",
    hero_mastery_label: "إتقان السنن النبوية اليومي",
    day_streak: "أيام متتالية",
    tab_routine: "🕒 جدول ٢٤ ساعة",
    tab_adhkar: "📿 الأذكار والسبحة",
    tab_diary: "📖 المحاسبة اليومية",
    tab_vault: "🔐 الخزنة والمعلومات",
    search_placeholder: "🔍 ابحث في أكثر من ٣٢ سنة نبوية، حديث، دعاء أو فائدة...",
    phase_all: "كل ٢٤ ساعة",
    phase_tahajjud: "🌌 التهجد والفجر",
    phase_duha: "☀️ الضحى والعمل",
    phase_dhuhr: "🌤️ الظهر والقيلولة والعصر",
    phase_maghrib: "🌆 المغرب والعشاء",
    phase_sleep: "🛌 سنن النوم",
    phase_diet: "🍯 الطب النبوي والفطرة",
    phase_character: "🤝 الأخلاق وأيام السنة",
    reset_today: "إعادة تعيين اليوم",
    proof_btn: "📖 الدليل",
    showing_habits: "عرض {shown} من أصل {total} سنة نبوية",
    completed_habits: "تم إتمام {done} من أصل {total} سنة نبوية اليوم",
    phase_banner_night: "🌌 فترة الليل والتهجد",
    phase_banner_fajr: "🌌 الفترة الحالية: السحر وبركة الفجر",
    phase_banner_duha: "☀️ الفترة الحالية: الضحى وإتقان العمل",
    phase_banner_dhuhr: "🌤️ الفترة الحالية: الظهر والقيلولة والعصر",
    phase_banner_maghrib: "🌆 الفترة الحالية: المغرب والأهل والعشاء",
    phase_banner_sleep: "🛌 الفترة الحالية: سنن النوم النبوي",
    fast_mon_thu: "🌙 اليوم: صيام السنة (الإثنين/الخميس)",
    fast_jumuah: "🕌 الجمعة: سورة الكهف والصلاة على النبي ﷺ",
    fast_default: "✨ حافظ على الصلوات الخمس المفروضة",
    tasbih_title: "📿 سبحة سنة ٢٤ الرقمية",
    tasbih_subtitle: "اختر ذكراً نبوياً صحيحاً واضغط على الحلقة الذهبية للتسبيح.",
    lifetime_dhikr: "إجمالي الأذكار الموثقة:",
    reset_cycle: "تصفير العداد",
    duas_heading: "🤲 الأدعية النبوية اليومية الأساسية",
    dua_wake_title: "🌅 دعاء الاستيقاظ (البخاري ٦٣١٢)",
    dua_wake_meaning: "الحمد لله الذي أحيانا بعدما أماتنا وإليه النشور.",
    dua_istighfar_title: "🛡️ سيد الاستغفار (البخاري ٦٣٠٦)",
    dua_istighfar_meaning: "من قالها موقناً بها حين يمسي وحين يصبح دخل الجنة.",
    dua_sleep_title: "🛌 دعاء النوم (البخاري ٦٣٢٤)",
    dua_sleep_meaning: "باسمك ربي وضعت جنبي وبك أرفعه، فإن أمسكت نفسي فارحمها.",
    diary_title: "📖 المحاسبة اليومية للنفس",
    diary_quote: "\"حاسبوا أنفسكم قبل أن تحاسبوا، وزنوا أعمالكم قبل أن توزن عليكم.\" — عمر بن الخطاب رضي الله عنه",
    diary_mood_label: "الحالة الإيمانية للقلب اليوم",
    mood_khushu: "😌 خشوع",
    mood_shukr: "🤲 شكر",
    mood_sabr: "🌿 صبر",
    mood_tawbah: "💧 توبة",
    diary_q1: "١. نعمة أشكر الله عليها اليوم:",
    diary_q2: "٢. تقصير أتوب إلى الله منه وأحذر تكراره:",
    diary_q3: "٣. نية صادقة ليوم غد إن شاء الله:",
    diary_save_btn: "💾 ختم المحاسبة رقمياً (SHA-256)",
    diary_ledger_title: "📜 سجل المحاسبة المختوم",
    diary_empty: "لم يتم تسجيل أي محاسبة يومية بعد.",
    vault_matrix_title: "📊 مصفوفة الاستقامة لـ ٧ أيام",
    vault_matrix_sub: "معدل إتمامك للسنن النبوية خلال الأيام السبعة الماضية.",
    vault_custom_title: "➕ إضافة ورد أو سنة شخصية",
    custom_title_ph: "عنوان العمل (مثال: حفظ ٥ آيات بعد الفجر)",
    custom_fact_ph: "الدليل من الحديث أو الفائدة",
    custom_add_btn: "إضافة إلى جدول سنة ٢٤",
    vault_crypto_title: "🔐 الخزنة المشفرة المقاومة للتلاعب (SHA-256)",
    vault_crypto_sub: "كل إنجاز، تسبيح، محاسبة، وحزمة لغة مؤمنة بتوقيع رقمي SHA-256.",
    vault_hash_label: "البصمة الرقمية لسجل سنة ٢٤ (SHA-256):",
    vault_i18n_hash_label: "البصمة الرقمية لحزم اللغات الموثقة (SHA-256):",
    export_btn: "⬇️ تصدير نسخة موقعة (JSON)",
    import_btn: "⬆️ استعادة نسخة موقعة (JSON)",
    vault_compliance_title: "🏛️ الامتثال المؤسسي ومتجر Google Play",
    vault_compliance_sub: "يعمل تطبيق سنة ٢٤ بدون إنترنت ١٠٠٪ بدون أي إعلانات أو تتبع خارجي.",
    privacy_policy_btn: "📄 عرض سياسة الخصوصية",
    modal_evidence_heading: "📖 الدليل الصحيح من القرآن والسنة",
    modal_wisdom_heading: "🧠 الحكمة الروحية والنفسية والصحية",
    modal_close_btn: "الحمد لله، فهمت"
  }
});

// 32 Comprehensive Prophetic Habits & Islamic Habitual Facts Across 24 Hours (Multi-Language Translations Locked)
const SUNNAH_24_HABITS = deepFreeze([
  {
    id: "s24_01_waking_dua",
    phase: "tahajjud_fajr",
    time: "04:00 AM • Awakening",
    title: "1. Waking Dua & Wiping Sleep from the Face",
    title_bn: "১. ঘুম থেকে ওঠার দোয়া ও হাত দিয়ে মুখমণ্ডল মুছে নেওয়া",
    title_ar: "١. دعاء الاستيقاظ ومسح أثر النوم عن الوجه",
    evidence: "Sahih al-Bukhari 183: The Prophet ﷺ woke up, sat down, wiped sleep from his face with his hand, recited the last 10 verses of Surah Aal-e-Imran, and said: 'Alhamdulillahilladhi ahyana ba'da ma amatana wa ilayhin-nushur.'",
    wisdom: "Immediately anchors consciousness in gratitude and clears sleep inertia naturally before any blue-light screen exposure."
  },
  {
    id: "s24_02_miswak_wudu",
    phase: "tahajjud_fajr",
    time: "04:10 AM • Oral & Spiritual Purity",
    title: "2. Using Miswak (Siwak) & Mindful Wudu",
    title_bn: "২. মিসওয়াক ব্যবহার করা ও মনোযোগসহ অযু করা",
    title_ar: "٢. السواك وإسباغ الوضوء بخشوع",
    evidence: "Sahih al-Bukhari 887: 'Were it not that it would be too hard on my Ummah, I would have commanded them to use the Siwak at every prayer.'",
    wisdom: "Salvadora persica contains natural antibacterial compounds, silica, and fluoride that eliminate overnight oral bacteria and stimulate alertness."
  },
  {
    id: "s24_03_tahajjud",
    phase: "tahajjud_fajr",
    time: "04:20 AM • Last Third of Night",
    title: "3. Tahajjud (Qiyam al-Layl) & Pre-Dawn Istighfar",
    title_bn: "৩. তাহাজ্জুদ (কিয়ামুল লাইল) ও সাহরির সময়ে ইস্তিগফার",
    title_ar: "٣. صلاة التهجد (قيام الليل) والاستغفار بالأسحار",
    evidence: "Sahih Muslim 758 & Quran 51:18: Our Lord descends every night to the lowest heaven in the last third of the night asking: 'Who is calling upon Me that I may answer him?'",
    wisdom: "Quiet pre-dawn solitude builds emotional resilience, deep cognitive focus (Khushu), and inner peace."
  },
  {
    id: "s24_04_fajr_sunnah_fard",
    phase: "tahajjud_fajr",
    time: "05:00 AM • Dawn Prayer",
    title: "4. 2 Rak'ah Sunnah of Fajr + Fajr Fard on Time",
    title_bn: "৪. ফজরের ২ রাকাত সুন্নাত ও সময়মতো ফজরের ফরজ সালাত",
    title_ar: "٤. ركعتا سنة الفجر وصلاة الفجر في وقتها",
    evidence: "Sahih Muslim 725: 'The two Rak'ahs before the dawn (Fajr) prayer are better than this world and all that it contains.'",
    wisdom: "Synchronizes the human circadian clock with dawn light and places the believer under Allah's protection (Sahih Muslim 657)."
  },
  {
    id: "s24_05_post_fajr_barakah",
    phase: "tahajjud_fajr",
    time: "05:30 AM • Barakah Window",
    title: "5. Morning Adhkar, Quran Recitation & Staying Awake After Fajr",
    title_bn: "৫. সকালের আযকার, কুরআন তিলাওয়াত ও ফজরের পর না ঘুমানো",
    title_ar: "٥. أذكار الصباح وتلاوة القرآن وعدم النوم بعد الفجر",
    evidence: "Sunan Abi Dawud 2606: 'O Allah, bless my Ummah in their early mornings.' The Prophet ﷺ did not sleep immediately after Fajr.",
    wisdom: "Harnesses peak morning cortisol and dopamine levels for Quranic contemplation, study, and strategic planning."
  },
  {
    id: "s24_06_ishraq_reflection",
    phase: "tahajjud_fajr",
    time: "06:15 AM • Post-Sunrise",
    title: "6. Sunrise Remembrance & 2 Rak'ah Ishraq",
    title_bn: "৬. সূর্যোদয় পর্যন্ত যিকির ও ২ রাকাত ইশরাক সালাত",
    title_ar: "٦. جلسة الذكر بعد الفجر وصلاة ركعتي الإشراق",
    evidence: "Jami` at-Tirmidhi 586: Whoever prays Fajr in congregation, then sits remembering Allah until the sun rises, then prays two Rak'ahs, has the reward of a complete Hajj and Umrah.",
    wisdom: "Morning sunlight exposure regulates serotonin and melatonin cycles for the entire 24-hour period."
  },
  {
    id: "s24_07_home_exit_dua",
    phase: "duha_work",
    time: "08:00 AM • Stepping Out",
    title: "7. Stepping Out with Bismillah & Tawakkul Dua",
    title_bn: "৭. বিসমিল্লাহ ও তাওয়াক্কুলের দোয়া পড়ে ঘর থেকে বের হওয়া",
    title_ar: "٧. دعاء الخروج من المنزل والتوكل على الله",
    evidence: "Sunan Abi Dawud 5095: Whoever says upon leaving his house 'Bismillahi, tawakkaltu 'alallah, la hawla wa la quwwata illa billah' is told: 'You are guided, sufficed, and protected.'",
    wisdom: "Instills psychological calm and purposeful reliance on Allah before entering academic or professional environments."
  },
  {
    id: "s24_08_salat_duha",
    phase: "duha_work",
    time: "08:45 AM • Forenoon Prayer",
    title: "8. Salat al-Duha (Charity for All 360 Joints)",
    title_bn: "৮. সালাতুদ দুহা বা চাশতের সালাত (৩৬০টি জোড়ার সদকা)",
    title_ar: "٨. صلاة الضحى (صدقة عن ٣٦٠ مفصلاً)",
    evidence: "Sahih Muslim 720: Every single morning charity is due upon every joint of your body; and two Rak'ahs offered in the forenoon (Duha) suffice for all 360 joints.",
    wisdom: "Serves as a mindful mid-morning reset that relieves spinal and joint tension during long study or coding sessions."
  },
  {
    id: "s24_09_halal_ihsan_work",
    phase: "duha_work",
    time: "09:00 AM • Deep Work",
    title: "9. Pursuing Knowledge & Work with Ihsan (Excellence)",
    title_bn: "৯. ইহসান (উৎকর্ষতা) ও সততার সাথে জ্ঞানার্জন ও হালাল কাজ",
    title_ar: "٩. طلب العلم والعمل الحلال بإحسان وإتقان",
    evidence: "Sahih Muslim 1955: 'Verily, Allah has prescribed Ihsan (excellence/proficiency) in all things.' & Bukhari 2072.",
    wisdom: "Elevates secular study, legal preparation, programming, and entrepreneurship into continuous worship (Ibadah)."
  },
  {
    id: "s24_10_tayammun_right",
    phase: "duha_work",
    time: "All Day • Prophetic Mindfulness",
    title: "10. Tayammun (Beginning Noble Actions with the Right Side)",
    title_bn: "১০. তায়াম্মুন (সকল উত্তম কাজ ডান দিক থেকে শুরু করা)",
    title_ar: "١٠. التيمن (البدء باليمين في الشؤون الطيبة)",
    evidence: "Sahih al-Bukhari 168: The Prophet ﷺ loved to start from the right side when putting on shoes, combing hair, purifying himself, and in all his noble affairs.",
    wisdom: "Replaces habitual autopilot with conscious Prophetic intentionality in every physical movement."
  },
  {
    id: "s24_11_dhuhr_rawatib",
    phase: "dhuhr_asr",
    time: "01:15 PM • Midday Prayer",
    title: "11. Dhuhr Prayer & Rawatib Sunnahs (4 Before, 2 After)",
    title_bn: "১১. যোহরের ফরজ সালাত ও সুন্নাতে মুয়াক্কাদাহ (পূর্বে ৪, পরে ২)",
    title_ar: "١١. صلاة الظهر والسنن الرواتب (٤ قبلها و٢ بعدها)",
    evidence: "Jami` at-Tirmidhi 414: Whoever persists in performing 12 Rak'ahs from the Sunnah daily, Allah will build a house for him in Paradise.",
    wisdom: "Provides a structured spiritual pause at solar noon that detaches the heart from worldly stress."
  },
  {
    id: "s24_12_qaylulah_nap",
    phase: "dhuhr_asr",
    time: "02:00 PM • Cognitive Recovery",
    title: "12. Qaylulah (20-Minute Prophetic Power Nap)",
    title_bn: "১২. কাইলুলা (দুপুরের সংক্ষিপ্ত নববী বিশ্রাম)",
    title_ar: "١٢. القيلولة النبوية (قسط يسير من الراحة ظهراً)",
    evidence: "Sahih al-Jami 4431: 'Take a midday nap (Qaylulah), for the Shayatin do not take a midday nap.'",
    wisdom: "Neuroscience confirms a 15–25 minute early afternoon nap clears adenosine buildup and restores executive function."
  },
  {
    id: "s24_13_asr_prayer",
    phase: "dhuhr_asr",
    time: "04:30 PM • The Middle Prayer",
    title: "13. Guarding Salat al-Asr on Time",
    title_bn: "১৩. সময়মতো সালাতুল আসর (মধ্যবর্তী সালাত) আদায় করা",
    title_ar: "١٣. المحافظة على صلاة العصر (الصلاة الوسطى) في وقتها",
    evidence: "Quran 2:238: 'Guard strictly your prayers, especially the Middle Prayer (Asr).' & Sahih al-Bukhari 553.",
    wisdom: "Prevents late-afternoon burnout and anchors the transition from work to evening tranquility."
  },
  {
    id: "s24_14_evening_adhkar",
    phase: "dhuhr_asr",
    time: "05:00 PM • Fortress of Dhikr",
    title: "14. Evening Adhkar (Adhkar al-Masa') Before Sunset",
    title_bn: "১৪. সূর্যাস্তের পূর্বে সন্ধ্যার আযকার (আযকারুল মাসা)",
    title_ar: "١٤. أذكار المساء قبل غروب الشمس",
    evidence: "Quran 33:41-42: 'O you who believe, remember Allah with much remembrance, and glorify Him morning and evening.'",
    wisdom: "Lowers evening cortisol and shields the mind from anxiety and spiritual restlessness."
  },
  {
    id: "s24_15_maghrib_sunnah",
    phase: "maghrib_isha",
    time: "06:00 PM • Sunset Prayer",
    title: "15. Maghrib Prayer & 2 Rak'ah Rawatib Sunnah",
    title_bn: "১৫. মাগরিবের ফরজ সালাত ও ২ রাকাত সুন্নাতে মুয়াক্কাদাহ",
    title_ar: "١٥. صلاة المغرب وركعتا السنة الراتبة",
    evidence: "Sahih Muslim 728: Part of the 12 daily Rawatib Rak'ahs that build a home in Jannah.",
    wisdom: "Marks the Islamic transition to a new calendar day with immediate gratitude."
  },
  {
    id: "s24_16_family_silat_rahim",
    phase: "maghrib_isha",
    time: "06:30 PM • Family & Kinship",
    title: "16. Warmth Toward Family & Serving at Home",
    title_bn: "১৬. পরিবারের সাথে সদাচরণ ও ঘরের কাজে সহায়তা করা",
    title_ar: "١٦. حسن العشرة وخدمة الأهل في المنزل",
    evidence: "Sahih al-Bukhari 676: The Prophet ﷺ used to be in the service of his family, and when the time for prayer came, he would go out to pray.",
    wisdom: "Strengthens family bonds and emotional warmth away from digital distractions."
  },
  {
    id: "s24_17_isha_witr",
    phase: "maghrib_isha",
    time: "08:00 PM • Night Prayer",
    title: "17. Isha Prayer in Congregation & Witr Prayer",
    title_bn: "১৭. জামাতের সাথে ইশার সালাত ও বিতর সালাত আদায়",
    title_ar: "١٧. صلاة العشاء في جماعة وصلاة الوتر",
    evidence: "Sahih Muslim 656: 'Whoever prays Isha in congregation, it is as if he stood half the night in prayer.'",
    wisdom: "Seals the active day with peace and odd-numbered Witr devotion (Bukhari 998)."
  },
  {
    id: "s24_18_surah_mulk_baqarah",
    phase: "maghrib_isha",
    time: "09:15 PM • Night Quran",
    title: "18. Reciting Surah Al-Mulk & Last 2 Ayahs of Al-Baqarah",
    title_bn: "১৮. সূরা আল-মুলক এবং সূরা বাকারার শেষ ২ আয়াত তিলাওয়াত",
    title_ar: "١٨. قراءة سورة الملك وآخر آيتين من سورة البقرة",
    evidence: "Sahih al-Bukhari 5009: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him.' & Tirmidhi 2891 (Surah Al-Mulk).",
    wisdom: "Replaces late-night doomscrolling with tranquil revelation; the Prophet ﷺ disliked idle talk after Isha (Bukhari 568)."
  },
  {
    id: "s24_19_sleep_wudu_dusting",
    phase: "sleep_sunnah",
    time: "10:00 PM • Bedtime Purity",
    title: "19. Sleeping in Wudu, Dusting Bed 3x & Right-Side Posture",
    title_bn: "১৯. অযু অবস্থায় ঘুমানো, বিছানা ৩ বার ঝাড়া ও ডান কাত হয়ে শোয়া",
    title_ar: "١٩. النوم على طهارة ونفض الفراش ٣ مرات والنوم على الشق الأيمن",
    evidence: "Sahih al-Bukhari 247 & 6320: 'When you go to bed, perform ablution as you do for prayer, dust off the bed three times, and lie down on your right side.'",
    wisdom: "Right-side sleeping reduces cardiac compression, improves lymphatic brain drainage, and eases digestion."
  },
  {
    id: "s24_20_kursi_3quls",
    phase: "sleep_sunnah",
    time: "10:10 PM • Night Shield",
    title: "20. Ayat al-Kursi & Cupping Hands with the 3 Quls (3x)",
    title_bn: "২০. আয়াতুল কুরসী ও তিন কুল পড়ে হাত মুবারক দিয়ে শরীরে মাসেহ (৩ বার)",
    title_ar: "٢٠. آية الكرسي والنفث في الكفين بالمعوذات (٣ مرات)",
    evidence: "Sahih al-Bukhari 5017: The Prophet ﷺ cupped his hands, blew into them, recited Al-Ikhlas, Al-Falaq, and An-Nas, and wiped over his head, face, and body three times.",
    wisdom: "Creates a calming tactile and spiritual wind-down routine that signals deep restorative sleep."
  },
  {
    id: "s24_21_tasbih_fatimah",
    phase: "sleep_sunnah",
    time: "10:15 PM • Energy Renewal",
    title: "21. Tasbih Fatimah Before Sleep (33-33-34)",
    title_bn: "২১. ঘুমানোর পূর্বে তাসবীহ ফাতিমী পাঠ (৩৩-৩৩-৩৪)",
    title_ar: "٢١. تسبيح فاطمة رضي الله عنها قبل النوم (٣٣-٣٣-٣٤)",
    evidence: "Sahih al-Bukhari 5361: Reciting 33x SubhanAllah, 33x Alhamdulillah, and 34x Allahu Akbar at bedtime is better for physical strength than having a servant.",
    wisdom: "Quiets racing thoughts and prepares the mind to wake effortlessly for Tahajjud and Fajr."
  },
  {
    id: "s24_22_forgiving_before_sleep",
    phase: "sleep_sunnah",
    time: "10:20 PM • Clean Heart",
    title: "22. Sleeping with a Heart Free of Malice (Salim al-Sadr)",
    title_bn: "২২. হিংসা-বিদ্বেষমুক্ত পবিত্র অন্তরে (সালীমুস সদর) ঘুমানো",
    title_ar: "٢٢. النوم بقلب سليم خالٍ من الغل والحقد على المسلمين",
    evidence: "Musnad Ahmad 12697: The companion promised Paradise three times by the Prophet ﷺ was the one who never went to sleep holding envy or hatred toward any Muslim.",
    wisdom: "Releasing resentment before sleep lowers nighttime blood pressure and heals emotional stress."
  },
  {
    id: "s24_23_one_third_stomach",
    phase: "diet_hygiene",
    time: "Every Meal • Metabolic Sunnah",
    title: "23. 1/3 Food, 1/3 Drink, 1/3 Breath + Eating with Right Hand",
    title_bn: "২৩. পেটের ১/৩ খাবার, ১/৩ পানি, ১/৩ শ্বাস ও ডান হাতে খাওয়া",
    title_ar: "٢٣. ثلث للطعام وثلث للشراب وثلث للنفس والأكل باليمين",
    evidence: "Jami` at-Tirmidhi 2380: 'A human being fills no worse vessel than his stomach... one-third for food, one-third for drink, and one-third for breath.'",
    wisdom: "Prevents post-prandial lethargy, insulin spikes, and acid reflux while preserving mental sharpness."
  },
  {
    id: "s24_24_water_three_sips",
    phase: "diet_hygiene",
    time: "Hydration • Prophetic Etiquette",
    title: "24. Drinking Water Sitting Down in 3 Mindful Sips",
    title_bn: "২৪. বসে এবং ৩ নিঃশ্বাসে পানি পান করা",
    title_ar: "٢٤. شرب الماء جالساً على ثلاث دفعات",
    evidence: "Sahih Muslim 2028: The Prophet ﷺ breathed three times outside the vessel while drinking and said: 'It is more quenching, healthier, and more wholesome.'",
    wisdom: "Prevents aerophagia (swallowing air) and supports gentle vagal nerve regulation."
  },
  {
    id: "s24_25_tibb_nabawi_superfoods",
    phase: "diet_hygiene",
    time: "Daily Nutrition • Tibb Nabawi",
    title: "25. Prophetic Superfoods (Black Seed, Honey, Olive Oil, Dates, Talbinah)",
    title_bn: "২৫. তিব্বে নববী খাবার (কালোজিরা, মধু, যায়তুন তেল, খেজুর, তালবিনা)",
    title_ar: "٢٥. أغذية الطب النبوي (الحبة السوداء، العسل، زيت الزيتون، التمر، التلبينة)",
    evidence: "Sahih al-Bukhari 5688: 'In the black seed (Habbatus Sauda) there is healing for every disease except death.'",
    wisdom: "Rich in thymoquinone, polyphenols, and prebiotic beta-glucans that boost immunity and gut-brain health."
  },
  {
    id: "s24_26_fitrah_grooming",
    phase: "diet_hygiene",
    time: "Personal Care • Fitrah",
    title: "26. Maintaining the 5 Practices of Fitrah, Perfume & Clean Attire",
    title_bn: "২৬. ফিতরাতের ৫টি সুন্নাহ, সুগন্ধি ব্যবহার ও পরিচ্ছন্ন পোশাক",
    title_ar: "٢٦. خصال الفطرة الخمس والطيب ونظافة الثياب",
    evidence: "Sahih al-Bukhari 5889 & Sahih Muslim 91: 'Allah is Beautiful and loves beauty.'",
    wisdom: "High personal hygiene, nail care, and pleasant scent elevate self-respect and social dignity."
  },
  {
    id: "s24_27_salam_smiling",
    phase: "character_social",
    time: "Social • Prophetic Warmth",
    title: "27. Initiating Salam & Smiling as Sadaqah",
    title_bn: "২৭. আগে সালাম দেওয়া এবং হাসিমুখে কথা বলা (সদকা)",
    title_ar: "٢٧. إفشاء السلام والتبسم في وجه أخيك صدقة",
    evidence: "Jami` at-Tirmidhi 1956: 'Your smiling in the face of your brother is charity (Sadaqah).'",
    wisdom: "Triggers positive mirror-neuron responses, reduces social friction, and spreads trust."
  },
  {
    id: "s24_28_guarding_tongue_anger",
    phase: "character_social",
    time: "Self-Mastery • Emotional Discipline",
    title: "28. Guarding the Tongue & Controlling Anger",
    title_bn: "২৮. জিহ্বার হেফাজত করা ও রাগ নিয়ন্ত্রণ করা",
    title_ar: "٢٨. حفظ اللسان وكظم الغيظ وترك الغضب",
    evidence: "Sahih al-Bukhari 6018: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.' & Bukhari 6116: 'Do not become angry.'",
    wisdom: "Preserves credibility, prevents regretful conflicts, and builds executive self-control."
  },
  {
    id: "s24_29_daily_sadaqah_istighfar",
    phase: "character_social",
    time: "Wealth & Soul • Barakah",
    title: "29. Daily Sadaqah (Charity) & 100x Istighfar",
    title_bn: "২৯. দৈনিক সদকা (দান) এবং ১০০ বার ইস্তিগফার পাঠ",
    title_ar: "٢٩. الصدقة اليومية والاستغفار ١٠٠ مرة",
    evidence: "Sahih Muslim 2588: 'Charity does not decrease wealth.' & Bukhari 6307: 'I seek Allah's forgiveness and repent to Him more than 70 (or 100) times a day.'",
    wisdom: "Cultivates an abundance mindset and purifies the heart from spiritual rust."
  },
  {
    id: "s24_30_honoring_parents",
    phase: "character_social",
    time: "Daily Duty • Birr al-Walidayn",
    title: "30. Dutifulness, Gentle Speech & Dua for Parents",
    title_bn: "৩০. পিতা-মাতার খেদমত, নম্র আচরণ ও তাঁদের জন্য দোয়া করা",
    title_ar: "٣٠. بر الوالدين وخفض الجناح والدعاء لهما",
    evidence: "Quran 17:23-24 & Sahih al-Bukhari 5970: Dutifulness to parents is among the most beloved deeds to Allah right after prayer on time.",
    wisdom: "Brings immense Barakah in lifespan, provision (Rizq), and emotional grounding."
  },
  {
    id: "s24_31_mon_thu_fasting",
    phase: "character_social",
    time: "Weekly Cycle • Mon/Thu & White Days",
    title: "31. Sunnah Fasting (Mondays, Thursdays & 13th-15th Hijri)",
    title_bn: "৩১. সুন্নাহ রোজা (সোমবার, বৃহস্পতিবার ও আইয়ামে বীজ ১৩-১৫ হিজরি)",
    title_ar: "٣١. صيام الإثنين والخميس والأيام البيض (١٣-١٥ هجري)",
    evidence: "Jami` at-Tirmidhi 747: 'Deeds are presented on Monday and Thursday, and I love that my deeds be presented while I am fasting.'",
    wisdom: "Periodic fasting stimulates cellular autophagy, insulin sensitivity, and spiritual willpower."
  },
  {
    id: "s24_32_jumuah_kahf_salawat",
    phase: "character_social",
    time: "Friday Sunnah • Jumu'ah Protocol",
    title: "32. Friday Ghusl, Early Arrival, Surah Al-Kahf & Abundant Salawat",
    title_bn: "৩২. জুমু'আর গোসল, আগেভাগে মসজিদে গমন, সূরা কাহফ ও অধিক দরূদ পাঠ",
    title_ar: "٣٢. غسل الجمعة والتبكير وسورة الكهف والإكثار من الصلاة على النبي ﷺ",
    evidence: "Sahih al-Bukhari 881 & Al-Hakim: Reciting Surah Al-Kahf on Friday illuminates the believer with light between the two Fridays.",
    wisdom: "Provides a weekly spiritual summit that realigns life priorities and long-term vision."
  }
]);

// Application State
let appState = {
  appName: "Sunnah 24",
  version: 24,
  locale: "en",
  i18nHash: "",
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
let verifiedI18nDigest = "";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

// Translation Helper Function
function t(key, replacements = {}) {
  const lang = I18N_DICTIONARIES[appState.locale] ? appState.locale : "en";
  let str = I18N_DICTIONARIES[lang][key] || I18N_DICTIONARIES.en[key] || key;
  Object.keys(replacements).forEach((k) => {
    str = str.replace(`{${k}}`, replacements[k]);
  });
  return str;
}

// Get Localized Habit Title
function getLocalizedHabitTitle(habit) {
  if (appState.locale === "bn" && habit.title_bn) return habit.title_bn;
  if (appState.locale === "ar" && habit.title_ar) return habit.title_ar;
  return habit.title;
}

// SHA-256 Web Crypto Hash for Sunnah 24 Tamper-Proof Verification
async function computeSHA256(payloadString, salt = LEDGER_SALT) {
  const encoder = new TextEncoder();
  const data = encoder.encode(payloadString + "|" + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Compute Immutable Digest of All Multi-Language Packs & Prophetic Habits
async function computeI18nDictionaryHash() {
  const canonicalPayload = canonicalizeObject({
    dictionaries: I18N_DICTIONARIES,
    habits: SUNNAH_24_HABITS
  });
  return computeSHA256(canonicalPayload, I18N_SALT);
}

function getCanonicalStatePayload(stateObj) {
  return JSON.stringify({
    appName: "Sunnah 24",
    version: stateObj.version,
    locale: stateObj.locale || "en",
    i18nHash: stateObj.i18nHash || verifiedI18nDigest,
    customHabits: stateObj.customHabits || [],
    completionsByDate: stateObj.completionsByDate || {},
    diaryEntries: stateObj.diaryEntries || [],
    lifetimeDhikr: stateObj.lifetimeDhikr || 0
  });
}

async function saveAndSealState() {
  verifiedI18nDigest = await computeI18nDictionaryHash();
  appState.i18nHash = verifiedI18nDigest;
  const payload = getCanonicalStatePayload(appState);
  appState.signature = await computeSHA256(payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  updateIntegrityUI(true);
}

async function loadAndVerifyState() {
  verifiedI18nDigest = await computeI18nDictionaryHash();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    await saveAndSealState();
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.locale) parsed.locale = "en";
    if (!parsed.i18nHash) parsed.i18nHash = verifiedI18nDigest;

    const expectedSig = await computeSHA256(getCanonicalStatePayload(parsed));
    const isLedgerIntact = parsed.signature === expectedSig;
    const isI18nIntact =
      parsed.i18nHash === verifiedI18nDigest &&
      Object.isFrozen(I18N_DICTIONARIES) &&
      Object.isFrozen(SUNNAH_24_HABITS);

    appState = parsed;
    updateIntegrityUI(isLedgerIntact && isI18nIntact);
  } catch (err) {
    console.error("Sunnah 24 Ledger check failed:", err);
    updateIntegrityUI(false);
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
  if (isVerified) {
    badge.textContent = t("badge_verified");
    badge.className = "badge-verified";
  } else {
    badge.textContent = t("badge_tampered");
    badge.className = "badge-verified badge-tampered";
  }
}

// Apply Active Language Pack to DOM & Document Direction (LTR / RTL)
function applyLanguageToDOM() {
  const langConfig = I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.en;
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

  renderHeaderDatesAndPhase();
  renderHabits();
  renderDiaryHistory();
  updateIntegrityUI(true);
}

function renderHeaderDatesAndPhase() {
  const now = new Date();
  const localeTag = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.en).localeTag;

  const greg = now.toLocaleDateString(localeTag, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  let hijri = "";
  try {
    hijri = new Intl.DateTimeFormat(`${localeTag}-u-ca-islamic-umalqura`, {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);
  } catch {
    hijri = "Hijri Calendar Active";
  }

  document.getElementById("current-date-display").textContent = `${greg} • ${hijri}`;

  const hour = now.getHours();
  let phaseLabel = t("phase_banner_night");
  if (hour >= 4 && hour < 7) phaseLabel = t("phase_banner_fajr");
  else if (hour >= 7 && hour < 12) phaseLabel = t("phase_banner_duha");
  else if (hour >= 12 && hour < 17) phaseLabel = t("phase_banner_dhuhr");
  else if (hour >= 17 && hour < 21) phaseLabel = t("phase_banner_maghrib");
  else phaseLabel = t("phase_banner_sleep");

  document.getElementById("next-phase-banner").textContent = phaseLabel;

  const dayOfWeek = now.getDay();
  const fastBanner = document.getElementById("fasting-banner");

  if (dayOfWeek === 1 || dayOfWeek === 4) {
    fastBanner.textContent = t("fast_mon_thu");
  } else if (dayOfWeek === 5) {
    fastBanner.textContent = t("fast_jumuah");
  } else {
    fastBanner.textContent = t("fast_default");
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
    const localizedTitle = getLocalizedHabitTitle(h).toLowerCase();
    const matchesSearch =
      !q ||
      localizedTitle.includes(q) ||
      h.title.toLowerCase().includes(q) ||
      h.evidence.toLowerCase().includes(q) ||
      h.wisdom.toLowerCase().includes(q);
    return matchesPhase && matchesSearch;
  });

  document.getElementById("filter-count-label").textContent = t("showing_habits", {
    shown: filtered.length,
    total: allHabits.length
  });

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
          <h4>${getLocalizedHabitTitle(habit)}</h4>
          <p class="habit-snippet">${habit.wisdom}</p>
        </div>
      </div>
      <button class="info-btn" data-info="${habit.id}">${t("proof_btn")}</button>
    `;

    container.appendChild(card);
  });

  const total = allHabits.length;
  const doneCount = completedToday.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  document.getElementById("daily-score-text").textContent = `${pct}%`;
  document.getElementById("completed-count-text").textContent = t("completed_habits", {
    done: doneCount,
    total
  });
  document.getElementById("daily-progress-bar").style.width = `${pct}%`;
  document.getElementById("streak-count").textContent = calculateStreak();
  renderWeeklyChart();
}

function renderWeeklyChart() {
  const chart = document.getElementById("weekly-chart");
  if (!chart) return;
  chart.innerHTML = "";
  const totalHabits = getAllHabits().length;
  const localeTag = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.en).localeTag;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString(localeTag, { weekday: "short" });
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
  document.getElementById("modal-title").textContent = getLocalizedHabitTitle(habit);
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
    listEl.innerHTML = `<p class="muted">${t("diary_empty")}</p>`;
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
  applyLanguageToDOM();
  document.getElementById("lifetime-dhikr-count").textContent = String(appState.lifetimeDhikr || 0);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  // Language Switcher with Cryptographic Re-Verification & Sealing
  document.getElementById("lang-switcher").addEventListener("change", async (e) => {
    const requestedLang = e.target.value;
    if (!I18N_DICTIONARIES[requestedLang]) return;

    const currentDigest = await computeI18nDictionaryHash();
    if (currentDigest !== verifiedI18nDigest || !Object.isFrozen(I18N_DICTIONARIES)) {
      updateIntegrityUI(false);
      alert("⚠️ Security Alert: Multi-Language Dictionary Tampering Detected!");
      return;
    }

    appState.locale = requestedLang;
    applyLanguageToDOM();
    await saveAndSealState();
  });

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
    const entryHash = await computeSHA256(
      `${date}|${appState.locale}|${selectedMood}|${gratitude}|${shortcoming}|${niyyah}`
    );

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
      wisdom:
        fact ||
        "The most beloved deeds to Allah are those done consistently, even if small (Sahih al-Bukhari 6464)."
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
      if (!imported.locale) imported.locale = "en";
      if (!imported.i18nHash) imported.i18nHash = verifiedI18nDigest;

      const expected = await computeSHA256(getCanonicalStatePayload(imported));
      if (imported.signature !== expected) {
        alert("⚠️ Sunnah 24 Security Alert: Backup signature mismatch! File integrity cannot be verified.");
        return;
      }
      appState = imported;
      await saveAndSealState();
      applyLanguageToDOM();
      document.getElementById("lifetime-dhikr-count").textContent = String(appState.lifetimeDhikr || 0);
      alert("✅ Sunnah 24 Signed Backup Restored & Cryptographically Verified!");
    } catch {
      alert("Invalid Sunnah 24 backup file.");
    }
  });
});
