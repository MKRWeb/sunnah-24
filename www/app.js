/**
 * SUNNAH 24 — ENTERPRISE PROPHETIC 24-HOUR LIFESTYLE & HABIT TRACKER (v4.2)
 * SHA-256 Tamper-Proof Engine + Triple-Redundant Multi-Month Vault (LocalStorage + IndexedDB + Native Android)
 * Local Timezone Date Engine + Accurate Hijri Calendar + Full Bangla (Default), Arabic & English Localization
 */

const STORAGE_KEY = "SUNNAH_24_ENTERPRISE_LEDGER_V24";
const BACKUP_MIRROR_KEY = "SUNNAH_24_ENTERPRISE_MIRROR_V35";
const IDB_NAME = "Sunnah24EnterpriseDB";
const IDB_STORE = "Sunnah24VaultStore";
const IDB_KEY = "primary_ledger_v35";
const LEDGER_SALT = "MKRWEB-SUNNAH-24-CORPORATE-IMMUTABLE-SALT";
const I18N_SALT = "MKRWEB-SUNNAH-24-I18N-DICTIONARY-IMMUTABLE-SALT-V25";

function deepFreeze(obj) {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => deepFreeze(obj[prop]));
  }
  return obj;
}

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

function localizeDigits(val, locale) {
  const str = String(val);
  if (locale === "bn") {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return str.replace(/\d/g, (d) => bnDigits[Number(d)]);
  }
  if (locale === "ar") {
    const arDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return str.replace(/\d/g, (d) => arDigits[Number(d)]);
  }
  return str;
}

// Local Timezone Date Key Generator (Fixes UTC midnight shift bug permanently)
function getLocalDateKey(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  return getLocalDateKey(new Date());
}

// Immutable Multi-Language UI Dictionary (Bangla Default, Arabic, English)
const I18N_DICTIONARIES = deepFreeze({
  bn: {
    dir: "ltr",
    localeTag: "bn-BD",
    app_title: "সুন্নাহ ২৪",
    badge_verified: "🛡️ S24 যাচাইকৃত",
    badge_tampered: "⚠️ টেম্পার সতর্কতা",
    hero_mastery_label: "দৈনিক সুন্নাহ ২৪ অনুশীলন",
    day_streak: "দিনের ধারাবাহিকতা",
    tab_routine: "২৪ ঘণ্টা রুটিন",
    tab_adhkar: "আযকার ও তাসবীহ",
    tab_diary: "মুহাসাবা ডায়েরি",
    tab_vault: "ভল্ট ও তথ্য",
    phase_all: "সব ২৪ ঘণ্টা",
    phase_tahajjud: "তাহাজ্জুদ ও ফজর",
    phase_duha: "সকাল ও কর্মক্ষেত্র",
    phase_dhuhr: "যোহর, কাইলুলা ও আসর",
    phase_maghrib: "মাগরিব ও ইশা",
    phase_sleep: "সুন্নাহ সম্মত ঘুম",
    phase_diet: "তিব্বে নববী ও ফিতরাত",
    phase_character: "আখলাক ও সুন্নাহ দিবস",
    reset_today: "আজকের রিসেট",
    proof_btn: "📖 দলিল ও হিকমত",
    showing_habits: "{total}টি নববী সুন্নাহর মধ্যে {shown}টি প্রদর্শিত হচ্ছে",
    completed_habits: "আজ {total}টি নববী সুন্নাহর মধ্যে {done}টি সম্পন্ন হয়েছে",
    phase_banner_night: "🌌 চলমান: রাত ও তাহাজ্জুদের সময়",
    phase_banner_fajr: "🌌 চলমান: শেষ রাত ও ফজরের বরকতময় সময়",
    phase_banner_duha: "☀️ চলমান: চাশত ও ইহসান ভিত্তিক কর্মঘণ্টা",
    phase_banner_dhuhr: "🌤️ চলমান: যোহর, কাইলুলা ও আসর",
    phase_banner_maghrib: "🌆 চলমান: মাগরিব, পরিবার ও ইশা",
    phase_banner_sleep: "🛌 চলমান: নববী ঘুমের সুন্নাহ প্রোটোকল",
    fast_mon_thu: "🌙 আজ: সুন্নাহ রোজা (সোমবার / বৃহস্পতিবার)",
    fast_jumuah: "🕌 জুমু'আ মোবারক: সূরা কাহফ ও দরূদ পাঠ",
    fast_default: "✨ ৫ ওয়াক্ত ফরজ সালাত জামাতে হেফাজত করুন",
    tasbih_title: "📿 সুন্নাহ ২৪ ডিজিটাল তাসবীহ",
    tasbih_subtitle: "একটি সহীহ যিকির নির্বাচন করুন এবং গণনা করতে সোনালী বৃত্তে ট্যাপ করুন।",
    lifetime_dhikr: "মোট যাচাইকৃত যিকির গণনা:",
    reset_cycle: "পুনরায় শুরু করুন",
    duas_heading: "🤲 সকাল-সন্ধ্যার অপরিহার্য পূর্ণাঙ্গ মাসনূন দোয়াসমূহ",
    duas_subheading: "আরবি মূল পাঠ, বাংলা উচ্চারণ, পূর্ণাঙ্গ অর্থ ও সহীহ হাদিসের ফযীলতসহ।",
    diary_title: "📖 দৈনিক মুহাসাবা (আত্মসমালোচনা ডায়েরি)",
    diary_quote: "\"তোমাদের হিসাব নেওয়ার আগেই নিজেদের হিসাব নাও এবং আমল ওজন করার আগেই তা ওজন করে দেখো।\" — উমর ইবনুল খাত্তাব (রা.)",
    diary_mood_label: "আজ অন্তরের আধ্যাত্মিক অবস্থা",
    mood_khushu: "😌 খুশু (প্রশান্ত)",
    mood_shukr: "🤲 শোকর (কৃতজ্ঞ)",
    mood_sabr: "🌿 সবর (ধৈর্যশীল)",
    mood_tawbah: "💧 তাওবাহ (অনুতপ্ত)",
    diary_q1: "১. আজকের যে নিয়ামতের জন্য আমি সবচেয়ে বেশি কৃতজ্ঞ:",
    diary_q1_ph: "আলহামদুলিল্লাহ, ঈমান, সুস্থতা এবং...",
    diary_q2: "২. যে ভুলত্রুটি থেকে তাওবাহ ও সতর্ক থাকতে চাই:",
    diary_q2_ph: "যবানের হেফাজত, সালাতে খুশু বৃদ্ধি...",
    diary_q3: "৩. আগামীকালের জন্য একনিষ্ঠ নিয়ত (Niyyah):",
    diary_q3_ph: "ইনশাআল্লাহ আগামীকাল তাহাজ্জুদে উঠব এবং...",
    diary_save_btn: "💾 ক্রিপ্টোগ্রাফিক সিগনেচারসহ সংরক্ষণ করুন",
    diary_ledger_title: "📜 সংরক্ষিত মুহাসাবা লেজার",
    diary_empty: "এখনও কোনো মুহাসাবা ডায়েরি সংরক্ষণ করা হয়নি।",
    diary_lbl_shukr: "শোকর:",
    diary_lbl_tawbah: "তাওবাহ:",
    diary_lbl_niyyah: "নিয়ত:",
    vault_matrix_title: "📊 ৭-দিনের সুন্নাহ ধারাবাহিকতা ম্যাট্রিক্স",
    vault_matrix_sub: "গত ৭ দিনে আপনার দৈনিক সুন্নাহ পালনের অগ্রগতি (দিনে ট্যাপ করে বিস্তারিত দেখুন)।",
    vault_archive_title: "🗓️ দীর্ঘমেয়াদী সুন্নাহ আর্কাইভ (১২ মাস / ৩৬৫ দিন)",
    vault_archive_sub: "আপনার বিগত কয়েক মাসের সকল দিনের রেকর্ড ডিভাইসে স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে (অন্য মাসের কার্ডে ট্যাপ করে সেই মাসের বিস্তারিত দেখুন)।",
    range_30d: "৩০ দিন (১ মাস)",
    range_90d: "৯০ দিন (৩ মাস)",
    range_180d: "১৮০ দিন (৬ মাস)",
    range_365d: "৩৬৫ দিন (১ বছর)",
    cat_weekly_title: "বিভাগভিত্তিক গড় (সাপ্তাহিক)",
    cat_weekly_sub: "এই সপ্তাহে কোন দিকে বেশি মনোযোগ দরকার",
    cat_monthly_title: "বিভাগভিত্তিক গড়",
    cat_monthly_sub: "এই মাসে কোন দিকে বেশি মনোযোগ দরকার",
    cat_salah: "নামায",
    cat_nafl_salah: "নফল নামায",
    cat_morning_evening: "সকাল-সন্ধ্যার আমল",
    cat_sleep_sunnah: "ঘুমের আগের আমল",
    cat_karaniya: "করণীয়",
    cat_barjaniya: "বর্জনীয়",
    cat_dayemi_sunnah: "দায়েমী সুন্নাহ",
    advice_prefix_improve: "💡 পরামর্শ: আপনার সার্বিক গড় {overall}%। গড় হিসাব অনুযায়ী '{category}' বিভাগে আপনার অগ্রগতি সবচেয়ে কম ({pct}%) — আগামী দিনগুলোতে এই বিভাগের সুন্নাহ পালনে বিশেষ মনোযোগ দিন।",
    advice_all_perfect: "🌟 মাশাআল্লাহ! আপনার সকল বিভাগেই ১০০% সুন্নাহ আমল সম্পন্ন হয়েছে। আল্লাহ আপনার ইস্তিকামাত কবুল করুন।",
    selected_month_records: "📅 নির্বাচিত মাসের দৈনিক রেকর্ডসমূহ:",
    tap_month_hint: "ট্যাপ করে নির্বাচন করুন",
    theme_dark_btn: "ডার্ক",
    theme_light_btn: "লাইট",
    madhab_hanafi_btn: "হানাফী",
    madhab_standard_btn: "শাফিঈ/জমহুর",
    madhab_hanafi_toast: "🕌 আসরের ওয়াক্ত: হানাফী মাযহাব (মিসলে সানী • ২ গুণ ছায়া) সক্রিয় করা হয়েছে",
    madhab_standard_toast: "🕌 আসরের ওয়াক্ত: শাফিঈ / জমহুর মাযহাব (মিসলে আউয়াল • ১ গুণ ছায়া) সক্রিয় করা হয়েছে",
    cat_range_30_title: "বিভাগভিত্তিক গড় (৩০ দিন / ১ মাস)",
    cat_range_90_title: "বিভাগভিত্তিক গড় (৯০ দিন / ৩ মাস)",
    cat_range_180_title: "বিভাগভিত্তিক গড় (১৮০ দিন / ৬ মাস)",
    cat_range_365_title: "বিভাগভিত্তিক গড় (৩৬৫ দিন / ১ বছর)",
    archive_empty: "নির্বাচিত সময়সীমার মধ্যে এখনও কোনো সম্পন্ন আমলের রেকর্ড নেই।",
    archive_active_days: "সক্রিয় দিন:",
    archive_avg_score: "গড় অর্জন:",
    vault_storage_status_label: "অটো-স্টোরেজ সুরক্ষা স্তর:",
    vault_custom_title: "➕ ব্যক্তিগত সুন্নাহ আমল যুক্ত করুন",
    custom_title_ph: "আমলের নাম (যেমন: ফজরের পর ৫ আয়াত হিফজ)",
    custom_fact_ph: "হাদিস সূত্র / ব্যক্তিগত উপকারিতা",
    custom_add_btn: "সুন্নাহ ২৪ রুটিনে যুক্ত করুন",
    custom_time_label: "ব্যক্তিগত সুন্নাহ ২৪",
    custom_default_evidence: "ব্যক্তিগত সুন্নাহ ২৪ লক্ষ্য",
    custom_default_wisdom: "আল্লাহর কাছে সবচেয়ে প্রিয় আমল তা-ই যা নিয়মিত করা হয়, যদিও তা অল্প হয় (সহীহ বুখারী ৬৪৬৪).",
    vault_crypto_title: "🔐 SHA-256 টেম্পার-প্রুফ ট্রিপল-লেয়ার ভল্ট",
    vault_crypto_sub: "প্রতিটি আমল স্বয়ংক্রিয়ভাবে ৩টি স্তরে (LocalStorage, IndexedDB এবং Native Android Vault) সংরক্ষিত হয় যাতে মাসের পর মাস ডেটা কখনোই মুছে না যায়।",
    vault_hash_label: "সক্রিয় সুন্নাহ ২৪ লেজার ডাইজেস্ট (SHA-256):",
    vault_i18n_hash_label: "টেম্পার-প্রুফ মাল্টি-ল্যাঙ্গুয়েজ প্যাক ডাইজেস্ট (SHA-256):",
    export_btn: "⬇️ ব্যাকআপ ডাউনলোড (JSON)",
    import_btn: "⬆️ ব্যাকআপ রিস্টোর (JSON)",
    vault_compliance_title: "🏛️ কর্পোরেট ও গুগল প্লে কমপ্লায়েন্স",
    vault_compliance_sub: "সুন্নাহ ২৪ সম্পূর্ণ অফলাইনে চলে—কোনো থার্ড-পার্টি ট্র্যাকার বা বিজ্ঞাপন নেই এবং আপনার ডেটা শতভাগ সুরক্ষিত।",
    privacy_policy_btn: "📄 প্রাইভেসি পলিসি দেখুন",
    modal_evidence_heading: "📖 সহীহ কুরআন ও সুন্নাহর দলিল",
    modal_wisdom_heading: "🧠 শারীরিক, মানসিক ও আধ্যাত্মিক হিকমত",
    modal_close_btn: "আলহামদুলিল্লাহ, বুঝেছি",
    alert_tamper: "⚠️ নিরাপত্তা সতর্কতা: ব্যাকআপ বা ভাষা ফাইলের স্বাক্ষর মিলছে না!",
    alert_restored: "✅ সুন্নাহ ২৪ ব্যাকআপ সফলভাবে যাচাই ও রিস্টোর হয়েছে!",
    alert_invalid: "অকার্যকর সুন্নাহ ২৪ ব্যাকআপ ফাইল।",
    day_detail_title: "📅 দিনের আমল বিবরণী:",
    day_detail_none: "এই তারিখে কোনো সুন্নাহ আমল চিহ্নিত করা হয়নি।",
    prohibited_title: "নামাজ নিষিদ্ধ সময় (ট্যাপ করে দেখুন)",
    prohibited_sunrise: "১. সূর্যোদয়ের সময় (Sunrise):",
    prohibited_zawal: "২. ঠিক দ্বিপ্রহর/দুপুরের সময় (Midday Zenith/Zawal):",
    prohibited_sunset: "৩. সূর্যাস্তের সময় (Sunset):",
    prohibited_hadith_ref: "📖 দলিল: সহীহ মুসলিম ৮৩১ — উকবাহ ইবনু আমির (রা.) বর্ণিত সূর্যোদয়, ঠিক দ্বিপ্রহর (যাওয়াল) ও সূর্যাস্তের সময় সালাত আদায় নিষিদ্ধ।",
    waqt_fajr: "ফজর",
    waqt_dhuhr: "যোহর",
    waqt_asr: "আসর",
    waqt_maghrib: "মাগরিব",
    waqt_isha: "ইশা",
    tasbih_options: [
      { target: 33, label: "সুবহানাল্লাহ (আল্লাহ পবিত্র ও মহান)", text: "সুবহানাল্লাহ — ৩৩ বার" },
      { target: 33, label: "আলহামদুলিল্লাহ (সকল প্রশংসা আল্লাহর)", text: "আলহামদুলিল্লাহ — ৩৩ বার" },
      { target: 34, label: "আল্লাহু আকবার (আল্লাহ সর্বশ্রেষ্ঠ)", text: "আল্লাহু আকবার — ৩৪ বার" },
      { target: 100, label: "আস্তাগফিরুল্লাহ ওয়া আতুবু ইলাইহি", text: "আস্তাগফিরুল্লাহ ওয়া আতুবু ইলাইহি — ১০০ বার" },
      { target: 100, label: "সুবহানাল্লাহি ওয়া বিহামদিহি", text: "সুবহানাল্লাহি ওয়া বিহামদিহি — ১০০ বার" },
      { target: 10, label: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ ﷺ", text: "নবীজি ﷺ-এর ওপর দরূদ পাঠ — ১০ বার" },

            {
        target: 100,
        label: "লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু, ওয়া হুয়া আলা কুল্লি শাইয়িন কাদীর • لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        text: "লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু, ওয়া হুয়া আলা কুল্লি শাইয়িন কাদীর — ১০০ বার"
      },
      
      { target: 33, label: "লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ", text: "হাওকালাহ (জান্নাতের গুপ্তধন) — ৩৩ বার" }
    ]
  },
  ar: {
    dir: "rtl",
    localeTag: "ar-SA",
    app_title: "سنة ٢٤",
    badge_verified: "🛡️ موثق S24",
    badge_tampered: "⚠️ تنبيه تلاعب",
    hero_mastery_label: "إتقان السنن النبوية اليومي",
    day_streak: "أيام متتالية",
    tab_routine: "جدول ٢٤ ساعة",
    tab_adhkar: "الأذكار والسبحة",
    tab_diary: "المحاسبة اليومية",
    tab_vault: "الخزنة والمعلومات",
    phase_all: "كل ٢٤ ساعة",
    phase_tahajjud: "التهجد والفجر",
    phase_duha: "الضحى والعمل",
    phase_dhuhr: "الظهر والقيلولة والعصر",
    phase_maghrib: "المغرب والعشاء",
    phase_sleep: "سنن النوم",
    phase_diet: "الطب النبوي والفطرة",
    phase_character: "الأخلاق وأيام السنة",
    reset_today: "إعادة تعيين اليوم",
    proof_btn: "📖 الدليل والحكمة",
    showing_habits: "عرض {shown} من أصل {total} سنة نبوية",
    completed_habits: "تم إتمام {done} من أصل {total} سنة نبوية اليوم",
    phase_banner_night: "🌌 الفترة الحالية: الليل والتهجد",
    phase_banner_fajr: "🌌 الفترة الحالية: السحر وبركة الفجر",
    phase_banner_duha: "☀️ الفترة الحالية: الضحى وإتقان العمل",
    phase_banner_dhuhr: "🌤️ الفترة الحالية: الظهر والقيلولة والعصر",
    phase_banner_maghrib: "🌆 الفترة الحالية: المغرب والأهل والعشاء",
    phase_banner_sleep: "🛌 الفترة الحالية: آداب وسنن النوم النبوي",
    fast_mon_thu: "🌙 اليوم: صيام السنة (الإثنين / الخميس)",
    fast_jumuah: "🕌 الجمعة: سورة الكهف والصلاة على النبي ﷺ",
    fast_default: "✨ حافظ على الصلوات الخمس المفروضة في جماعة",
    tasbih_title: "📿 سبحة سنة ٢٤ الرقمية",
    tasbih_subtitle: "اختر ذكراً نبوياً صحيحاً واضغط على الحلقة الذهبية للتسبيح.",
    lifetime_dhikr: "إجمالي الأذكار الموثقة:",
    reset_cycle: "تصفير العداد",
    duas_heading: "🤲 أذكار الصباح والمساء والأدعية النبوية الكاملة",
    duas_subheading: "النص العربي الكامل مع المعاني والفضائل الصحيحة.",
    diary_title: "📖 المحاسبة اليومية للنفس",
    diary_quote: "\"حاسبوا أنفسكم قبل أن تحاسبوا، وزنوا أعمالكم قبل أن توزن عليكم.\" — عمر بن الخطاب رضي الله عنه",
    diary_mood_label: "الحالة الإيمانية للقلب اليوم",
    mood_khushu: "😌 خشوع (طمأنينة)",
    mood_shukr: "🤲 شكر (امتنان)",
    mood_sabr: "🌿 صبر (ثبات)",
    mood_tawbah: "💧 توبة (إنابة)",
    diary_q1: "١. نعمة أشكر الله عليها اليوم:",
    diary_q1_ph: "الحمد لله على نعمة الإسلام والعافية و...",
    diary_q2: "٢. تقصير أتوب إلى الله منه وأحذر تكراره:",
    diary_q2_ph: "حفظ اللسان، زيادة الخشوع في الصلاة...",
    diary_q3: "٣. نية صادقة ليوم غد إن شاء الله:",
    diary_q3_ph: "إن شاء الله سأستيقظ للتهجد غداً و...",
    diary_save_btn: "💾 ختم المحاسبة رقمياً (SHA-256)",
    diary_ledger_title: "📜 سجل المحاسبة المختوم",
    diary_empty: "لم يتم تسجيل أي محاسبة يومية بعد.",
    diary_lbl_shukr: "الشكر:",
    diary_lbl_tawbah: "التوبة:",
    diary_lbl_niyyah: "النية:",
    vault_matrix_title: "📊 مصفوفة الاستقامة لـ ٧ أيام",
    vault_matrix_sub: "معدل إتمامك للسنن النبوية خلال الأيام السبعة الماضية (اضغط على اليوم للتفاصيل).",
    vault_archive_title: "🗓️ أرشيف السنن طويل المدى (١٢ شهراً / ٣٦٥ يوماً)",
    vault_archive_sub: "يتم حفظ سجل أيامك وأشهرك السابقة تلقائياً في الجهاز (اضغط على أي شهر لعرض تفاصيله).",
    range_30d: "٣٠ يوماً (شهر)",
    range_90d: "٩٠ يوماً (٣ أشهر)",
    range_180d: "١٨٠ يوماً (٦ أشهر)",
    range_365d: "٣٦٥ يوماً (سنة)",
    cat_weekly_title: "المتوسط حسب الفئة (الأسبوعي)",
    cat_weekly_sub: "الجوانب التي تحتاج إلى مزيد من العناية هذا الأسبوع",
    cat_monthly_title: "المتوسط حسب الفئة",
    cat_monthly_sub: "الجوانب التي تحتاج إلى مزيد من العناية هذا الشهر",
    cat_salah: "الصلاة المفروضة والرواتب",
    cat_nafl_salah: "صلاة النافلة",
    cat_morning_evening: "أذكار الصباح والمساء",
    cat_sleep_sunnah: "سنن ما قبل النوم",
    cat_karaniya: "المأمورات والواجبات",
    cat_barjaniya: "المنهيات وحفظ الجوارح",
    cat_dayemi_sunnah: "السنن الدائمة اليومية",
    advice_prefix_improve: "💡 نصيحة: متوسطك العام {overall}%. فئة «{category}» هي الأقل إنجازاً ({pct}%) — ننصحك بالتركيز على تحسينها في الأيام القادمة.",
    advice_all_perfect: "🌟 ما شاء الله! أتممت ١٠٠٪ في جميع الفئات، ثبتك الله وزادك توفيقاً.",
    selected_month_records: "📅 السجلات اليومية للشهر المحدد:",
    tap_month_hint: "اضغط للعرض",
    theme_dark_btn: "داكن",
    theme_light_btn: "فاتح",
    madhab_hanafi_btn: "حنفي",
    madhab_standard_btn: "شافعي/جمهور",
    madhab_hanafi_toast: "🕌 وقت العصر: تم تفعيل المذهب الحنفي (مثلان • ظل مضاعف)",
    madhab_standard_toast: "🕌 وقت العصر: تم تفعيل مذهب الجمهور / الشافعي (مثل واحد)",
    cat_range_30_title: "المتوسط حسب المرحلة (٣٠ يوماً)",
    cat_range_90_title: "المتوسط حسب المرحلة (٩٠ يوماً)",
    cat_range_180_title: "المتوسط حسب المرحلة (١٨٠ يوماً)",
    cat_range_365_title: "المتوسط حسب المرحلة (٣٦٥ يوماً)",
    archive_empty: "لا توجد سجلات مكتملة في هذه الفترة بعد.",
    archive_active_days: "الأيام النشطة:",
    archive_avg_score: "المعدل:",
    vault_storage_status_label: "طبقات الحفظ التلقائي:",
    vault_custom_title: "➕ إضافة ورد أو سنة شخصية",
    custom_title_ph: "عنوان العمل (مثال: حفظ ٥ آيات بعد الفجر)",
    custom_fact_ph: "الدليل من الحديث أو الفائدة",
    custom_add_btn: "إضافة إلى جدول سنة ٢٤",
    custom_time_label: "ورد شخصي — سنة ٢٤",
    custom_default_evidence: "هدف شخصي في جدول سنة ٢٤",
    custom_default_wisdom: "أحب الأعمال إلى الله أدومها وإن قل (صحيح البخاري ٦٤٦٤).",
    vault_crypto_title: "🔐 الخزنة المشفرة ثلاثية الطبقات (SHA-256)",
    vault_crypto_sub: "يتم حفظ كل عمل تلقائياً في ٣ طبقات (LocalStorage + IndexedDB + خزنة أندرويد) لضمان عدم ضياع البيانات.",
    vault_hash_label: "البصمة الرقمية لسجل سنة ٢٤ (SHA-256):",
    vault_i18n_hash_label: "البصمة الرقمية لحزم اللغات الموثقة (SHA-256):",
    export_btn: "⬇️ تصدير نسخة موقعة (JSON)",
    import_btn: "⬆️ استعادة نسخة موقعة (JSON)",
    vault_compliance_title: "🏛️ الامتثال المؤسسي ومتجر Google Play",
    vault_compliance_sub: "يعمل تطبيق سنة ٢٤ بدون إنترنت ١٠٠٪ بدون أي إعلانات أو تتبع خارجي.",
    privacy_policy_btn: "📄 عرض سياسة الخصوصية",
    modal_evidence_heading: "📖 الدليل الصحيح من القرآن والسنة",
    modal_wisdom_heading: "🧠 الحكمة الروحية والنفسية والصحية",
    modal_close_btn: "الحمد لله، فهمت",
    alert_tamper: "⚠️ تنبيه أمني: فشل التحقق من التوقيع الرقمي للملف!",
    alert_restored: "✅ تمت استعادة النسخة الاحتياطية والتحقق من سلامتها بنجاح!",
    alert_invalid: "ملف النسخة الاحتياطية غير صالح.",
    day_detail_title: "📅 تفاصيل إنجاز اليوم:",
    day_detail_none: "لم يتم تسجيل سنن مكتملة في هذا التاريخ.",
    prohibited_title: "أوقات النهي عن الصلاة (اضغط للتفاصيل)",
    prohibited_sunrise: "١. وقت الشروق (Sunrise):",
    prohibited_zawal: "٢. وقت الزوال / الاستواء (Midday Zenith/Zawal):",
    prohibited_sunset: "٣. وقت الغروب (Sunset):",
    prohibited_hadith_ref: "📖 الدليل: صحيح مسلم ٨٣١ — نهى رسول الله ﷺ عن الصلاة في ثلاث ساعات: عند طلوع الشمس، وعند استوائها، وعند غروبها.",
    waqt_fajr: "الفجر",
    waqt_dhuhr: "الظهر",
    waqt_asr: "العصر",
    waqt_maghrib: "المغرب",
    waqt_isha: "العشاء",
    tasbih_options: [
      { target: 33, label: "سبحان الله", text: "سبحان الله — ٣٣ مرة" },
      { target: 33, label: "الحمد لله", text: "الحمد لله — ٣٣ مرة" },
      { target: 34, label: "الله أكبر", text: "الله أكبر — ٣٤ مرة" },
      { target: 100, label: "أستغفر الله وأتوب إليه", text: "أستغفر الله وأتوب إليه — ١٠٠ مرة" },
      { target: 100, label: "سبحان الله وبحمده", text: "سبحان الله وبحمده — ١٠٠ مرة" },
      { target: 10, label: "اللهم صل وسلم على نبينا محمد ﷺ", text: "الصلاة على النبي ﷺ — ١٠ مرات" },

            {
        target: 100,
        label: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ — ١٠٠ مرة"
      },

      { target: 33, label: "لا حول ولا قوة إلا بالله", text: "الحوقلة (كنز من كنوز الجنة) — ٣٣ مرة" }
    ]
  },
  en: {
    dir: "ltr",
    localeTag: "en-US",
    app_title: "Sunnah 24",
    badge_verified: "🛡️ S24 Verified",
    badge_tampered: "⚠️ Tamper Alert",
    hero_mastery_label: "DAILY SUNNAH 24 MASTERY",
    day_streak: "Day Streak",
    tab_routine: "24H Routine",
    tab_adhkar: "Adhkar",
    tab_diary: "Muhasabah",
    tab_vault: "Vault & Info",
    phase_all: "All 24H",
    phase_tahajjud: "Pre-Dawn & Fajr",
    phase_duha: "Morning & Work",
    phase_dhuhr: "Midday & Asr",
    phase_maghrib: "Evening & Isha",
    phase_sleep: "Prophetic Sleep",
    phase_diet: "Tibb Nabawi & Fitrah",
    phase_character: "Akhlaq & Sunnah Days",
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
    duas_heading: "🤲 Essential Full Morning & Evening Masnoon Duas",
    duas_subheading: "Complete Arabic text, transliteration, full translation, and authentic virtues.",
    diary_title: "📖 Daily Muhasabah (Self-Accountability)",
    diary_quote: "\"Hold yourselves accountable before you are held accountable, and weigh your deeds before they are weighed for you.\" — Umar ibn Al-Khattab (RA)",
    diary_mood_label: "Spiritual State of the Heart Today",
    mood_khushu: "😌 Khushu",
    mood_shukr: "🤲 Shukr",
    mood_sabr: "🌿 Sabr",
    mood_tawbah: "💧 Tawbah",
    diary_q1: "1. Blessing (Ni'mah) I am most grateful for today:",
    diary_q1_ph: "Alhamdulillah for health, faith, and...",
    diary_q2: "2. Shortcomings to repent from & guard against:",
    diary_q2_ph: "Guarding my tongue, improving Khushu in Salah...",
    diary_q3: "3. Sincere Intention (Niyyah) for tomorrow:",
    diary_q3_ph: "InshaAllah tomorrow I will wake for Tahajjud and...",
    diary_save_btn: "💾 Cryptographically Seal Reflection",
    diary_ledger_title: "📜 Sealed Muhasabah Ledger",
    diary_empty: "No Muhasabah reflections sealed yet.",
    diary_lbl_shukr: "Shukr:",
    diary_lbl_tawbah: "Tawbah:",
    diary_lbl_niyyah: "Niyyah:",
    vault_matrix_title: "📊 7-Day Sunnah Consistency Matrix",
    vault_matrix_sub: "Your daily habit completion momentum across the past 7 days (tap any day to inspect).",
    vault_archive_title: "🗓️ Long-Term Sunnah Archive (12 Months / 365 Days)",
    vault_archive_sub: "Your multi-month daily history is automatically preserved across 3 storage layers (tap any month card to inspect that month).",
    range_30d: "30 Days (1M)",
    range_90d: "90 Days (3M)",
    range_180d: "180 Days (6M)",
    range_365d: "365 Days (1Y)",
    cat_weekly_title: "Category Average (Weekly)",
    cat_weekly_sub: "Which areas need more focus this week",
    cat_monthly_title: "Category Average",
    cat_monthly_sub: "Which areas need more focus this month",
    cat_salah: "Fard & Rawatib Salah",
    cat_nafl_salah: "Nafl Prayer",
    cat_morning_evening: "Morning & Evening Adhkar",
    cat_sleep_sunnah: "Bedtime Sunnahs",
    cat_karaniya: "Essential Duties (Karaniya)",
    cat_barjaniya: "Restraint & Abstinence (Barjaniya)",
    cat_dayemi_sunnah: "Perpetual Daily Sunnahs",
    advice_prefix_improve: "💡 Recommendation: Your overall average is {overall}%. Based on the average breakdown, '{category}' is your lowest area ({pct}%) — focus on improving this category over the coming days.",
    advice_all_perfect: "🌟 MashaAllah! You achieved 100% across all categories. May Allah grant you steadfastness.",
    selected_month_records: "📅 Daily Records for Selected Month:",
    tap_month_hint: "Tap to view month",
    theme_dark_btn: "Dark",
    theme_light_btn: "Light",
    madhab_hanafi_btn: "Hanafi",
    madhab_standard_btn: "Standard",
    madhab_hanafi_toast: "🕌 Asr Timing: Hanafi Madhab (Mithl-e-Thani • 2x Shadow) Activated",
    madhab_standard_toast: "🕌 Asr Timing: Standard / Shafi'i, Maliki, Hanbali (1x Shadow) Activated",
    cat_range_30_title: "Phase Average (30 Days / 1M)",
    cat_range_90_title: "Phase Average (90 Days / 3M)",
    cat_range_180_title: "Phase Average (180 Days / 6M)",
    cat_range_365_title: "Phase Average (365 Days / 1Y)",
    archive_empty: "No completed habit records found in this range yet.",
    archive_active_days: "Active Days:",
    archive_avg_score: "Avg Score:",
    vault_storage_status_label: "AUTO-PERSISTENCE LAYERS:",
    vault_custom_title: "➕ Add Personal Habit to Sunnah 24",
    custom_title_ph: "Habit Title (e.g., Memorize 5 Ayahs after Fajr)",
    custom_fact_ph: "Hadith Reference / Personal Benefit",
    custom_add_btn: "Add to Sunnah 24 Routine",
    custom_time_label: "Custom Sunnah 24",
    custom_default_evidence: "Personal Sunnah 24 Goal",
    custom_default_wisdom: "The most beloved deeds to Allah are those done consistently, even if small (Sahih al-Bukhari 6464).",
    vault_crypto_title: "🔐 SHA-256 Tamper-Proof Triple-Layer Vault",
    vault_crypto_sub: "Every habit check is automatically mirrored across LocalStorage, IndexedDB, and Native Android Vault so history never resets.",
    vault_hash_label: "ACTIVE SUNNAH 24 LEDGER DIGEST (SHA-256):",
    vault_i18n_hash_label: "TAMPER-PROOF MULTI-LANGUAGE PACK DIGEST (SHA-256):",
    export_btn: "⬇️ Export Signed JSON",
    import_btn: "⬆️ Restore Signed JSON",
    vault_compliance_title: "🏛️ Corporate & Google Play Compliance",
    vault_compliance_sub: "Sunnah 24 operates 100% offline with zero third-party trackers, zero ads, and full local data sovereignty.",
    privacy_policy_btn: "📄 View Privacy Policy",
    modal_evidence_heading: "📖 Authentic Prophetic Evidence (Quran & Sunnah)",
    modal_wisdom_heading: "🧠 Physiological, Psychological & Spiritual Wisdom",
    modal_close_btn: "Alhamdulillah, Understood",
    alert_tamper: "⚠️ Sunnah 24 Security Alert: Signature mismatch! File integrity cannot be verified.",
    alert_restored: "✅ Sunnah 24 Signed Backup Restored & Cryptographically Verified!",
    alert_invalid: "Invalid Sunnah 24 backup file.",
    day_detail_title: "📅 Completed Sunnahs on:",
    day_detail_none: "No habits were marked completed on this date.",
    prohibited_title: "Prohibited Times for Salah (Tap to Expand)",
    prohibited_sunrise: "1. Sunrise Time (Sunrise):",
    prohibited_zawal: "2. Midday Zenith Time (Midday Zenith/Zawal):",
    prohibited_sunset: "3. Sunset Time (Sunset):",
    prohibited_hadith_ref: "📖 Proof: Sahih Muslim 831 — Uqbah ibn Amir (RA) reported that the Prophet ﷺ forbade praying during sunrise, solar zenith (Zawal), and sunset.",
    waqt_fajr: "Fajr",
    waqt_dhuhr: "Dhuhr",
    waqt_asr: "Asr",
    waqt_maghrib: "Maghrib",
    waqt_isha: "Isha",
    tasbih_options: [
      { target: 33, label: "SubhanAllah (Glory be to Allah)", text: "SubhanAllah — 33x" },
      { target: 33, label: "Alhamdulillah (Praise be to Allah)", text: "Alhamdulillah — 33x" },
      { target: 34, label: "Allahu Akbar (Allah is the Greatest)", text: "Allahu Akbar — 34x" },
      { target: 100, label: "Astaghfirullah wa atubu ilayh", text: "Astaghfirullah wa atubu ilayh — 100x" },
      { target: 100, label: "SubhanAllahi wa bihamdihi", text: "SubhanAllahi wa bihamdihi — 100x" },
      { target: 10, label: "Allahumma salli 'ala Muhammad ﷺ", text: "Salawat upon the Prophet ﷺ — 10x" },
            
            {
        target: 100,
        label: "La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu, wa Huwa 'ala kulli shay'in Qadir • لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        text: "La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu... — 100x"
      },


      { target: 33, label: "La hawla wa la quwwata illa billah", text: "Hawqalah (Treasure of Paradise) — 33x" }
    ]
  }
});

// 32 Comprehensive Prophetic Habits across 24 hours
const SUNNAH_24_HABITS = deepFreeze([
  {
    id: "s24_01_waking_dua",
    phase: "tahajjud_fajr",
    time: "04:00 AM • Awakening",
    time_bn: "ভোর ০৪:০০ • ঘুম থেকে জাগ্রত হওয়া",
    time_ar: "٠٤:٠٠ ص • الاستيقاظ",
    title: "1. Waking Dua & Wiping Sleep from the Face",
    title_bn: "১. ঘুম থেকে ওঠার দোয়া ও হাত দিয়ে মুখমণ্ডল মুছে নেওয়া",
    title_ar: "١. دعاء الاستيقاظ ومسح أثر النوم عن الوجه",
    evidence: "Sahih al-Bukhari 183: The Prophet ﷺ woke up, sat down, wiped sleep from his face with his hand, recited the last 10 verses of Surah Aal-e-Imran, and said: 'Alhamdulillahilladhi ahyana ba'da ma amatana wa ilayhin-nushur.'",
    evidence_bn: "সহীহ বুখারী ১৮৩: নবীজি ﷺ ঘুম থেকে উঠে বসতেন, হাত দিয়ে মুখমণ্ডল থেকে ঘুমের রেশ মুছে নিতেন, সূরা আলে ইমরানের শেষ ১০ আয়াত তিলাওয়াত করতেন এবং দোয়া পড়তেন: 'আলহামদুলিল্লাহিল্লাযী আহ্ইয়ানা বা'দা মা আমাতানা ওয়া ইলাইহিন নুশূর।'",
    evidence_ar: "صحيح البخاري ١٨٣: استيقظ النبي ﷺ فجلس يمسح النوم عن وجهه بيده، ثم قرأ العشر الآيات الخواتيم من سورة آل عمران، وقال: «الحمد لله الذي أحيانا بعدما أماتنا وإليه النشور».",
    wisdom: "Immediately anchors consciousness in gratitude and clears sleep inertia naturally before any blue-light screen exposure.",
    wisdom_bn: "মোবাইল স্ক্রিনের নীল আলো দেখার আগেই মস্তিষ্ককে আল্লাহর শুকরিয়ায় স্থির করে এবং প্রাকৃতিকভাবে ঘুমের জড়তা দূর করে।",
    wisdom_ar: "يربط الوعي فور الاستيقاظ بشكر الله ويزيل خمول النوم طبيعياً قبل التعرض لضوء الشاشات."
  },
  {
    id: "s24_02_miswak_wudu",
    phase: "tahajjud_fajr",
    time: "04:10 AM • Oral & Spiritual Purity",
    time_bn: "ভোর ০৪:১০ • মুখ ও আত্মার পবিত্রতা",
    time_ar: "٠٤:١٠ ص • الطهارة والسواك",
    title: "2. Using Miswak (Siwak) & Mindful Wudu",
    title_bn: "২. মিসওয়াক ব্যবহার করা ও মনোযোগসহ অযু করা",
    title_ar: "٢. السواك وإسباغ الوضوء بخشوع",
    evidence: "Sahih al-Bukhari 887: 'Were it not that it would be too hard on my Ummah, I would have commanded them to use the Siwak at every prayer.'",
    evidence_bn: "সহীহ বুখারী ৮৮৭: 'আমার উম্মতের জন্য কঠিন না হলে আমি তাদের প্রত্যেক সালাতের সময় মিসওয়াক করার নির্দেশ দিতাম।'",
    evidence_ar: "صحيح البخاري ٨٨٧: «لولا أن أشق على أمتي لأمرتهم بالسواك عند كل صلاة».",
    wisdom: "Salvadora persica contains natural antibacterial compounds, silica, and fluoride that eliminate overnight oral bacteria and stimulate alertness.",
    wisdom_bn: "মিসওয়াকে প্রাকৃতিক অ্যান্টিব্যাকটেরিয়াল উপাদান, সিলিকা ও ফ্লোরাইড রয়েছে যা রাতের জীবাণু দূর করে এবং মস্তিষ্ককে সতেজ করে।",
    wisdom_ar: "يحتوي السواك على مركبات طبيعية مضادة للبكتيريا تطهر الفم وتنشط الدورة الدموية والانتباه."
  },
  {
    id: "s24_03_tahajjud",
    phase: "tahajjud_fajr",
    time: "04:20 AM • Last Third of Night",
    time_bn: "ভোর ০৪:২০ • রাতের শেষ তৃতীয়াংশ",
    time_ar: "٠٤:٢٠ ص • الثلث الأخير من الليل",
    title: "3. Tahajjud (Qiyam al-Layl) & Pre-Dawn Istighfar",
    title_bn: "৩. তাহাজ্জুদ (কিয়ামুল লাইল) ও সাহরির সময়ে ইস্তিগফার",
    title_ar: "٣. صلاة التهجد (قيام الليل) والاستغفار بالأسحار",
    evidence: "Sahih Muslim 758 & Quran 51:18: Our Lord descends every night to the lowest heaven in the last third of the night asking: 'Who is calling upon Me that I may answer him?'",
    evidence_bn: "সহীহ মুসলিম ৭৫৮ ও সূরা যারিয়াত ১৮: প্রতি রাতের শেষ তৃতীয়াংশে আমাদের রব দুনিয়ার আকাশে অবতরণ করে বলেন: 'কে আছো আমাকে ডাকবে, আমি তার ডাকে সাড়া দেবো?'",
    evidence_ar: "صحيح مسلم ٧٥٨ والذاريات ١٨: ينزل ربنا تبارك وتعالى كل ليلة إلى السماء الدنيا حين يبقى ثلث الليل الآخر فيقول: «من يدعوني فأستجيب له؟».",
    wisdom: "Quiet pre-dawn solitude builds emotional resilience, deep cognitive focus (Khushu), and inner peace.",
    wisdom_bn: "ভোররাতের নির্জন ইবাদত মানসিক দৃঢ়তা, গভীর মনোযোগ (খুশু) এবং আত্মিক প্রশান্তি তৈরি করে।",
    wisdom_ar: "خلوة السحر تبني القوة النفسية والتركيز العميق والسكينة الداخلية."
  },
  {
    id: "s24_04_fajr_sunnah_fard",
    phase: "tahajjud_fajr",
    time: "05:00 AM • Dawn Prayer",
    time_bn: "ভোর ০৫:০০ • ফজরের সালাত",
    time_ar: "٠٥:٠٠ ص • صلاة الفجر",
    title: "4. 2 Rak'ah Sunnah of Fajr + Fajr Fard on Time",
    title_bn: "৪. ফজরের ২ রাকাত সুন্নাত ও সময়মতো ফজরের ফরজ সালাত",
    title_ar: "٤. ركعتا سنة الفجر وصلاة الفجر في وقتها",
    evidence: "Sahih Muslim 725: 'The two Rak'ahs before the dawn (Fajr) prayer are better than this world and all that it contains.'",
    evidence_bn: "সহীহ মুসলিম ৭২৫: 'ফজরের পূর্বে দুই রাকাত সুন্নাত সালাত দুনিয়া ও তার মধ্যকার সবকিছুর চেয়ে উত্তম।' (এবং ফজর আদায়কারী আল্লাহর জিম্মায় থাকে — মুসলিম ৬৫৭)।",
    evidence_ar: "صحيح مسلم ٧٢٥: «ركعتا الفجر خير من الدنيا وما فيها»، ومن صلى الصبح فهو في ذمة الله (مسلم ٦٥٧).",
    wisdom: "Synchronizes the human circadian clock with dawn light and places the believer under Allah's protection (Sahih Muslim 657).",
    wisdom_bn: "দেহের বায়োলজিক্যাল ঘড়িকে ভোরের আলোর সাথে সামঞ্জস্যপূর্ণ করে এবং মুমিনকে সারাদিন আল্লাহর নিরাপত্তায় রাখে।",
    wisdom_ar: "تضبط الساعة البيولوجية للجسم مع ضوء الفجر وتجعل المؤمن في ذمة الله وحفظه طوال اليوم."
  },
  {
    id: "s24_05_post_fajr_barakah",
    phase: "tahajjud_fajr",
    time: "05:30 AM • Barakah Window",
    time_bn: "ভোর ০৫:৩০ • বরকতময় প্রহর",
    time_ar: "٠٥:٣٠ ص • وقت البركة",
    title: "5. Morning Adhkar, Quran Recitation & Staying Awake After Fajr",
    title_bn: "৫. সকালের আযকার, কুরআন তিলাওয়াত ও ফজরের পর না ঘুমানো",
    title_ar: "٥. أذكار الصباح وتلاوة القرآن وعدم النوم بعد الفجر",
    evidence: "Sunan Abi Dawud 2606: 'O Allah, bless my Ummah in their early mornings.' The Prophet ﷺ did not sleep immediately after Fajr.",
    evidence_bn: "সুনানে আবু দাউদ ২৬০৬: 'হে আল্লাহ! আমার উম্মতের ভোরবেলার কাজে বরকত দান করুন।' নবীজি ﷺ ফজরের পর ঘুমাতেন না।",
    evidence_ar: "سنن أبي داود ٢٦٠٦: «اللهم بارك لأمتي في بكورها»، وكان النبي ﷺ يمكث في مصلاه بعد الفجر ولا ينام.",
    wisdom: "Harnesses peak morning cortisol and dopamine levels for Quranic contemplation, study, and strategic planning.",
    wisdom_bn: "সকালের সর্বোচ্চ মনোযোগ ও কর্মশক্তিকে কুরআন অনুধাবন, অধ্যয়ন এবং দিনের পরিকল্পনায় কাজে লাগায়।",
    wisdom_ar: "يستثمر ذروة النشاط الذهني الصباحي لتدبر القرآن والدراسة والتخطيط اليومي."
  },
  {
    id: "s24_06_ishraq_reflection",
    phase: "tahajjud_fajr",
    time: "06:15 AM • Post-Sunrise",
    time_bn: "সকাল ০৬:১৫ • সূর্যোদয়ের পর",
    time_ar: "٠٦:١٥ ص • بعد الشروق",
    title: "6. Sunrise Remembrance & 2 Rak'ah Ishraq",
    title_bn: "৬. সূর্যোদয় পর্যন্ত যিকির ও ২ রাকাত ইশরাক সালাত",
    title_ar: "٦. جلسة الذكر بعد الفجر وصلاة ركعتي الإشراق",
    evidence: "Jami` at-Tirmidhi 586: Whoever prays Fajr in congregation, then sits remembering Allah until the sun rises, then prays two Rak'ahs, has the reward of a complete Hajj and Umrah.",
    evidence_bn: "জামে তিরমিযী ৫৮৬: যে ব্যক্তি জামাতে ফজর পড়ে সূর্যোদয় পর্যন্ত বসে আল্লাহর যিকির করে এবং এরপর দুই রাকাত সালাত পড়ে, সে পরিপূর্ণ হজ ও উমরার সওয়াব পায়।",
    evidence_ar: "جامع الترمذي ٥٨٦: «من صلى الغداة في جماعة ثم قعد يذكر الله حتى تطلع الشمس ثم صلى ركعتين كانت له كأجر حجة وعمرة تامة تامة تامة».",
    wisdom: "Morning sunlight exposure regulates serotonin and melatonin cycles for the entire 24-hour period.",
    wisdom_bn: "সকালের মৃদু সূর্যালোক দেহে সেরোটোনিন ও মেলাটোনিন হরমোনের ভারসাম্য রক্ষা করে যা রাতে গভীর ঘুমে সাহায্য করে।",
    wisdom_ar: "التعرض لضوء الصباح ينظم إفراز السيروتونين والميلاتونين على مدار الـ ٢٤ ساعة."
  },
  {
    id: "s24_07_home_exit_dua",
    phase: "duha_work",
    time: "08:00 AM • Stepping Out",
    time_bn: "সকাল ০৮:০০ • ঘর থেকে বের হওয়া",
    time_ar: "٠٨:٠٠ ص • الخروج من المنزل",
    title: "7. Stepping Out with Bismillah & Tawakkul Dua",
    title_bn: "৭. বিসমিল্লাহ ও তাওয়াক্কুলের দোয়া পড়ে ঘর থেকে বের হওয়া",
    title_ar: "٧. دعاء الخروج من المنزل والتوكل على الله",
    evidence: "Sunan Abi Dawud 5095: Whoever says upon leaving his house 'Bismillahi, tawakkaltu 'alallah, la hawla wa la quwwata illa billah' is told: 'You are guided, sufficed, and protected.'",
    evidence_bn: "সুনানে আবু দাউদ ৫০৯৫: ঘর থেকে বের হওয়ার সময় যে ব্যক্তি বলে 'বিসমিল্লাহি তাওয়াক্কালতু আলাল্লাহ, লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ', তাকে বলা হয়: 'তুমি হিদায়াতপ্রাপ্ত, যথেষ্টকৃত ও সুরক্ষিত হলে।'",
    evidence_ar: "سنن أبي داود ٥٠٩٥: من قال إذا خرج من بيته: «بسم الله توكلت على الله، لا حول ولا قوة إلا بالله» يقال له: «هديت وكفيت ووقيت».",
    wisdom: "Instills psychological calm and purposeful reliance on Allah before entering academic or professional environments.",
    wisdom_bn: "কর্মক্ষেত্র বা শিক্ষাঙ্গনে প্রবেশের পূর্বে মনে প্রশান্তি ও আল্লাহর ওপর অবিচল আস্থা তৈরি করে।",
    wisdom_ar: "يغرس الطمأنينة النفسية والتوكل الصادق على الله قبل بدء الدراسة أو العمل."
  },
  {
    id: "s24_08_salat_duha",
    phase: "duha_work",
    time: "08:45 AM • Forenoon Prayer",
    time_bn: "সকাল ০৮:৪৫ • চাশতের সালাত",
    time_ar: "٠٨:٤٥ ص • صلاة الضحى",
    title: "8. Salat al-Duha (Charity for All 360 Joints)",
    title_bn: "৮. সালাতুদ দুহা বা চাশতের সালাত (৩৬০টি জোড়ার সদকা)",
    title_ar: "٨. صلاة الضحى (صدقة عن ٣٦٠ مفصلاً)",
    evidence: "Sahih Muslim 720: Every single morning charity is due upon every joint of your body; and two Rak'ahs offered in the forenoon (Duha) suffice for all 360 joints.",
    evidence_bn: "সহীহ মুসলিম ৭২০: প্রতিদিন সকালে মানুষের শরীরের প্রতিটি গ্রন্থির (৩৬০টি জোড়া) ওপর সদকা ওয়াজিব হয়, আর দুহা বা চাশতের দুই রাকাত সালাত তার সবগুলোর সদকা হিসেবে যথেষ্ট হয়ে যায়।",
    evidence_ar: "صحيح مسلم ٧٢٠: «يصبح على كل سلامى من أحدكم صدقة... ويجزئ من ذلك ركعتان يركعهما من الضحى».",
    wisdom: "Serves as a mindful mid-morning reset that relieves spinal and joint tension during long study or coding sessions.",
    wisdom_bn: "দীর্ঘ পড়াশোনা বা কাজের ফাঁকে মেরুদণ্ড ও শরীরের অস্থিসন্ধির ক্লান্তি দূর করে এবং মনকে সতেজ করে।",
    wisdom_ar: "تمنح الجسم والذهن استراحة روحية وحركية تخفف إجهاد المفاصل والعمود الفقري أثناء العمل."
  },
  {
    id: "s24_09_halal_ihsan_work",
    phase: "duha_work",
    time: "09:00 AM • Deep Work",
    time_bn: "সকাল ০৯:০০ • একাগ্র কর্মঘণ্টা",
    time_ar: "٠٩:٠٠ ص • العمل المتقن",
    title: "9. Pursuing Knowledge & Work with Ihsan (Excellence)",
    title_bn: "৯. ইহসান (উৎকর্ষতা) ও সততার সাথে জ্ঞানার্জন ও হালাল কাজ",
    title_ar: "٩. طلب العلم والعمل الحلال بإحسان وإتقان",
    evidence: "Sahih Muslim 1955: 'Verily, Allah has prescribed Ihsan (excellence/proficiency) in all things.' & Bukhari 2072.",
    evidence_bn: "সহীহ মুসলিম ১৯৫৫: 'নিশ্চয়ই আল্লাহ প্রতিটি কাজে ইহসান (সর্বোচ্চ সুন্দর ও নিখুঁতভাবে সম্পন্ন করা) নির্ধারণ করেছেন।' এবং নিজ হাতের হালাল উপার্জন সর্বোত্তম (বুখারী ২০৭২)।",
    evidence_ar: "صحيح مسلم ١٩٥٥: «إن الله كتب الإحسان على كل شيء»، وما أكل أحد طعاماً قط خيراً من أن يأكل من عمل يده (البخاري ٢٠٧٢).",
    wisdom: "Elevates secular study, legal preparation, programming, and entrepreneurship into continuous worship (Ibadah).",
    wisdom_bn: "সৎ নিয়ত ও ইহসানের মাধ্যমে দৈনন্দিন পড়াশোনা, প্রোগ্রামিং ও পেশাগত কাজকে নিরবচ্ছিন্ন ইবাদতে রূপান্তরিত করে।",
    wisdom_ar: "يحول الدراسة والبرمجة والعمل المهني بالنية الصالحة والإتقان إلى عبادة مستمرة."
  },
  {
    id: "s24_10_tayammun_right",
    phase: "duha_work",
    time: "All Day • Prophetic Mindfulness",
    time_bn: "সারাদিন • নববী সচেতনতা",
    time_ar: "طوال اليوم • اليقظة النبوية",
    title: "10. Tayammun (Beginning Noble Actions with the Right Side)",
    title_bn: "১০. তায়াম্মুন (সকল উত্তম কাজ ডান দিক থেকে শুরু করা)",
    title_ar: "١٠. التيمن (البدء باليمين في الشؤون الطيبة)",
    evidence: "Sahih al-Bukhari 168: The Prophet ﷺ loved to start from the right side when putting on shoes, combing hair, purifying himself, and in all his noble affairs.",
    evidence_bn: "সহীহ বুখারী ১৬৮: নবীজি ﷺ জুতা পরিধান, চুল আঁচড়ানো, পবিত্রতা অর্জন এবং তাঁর সকল উত্তম কাজে ডান দিক থেকে শুরু করতে ভালোবাসতেন।",
    evidence_ar: "صحيح البخاري ١٦٨: «كان النبي ﷺ يعجبه التيمن في تنعله وترجله وطهوره وفي شأنه كله».",
    wisdom: "Replaces habitual autopilot with conscious Prophetic intentionality in every physical movement.",
    wisdom_bn: "অচেতন অভ্যাসের পরিবর্তে প্রতিটি দৈনন্দিন কাজে সুন্নাতের সচেতন উপস্থিতি বজায় রাখে।",
    wisdom_ar: "يستبدل العادات التلقائية بالحضور الذهني والاقتداء الواعي بالسنة في كل حركة."
  },
  {
    id: "s24_11_dhuhr_rawatib",
    phase: "dhuhr_asr",
    time: "01:15 PM • Midday Prayer",
    time_bn: "দুপুর ০১:১৫ • যোহরের সালাত",
    time_ar: "٠١:١٥ م • صلاة الظهر",
    title: "11. Dhuhr Prayer & Rawatib Sunnahs (4 Before, 2 After)",
    title_bn: "১১. যোহরের ফরজ সালাত ও সুন্নাতে মুয়াক্কাদাহ (পূর্বে ৪, পরে ২)",
    title_ar: "١١. صلاة الظهر والسنن الرواتب (٤ قبلها و٢ بعدها)",
    evidence: "Jami` at-Tirmidhi 414: Whoever persists in performing 12 Rak'ahs from the Sunnah daily, Allah will build a house for him in Paradise.",
    evidence_bn: "জামে তিরমিযী ৪১৪: যে ব্যক্তি প্রতিদিন ১২ রাকাত সুন্নাতে মুয়াক্কাদাহ আদায়ে যত্নবান থাকে, আল্লাহ তার জন্য জান্নাতে একটি ঘর নির্মাণ করেন।",
    evidence_ar: "جامع الترمذي ٤١٤: «من ثابر على ثنتي عشرة ركعة من السنة بنى الله له بيتاً في الجنة».",
    wisdom: "Provides a structured spiritual pause at solar noon that detaches the heart from worldly stress.",
    wisdom_bn: "দুপুরের ব্যস্ততার মাঝে হৃদয়কে দুনিয়ার চাপ থেকে মুক্ত করে আল্লাহর সান্নিধ্যে প্রশান্ত করে।",
    wisdom_ar: "تمنح القلب وقفة إيمانية في منتصف النهار تفصله عن ضغوط الحياة والعمل."
  },
  {
    id: "s24_12_qaylulah_nap",
    phase: "dhuhr_asr",
    time: "02:00 PM • Cognitive Recovery",
    time_bn: "দুপুর ০২:০০ • মস্তিষ্কের বিশ্রাম",
    time_ar: "٠٢:٠٠ م • استعادة النشاط",
    title: "12. Qaylulah (20-Minute Prophetic Power Nap)",
    title_bn: "১২. কাইলুলা (দুপুরের ২০ মিনিটের নববী বিশ্রাম)",
    title_ar: "١٢. القيلولة النبوية (قسط يسير من الراحة ظهراً)",
    evidence: "Sahih al-Jami 4431: 'Take a midday nap (Qaylulah), for the Shayatin do not take a midday nap.'",
    evidence_bn: "সহীহুল জামে ৪৪৩১: 'তোমরা দুপুরে কাইলুলা (হালকা বিশ্রাম বা ঘুম) করো, কেননা শয়তান কাইলুলা করে না।'",
    evidence_ar: "صحيح الجامع ٤٤٣١: «قيلوا فإن الشياطين لا تقيل».",
    wisdom: "Neuroscience confirms a 15–25 minute early afternoon nap clears adenosine buildup and restores executive function.",
    wisdom_bn: "আধুনিক স্নায়ুবিজ্ঞান প্রমাণ করেছে দুপুরের ১৫-২৫ মিনিটের হালকা ঘুম মস্তিষ্কের ক্লান্তি দূর করে এবং স্মৃতিশক্তি ও কর্মক্ষমতা বাড়ায়।",
    wisdom_ar: "يثبت علم الأعصاب أن قيلولة ١٥-٢٥ دقيقة تزيل تراكم الأدينوزين وتجدد التركيز والذاكرة."
  },
  {
    id: "s24_13_asr_prayer",
    phase: "dhuhr_asr",
    time: "04:30 PM • The Middle Prayer",
    time_bn: "বিকেল ০৪:৩০ • মধ্যবর্তী সালাত",
    time_ar: "٠٤:٣٠ م • الصلاة الوسطى",
    title: "13. Guarding Salat al-Asr on Time",
    title_bn: "১৩. সময়মতো সালাতুল আসর (মধ্যবর্তী সালাত) আদায় করা",
    title_ar: "١٣. المحافظة على صلاة العصر (الصلاة الوسطى) في وقتها",
    evidence: "Quran 2:238: 'Guard strictly your prayers, especially the Middle Prayer (Asr).' & Sahih al-Bukhari 553.",
    evidence_bn: "সূরা বাকারা ২৩৮: 'তোমরা সালাতসমূহের প্রতি যত্নবান হও, বিশেষ করে মধ্যবর্তী (আসর) সালাতের প্রতি।' (সহীহ বুখারী ৫৫৩)।",
    evidence_ar: "سورة البقرة ٢٣٨: ﴿حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ﴾ وصحيح البخاري ٥٥٣.",
    wisdom: "Prevents late-afternoon burnout and anchors the transition from work to evening tranquility.",
    wisdom_bn: "বিকেলের অবসাদ দূর করে এবং কর্মব্যস্ত দিন থেকে সন্ধ্যার প্রশান্তিতে প্রবেশের সেতুবন্ধন তৈরি করে।",
    wisdom_ar: "تحمي من الإرهاق المسائي وتربط بين نهاية العمل وسكينة المساء."
  },
  {
    id: "s24_14_evening_adhkar",
    phase: "dhuhr_asr",
    time: "05:00 PM • Fortress of Dhikr",
    time_bn: "বিকেল ০৫:০০ • যিকিরের দুর্গ",
    time_ar: "٠٥:٠٠ م • حصن المساء",
    title: "14. Evening Adhkar (Adhkar al-Masa') Before Sunset",
    title_bn: "১৪. সূর্যাস্তের পূর্বে সন্ধ্যার আযকার (আযকারুল মাসা)",
    title_ar: "١٤. أذكار المساء قبل غروب الشمس",
    evidence: "Quran 33:41-42: 'O you who believe, remember Allah with much remembrance, and glorify Him morning and evening.'",
    evidence_bn: "সূরা আহযাব ৪১-৪২: 'হে মুমিনগণ! তোমরা আল্লাহকে অধিক পরিমাণে স্মরণ করো এবং সকাল ও সন্ধ্যায় তাঁর পবিত্রতা ঘোষণা করো।'",
    evidence_ar: "سورة الأحزاب ٤١-٤٢: ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا * وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا﴾.",
    wisdom: "Lowers evening cortisol and shields the mind from anxiety and spiritual restlessness.",
    wisdom_bn: "সন্ধ্যার মানসিক চাপ ও উদ্বেগ হ্রাস করে এবং আত্মাকে যাবতীয় অনিষ্ট থেকে সুরক্ষিত রাখে।",
    wisdom_ar: "تخفض هرمون التوتر المسائي وتحصن القلب من القلق والاضطراب الروحي."
  },
  {
    id: "s24_15_maghrib_sunnah",
    phase: "maghrib_isha",
    time: "06:00 PM • Sunset Prayer",
    time_bn: "সন্ধ্যা ০৬:০০ • মাগরিবের সালাত",
    time_ar: "٠٦:٠٠ م • صلاة المغرب",
    title: "15. Maghrib Prayer & 2 Rak'ah Rawatib Sunnah",
    title_bn: "১৫. মাগরিবের ফরজ সালাত ও ২ রাকাত সুন্নাতে মুয়াক্কাদাহ",
    title_ar: "١٥. صلاة المغرب وركعتا السنة الراتبة",
    evidence: "Sahih Muslim 728: Part of the 12 daily Rawatib Rak'ahs that build a home in Jannah.",
    evidence_bn: "সহীহ মুসলিম ৭২৮: জান্নাতে ঘর নির্মাণকারী দৈনিক ১২ রাকাত সুন্নাতে মুয়াক্কাদার অন্যতম অংশ।",
    evidence_ar: "صحيح مسلم ٧٢٨: من السنن الرواتب الاثنتي عشرة التي يبنى لصاحبها بيت في الجنة.",
    wisdom: "Marks the Islamic transition to a new calendar day with immediate gratitude.",
    wisdom_bn: "ইসলামী ক্যালেন্ডার অনুযায়ী নতুন দিনের সূচনাকে আল্লাহর শুকরিয়া ও ইবাদতের মাধ্যমে স্মরণীয় করে।",
    wisdom_ar: "تستقبل بداية اليوم الإسلامي الجديد بالعبادة والشكر فور غروب الشمس."
  },
  {
    id: "s24_16_family_silat_rahim",
    phase: "maghrib_isha",
    time: "06:30 PM • Family & Kinship",
    time_bn: "সন্ধ্যা ০৬:৩০ • পরিবার ও আত্মীয়তা",
    time_ar: "٠٦:٣٠ م • الأهل وصلة الرحم",
    title: "16. Warmth Toward Family & Serving at Home",
    title_bn: "১৬. পরিবারের সাথে সদাচরণ ও ঘরের কাজে সহায়তা করা",
    title_ar: "١٦. حسن العشرة وخدمة الأهل في المنزل",
    evidence: "Sahih al-Bukhari 676: The Prophet ﷺ used to be in the service of his family, and when the time for prayer came, he would go out to pray.",
    evidence_bn: "সহীহ বুখারী ৬৭৬: নবীজি ﷺ ঘরের কাজে পরিবারের সেবা ও সহায়তা করতেন এবং সালাতের সময় হলে সালাতের জন্য বের হতেন।",
    evidence_ar: "صحيح البخاري ٦٧٦: سئلت عائشة رضي الله عنها ما كان النبي ﷺ يصنع في بيته؟ قالت: «كان يكون في مهنة أهله، فإذا حضرت الصلاة خرج إلى الصلاة».",
    wisdom: "Strengthens family bonds and emotional warmth away from digital distractions.",
    wisdom_bn: "ডিজিটাল আসক্তি থেকে দূরে থেকে পারিবারিক বন্ধন ও সৌহার্দ্য সুদৃঢ় করে।",
    wisdom_ar: "يقوي الروابط الأسرية والدفء العاطفي بعيداً عن المشتتات الرقمية."
  },
  {
    id: "s24_17_isha_witr",
    phase: "maghrib_isha",
    time: "08:00 PM • Night Prayer",
    time_bn: "রাত ০৮:০০ • ইশা ও বিতর",
    time_ar: "٠٨:٠٠ م • العشاء والوتر",
    title: "17. Isha Prayer in Congregation & Witr Prayer",
    title_bn: "১৭. জামাতের সাথে ইশার সালাত ও বিতর সালাত আদায়",
    title_ar: "١٧. صلاة العشاء في جماعة وصلاة الوتر",
    evidence: "Sahih Muslim 656: 'Whoever prays Isha in congregation, it is as if he stood half the night in prayer.'",
    evidence_bn: "সহীহ মুসলিম ৬৫৬: 'যে ব্যক্তি জামাতের সাথে ইশার সালাত আদায় করল, সে যেন অর্ধরাত দাঁড়িয়ে সালাত আদায় করল।' এবং বিতর দিয়ে রাতের সালাত সমাপ্ত করো (বুখারী ৯৯৮)।",
    evidence_ar: "صحيح مسلم ٦٥٦: «من صلى العشاء في جماعة فكأنما قام نصف الليل»، و«اجعلوا آخر صلاتكم بالليل وتراً» (البخاري ٩٩٨).",
    wisdom: "Seals the active day with peace and odd-numbered Witr devotion (Bukhari 998).",
    wisdom_bn: "সারাদিনের কর্মব্যস্ততাকে প্রশান্তিময় জামাত ও বিতর সালাতের মাধ্যমে সমাপ্ত করে।",
    wisdom_ar: "تختم اليوم العملي بالطمأنينة وصلاة الوتر المباركة."
  },
  {
    id: "s24_18_surah_mulk_baqarah",
    phase: "maghrib_isha",
    time: "09:15 PM • Night Quran",
    time_bn: "রাত ০৯:১৫ • রাতের কুরআন তিলাওয়াত",
    time_ar: "٠٩:١٥ م • ورد القرآن الليلي",
    title: "18. Reciting Surah Al-Mulk & Last 2 Ayahs of Al-Baqarah",
    title_bn: "১৮. সূরা আল-মুলক এবং সূরা বাকারার শেষ ২ আয়াত তিলাওয়াত",
    title_ar: "١٨. قراءة سورة الملك وآخر آيتين من سورة البقرة",
    evidence: "Sahih al-Bukhari 5009: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him.' & Tirmidhi 2891 (Surah Al-Mulk).",
    evidence_bn: "সহীহ বুখারী ৫০০৯: 'যে ব্যক্তি রাতে সূরা বাকারার শেষ দুটি আয়াত তিলাওয়াত করবে, তা তার জন্য যথেষ্ট হবে।' এবং সূরা মুলক কবরের আজাব থেকে রক্ষা করে (তিরমিযী ২৮৯১)।",
    evidence_ar: "صحيح البخاري ٥٠٠٩: «من قرأ بالآيتين من آخر سورة البقرة في ليلة كفتاه»، وسورة الملك هي المانعة من عذاب القبر (الترمذي ٢٨٩١).",
    wisdom: "Replaces late-night doomscrolling with tranquil revelation; the Prophet ﷺ disliked idle talk after Isha (Bukhari 568).",
    wisdom_bn: "রাতে অহেতুক কথাবার্তা ও মোবাইল স্ক্রলিং পরিহার করে ওহীর প্রশান্তি নিয়ে ঘুমানোর প্রস্তুতি দেয় (বুখারী ৫৬৮)।",
    wisdom_ar: "يستبدل السهر غير المفيد بتدبر الوحي؛ وكان النبي ﷺ يكره الحديث بعد العشاء (البخاري ٥٦٨)."
  },
  {
    id: "s24_19_sleep_wudu_dusting",
    phase: "sleep_sunnah",
    time: "10:00 PM • Bedtime Purity",
    time_bn: "রাত ১০:০০ • ঘুমানোর প্রস্তুতি",
    time_ar: "١٠:٠٠ م • طهارة النوم",
    title: "19. Sleeping in Wudu, Dusting Bed 3x & Right-Side Posture",
    title_bn: "১৯. অযু অবস্থায় ঘুমানো, বিছানা ৩ বার ঝাড়া ও ডান কাত হয়ে শোয়া",
    title_ar: "١٩. النوم على طهارة ونفض الفراش ٣ مرات والنوم على الشق الأيمن",
    evidence: "Sahih al-Bukhari 247 & 6320: 'When you go to bed, perform ablution as you do for prayer, dust off the bed three times, and lie down on your right side.'",
    evidence_bn: "সহীহ বুখারী ২৪৭ ও ৬৩২০: 'যখন বিছানায় যাবে, সালাতের অযুর মতো অযু করবে, বিছানা তিনবার ঝেড়ে নেবে এবং ডান কাতে শুয়ে পড়বে।'",
    evidence_ar: "صحيح البخاري ٢٤٧ و٦٣٢٠: «إذا أتيت مضجعك فتوضأ وضوءك للصلاة، ثم اضطجع على شقك الأيمن» مع نفض الفراش ثلاثاً.",
    wisdom: "Right-side sleeping reduces cardiac compression, improves lymphatic brain drainage, and eases digestion.",
    wisdom_bn: "ডান কাতে ঘুমালে হৃৎপিণ্ডের ওপর চাপ কমে, মস্তিষ্কের লিম্ফ্যাটিক নিষ্কাশন উন্নত হয় এবং হজম সহজ হয়।",
    wisdom_ar: "النوم على الشق الأيمن يخفف الضغط عن القلب ويحسن تصريف السموم العصبية ويسهل الهضم."
  },
  {
    id: "s24_20_kursi_3quls",
    phase: "sleep_sunnah",
    time: "10:10 PM • Night Shield",
    time_bn: "রাত ১০:১০ • রাতের সুরক্ষা কবচ",
    time_ar: "١٠:١٠ م • التحصين الليلي",
    title: "20. Ayat al-Kursi & Cupping Hands with the 3 Quls (3x)",
    title_bn: "২০. আয়াতুল কুরসী ও তিন কুল পড়ে হাত দিয়ে শরীরে মাসেহ (৩ বার)",
    title_ar: "٢٠. آية الكرسي والنفث في الكفين بالمعوذات (٣ مرات)",
    evidence: "Sahih al-Bukhari 5017: The Prophet ﷺ cupped his hands, blew into them, recited Al-Ikhlas, Al-Falaq, and An-Nas, and wiped over his head, face, and body three times.",
    evidence_bn: "সহীহ বুখারী ৫০১৭: নবীজি ﷺ প্রতি রাতে বিছানায় গেলে দুই হাত একত্র করে সূরা ইখলাস, ফালাক ও নাস পড়ে ফুঁ দিতেন এবং মাথা, মুখমণ্ডল ও দেহের যতটুকু সম্ভব তিনবার মাসেহ করতেন।",
    evidence_ar: "صحيح البخاري ٥٠١٧: كان النبي ﷺ إذا أوى إلى فراشه جمع كفيه ثم نفث فيهما فقرأ الإخلاص والفلق والناس ومسح بهما ما استطاع من جسده ثلاث مرات.",
    wisdom: "Creates a calming tactile and spiritual wind-down routine that signals deep restorative sleep.",
    wisdom_bn: "দেহ ও মনে গভীর আধ্যাত্মিক নিরাপত্তা ও প্রশান্তির অনুভূতি তৈরি করে যা গভীর ঘুমে সাহায্য করে।",
    wisdom_ar: "يخلق روتيناً روحياً وحسياً مهدئاً يهيئ الجهاز العصبي لنوم عميق ومبارك."
  },
  {
    id: "s24_21_tasbih_fatimah",
    phase: "sleep_sunnah",
    time: "10:15 PM • Energy Renewal",
    time_bn: "রাত ১০:১৫ • কর্মশক্তি নবায়ন",
    time_ar: "١٠:١٥ م • تجديد الطاقة",
    title: "21. Tasbih Fatimah Before Sleep (33-33-34)",
    title_bn: "২১. ঘুমানোর পূর্বে তাসবীহ ফাতিমী পাঠ (৩৩-৩৩-৩৪)",
    title_ar: "٢١. تسبيح فاطمة رضي الله عنها قبل النوم (٣٣-٣٣-٣٤)",
    evidence: "Sahih al-Bukhari 5361: Reciting 33x SubhanAllah, 33x Alhamdulillah, and 34x Allahu Akbar at bedtime is better for physical strength than having a servant.",
    evidence_bn: "সহীহ বুখারী ৫৩৬১: ঘুমানোর সময় ৩৩ বার সুবহানাল্লাহ, ৩৩ বার আলহামদুলিল্লাহ এবং ৩৪ বার আল্লাহু আকবার পাঠ করা শারীরিক শক্তির জন্য একজন খাদেম থাকার চেয়েও উত্তম।",
    evidence_ar: "صحيح البخاري ٥٣٦١: تسبيح الله ٣٣ وتحميده ٣٣ وتكبيره ٣٤ عند المنام خير لكما من خادم.",
    wisdom: "Quiets racing thoughts and prepares the mind to wake effortlessly for Tahajjud and Fajr.",
    wisdom_bn: "মনের অস্থির চিন্তা শান্ত করে এবং তাহাজ্জুদ ও ফজরে সতেজভাবে জাগ্রত হতে সাহায্য করে।",
    wisdom_ar: "يهدئ تسارع الأفكار ويهيئ العقل والجسد للاستيقاظ بنشاط للتهجد والفجر."
  },
  {
    id: "s24_22_forgiving_before_sleep",
    phase: "sleep_sunnah",
    time: "10:20 PM • Clean Heart",
    time_bn: "রাত ১০:২০ • নির্মল হৃদয়",
    time_ar: "١٠:٢٠ م • سلامة الصدر",
    title: "22. Sleeping with a Heart Free of Malice (Salim al-Sadr)",
    title_bn: "২২. হিংসা-বিদ্বেষমুক্ত পবিত্র অন্তরে (সালীমুস সদর) ঘুমানো",
    title_ar: "٢٢. النوم بقلب سليم خالٍ من الغل والحقد على المسلمين",
    evidence: "Musnad Ahmad 12697: The companion promised Paradise three times by the Prophet ﷺ was the one who never went to sleep holding envy or hatred toward any Muslim.",
    evidence_bn: "মুসনাদে আহমাদ ১২৬৯৭: নবীজি ﷺ যাকে তিনবার জান্নাতের সুসংবাদ দিয়েছিলেন, তাঁর বিশেষ আমল ছিল তিনি প্রতি রাতে সকল মুসলিমের প্রতি হিংসা ও বিদ্বেষমুক্ত অন্তরে ঘুমাতেন।",
    evidence_ar: "مسند أحمد ١٢٦٩٧: الصحابي الذي بشره النبي ﷺ بالجنة ثلاثاً كان لا يبيت وفي نفسه غش أو حسد لأحد من المسلمين.",
    wisdom: "Releasing resentment before sleep lowers nighttime blood pressure and heals emotional stress.",
    wisdom_bn: "ঘুমানোর আগে ক্ষমা ও উদারতা চর্চা করলে রাতের রক্তচাপ স্বাভাবিক থাকে এবং মানসিক প্রশান্তি মেলে।",
    wisdom_ar: "التسامح وتصفية القلب قبل النوم يخفض ضغط الدم الليلي ويشفي التوتر النفسي."
  },
  {
    id: "s24_23_one_third_stomach",
    phase: "diet_hygiene",
    time: "Every Meal • Metabolic Sunnah",
    time_bn: "প্রতি বেলার খাবার • পরিমিত আহার",
    time_ar: "كل وجبة • الاعتدال النبوي",
    title: "23. 1/3 Food, 1/3 Drink, 1/3 Breath + Eating with Right Hand",
    title_bn: "২৩. পেটের ১/৩ খাবার, ১/৩ পানি, ১/৩ শ্বাস ও ডান হাতে খাওয়া",
    title_ar: "٢٣. ثلث للطعام وثلث للشراب وثلث للنفس والأكل باليمين",
    evidence: "Jami` at-Tirmidhi 2380: 'A human being fills no worse vessel than his stomach... one-third for food, one-third for drink, and one-third for breath.'",
    evidence_bn: "জামে তিরমিযী ২৩৮০: 'মানুষ পেটের চেয়ে মন্দ কোনো পাত্র পূর্ণ করে না... যদি খেতেই হয় তবে এক-তৃতীয়াংশ খাবারের জন্য, এক-তৃতীয়াংশ পানির জন্য এবং এক-তৃতীয়াংশ শ্বাস-প্রশ্বাসের জন্য রাখবে।'",
    evidence_ar: "جامع الترمذي ٢٣٨٠: «ما ملأ آدمي وعاءً شراً من بطن... فثلث لطعامه وثلث لشرابه وثلث لنفسه».",
    wisdom: "Prevents post-prandial lethargy, insulin spikes, and acid reflux while preserving mental sharpness.",
    wisdom_bn: "খাবার-পরবর্তী আলস্য, অতিরিক্ত ইনসুলিন বৃদ্ধি এবং অ্যাসিডিটি রোধ করে মস্তিষ্ককে সজাগ রাখে।",
    wisdom_ar: "يمنع الخمول بعد الأكل وارتفاع الأنسولين الحاد ويحافظ على صفاء الذهن."
  },
  {
    id: "s24_24_water_three_sips",
    phase: "diet_hygiene",
    time: "Hydration • Prophetic Etiquette",
    time_bn: "পানি পান • নববী আদব",
    time_ar: "شرب الماء • الأدب النبوي",
    title: "24. Drinking Water Sitting Down in 3 Mindful Sips",
    title_bn: "২৪. বসে এবং ৩ নিঃশ্বাসে পানি পান করা",
    title_ar: "٢٤. شرب الماء جالساً على ثلاث دفعات",
    evidence: "Sahih Muslim 2028: The Prophet ﷺ breathed three times outside the vessel while drinking and said: 'It is more quenching, healthier, and more wholesome.'",
    evidence_bn: "সহীহ মুসলিম ২০২৮: নবীজি ﷺ পানি পানের সময় পাত্রের বাইরে তিনবার শ্বাস নিতেন এবং বলতেন: 'এটি অধিক তৃপ্তিদায়ক, স্বাস্থ্যকর ও সহজে হজমযোগ্য।'",
    evidence_ar: "صحيح مسلم ٢٠٢٨: كان النبي ﷺ يتنفس في الشراب ثلاثاً خارج الإناء ويقول: «إنه أروى وأبرأ وأمرأ».",
    wisdom: "Prevents aerophagia (swallowing air) and supports gentle vagal nerve regulation.",
    wisdom_bn: "তাড়াহুড়ো করে পানি গেলার ক্ষতিকর প্রভাব রোধ করে এবং স্নায়ুতন্ত্র ও পাকস্থলীকে প্রশান্ত রাখে।",
    wisdom_ar: "يمنع ابتلاع الهواء المفاجئ وينظم عمل العصب الحائر والجهاز الهضمي بلطف."
  },
  {
    id: "s24_25_tibb_nabawi_superfoods",
    phase: "diet_hygiene",
    time: "Daily Nutrition • Tibb Nabawi",
    time_bn: "দৈনিক পুষ্টি • তিব্বে নববী",
    time_ar: "التغذية اليومية • الطب النبوي",
    title: "25. Prophetic Superfoods (Black Seed, Honey, Olive Oil, Dates, Talbinah)",
    title_bn: "২৫. তিব্বে নববী খাবার (কালোজিরা, মধু, যায়তুন তেল, খেজুর, তালবিনা)",
    title_ar: "٢٥. أغذية الطب النبوي (الحبة السوداء، العسل، زيت الزيتون، التمر، التلبينة)",
    evidence: "Sahih al-Bukhari 5688: 'In the black seed (Habbatus Sauda) there is healing for every disease except death.'",
    evidence_bn: "সহীহ বুখারী ৫৬৮৮: 'কালোজিরায় মৃত্যু ব্যতীত সকল রোগের নিরাময় রয়েছে।' এবং মধু, যায়তুন ও তালবিনা অন্তরকে প্রশান্ত করে।",
    evidence_ar: "صحيح البخاري ٥٦٨٨: «إن في الحبة السوداء شفاء من كل داء إلا السام»، والتلبينة تجم فؤاد المريض.",
    wisdom: "Rich in thymoquinone, polyphenols, and prebiotic beta-glucans that boost immunity and gut-brain health.",
    wisdom_bn: "থাইমোকুইনোন, পলিফেনল ও প্রিবায়োটিক উপাদানে সমৃদ্ধ যা রোগ প্রতিরোধ ক্ষমতা ও মস্তিষ্কের স্বাস্থ্য বৃদ্ধি করে।",
    wisdom_ar: "غنية بمضادات الأكسدة والثيموكينون والألياف الحيوية التي تعزز المناعة وصحة الدماغ."
  },
  {
    id: "s24_26_fitrah_grooming",
    phase: "diet_hygiene",
    time: "Personal Care • Fitrah",
    time_bn: "পরিচ্ছন্নতা • স্বভাবজাত ফিতরাত",
    time_ar: "العناية الشخصية • الفطرة",
    title: "26. Maintaining the 5 Practices of Fitrah, Perfume & Clean Attire",
    title_bn: "২৬. ফিতরাতের ৫টি সুন্নাহ, সুগন্ধি ব্যবহার ও পরিচ্ছন্ন পোশাক",
    title_ar: "٢٦. خصال الفطرة الخمس والطيب ونظافة الثياب",
    evidence: "Sahih al-Bukhari 5889 & Sahih Muslim 91: 'Allah is Beautiful and loves beauty.'",
    evidence_bn: "সহীহ বুখারী ৫৮৮৯ ও মুসলিম ৯১: 'নিশ্চয়ই আল্লাহ সুন্দর এবং তিনি সৌন্দর্য ও পরিচ্ছন্নতা ভালোবাসেন।'",
    evidence_ar: "صحيح البخاري ٥٨٨٩ وصحيح مسلم ٩١: «إن الله جميل يحب الجمال».",
    wisdom: "High personal hygiene, nail care, and pleasant scent elevate self-respect and social dignity.",
    wisdom_bn: "নখ কাটা, শারীরিক পরিচ্ছন্নতা এবং সুগন্ধি ব্যবহার আত্মমর্যাদা ও সামাজিক সৌন্দর্য বৃদ্ধি করে।",
    wisdom_ar: "النظافة الفطرية وتقليم الأظافر والتطيب ترفع الوقار النفسي والاجتماعي."
  },
  {
    id: "s24_27_salam_smiling",
    phase: "character_social",
    time: "Social • Prophetic Warmth",
    time_bn: "সামাজিক আচরণ • নববী সৌহার্দ্য",
    time_ar: "المجتمع • المودة النبوية",
    title: "27. Initiating Salam & Smiling as Sadaqah",
    title_bn: "২৭. আগে সালাম দেওয়া এবং হাসিমুখে কথা বলা (সদকা)",
    title_ar: "٢٧. إفشاء السلام والتبسم في وجه أخيك صدقة",
    evidence: "Jami` at-Tirmidhi 1956: 'Your smiling in the face of your brother is charity (Sadaqah).'",
    evidence_bn: "জামে তিরমিযী ১৯৫৬: 'তোমার ভাইয়ের দিকে হাসিমুখে তাকানোও তোমার জন্য একটি সদকা (দান)।'",
    evidence_ar: "جامع الترمذي ١٩٥٦: «تبسمك في وجه أخيك لك صدقة».",
    wisdom: "Triggers positive mirror-neuron responses, reduces social friction, and spreads trust.",
    wisdom_bn: "মানুষের মাঝে পারস্পরিক আস্থা, ভালোবাসা ও ইতিবাচক পরিবেশ ছড়িয়ে দেয়।",
    wisdom_ar: "ينشر المودة والثقة المتبادلة ويزيل الجفاء الاجتماعي."
  },
  {
    id: "s24_28_guarding_tongue_anger",
    phase: "character_social",
    time: "Self-Mastery • Emotional Discipline",
    time_bn: "আত্মনিয়ন্ত্রণ • আবেগীয় শৃঙ্খলা",
    time_ar: "ضبط النفس • الحلم والأناة",
    title: "28. Guarding the Tongue & Controlling Anger",
    title_bn: "২৮. জিহ্বার হেফাজত করা ও রাগ নিয়ন্ত্রণ করা",
    title_ar: "٢٨. حفظ اللسان وكظم الغيظ وترك الغضب",
    evidence: "Sahih al-Bukhari 6018: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.' & Bukhari 6116: 'Do not become angry.'",
    evidence_bn: "সহীহ বুখারী ৬০১৮: 'যে ব্যক্তি আল্লাহ ও শেষ দিবসে ঈমান রাখে, সে যেন উত্তম কথা বলে অথবা নীরব থাকে।' এবং 'রাগান্বিত হয়ো না' (বুখারী ৬১১৬)।",
    evidence_ar: "صحيح البخاري ٦٠١٨: «من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت»، ووصيته ﷺ: «لا تغضب» (البخاري ٦١١٦).",
    wisdom: "Preserves credibility, prevents regretful conflicts, and builds executive self-control.",
    wisdom_bn: "অপ্রয়োজনীয় বিবাদ ও অনুশোচনা থেকে রক্ষা করে এবং ব্যক্তিত্বের গাম্ভীর্য ও আত্মনিয়ন্ত্রণ বৃদ্ধি করে।",
    wisdom_ar: "يحفظ الهيبة والمصداقية ويمنع النزاعات والندم ويعزز التحكم الذاتي."
  },
  {
    id: "s24_29_daily_sadaqah_istighfar",
    phase: "character_social",
    time: "Wealth & Soul • Barakah",
    time_bn: "সম্পদ ও আত্মা • বরকত",
    time_ar: "المال والروح • البركة",
    title: "29. Daily Sadaqah (Charity) & 100x Istighfar",
    title_bn: "২৯. দৈনিক সদকা (দান) এবং ১০০ বার ইস্তিগফার পাঠ",
    title_ar: "٢٩. الصدقة اليومية والاستغفار ١٠٠ مرة",
    evidence: "Sahih Muslim 2588: 'Charity does not decrease wealth.' & Bukhari 6307: 'I seek Allah's forgiveness and repent to Him more than 70 (or 100) times a day.'",
    evidence_bn: "সহীহ মুসলিম ২৫৮৮: 'সদকা করলে সম্পদ কমে না।' এবং নবীজি ﷺ প্রতিদিন ৭০ বা ১০০ বারের অধিক ইস্তিগফার করতেন (বুখারী ৬৩০৭)।",
    evidence_ar: "صحيح مسلم ٢٥٨٨: «ما نقصت صدقة من مال»، وقال ﷺ: «والله إني لأستغفر الله وأتوب إليه في اليوم أكثر من سبعين مرة» (البخاري ٦٣٠٧).",
    wisdom: "Cultivates an abundance mindset and purifies the heart from spiritual rust.",
    wisdom_bn: "রিজিকে বরকত আনে, কৃপণতা দূর করে এবং অন্তরকে গুনাহের মরিচা থেকে পবিত্র রাখে।",
    wisdom_ar: "يجلب البركة في الرزق ويطهر القلب من ران الذنوب والغفلة."
  },
  {
    id: "s24_30_honoring_parents",
    phase: "character_social",
    time: "Daily Duty • Birr al-Walidayn",
    time_bn: "দৈনিক দায়িত্ব • পিতা-মাতার সেবা",
    time_ar: "واجب يومي • بر الوالدين",
    title: "30. Dutifulness, Gentle Speech & Dua for Parents",
    title_bn: "৩০. পিতা-মাতার খেদমত, নম্র আচরণ ও তাঁদের জন্য দোয়া করা",
    title_ar: "٣٠. بر الوالدين وخفض الجناح والدعاء لهما",
    evidence: "Quran 17:23-24 & Sahih al-Bukhari 5970: Dutifulness to parents is among the most beloved deeds to Allah right after prayer on time.",
    evidence_bn: "সূরা বনী ইসরাঈল ২৩-২৪ ও সহীহ বুখারী ৫৯৭০: সময়মতো সালাত আদায়ের পরই আল্লাহর কাছে সবচেয়ে প্রিয় আমল হলো পিতা-মাতার সাথে সদাচরণ করা।",
    evidence_ar: "سورة الإسراء ٢٣-٢٤ وصحيح البخاري ٥٩٧٠: بر الوالدين من أحب الأعمال إلى الله عز وجل بعد الصلاة على وقتها.",
    wisdom: "Brings immense Barakah in lifespan, provision (Rizq), and emotional grounding.",
    wisdom_bn: "হায়াত ও রিজিকে অফুরন্ত বরকত আনে এবং দুনিয়া ও আখিরাতে সফলতার পথ সুগম করে।",
    wisdom_ar: "سبب عظيم للبركة في العمر والرزق والتوفيق في الدنيا والآخرة."
  },
  {
    id: "s24_31_mon_thu_fasting",
    phase: "character_social",
    time: "Weekly Cycle • Mon/Thu & White Days",
    time_bn: "সাপ্তাহিক সুন্নাহ • সোম/বৃহস্পতি ও আইয়ামে বীজ",
    time_ar: "دورة أسبوعية • الإثنين والخميس والأيام البيض",
    title: "31. Sunnah Fasting (Mondays, Thursdays & 13th-15th Hijri)",
    title_bn: "৩১. সুন্নাহ রোজা (সোমবার, বৃহস্পতিবার ও আইয়ামে বীজ ১৩-১৫ হিজরি)",
    title_ar: "٣١. صيام الإثنين والخميس والأيام البيض (١٣-١٥ هجري)",
    evidence: "Jami` at-Tirmidhi 747: 'Deeds are presented on Monday and Thursday, and I love that my deeds be presented while I am fasting.'",
    evidence_bn: "জামে তিরমিযী ৭৪৭: 'সোমবার ও বৃহস্পতিবার আল্লাহর দরবারে বান্দার আমল পেশ করা হয়, আর আমি ভালোবাসি যে রোজা অবস্থায় আমার আমল পেশ করা হোক।'",
    evidence_ar: "جامع الترمذي ٧٤٧: «تعرض الأعمال يوم الإثنين والخميس، فأحب أن يعرض عملي وأنا صائم».",
    wisdom: "Periodic fasting stimulates cellular autophagy, insulin sensitivity, and spiritual willpower.",
    wisdom_bn: "নিয়মিত নফল রোজা দেহের কোষের অটোফ্যাজি (পুনর্গঠন) সক্রিয় করে এবং তাকওয়া ও ইচ্ছাশক্তি বৃদ্ধি করে।",
    wisdom_ar: "الصيام الدوري ينشط التهام الخلايا التالفة (Autophagy) ويقوي الإرادة والتقوى."
  },
  {
    id: "s24_32_jumuah_kahf_salawat",
    phase: "character_social",
    time: "Friday Sunnah • Jumu'ah Protocol",
    time_bn: "জুমু'আর সুন্নাহ • শুক্রবারের আমল",
    time_ar: "سنن الجمعة • آداب يوم الجمعة",
    title: "32. Friday Ghusl, Early Arrival, Surah Al-Kahf & Abundant Salawat",
    title_bn: "৩২. জুমু'আর গোসল, আগেভাগে মসজিদে গমন, সূরা কাহফ ও অধিক দরূদ পাঠ",
    title_ar: "٣٢. غسل الجمعة والتبكير وسورة الكهف والإكثار من الصلاة على النبي ﷺ",
    evidence: "Sahih al-Bukhari 881 & Al-Hakim: Reciting Surah Al-Kahf on Friday illuminates the believer with light between the two Fridays.",
    evidence_bn: "সহীহ বুখারী ৮৮১ ও মুস্তাদরাকে হাকেম: জুমু'আর দিন সূরা কাহফ তিলাওয়াত করলে দুই জুমু'আর মধ্যবর্তী সময় নূর দ্বারা আলোকিত থাকে এবং দরূদ পাঠ রাসূল ﷺ-এর শাফায়াত লাভের মাধ্যম।",
    evidence_ar: "صحيح البخاري ٨٨١ والمستدرك: «من قرأ سورة الكهف في يوم الجمعة أضاء له من النور ما بين الجمعتين».",
    wisdom: "Provides a weekly spiritual summit that realigns life priorities and long-term vision.",
    wisdom_bn: "সপ্তাহজুড়ে ঈমানের নবায়ন ঘটায় এবং জীবনের লক্ষ্যকে আখিরাতমুখী রাখে।",
    wisdom_ar: "محطة إيمانية أسبوعية تجدد نور القلب وتعيد ترتيب أولويات الحياة."
  }
]);

// 12 Essential Full Morning & Evening Masnoon Duas
const SUNNAH_24_DUAS = deepFreeze([
  {
    id: "dua_01_kalimat_tammat",
    title_bn: "১. সৃষ্টির অনিষ্ট ও বিষধর প্রাণী থেকে আশ্রয়ের দোয়া",
    title_ar: "١. التعوذ بكلمات الله التامات من شر ما خلق",
    title_en: "1. Protection from the Evil of What He Created",
    badge_bn: "সন্ধ্যায় ৩ বার",
    badge_ar: "٣ مرات مساءً",
    badge_en: "Evening 3x",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translit_bn: "উচ্চারণ: আ'উযু বিকালিমা-তিল্লা-হিত তা-ম্মা-তি মিন শাররি মা- খালাক্ব।",
    translit_en: "Transliteration: A'udhu bikalimatillahit-tammati min sharri ma khalaq.",
    meaning_bn: "অর্থ: আল্লাহর পরিপূর্ণ কালিমাসমূহের উসীলায় আমি তাঁর নিকট তাঁর সৃষ্টির সকল ক্ষতি থেকে আশ্রয় চাই।",
    meaning_ar: "المعنى: ألتجئ وأعتصم بكلمات الله الكاملة التي لا يلحقها نقص من شر كل ذي شر من المخلوقات.",
    meaning_en: "Meaning: I seek refuge in the perfect words of Allah from the evil of what He has created.",
    virtue_bn: "✨ ফযীলত: যে ব্যক্তি সন্ধ্যায় এ দোয়াটি ৩ বার বলবে, সে রাতে কোনো বিষধর প্রাণী বা অনিষ্টকারী কিছু তার ক্ষতি করতে পারবে না (সহীহ মুসলিম ২৭০৯, ইবনে মাজাহ ৩৫১৮)।",
    virtue_ar: "✨ الفضيلة: من قالها حين يمسي ثلاث مرات لم تضره حمة تلك الليلة (صحيح مسلم ٢٧٠٩).",
    virtue_en: "✨ Virtue: Whoever recites this 3 times in the evening will not be harmed by any venomous creature that night (Sahih Muslim 2709)."
  },
  {
    id: "dua_02_tahlil",
    title_bn: "২. তাওহীদ ও প্রশংসার শ্রেষ্ঠ যিকির (তাহলীল)",
    title_ar: "٢. تهليل الصباح والمساء العظيم",
    title_en: "2. Supreme Declaration of Tawheed (Tahleel)",
    badge_bn: "সকাল-সন্ধ্যায় ১০ বা ১০০ বার",
    badge_ar: "١٠ مرات أو ١٠٠ مرة",
    badge_en: "10x or 100x Daily",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    translit_bn: "উচ্চারণ: লা- ইলা-হা ইল্লাল্লা-হু ওয়াহদাহু লা- শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু ওয়া হুয়া 'আলা- কুল্লি শাইয়িন ক্বাদীর।",
    translit_en: "Transliteration: La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir.",
    meaning_bn: "অর্থ: একমাত্র আল্লাহ ছাড়া কোনো হক্ব ইলাহ নেই, তাঁর কোনো শরীক নেই, রাজত্ব তাঁরই, সমস্ত প্রশংসাও তাঁরই, আর তিনি সব কিছুর ওপর ক্ষমতাবান।",
    meaning_ar: "المعنى: إقرار بتفرد الله بالألوهية والملك والحمد والقدرة المطلقة على كل شيء.",
    meaning_en: "Meaning: None has the right to be worshipped but Allah alone, Who has no partner. His is the dominion and His is the praise, and He is Able to do all things.",
    virtue_bn: "✨ ফযীলত: সকাল-সন্ধ্যায় ১০ বার পাঠ করলে ৪টি দাসমুক্তির সওয়াব, ১০টি নেকী ও শয়তান থেকে সুরক্ষা মেলে। আর দিনে ১০০ বার পড়লে ১০টি দাসমুক্তির সওয়াব, ১০০ নেকী লেখা হয় ও ১০০ গুনাহ মাফ হয় (সহীহ বুখারী ৩২৯৩, মুসলিম ২৬৯১)।",
    virtue_ar: "✨ الفضيلة: من قالها في يوم مائة مرة كانت له عدل عشر رقاب وكتبت له مائة حسنة ومحيت عنه مائة سيئة وحرزاً من الشيطان (البخاري ٣٢٩٣ ومسلم ٢٦٩١).",
    virtue_en: "✨ Virtue: Reciting 100x daily equals freeing 10 slaves, writes 100 good deeds, erases 100 sins, and shields from Satan all day (Bukhari 3293, Muslim 2691)."
  },
  {
    id: "dua_03_sayyidul_istighfar",
    title_bn: "৩. সাইয়্যিদুল ইস্তিগফার (ক্ষমা প্রার্থনার শ্রেষ্ঠ দোয়া)",
    title_ar: "٣. سيد الاستغفار",
    title_en: "3. Sayyidul Istighfar (Chief Prayer for Forgiveness)",
    badge_bn: "সকাল-সন্ধ্যায় ১ বার",
    badge_ar: "مرة واحدة صباحاً ومساءً",
    badge_en: "Morning & Evening 1x",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    translit_bn: "উচ্চারণ: আল্লা-হুম্মা আনতা রাব্বী লা- ইলা-হা ইল্লা- আনতা, খালাক্বতানী ওয়া আনা 'আবদুকা, ওয়া আনা 'আলা- 'আহদিকা ওয়া ওয়া'দিকা মাস্তাত্বা'তু। আ'উযু বিকা মিন শাররি মা- সানা'তু, আবূউ লাকা বিনি'মাতিকা 'আলাইয়্যা, ওয়া আবূউ বিযাম্বী, ফাগফির লী ফাইন্নাহু লা- ইয়াগফিরুয যুনূবা ইল্লা- আনতা।",
    translit_en: "Transliteration: Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa Anta.",
    meaning_bn: "অর্থ: হে আল্লাহ! আপনি আমার রব, আপনি ছাড়া কোনো হক্ব ইলাহ নেই। আপনি আমাকে সৃষ্টি করেছেন এবং আমি আপনার বান্দা। আমি আমার সাধ্যমতো আপনার অঙ্গীকার ও প্রতিশ্রুতির ওপর রয়েছি। আমি আমার কৃতকর্মের অনিষ্ট থেকে আপনার আশ্রয় চাই। আমার ওপর আপনার প্রদত্ত নিয়ামত স্বীকার করছি এবং আমার গুনাহেরও স্বীকারোক্তি দিচ্ছি। অতএব আমাকে ক্ষমা করুন, কেননা আপনি ছাড়া কেউ গুনাহ ক্ষমা করতে পারে না।",
    meaning_ar: "المعنى: اعتراف العبد بربوبية الله ونعمته وإقراره بذنبه وطلب المغفرة منه وحده.",
    meaning_en: "Meaning: O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
    virtue_bn: "✨ ফযীলত: যে ব্যক্তি দৃঢ় বিশ্বাসের সাথে সকালে বা সন্ধ্যায় এটি পাঠ করবে এবং সেদিন বা রাতে মৃত্যুবরণ করবে, সে নিশ্চিত জান্নাতবাসী হবে (সহীহ বুখারী ৬৩০৬)।",
    virtue_ar: "✨ الفضيلة: من قالها موقناً بها حين يمسي وحين يصبح فمات من يومه أو ليلته دخل الجنة (صحيح البخاري ٦٣٠٦).",
    virtue_en: "✨ Virtue: Whoever says this with conviction in the morning or evening and dies that day or night will enter Paradise (Sahih al-Bukhari 6306)."
  },
  {
    id: "dua_04_bismillahi_la_yadurru",
    title_bn: "৪. সর্বপ্রকার আকস্মিক বিপদ ও ক্ষতি থেকে সুরক্ষার দোয়া",
    title_ar: "٤. دعاء الحفظ من الفجأة والضرر",
    title_en: "4. Protection from Sudden Harm & Calamity",
    badge_bn: "সকাল-সন্ধ্যায় ৩ বার",
    badge_ar: "٣ مرات صباحاً ومساءً",
    badge_en: "Morning & Evening 3x",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    translit_bn: "উচ্চারণ: বিসমিল্লা-হিল্লাযী লা- ইয়াদুররু মা'আসমিহী শাইউন ফিল আরদ্বি ওয়ালা- ফিস সামা-ই, ওয়া হুয়াস সামী'উল 'আলীম।",
    translit_en: "Transliteration: Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
    meaning_bn: "অর্থ: শুরু করছি আল্লাহর নামে, যাঁর নামের সাথে আসমান ও যমীনে কোনো কিছুই কোনো ক্ষতি করতে পারে না। আর তিনি সর্বশ্রোতা, মহাজ্ঞানী।",
    meaning_ar: "المعنى: الاستعاذة باسم الله الذي يمنع كل ضرر في الأرض وفي السماء.",
    meaning_en: "Meaning: In the Name of Allah, with Whose Name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.",
    virtue_bn: "✨ ফযীলত: যে ব্যক্তি সকাল ও সন্ধ্যায় ৩ বার করে পাঠ করবে, কোনো কিছুই তার ক্ষতি করতে পারবে না এবং সে আকস্মিক বিপদ থেকে নিরাপদ থাকবে (তিরমিযী ৩৩৮৮, আবু দাউদ ৫০৮৮)।",
    virtue_ar: "✨ الفضيلة: من قالها ثلاث مرات إذا أصبح وثلاثاً إذا أمسى لم يضره شيء (الترمذي ٣٣٨٨ وأبو داود ٥٠٨٨).",
    virtue_en: "✨ Virtue: Whoever recites it 3 times in the morning and evening will not be harmed by anything (Tirmidhi 3388, Abu Dawud 5088)."
  },
  {
    id: "dua_05_hasbiyallah",
    title_bn: "৫. দুনিয়া ও আখিরাতের সকল দুশ্চিন্তা মুক্তির দোয়া",
    title_ar: "٥. دعاء كفاية الهموم في الدنيا والآخرة",
    title_en: "5. Sufficiency Against All Worries of Dunya & Akhirah",
    badge_bn: "সকাল-সন্ধ্যায় ৭ বার",
    badge_ar: "٧ مرات صباحاً ومساءً",
    badge_en: "Morning & Evening 7x",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    translit_bn: "উচ্চারণ: হাসবিয়াল্লা-হু লা- ইলা-হা ইল্লা- হুয়া, 'আলাইহি তাওয়াক্কালতু ওয়া হুয়া রাব্বুল 'আরশিল 'আযীম।",
    translit_en: "Transliteration: Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Azim.",
    meaning_bn: "অর্থ: আল্লাহই আমার জন্য যথেষ্ট, তিনি ছাড়া আর কোনো হক্ব ইলাহ নেই। আমি তাঁর ওপরই ভরসা করেছি। আর তিনি মহান আরশের রব।",
    meaning_ar: "المعنى: تفويض الأمر كله لله وحده رب العرش العظيم.",
    meaning_en: "Meaning: Allah is sufficient for me; there is no deity except Him. On Him I rely, and He is the Lord of the Great Throne.",
    virtue_bn: "✨ ফযীলত: যে ব্যক্তি সকালে ৭ বার ও সন্ধ্যায় ৭ বার পাঠ করবে, তার দুনিয়া ও আখিরাতের সকল দুশ্চিন্তা ও উৎকণ্ঠার জন্য আল্লাহই যথেষ্ট হবেন (সূরা তাওবা ১২৯, আবু দাউদ ৫০৮১)।",
    virtue_ar: "✨ الفضيلة: من قالها حين يصبح وحين يمسي سبع مرات كفاه الله ما أهمه من أمر الدنيا والآخرة (أبو داود ٥٠٨١).",
    virtue_en: "✨ Virtue: Whoever says this 7 times in the morning and evening, Allah will suffice him against whatever worries him in this world and the Hereafter (Abu Dawud 5081)."
  },
  {
    id: "dua_06_afiyah_badan",
    title_bn: "৬. দেহ, শ্রবণ ও দৃষ্টিশক্তির সুস্থতা এবং কবরের আযাব থেকে আশ্রয়",
    title_ar: "٦. دعاء العافية في البدن والسمع والبصر",
    title_en: "6. Well-being in Body, Hearing & Sight",
    badge_bn: "সকাল-সন্ধ্যায় ৩ বার",
    badge_ar: "٣ مرات صباحاً ومساءً",
    badge_en: "Morning & Evening 3x",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَٰهَ إِلَّا أَنْتَ",
    translit_bn: "উচ্চারণ: আল্লা-হুম্মা 'আ-ফিনী ফী বাদানী, আল্লা-হুম্মা 'আ-ফিনী ফী সাম'ঈ, আল্লা-হুম্মা 'আ-ফিনী ফী বাসারী, লা- ইলা-হা ইল্লা- আনতা। আল্লা-হুম্মা ইন্নী আ'উযু বিকা মিনাল কুফরি ওয়াল ফাক্বরি, আল্লা-হুম্মা ইন্নী আ'উযু বিকা মিন 'আযা-বিল ক্বাবরি, লা- ইলা-হা ইল্লা- আনতা।",
    translit_en: "Transliteration: Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Anta. Allahumma inni a'udhu bika minal-kufri wal-faqri, Allahumma inni a'udhu bika min 'adhabil-qabri, la ilaha illa Anta.",
    meaning_bn: "অর্থ: হে আল্লাহ! আমার দেহে সুস্থতা দিন। হে আল্লাহ! আমার শ্রবণশক্তিতে সুস্থতা দিন। হে আল্লাহ! আমার দৃষ্টিশক্তিতে সুস্থতা দিন। আপনি ছাড়া কোনো হক্ব ইলাহ নেই। হে আল্লাহ! আমি আপনার কাছে কুফরি ও দারিদ্র্য থেকে আশ্রয় চাই এবং কবরের আযাব থেকে আশ্রয় চাই। আপনি ছাড়া কোনো হক্ব ইলাহ নেই।",
    meaning_ar: "المعنى: سؤال الله المعافاة في الجوارح والحفظ من الكفر والفقر وعذاب القبر.",
    meaning_en: "Meaning: O Allah, grant health to my body, grant health to my hearing, grant health to my sight. None has the right to be worshipped except You. O Allah, I seek refuge in You from disbelief, poverty, and the punishment of the grave. None has the right to be worshipped except You.",
    virtue_bn: "✨ ফযীলত: রাসূলুল্লাহ ﷺ প্রতিদিন সকাল ও সন্ধ্যায় ৩ বার করে নিয়মিত এই দোয়াটি পাঠ করতেন (সুনানে আবু দাউদ ৫০৯০)।",
    virtue_ar: "✨ الفضيلة: واظب النبي ﷺ على الدعاء بها ثلاث مرات صباحاً ومساءً (سنن أبي داود ٥٠٩٠).",
    virtue_en: "✨ Virtue: The Prophet ﷺ consistently recited this 3 times every morning and evening (Sunan Abi Dawud 5090)."
  },
  {
    id: "dua_07_afiyah_six_directions",
    title_bn: "৭. দ্বীন, দুনিয়া ও পরিবার এবং ছয় দিক থেকে সার্বিক নিরাপত্তার দোয়া",
    title_ar: "٧. دعاء العفو والعافية والحفظ من الجهات الست",
    title_en: "7. Comprehensive Protection from All Six Directions",
    badge_bn: "সকাল-সন্ধ্যায় ১ বার",
    badge_ar: "مرة واحدة صباحاً ومساءً",
    badge_en: "Morning & Evening 1x",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
    translit_bn: "উচ্চারণ: আল্লা-হুম্মা ইন্নী আসআলুকাল 'আফওয়া ওয়াল 'আ-ফিয়াতা ফিদ্দুনইয়া ওয়াল আ-খিরাহ। আল্লা-হুম্মা ইন্নী আসআলুকাল 'আফওয়া ওয়াল 'আ-ফিয়াতা ফী দীনী ওয়া দুনইয়া-ইয়া ওয়া আহলী ওয়া মা-লী। আল্লা-হুম্মাসতুর 'আওরা-তী ওয়া আ-মিন রাও'আ-তী। আল্লা-হুম্মাহফাযনী মিম্বাইনি ইয়াদাইয়্যা ওয়া মিন খালফী ওয়া 'আন ইয়ামীনী ওয়া 'আন শিমা-লী ওয়া মিন ফাওক্বী, ওয়া আ'উযু বি'আযামাতিকা আন উগতা-লা মিন তাহতী।",
    translit_en: "Transliteration: Allahumma inni as'alukal-'afwa wal-'afiyata fid-dunya wal-akhirah. Allahumma inni as'alukal-'afwa wal-'afiyata fi dini wa dunyaya wa ahli wa mali. Allahummastur 'awrati wa amin raw'ati. Allahummahfazni min bayni yadayya wa min khalfi wa 'an yamini wa 'an shimali wa min fawqi, wa a'udhu bi'azamatika an ughtala min tahti.",
    meaning_bn: "অর্থ: হে আল্লাহ! আমি আপনার নিকট দুনিয়া ও আখিরাতে ক্ষমা ও নিরাপত্তা প্রার্থনা করছি। হে আল্লাহ! আমি আপনার নিকট আমার দ্বীন, দুনিয়া, পরিবার ও সম্পদে ক্ষমা ও নিরাপত্তা চাচ্ছি। হে আল্লাহ! আমার গোপন ত্রুটিসমূহ ঢেকে রাখুন এবং আমার ভীতিকে নিরাপত্তায় পরিণত করুন। হে আল্লাহ! আমাকে আমার সামনে, পেছনে, ডানে, বামে ও ওপর দিক থেকে হেফাজত করুন। আর আপনার মহত্ত্বের উসীলায় আমার নিচ দিক থেকে হঠাৎ আক্রান্ত হওয়া (ভূমিধস) থেকে আশ্রয় চাই।",
    meaning_ar: "المعنى: أجمع دعاء لطلب العفو والعافية والستر والحفظ الشامل في الدين والدنيا والأهل والمال.",
    meaning_en: "Meaning: O Allah, I ask You for forgiveness and well-being in this world and the Hereafter, and in my religion, worldly affairs, family, and wealth. Conceal my faults, calm my fears, and guard me from in front of me, behind me, my right, my left, and above me, and I seek refuge in Your greatness from being unexpectedly destroyed from beneath me.",
    virtue_bn: "✨ ফযীলত: রাসূলুল্লাহ ﷺ সকাল ও সন্ধ্যায় কখনোই এই ব্যাপক নিরাপত্তার দোয়াটি পাঠ করা ছাড়তেন না (আবু দাউদ ৫০৭৪, ইবনে মাজাহ ৩৮৭১)।",
    virtue_ar: "✨ الفضيلة: لم يكن رسول الله ﷺ يدع هؤلاء الدعوات حين يمسي وحين يصبح (أبو داود ٥٠٧٤ وابن ماجه ٣٨٧١).",
    virtue_en: "✨ Virtue: The Prophet ﷺ never left reciting these comprehensive words every morning and evening (Abu Dawud 5074, Ibn Majah 3871)."
  },
  {
    id: "dua_08_raditu_billahi",
    title_bn: "৮. কিয়ামতের দিন আল্লাহর সন্তুষ্টি লাভের দোয়া",
    title_ar: "٨. دعاء الرضا بالله رباً وبالإسلام ديناً وبمحمد ﷺ نبياً",
    title_en: "8. Declaration of Contentment with Allah, Islam & the Prophet ﷺ",
    badge_bn: "সকাল-সন্ধ্যায় ৩ বার",
    badge_ar: "٣ مرات صباحاً ومساءً",
    badge_en: "Morning & Evening 3x",
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    translit_bn: "উচ্চারণ: রাদ্বীতু বিল্লা-হি রাব্বান, ওয়া বিল ইসলা-মি দীনান, ওয়া বিমুহাম্মাদিন সাল্লাল্লা-হু 'আলাইহি ওয়াসাল্লামা নাবিয়্যান।",
    translit_en: "Transliteration: Raditu billahi Rabban, wa bil-Islami dinan, wa bi-Muhammadin sallallahu 'alayhi wa sallama Nabiyyan.",
    meaning_bn: "অর্থ: আল্লাহকে রব, ইসলামকে দ্বীন এবং মুহাম্মাদ সাল্লাল্লাহু আলাইহি ওয়াসাল্লামকে নবীরূপে গ্রহণ করে আমি সন্তুষ্ট।",
    meaning_ar: "المعنى: تجديد العهد والرضا التام بربوبية الله وبدين الإسلام وبرسالة النبي محمد ﷺ.",
    meaning_en: "Meaning: I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.",
    virtue_bn: "✨ ফযীলত: যে ব্যক্তি সকাল ও সন্ধ্যায় ৩ বার করে এই দোয়া বলবে, কিয়ামতের দিন তাকে সন্তুষ্ট করা আল্লাহর ওপর আবশ্যক হয়ে যায় (তিরমিযী ৩৩৮৯, মুসনাদে আহমাদ ১৮৯৬৭)।",
    virtue_ar: "✨ الفضيلة: من قالها ثلاثاً حين يصبح وثلاثاً حين يمسي كان حقاً على الله أن يرضيه يوم القيامة (الترمذي ٣٣٨٩).",
    virtue_en: "✨ Virtue: Whoever recites this 3 times morning and evening, Allah has promised to please him on the Day of Resurrection (Tirmidhi 3389)."
  },
  {
    id: "dua_09_ya_hayyu_ya_qayyum",
    title_bn: "৯. সার্বিক অবস্থা সংশোধন ও আল্লাহর রহমত প্রার্থনার দোয়া",
    title_ar: "٩. الاستغاثة برحمة الحي القيوم وإصلاح الشأن كله",
    title_en: "9. Seeking Aid Through Allah's Mercy for All Affairs",
    badge_bn: "সকাল-সন্ধ্যায় ১ বার",
    badge_ar: "مرة واحدة صباحاً ومساءً",
    badge_en: "Morning & Evening 1x",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ",
    translit_bn: "উচ্চারণ: ইয়া- হাইয়্যু ইয়া- ক্বাইয়্যূমু বিরাহমাতিকা আসতাগীস, আসলিহ লী শা'নী কুল্লাহু, ওয়ালা- তাকিলনী ইলা- নাফসী ত্বারফাতা 'আইন।",
    translit_en: "Transliteration: Ya Hayyu ya Qayyumu birahmatika astaghith, aslih li sha'ni kullahu, wa la takilni ila nafsi tarfata 'ayn.",
    meaning_bn: "অর্থ: হে চিরঞ্জীব, হে চিরস্থায়ী! আমি আপনার রহমতের উসীলায় সাহায্য ও উদ্ধার কামনা করি; আপনি আমার সার্বিক অবস্থা সংশোধন করে দিন এবং আমাকে এক পলকের জন্যও আমার নিজের কাছে সোপর্দ করবেন না।",
    meaning_ar: "المعنى: التوسل باسمي الله الحي القيوم لإصلاح جميع شؤون الحياة وعدم التخلي عن العبد لحظة.",
    meaning_en: "Meaning: O Ever-Living, O Sustainer of all, by Your mercy I seek help; rectify all my affairs and do not leave me to myself even for the blink of an eye.",
    virtue_bn: "✨ ফযীলত: রাসূলুল্লাহ ﷺ তাঁর প্রিয় কন্যা ফাতিমা (রা.)-কে সকাল ও সন্ধ্যায় এই দোয়াটি পড়ার বিশেষ ওসিয়ত করেছিলেন (মুস্তাদরাকে হাকেম ২০০০, সহীহ তারগীব ৬৬১)।",
    virtue_ar: "✨ الفضيلة: أوصى بها النبي ﷺ ابنته فاطمة رضي الله عنها أن تقولها إذا أصبحت وإذا أمست (المستدرك ٢٠٠٠).",
    virtue_en: "✨ Virtue: The Prophet ﷺ specifically advised his daughter Fatimah (RA) to recite this every morning and evening (Al-Hakim 2000)."
  },
  {
    id: "dua_10_subhanallahi_adada",
    title_bn: "১০. সৃষ্টির সংখ্যা ও আরশের ওজনের সমপরিমাণ তাসবীহ",
    title_ar: "١٠. التسبيح المضاعف (عدد خلقه ورضا نفسه)",
    title_en: "10. Multiplied Glorification Equal to His Creation & Throne",
    badge_bn: "সকালে ৩ বার",
    badge_ar: "٣ مرات صباحاً",
    badge_en: "Morning 3x",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
    translit_bn: "উচ্চারণ: সুবহা-নাল্লা-হি ওয়া বিহামদিহী: 'আদাদা খালক্বিহী, ওয়া রিদ্বা- নাফসিহী, ওয়া যিনাতা 'আরশিহী, ওয়া মিদা-দা কালিমা-তিহী।",
    translit_en: "Transliteration: Subhanallahi wa bihamdihi: 'adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatihi.",
    meaning_bn: "অর্থ: আমি আল্লাহর প্রশংসাসহ পবিত্রতা ও মহিমা ঘোষণা করছি—তাঁর সৃষ্ট বস্তুসমূহের সংখ্যার সমান, তাঁর নিজের সন্তোষের সমান, তাঁর আরশের ওজনের সমান এবং তাঁর বাণীসমূহ লেখার কালির পরিমাণের সমান।",
    meaning_ar: "المعنى: تسبيح عظيم مضاعف الأجر يفوق ساعات طويلة من الذكر.",
    meaning_en: "Meaning: Glory and praise be to Allah, as many times as the number of His creation, as much as pleases Him, as heavy as the weight of His Throne, and as much as the ink of His words.",
    virtue_bn: "✨ ফযীলত: ফজরের পর থেকে চাশতের সময় পর্যন্ত দীর্ঘক্ষণ বসে যিকির করার চেয়েও এই ৪টি বাক্য ৩ বার বলা সওয়াবের দিক থেকে অধিক ভারী ও উত্তম (সহীহ মুসলিম ২৭২৬)।",
    virtue_ar: "✨ الفضيلة: قال النبي ﷺ لجويرية رضي الله عنها أن هذه الأربع كلمات ثلاث مرات تعدل وتفوق الذكر من الفجر إلى الضحى (صحيح مسلم ٢٧٢٦).",
    virtue_en: "✨ Virtue: Reciting these 4 phrases 3 times outweighs sitting in remembrance from Fajr until mid-morning (Sahih Muslim 2726)."
  },
  {
    id: "dua_11_ilman_nafia",
    title_bn: "১১. উপকারী জ্ঞান, পবিত্র রিজিক ও কবুলযোগ্য আমলের দোয়া",
    title_ar: "١١. دعاء العلم النافع والرزق الطيب والعمل المتقبل",
    title_en: "11. Prayer for Beneficial Knowledge, Pure Provision & Accepted Deeds",
    badge_bn: "ফজরের পর / সকালে ১ বার",
    badge_ar: "مرة واحدة بعد الفجر / صباحاً",
    badge_en: "After Fajr / Morning 1x",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    translit_bn: "উচ্চারণ: আল্লা-হুম্মা ইন্নী আসআলুকা 'ইলমান না-ফি'আন, ওয়া রিযক্বান ত্বাইয়্যিবান, ওয়া 'আমালান মুতাক্বাব্বালান।",
    translit_en: "Transliteration: Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
    meaning_bn: "অর্থ: হে আল্লাহ! আমি আপনার নিকট উপকারী জ্ঞান, পবিত্র-হালাল রিজিক এবং কবুলযোগ্য নেক আমল প্রার্থনা করি।",
    meaning_ar: "المعنى: افتتاح اليوم بطلب المقاصد الثلاثة الكبرى: العلم النافع، الرزق الحلال، وقبول العمل.",
    meaning_en: "Meaning: O Allah, I ask You for beneficial knowledge, pure lawful provision, and accepted deeds.",
    virtue_bn: "✨ ফযীলত: রাসূলুল্লাহ ﷺ প্রতিদিন ফজরের সালাতের সালাম ফিরানোর পর এই দোয়াটি পাঠ করতেন (সুনানে ইবনে মাজাহ ৯২৫, মুসনাদে আহমাদ ২৬৬০২)।",
    virtue_ar: "✨ الفضيلة: كان النبي ﷺ يقولها كل صباح إذا سلم من صلاة الفجر (سنن ابن ماجه ٩٢٥).",
    virtue_en: "✨ Virtue: The Prophet ﷺ recited this every morning after concluding the Fajr prayer (Sunan Ibn Majah 925)."
  },
  {
    id: "dua_12_bika_asbahna_sleep",
    title_bn: "১২. সকাল-সন্ধ্যায় জীবন-মৃত্যু ও পুনরুত্থানের স্মরণ",
    title_ar: "١٢. دعاء الدخول في الصباح والمساء",
    title_en: "12. Entering the Morning & Evening by Allah's Grace",
    badge_bn: "সকাল-সন্ধ্যায় ১ বার",
    badge_ar: "مرة واحدة صباحاً ومساءً",
    badge_en: "Morning & Evening 1x",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    translit_bn: "উচ্চারণ: আল্লা-হুম্মা বিকা আসবাহনা- ওয়া বিকা আমসাইনা-, ওয়া বিকা নাহইয়া- ওয়া বিকা নামূতু ওয়া ইলাইকান নুশূর। (সন্ধ্যায়: আল্লা-হুম্মা বিকা আমসাইনা- ওয়া বিকা আসবাহনা-... ওয়া ইলাইকাল মাসীর)।",
    translit_en: "Transliteration: Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur. (In evening: ...wa ilaykal-masir).",
    meaning_bn: "অর্থ: হে আল্লাহ! আপনার অনুগ্রহেই আমরা সকালে উপনীত হয়েছি এবং আপনার অনুগ্রহেই সন্ধ্যায় উপনীত হয়েছি। আপনার দ্বারাই আমরা জীবিত থাকি, আপনার দ্বারাই আমরা মৃত্যুবরণ করব এবং আপনার কাছেই আমাদের পুনরুত্থান (সন্ধ্যায়: প্রত্যাবর্তন)।",
    meaning_ar: "المعنى: تفويض الحياة والموت والبعث لله سبحانه في كل صباح ومساء.",
    meaning_en: "Meaning: O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die, and unto You is our resurrection (and return).",
    virtue_bn: "✨ ফযীলত: নবীজি ﷺ সাহাবীগণকে সকাল ও সন্ধ্যায় এই দোয়াটি পাঠ করার শিক্ষা দিয়েছেন (জামে তিরমিযী ৩৩৯১, ইবনে মাজাহ ৩৮৬৮)।",
    virtue_ar: "✨ الفضيلة: علمها النبي ﷺ أصحابه ليقولوها عند الصباح والمساء (جامع الترمذي ٣٣٩١).",
    virtue_en: "✨ Virtue: Taught by the Prophet ﷺ to be recited at the start of every morning and evening (Jami` at-Tirmidhi 3391)."
  },
  {
    id: "dua_13_surah_hashr_last3",
    title_bn: "১৩. সূরা হাশরের শেষ তিন আয়াত (২২-২৪)",
    title_ar: "١٣. أواخر سورة الحشر (الآيات ٢٢-٢٤)",
    title_en: "13. Last Three Verses of Surah Al-Hashr (22–24)",
    badge_bn: "সকাল-সন্ধ্যায় ১ বার",
    badge_ar: "مرة واحدة صباحاً ومساءً",
    badge_en: "Morning & Evening 1x",
    arabic: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ ۝ هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ ۝ هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ ۚ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ ۝ هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ",
    translit_bn: "উচ্চারণ: (প্রথমে ৩ বার: আ'উযু বিল্লা-হিস সামী'ইল 'আলীমি মিনাশ শাইত্বা-নির রাজীম)। হুওয়াল্লা-হুল্লাযী লা- ইলা-হা ইল্লা- হুয়া, 'আ-লিমুল গাইবি ওয়াশ শাহা-দাহ, হুওয়ার রাহমা-নুর রাহীম। হুওয়াল্লা-হুল্লাযী লা- ইলা-হা ইল্লা- হুওয়াল মালিকুল ক্বুদ্দূসুস সালা-মুল মু'মিনুল মুহাইমিনুল 'আযীযুল জাব্বা-রুল মুতাকাব্বির; সুবহা-নাল্লা-হি 'আম্মা- ইউশরিকূন। হুওয়াল্লা-হুল খা-লিক্বুল বা-রিউল মুসাওয়িরু লাহুল আসমা-উল হুসনা-; ইউসাব্বিহু লাহু মা- ফিস সামা-ওয়া-তি ওয়াল আরদ্বি, ওয়া হুওয়াল 'আযীযুল হাকীম।",
    translit_en: "Transliteration: (First 3x: A'udhu billahis-Sami'il-'Alimi minash-shaytanir-rajim). Huwallahul-ladhi la ilaha illa Huwa 'Alimul-ghaybi wash-shahadah, Huwar-Rahmanur-Rahim. Huwallahul-ladhi la ilaha illa Huwal-Malikul-Quddusus-Salamul-Mu'minul-Muhayminul-'Azizul-Jabbarul-Mutakabbir, Subhanallahi 'amma yushrikun. Huwallahul-Khaliqul-Bari'ul-Musawwiru lahul-Asma'ul-Husna, yusabbihu lahu ma fis-samawati wal-ardi wa Huwal-'Azizul-Hakim.",
    meaning_bn: "অর্থ: তিনিই আল্লাহ, যিনি ছাড়া কোনো হক্ব ইলাহ নেই; তিনি দৃশ্য ও অদৃশ্যের পরিজ্ঞাতা; তিনি পরম করুণাময়, অসীম দয়ালু। তিনিই আল্লাহ, যিনি ছাড়া কোনো হক্ব ইলাহ নেই; তিনি অধিপতি, মহাপবিত্র, শান্তিদাতা, নিরাপত্তাবিধায়ক, রক্ষক, পরাক্রমশালী, প্রবল, অতীব মহিমান্বিত। তারা যা শরীক করে তা হতে আল্লাহ পবিত্র। তিনিই আল্লাহ, সৃষ্টিকর্তা, উদ্ভাবক, রূপদাতা; তাঁরই রয়েছে সুন্দরতম নামসমূহ। আসমান ও যমীনে যা কিছু আছে সবই তাঁর পবিত্রতা ও মহিমা ঘোষণা করে; আর তিনি পরাক্রমশালী, প্রজ্ঞাময়।",
    meaning_ar: "المعنى: تمجيد الله بأسمائه الحسنى وصفاته العلى وتنزيهه عن الشرك وتفويض الأمر لعزته وحكمته.",
    meaning_en: "Meaning: He is Allah, other than Whom there is no deity, Knower of the unseen and the witnessed; He is the Entirely Merciful, the Especially Merciful. He is Allah, other than Whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith, the Overseer, the Exalted in Might, the Compeller, the Superior. Exalted is Allah above whatever they associate with Him. He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names. Whatever is in the heavens and earth is exalting Him. And He is the Exalted in Might, the Wise.",
    virtue_bn: "✨ ফযীলত: সকালে বা সন্ধ্যায় ৩ বার 'আউযু বিল্লাহিস সামীইল আলিম মিনাশ শাইতানির রাজীম' পড়ে সূরা হাশরের শেষ তিন আয়াত তিলাওয়াত করলে আল্লাহ তার জন্য ৭০ হাজার ফেরেশতা নিযুক্ত করেন, যারা সন্ধ্যা/সকাল পর্যন্ত তার জন্য মাগফিরাতের দোয়া করতে থাকে; আর সেদিন মারা গেলে সে শহীদের মর্যাদা লাভ করে (জামে তিরমিযী ২৯২২, মুসনাদে আহমাদ ২০৩০৬)।",
    virtue_ar: "✨ الفضيلة: من قالها حين يصبح ثلاث مرات وقرأ ثلاث آيات من آخر سورة الحشر وكّل الله به سبعين ألف ملك يصلون عليه حتى يمسي، وإن مات في ذلك اليوم مات شهيداً، ومن قالها حين يمسي كان بتلك المنزلة (جامع الترمذي ٢٩٢٢).",
    virtue_en: "✨ Virtue: Whoever says 'A'udhu billahis-Sami'il-'Alim minash-shaytanir-rajim' 3 times in the morning/evening and recites the last 3 verses of Surah Al-Hashr, Allah appoints 70,000 angels to pray for his forgiveness until evening/morning, and if he dies that day/night, he dies as a martyr (Jami` at-Tirmidhi 2922)."
  },
  {
    id: "dua_14_ayatul_kursi",
    title_bn: "১৪. আয়াতুল কুরসী (সূরা আল-বাকারা: ২৫৫)",
    title_ar: "١٤. آية الكرسي (سورة البقرة: ٢٥٥)",
    title_en: "14. Ayat al-Kursi — The Verse of the Throne (Al-Baqarah: 255)",
    badge_bn: "সকাল-সন্ধ্যা, ঘুমের পূর্বে ও ফরজ সালাতের পর",
    badge_ar: "صباحاً ومساءً وعند النوم ودبر كل صلاة",
    badge_en: "Morning, Evening, Bedtime & After Salah",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translit_bn: "উচ্চারণ: আল্লা-হু লা- ইলা-হা ইল্লা- হুওয়াল হাইয়্যুল ক্বাইয়্যূম। লা- তা'খুযুহু সিনাতুওঁ ওয়ালা- নাওম। লাহু মা- ফিস সামা-ওয়া-তি ওয়ামা- ফিল আরদ্ব। মান যাল্লাযী ইয়াশফা'উ 'ইনদাহু ইল্লা- বিইযনিহ। ইয়া'লামু মা- বাইনা আইদীহিম ওয়ামা- খালফাহুম, ওয়ালা- ইউহীত্বূনা বিশাইয়িম মিন 'ইলমিহী ইল্লা- বিমা- শা-আ। ওয়াসি'আ কুরসিইয়্যুহুস সামা-ওয়া-তি ওয়াল আরদ্ব, ওয়ালা- ইয়াঊদুহু হিফযুহুমা- ওয়া হুওয়াল 'আলিইয়্যুল 'আযীম।",
    translit_en: "Transliteration: Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bishay'im-min 'ilmihi illa bima sha'a. Wasi'a Kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifzuhuma, wa Huwal-'Aliyyul-'Azim.",
    meaning_bn: "অর্থ: আল্লাহ, তিনি ছাড়া কোনো হক্ব ইলাহ নেই; তিনি চিরঞ্জীব, সর্বধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আসমানসমূহ ও যমীনে যা কিছু রয়েছে সবই তাঁর। কে আছে এমন যে তাঁর অনুমতি ছাড়া তাঁর কাছে সুপারিশ করবে? তাদের সামনে ও পেছনে যা কিছু আছে তা তিনি জানেন। আর যা তিনি ইচ্ছা করেন তা ছাড়া তাঁর জ্ঞানের কোনো কিছুই তারা পরিবেষ্টন করতে পারে না। তাঁর কুরসী আসমানসমূহ ও যমীনকে পরিব্যাপ্ত করে আছে এবং এ দুটির সংরক্ষণ তাঁকে ক্লান্ত করে না। আর তিনি সুউচ্চ, সুমহান।",
    meaning_ar: "المعنى: أعظم آية في كتاب الله، تتضمن توحيد الله، وكمال حياته وقيوميته، وسعة علمه وملكه وقدرته وحفظه للكون.",
    meaning_en: "Meaning: Allah — there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    virtue_bn: "✨ ফযীলত: কুরআনের সর্বশ্রেষ্ঠ আয়াত (সহীহ মুসলিম ৮১০)। প্রাতে ও সন্ধ্যায় পাঠ করলে সারাদিন ও সারারাত শয়তান ও জিনদের অনিষ্ট থেকে নিরাপদ থাকা যায় (নাসাঈ সুনানুল কুবরা ১০৭৯৭)। রাতে ঘুমানোর সময় পড়লে সকাল পর্যন্ত আল্লাহর পক্ষ থেকে একজন ফেরেশতা পাহারায় নিযুক্ত থাকেন (সহীহ বুখারী ২৩১১); আর প্রত্যেক ফরজ সালাতের পর পাঠ করলে জান্নাতে প্রবেশের পথে মৃত্যু ছাড়া আর কোনো বাধা থাকে না (নাসাঈ সুনানুল কুবরা ৯৮৪৮)।",
    virtue_ar: "✨ الفضيلة: أعظم آية في كتاب الله (مسلم ٨١٠). من قرأها عند النوم لم يزل عليه من الله حافظ ولا يقربه شيطان حتى يصبح (البخاري ٢٣١١)، ومن قرأها دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت (النسائي في الكبرى ٩٨٤٨).",
    virtue_en: "✨ Virtue: The greatest verse in the Quran (Sahih Muslim 810). Reciting it morning and evening protects from Jinn and devils; reciting it at bedtime appoints a guardian angel from Allah until morning (Sahih al-Bukhari 2311); and reciting it after every Fard prayer leaves nothing standing between the believer and Paradise except death (An-Nasa'i 9848)."
  },
  {
    id: "dua_15_baqarah_last2",
    title_bn: "১৫. সূরা আল-বাকারার শেষ দুই আয়াত (২৮৫-২৮৬)",
    title_ar: "١٥. الآيتان من آخر سورة البقرة (٢٨٥-٢٨٦)",
    title_en: "15. Last Two Verses of Surah Al-Baqarah (285–286)",
    badge_bn: "সন্ধ্যায় / রাতে ১ বার",
    badge_ar: "مرة واحدة في الليل / المساء",
    badge_en: "Evening / Night 1x",
    arabic: "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    translit_bn: "উচ্চারণ: আ-মানার রাসূলু বিমা- উনযিলা ইলাইহি মির রাব্বিহী ওয়াল মু'মিনূন। কুল্লুন আ-মানা বিল্লা-হি ওয়া মালা-ইকাতিহী ওয়া কুতুবিহী ওয়া রুসুলিহী, লা- নুফাররিক্বু বাইনা আহাদিম মির রুসুলিহ। ওয়া ক্বা-লূ সামি'না- ওয়া আত্বা'না- গুফরা-নাকা রাব্বানা- ওয়া ইলাইকাল মাসীর। লা- ইউকাল্লিফুল্লা-হু নাফসান ইল্লা- উস'আহা-, লাহা- মা- কাসাবাত ওয়া 'আলাইহা- মাকতাসাবাত। রাব্বানা- লা- তুআ-খিযনা- ইন নাসীনা- আও আখত্বা'না-; রাব্বানা- ওয়ালা- তাহমিল 'আলাইনা- ইসরান কামা- হামালতাহু 'আলাল্লাযীনা মিন ক্বাবলিনা-; রাব্বানা- ওয়ালা- তুহাম্মিলনা- মা- লা- ত্বা-ক্বাতা লানা- বিহী; ওয়া'ফু 'আন্না- ওয়াগফির লানা- ওয়ারহামনা-; আনতা মাওলা-না- ফানসুরনা- 'আলাল ক্বাওমিল কা-ফিরীন।",
    translit_en: "Transliteration: Amanar-Rasulu bima unzila ilayhi mir-Rabbihi wal-mu'minun. Kullun amana billahi wa mala'ikatihi wa kutubihi wa rusulihi la nufarriqu bayna ahadim-mir-rusulih. Wa qalu sami'na wa ata'na ghufranaka Rabbana wa ilaykal-masir. La yukallifullahu nafsan illa wus'aha, laha ma kasabat wa 'alayha maktasabat. Rabbana la tu'akhidhna in nasina aw akhta'na, Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alal-ladhina min qablina, Rabbana wa la tuhammilna ma la taqata lana bih, wa'fu 'anna waghfir lana warhamna, Anta Mawlana fansurna 'alal-qawmil-kafirin.",
    meaning_bn: "অর্থ: রাসূল তাঁর রবের পক্ষ থেকে যা তাঁর কাছে নাযিল করা হয়েছে তার ওপর ঈমান এনেছেন এবং মুমিনগণও। প্রত্যেকেই ঈমান এনেছে আল্লাহর ওপর, তাঁর ফেরেশতাকুল, তাঁর কিতাবসমূহ এবং তাঁর রাসূলগণের ওপর; (তারা বলে) আমরা তাঁর রাসূলগণের কারও মধ্যে তারতম্য করি না। আর তারা বলে, আমরা শুনলাম এবং আনুগত্য করলাম। হে আমাদের রব! আমরা আপনার ক্ষমা প্রার্থনা করি এবং আপনার দিকেই প্রত্যাবর্তনস্থল। আল্লাহ কোনো ব্যক্তিকে তার সামর্থ্যের বাইরে দায়িত্ব দেন না। সে যা অর্জন করে তা তারই জন্য এবং সে যা কামাই করে তা তারই ওপর বর্তাবে। হে আমাদের রব! আমরা যদি ভুলে যাই অথবা ভুল করি তবে আমাদেরকে অপরাধী করবেন না। হে আমাদের রব! আমাদের ওপর এমন বোঝা চাপিয়ে দেবেন না, যেমন আমাদের পূর্ববর্তীদের ওপর চাপিয়ে দিয়েছিলেন। হে আমাদের রব! আমাদের ওপর এমন কিছু চাপিয়ে দেবেন না যা বহন করার শক্তি আমাদের নেই। আর আমাদের পাপ মোচন করুন, আমাদের ক্ষমা করুন এবং আমাদের প্রতি দয়া করুন। আপনিই আমাদের অভিভাবক, অতএব কাফির সম্প্রদায়ের বিরুদ্ধে আমাদেরকে সাহায্য করুন।",
    meaning_ar: "المعنى: إقرار المؤمنين بأركان الإيمان والسمع والطاعة، ودعاء جامع برفع الحرج والمغفرة والرحمة والنصرة.",
    meaning_en: "Meaning: The Messenger has believed in what was revealed to him from his Lord, and so have the believers. All of them have believed in Allah and His angels and His books and His messengers, saying, 'We make no distinction between any of His messengers.' And they say, 'We hear and we obey. We seek Your forgiveness, our Lord, and to You is the final destination.' Allah does not charge a soul except with that within its capacity... 'Our Lord, do not impose blame upon us if we have forgotten or erred... Pardon us, forgive us, and have mercy upon us. You are our Protector, so give us victory over the disbelieving people.'",
    virtue_bn: "✨ ফযীলত: যে ব্যক্তি রাতে সূরা আল-বাকারার শেষ দুটি আয়াত তিলাওয়াত করবে, তা তার জন্য (রাতের বিপদ-আপদ, শয়তানের অনিষ্ট ও ইবাদতের ঘাটতি পূরণে) যথেষ্ট হয়ে যাবে (সহীহ বুখারী ৫০০৯, সহীহ মুসলিম ৮০৭)। আরশের নিচের বিশেষভাণ্ডার থেকে এই দুই আয়াত দান করা হয়েছে এবং আল্লাহ প্রতিটি প্রার্থনার জবাবে বলেন: 'আমি তা কবুল করলাম' (সহীহ মুসলিম ১২৬)।",
    virtue_ar: "✨ الفضيلة: «من قرأ بالآيتين من آخر سورة البقرة في ليلة كفتاه» (صحيح البخاري ٥٠٠٩ ومسلم ٨٠٧)، وقد أُعطيهما النبي ﷺ من كنز تحت العرش واستجاب الله كل دعاء فيهما (مسلم ١٢٦).",
    virtue_en: "✨ Virtue: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him' against all harm and evil (Sahih al-Bukhari 5009, Sahih Muslim 807). Granted from a treasure beneath the Throne, Allah responded to every supplication within them saying, 'I have done so' (Sahih Muslim 126)."
  }
]);

// Application State (Default Language set to Bangla: 'bn')
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

let activePhase = "all";
let selectedMood = "Khushu";
let tasbihCount = 0;
let tasbihTarget = 33;
let verifiedI18nDigest = "";
let historyRangeDays = 30;
let selectedArchiveMonthKey = getTodayKey().slice(0, 7);
let lastObservedDateKey = getTodayKey();

function t(key, replacements = {}) {
  const lang = I18N_DICTIONARIES[appState.locale] ? appState.locale : "bn";
  let str = I18N_DICTIONARIES[lang][key] || I18N_DICTIONARIES.bn[key] || key;
  Object.keys(replacements).forEach((k) => {
    str = str.replace(`{${k}}`, replacements[k]);
  });
  return str;
}

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
          ? "জুমু'আ (মধ্যাহ্ন হতে আসরের পূর্ব পর্যন্ত)"
          : lang === "ar"
          ? "الجمعة (من الزوال حتى العصر)"
          : "Jumu'ah (After Zawal until Asr)",
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
        ? "যোহর (মধ্যাহ্ন হতে আসরের পূর্ব পর্যন্ত)"
        : lang === "ar"
        ? "الظهر (من الزوال حتى العصر)"
        : "Dhuhr (After Zawal until Asr)",
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

function getCanonicalStatePayload(stateObj) {
  return JSON.stringify({
    appName: "Sunnah 24",
    version: stateObj.version,
    locale: stateObj.locale || "bn",
    i18nHash: stateObj.i18nHash || verifiedI18nDigest,
    customHabits: stateObj.customHabits || [],
    completionsByDate: canonicalizeObject(stateObj.completionsByDate || {}),
    duaCompletionsByDate: canonicalizeObject(stateObj.duaCompletionsByDate || {}),
    diaryEntries: stateObj.diaryEntries || [],
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
      badge.textContent = window.AndroidDownloader
        ? `🛡️ S24 • ${getInstalledAppVersionTag()}`
        : t("badge_verified");
      badge.className = "badge-verified";
    } else {
      badge.textContent = t("badge_tampered");
      badge.className = "badge-verified badge-tampered";
    }
  }
}


// ============================================================================
// WORLD-STANDARD STRICT TIME-WINDOW LOCK, REGIONAL SEASONAL ISLAMIC PRAYER
// ASTRONOMICAL ENGINE (BANGLADESH • MIDDLE EAST • WESTERN) & SVG RINGS
// ============================================================================
const HERO_RING_CIRCUMFERENCE = 245.04;   // 2 * PI * 39 (Sleek 92x92 Hero Ring)
const TASBIH_RING_CIRCUMFERENCE = 703.72; // 2 * PI * 112
const DUA_RING_CIRCUMFERENCE = 150.8;     // 2 * PI * 24

// ============================================================================
// X (TWITTER)-STYLE SILENT BACKGROUND MULTI-TIER GEOGRAPHIC LOCATION DETECTOR,
// REGION-MATCHED DEFAULTS & UNIVERSAL MADHAB TOGGLE ENGINE (NON-CONTRADICTORY)
// ============================================================================
// - Automatically & silently detects user's geographic location and timezone in the background
//   using a 4-Tier X-style telemetry pipeline:
//   Tier 1: Silent Zero-Permission IANA Timezone + UTC Meridian Telemetry (instant, 0 popups)
//   Tier 2: Silent Permissions API Check (`navigator.permissions.query({name:'geolocation'})`)
//           — only invokes GPS if already granted or cached, avoiding intrusive prompts
//   Tier 3: Silent Background Timezone-Shift & Visibility Watcher (auto-updates if user travels)
//   Tier 4: Region-Matched Asr Defaults + Universal Madhab Toggle:
//           • Automatically sets `asrShadowFactor: 2` (Hanafi Mithl-e-Thani) for South Asia,
//             Central Asia, and Turkey (Bangladesh, Pakistan, India, Afghanistan, Turkey, etc.).
//           • Automatically sets `asrShadowFactor: 1` (Standard / Shafi'i, Maliki, Hanbali Mithl-e-Awwal)
//             for the Middle East, Africa, Southeast Asia, Europe, Americas, and Oceania.
//           • Users anywhere in the world can tap the top-bar Madhab Toggle button to switch
//             between Hanafi (2x shadow) and Standard / Shafi'i (1x shadow) with zero contradiction.
const GEO_LOCATION_CACHE_KEY = "SUNNAH_24_X_GEO_COORDS_V1";
const MADHAB_STORAGE_KEY = "SUNNAH_24_ASR_MADHAB_PREF_V1";

const REGIONAL_PRAYER_PROFILES = deepFreeze({
  bn: {
    regionCode: "BD",
    subRegion: "SOUTH_ASIA",
    regionName_bn: "বাংলাদেশ ও দক্ষিণ এশিয়া (ইসলামিক ফাউন্ডেশন ঋতুভিত্তিক সময়সূচী)",
    regionName_ar: "بنغلاديش وجنوب آسيا (التوقيت الموسمي - المؤسسة الإسلامية)",
    regionName_en: "Bangladesh & South Asia (Islamic Foundation Seasonal Waqt)",
    lat: 23.8103,
    lon: 90.4125,
    tzHours: 6.0,
    fajrAngle: 18.0,
    ishaAngle: 18.0,
    ishaFixedMins: 0,
    asrShadowFactor: 2 // Region-Matched Default: Hanafi (Mithl-e-Thani, 2x shadow) for South Asia
  },
  ar: {
    regionCode: "ME",
    subRegion: "MIDDLE_EAST",
    regionName_bn: "মধ্যপ্রাচ্য ও আরব বিশ্ব (উম্মুল কুরা ঋতুভিত্তিক সময়সূচী)",
    regionName_ar: "الشرق الأوسط (تقويم أم القرى الموسمي)",
    regionName_en: "Middle East (Umm al-Qura Seasonal Waqt)",
    lat: 21.4225,
    lon: 39.8262,
    tzHours: 3.0,
    fajrAngle: 18.5,
    ishaAngle: 0,
    ishaFixedMins: 90, // Umm al-Qura 90 mins after Maghrib
    asrShadowFactor: 1 // Region-Matched Default: Standard / Jumhur (Mithl-e-Awwal, 1x shadow) for Middle East
  },
  en: {
    regionCode: "WEST",
    subRegion: "WESTERN",
    regionName_bn: "পশ্চিমা বিশ্ব ও আন্তর্জাতিক (ISNA/MWL ঋতুভিত্তিক সময়সূচী)",
    regionName_ar: "الدول الغربية (التوقيت الموسمي ISNA/MWL)",
    regionName_en: "Western Countries (ISNA/MWL Seasonal Waqt)",
    lat: 40.7128,
    lon: -74.006,
    tzHours: -5.0,
    fajrAngle: 15.0,
    ishaAngle: 15.0,
    ishaFixedMins: 0,
    asrShadowFactor: 1 // Region-Matched Default: Standard / Jumhur (Mithl-e-Awwal, 1x shadow) for Western profiles
  }
});

// Comprehensive IANA Timezone -> Exact Geographic Hub & Calculation Authority Registry
// Region-Matched Defaults:
// - South Asia, Central Asia & Turkey -> asrShadowFactor: 2 (Hanafi)
// - Middle East, Africa, Southeast Asia & Western Countries -> asrShadowFactor: 1 (Standard / Shafi'i, Maliki, Hanbali)
const IANA_GEO_TIMEZONE_REGISTRY = deepFreeze({
  // --- SOUTH ASIA (Islamic Foundation / Karachi Hanafi Standard: 18° Fajr/Isha, asrShadowFactor = 2) ---
  "asia/dhaka": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 23.8103, lon: 90.4125, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/dacca": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 23.8103, lon: 90.4125, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/kolkata": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 22.5726, lon: 88.3639, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/calcutta": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 22.5726, lon: 88.3639, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/karachi": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 24.8607, lon: 67.0011, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/colombo": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 6.9271, lon: 79.8612, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/kathmandu": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 27.7172, lon: 85.324, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/katmandu": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 27.7172, lon: 85.324, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "indian/maldives": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 4.1755, lon: 73.5093, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/thimphu": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 27.4728, lon: 89.6393, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/kabul": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 34.5553, lon: 69.2075, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/yangon": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 16.8409, lon: 96.1735, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/rangoon": { regionCode: "BD", subRegion: "SOUTH_ASIA", lat: 16.8409, lon: 96.1735, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2 },

  // --- CENTRAL ASIA & TURKEY (Hanafi Regional Default: asrShadowFactor = 2) ---
  "asia/tashkent": { regionCode: "ME", subRegion: "CENTRAL_ASIA", lat: 41.2995, lon: 69.2401, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/almaty": { regionCode: "ME", subRegion: "CENTRAL_ASIA", lat: 43.222, lon: 76.8512, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/bishkek": { regionCode: "ME", subRegion: "CENTRAL_ASIA", lat: 42.8746, lon: 74.5698, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/dushanbe": { regionCode: "ME", subRegion: "CENTRAL_ASIA", lat: 38.5598, lon: 68.787, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/ashgabat": { regionCode: "ME", subRegion: "CENTRAL_ASIA", lat: 37.9601, lon: 58.3261, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "asia/baku": { regionCode: "ME", subRegion: "CENTRAL_ASIA", lat: 40.4093, lon: 49.8671, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2 },
  "europe/istanbul": { regionCode: "ME", subRegion: "TURKEY", lat: 41.0082, lon: 28.9784, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2 },

  // --- MIDDLE EAST, GULF & AFRICA (Standard / Shafi'i, Maliki, Hanbali Default: asrShadowFactor = 1) ---
  "asia/riyadh": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 21.4225, lon: 39.8262, fajrAngle: 18.5, ishaAngle: 0, ishaFixedMins: 90, asrShadowFactor: 1 },
  "asia/makkah": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 21.4225, lon: 39.8262, fajrAngle: 18.5, ishaAngle: 0, ishaFixedMins: 90, asrShadowFactor: 1 },
  "asia/aden": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 15.3694, lon: 44.191, fajrAngle: 18.5, ishaAngle: 0, ishaFixedMins: 90, asrShadowFactor: 1 },
  "asia/kuwait": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 29.3759, lon: 47.9774, fajrAngle: 18.0, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/qatar": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 25.2854, lon: 51.531, fajrAngle: 18.0, ishaAngle: 0, ishaFixedMins: 90, asrShadowFactor: 1 },
  "asia/bahrain": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 26.2285, lon: 50.586, fajrAngle: 18.0, ishaAngle: 0, ishaFixedMins: 90, asrShadowFactor: 1 },
  "asia/dubai": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 25.2048, lon: 55.2708, fajrAngle: 18.2, ishaAngle: 18.2, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/muscat": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 23.588, lon: 58.3829, fajrAngle: 18.2, ishaAngle: 18.2, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/baghdad": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 33.3152, lon: 44.3661, fajrAngle: 19.5, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/amman": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 31.9454, lon: 35.9284, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/jerusalem": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 31.7683, lon: 35.2137, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/beirut": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 33.8938, lon: 35.5018, fajrAngle: 18.0, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/damascus": { regionCode: "ME", subRegion: "MIDDLE_EAST", lat: 33.5138, lon: 36.2765, fajrAngle: 18.0, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1 },
  "africa/cairo": { regionCode: "ME", subRegion: "AFRICA", lat: 30.0444, lon: 31.2357, fajrAngle: 19.5, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1 },
  "africa/casablanca": { regionCode: "ME", subRegion: "AFRICA", lat: 33.5731, lon: -7.5898, fajrAngle: 19.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "africa/algiers": { regionCode: "ME", subRegion: "AFRICA", lat: 36.7538, lon: 3.0588, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "africa/tunis": { regionCode: "ME", subRegion: "AFRICA", lat: 36.8065, lon: 10.1815, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "africa/lagos": { regionCode: "ME", subRegion: "AFRICA", lat: 6.5244, lon: 3.3792, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "africa/nairobi": { regionCode: "ME", subRegion: "AFRICA", lat: -1.2921, lon: 36.8219, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "africa/johannesburg": { regionCode: "ME", subRegion: "AFRICA", lat: -26.2041, lon: 28.0473, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },

  // --- SOUTHEAST ASIA (20° Fajr, 18° Isha, Standard Shafi'i Asr Default: asrShadowFactor = 1) ---
  "asia/kuala_lumpur": { regionCode: "ME", subRegion: "SE_ASIA", lat: 3.139, lon: 101.6869, fajrAngle: 20.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/singapore": { regionCode: "ME", subRegion: "SE_ASIA", lat: 1.3521, lon: 103.8198, fajrAngle: 20.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/jakarta": { regionCode: "ME", subRegion: "SE_ASIA", lat: -6.2088, lon: 106.8456, fajrAngle: 20.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "asia/brunei": { regionCode: "ME", subRegion: "SE_ASIA", lat: 4.9031, lon: 114.9398, fajrAngle: 20.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1 },

  // --- WESTERN COUNTRIES: EUROPE (MWL 18° Fajr, 17° Isha, Standard Asr Default: asrShadowFactor = 1) ---
  "europe/london": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 51.5074, lon: -0.1278, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/dublin": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 53.3498, lon: -6.2603, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/paris": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 48.8566, lon: 2.3522, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/berlin": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 52.52, lon: 13.405, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/rome": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 41.9028, lon: 12.4964, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/madrid": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 40.4168, lon: -3.7038, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/amsterdam": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 52.3676, lon: 4.9041, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/brussels": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 50.8503, lon: 4.3517, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/zurich": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 47.3769, lon: 8.5417, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/vienna": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 48.2082, lon: 16.3738, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/stockholm": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 59.3293, lon: 18.0686, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/oslo": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 59.9139, lon: 10.7522, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/copenhagen": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 55.6761, lon: 12.5683, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/athens": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 37.9838, lon: 23.7275, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/lisbon": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 38.7223, lon: -9.1393, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "europe/warsaw": { regionCode: "WEST", subRegion: "WESTERN_EUROPE", lat: 52.2297, lon: 21.0122, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },

  // --- WESTERN COUNTRIES: NORTH AMERICA (ISNA 15° Fajr, 15° Isha, Standard Asr Default: asrShadowFactor = 1) ---
  "america/new_york": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 40.7128, lon: -74.006, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/toronto": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 43.6532, lon: -79.3832, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/chicago": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 41.8781, lon: -87.6298, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/winnipeg": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 49.8951, lon: -97.1384, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/denver": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 39.7392, lon: -104.9903, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/edmonton": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 53.5461, lon: -113.4938, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/los_angeles": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 34.0522, lon: -118.2437, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/vancouver": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 49.2827, lon: -123.1207, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/detroit": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 42.3314, lon: -83.0458, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/halifax": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 44.6488, lon: -63.5752, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "america/phoenix": { regionCode: "WEST", subRegion: "NORTH_AMERICA", lat: 33.4484, lon: -112.074, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1 },

  // --- WESTERN COUNTRIES: OCEANIA (MWL 18° Fajr, 17° Isha, Standard Asr Default: asrShadowFactor = 1) ---
  "australia/sydney": { regionCode: "WEST", subRegion: "OCEANIA", lat: -33.8688, lon: 151.2093, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "australia/melbourne": { regionCode: "WEST", subRegion: "OCEANIA", lat: -37.8136, lon: 144.9631, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "australia/brisbane": { regionCode: "WEST", subRegion: "OCEANIA", lat: -27.4705, lon: 153.026, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "australia/perth": { regionCode: "WEST", subRegion: "OCEANIA", lat: -31.9505, lon: 115.8605, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "australia/adelaide": { regionCode: "WEST", subRegion: "OCEANIA", lat: -34.9285, lon: 138.6007, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 },
  "pacific/auckland": { regionCode: "WEST", subRegion: "OCEANIA", lat: -36.8485, lon: 174.7633, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1 }
});

let cachedDeviceGeoCoords = null;
let lastObservedTimezoneId = "";

// Returns user's explicit Madhab override ("hanafi" | "standard") or null for automatic region-matched default
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


// ============================================================================
// INTERACTIVE BANGLADESH 8 DIVISIONS → ALL 64 DISTRICTS (ZILAS) → UPAZILA/THANA
// SELECTOR ENGINE (ISLAMIC FOUNDATION BANGLADESH COORDINATES & DYNAMIC UI)
// ============================================================================
const BD_SELECTED_LOC_STORAGE_KEY = "SUNNAH_24_BD_SELECTED_LOCATION_V1";

const BD_GEO_HIERARCHY = deepFreeze([
  {
    id: "dhaka",
    name_bn: "ঢাকা বিভাগ",
    name_en: "Dhaka Division",
    name_ar: "إقليم دكا",
    districts: [
      { id: "dhaka", name_bn: "ঢাকা", name_en: "Dhaka", lat: 23.8103, lon: 90.4125, upazilas: ["ঢাকা সদর (Dhaka)", "সাভার (Savar)", "ধামরাই (Dhamrai)", "কেরানীগঞ্জ (Keraniganj)", "নবাবগঞ্জ (Nawabganj)", "দোহার (Dohar)", "ধানমন্ডি (Dhanmondi)", "মিরপুর (Mirpur)", "উত্তরা (Uttara)", "গুলশান (Gulshan)", "মতিঝিল (Motijheel)", "মোহাম্মদপুর (Mohammadpur)", "তেজগাঁও (Tejgaon)", "লালবাগ (Lalbagh)", "কোতোয়ালী (Kotwali)", "রমনা (Ramna)", "খিলগাঁও (Khilgaon)", "বাড্ডা (Badda)", "পল্লবী (Pallabi)", "যাত্রাবাড়ী (Jatrabari)"] },
      { id: "gazipur", name_bn: "গাজীপুর", name_en: "Gazipur", lat: 23.9999, lon: 90.4203, upazilas: ["গাজীপুর সদর (Gazipur Sadar)", "কালিয়াকৈর (Kaliakair)", "কালীগঞ্জ (Kaliganj)", "কাপাসিয়া (Kapasia)", "শ্রীপুর (Sreepur)", "টঙ্গী (Tongi)"] },
      { id: "narayanganj", name_bn: "নারায়ণগঞ্জ", name_en: "Narayanganj", lat: 23.6238, lon: 90.5000, upazilas: ["নারায়ণগঞ্জ সদর (Narayanganj Sadar)", "বন্দর (Bandar)", "আড়াইহাজার (Araihazar)", "রূপগঞ্জ (Rupganj)", "সোনারগাঁও (Sonargaon)", "সিদ্ধিরগঞ্জ (Siddhirganj)", "ফতুল্লা (Fatullah)"] },
      { id: "tangail", name_bn: "টাঙ্গাইল", name_en: "Tangail", lat: 24.2513, lon: 89.9167, upazilas: ["টাঙ্গাইল সদর (Tangail Sadar)", "সখিপুর (Sakhipur)", "বাসাইল (Basail)", "মধুপুর (Madhupur)", "ঘাটাইল (Ghatail)", "কালিহাতী (Kalihati)", "নাগরপুর (Nagarpur)", "মির্জাপুর (Mirzapur)", "গোপালপুর (Gopalpur)", "দেলদুয়ার (Delduar)", "ভূঞাপুর (Bhuapur)", "ধনবাড়ী (Dhanbari)"] },
      { id: "manikganj", name_bn: "মানিকগঞ্জ", name_en: "Manikganj", lat: 23.8644, lon: 90.0047, upazilas: ["মানিকগঞ্জ সদর (Manikganj Sadar)", "সিংগাইর (Singair)", "শিবালয় (Shibalaya)", "সাটুরিয়া (Saturia)", "হরিরামপুর (Harirampur)", "ঘিওর (Ghior)", "দৌলতপুর (Daulatpur)"] },
      { id: "munshiganj", name_bn: "মুন্সীগঞ্জ", name_en: "Munshiganj", lat: 23.5422, lon: 90.5305, upazilas: ["মুন্সীগঞ্জ সদর (Munshiganj Sadar)", "শ্রীনগর (Sreenagar)", "সিরাজদিখান (Sirajdikhan)", "লৌহজং (Lohajang)", "গজারিয়া (Gazaria)", "টঙ্গীবাড়ী (Tongibari)"] },
      { id: "narsingdi", name_bn: "নরসিংদী", name_en: "Narsingdi", lat: 23.9229, lon: 90.7177, upazilas: ["নরসিংদী সদর (Narsingdi Sadar)", "বেলাবো (Belabo)", "মনোহরদী (Monohardi)", "পলাশ (Palash)", "রায়পুরা (Raipura)", "শিবপুর (Shibpur)"] },
      { id: "kishoreganj", name_bn: "কিশোরগঞ্জ", name_en: "Kishoreganj", lat: 24.4449, lon: 90.7766, upazilas: ["কিশোরগঞ্জ সদর (Kishoreganj Sadar)", "অষ্টগ্রাম (Austagram)", "বাজিতপুর (Bajitpur)", "ভৈরব (Bhairab)", "হোসেনপুর (Hossainpur)", "ইটনা (Itna)", "করিমগঞ্জ (Karimganj)", "কতিয়াদী (Katiadi)", "কুলিয়ারচর (Kuliarchar)", "মিঠামইন (Mithamain)", "নিকলী (Nikli)", "পাকুন্দিয়া (Pakundia)", "তাড়াইল (Tarail)"] },
      { id: "faridpur", name_bn: "ফরিদপুর", name_en: "Faridpur", lat: 23.6070, lon: 89.8429, upazilas: ["ফরিদপুর সদর (Faridpur Sadar)", "আলফাডাঙ্গা (Alfadanga)", "বোয়ালমারী (Boalmari)", "সদরপুর (Sadarpur)", "নগরকান্দা (Nagarkanda)", "ভাঙ্গা (Bhanga)", "চরভদ্রাসন (Charbhadrasan)", "মধুখালী (Madhukhali)", "সালথা (Saltha)"] },
      { id: "gopalganj", name_bn: "গোপালগঞ্জ", name_en: "Gopalganj", lat: 23.0051, lon: 89.8266, upazilas: ["গোপালগঞ্জ সদর (Gopalganj Sadar)", "কাশিয়ানী (Kashiani)", "কোটালীপাড়া (Kotalipara)", "মুকসুদপুর (Muksudpur)", "টুঙ্গিপাড়া (Tungipara)"] },
      { id: "madaripur", name_bn: "মাদারীপুর", name_en: "Madaripur", lat: 23.1641, lon: 90.1897, upazilas: ["মাদারীপুর সদর (Madaripur Sadar)", "শিবচর (Shibchar)", "কালকিনি (Kalkini)", "রাজৈর (Rajoir)", "ডাসার (Dasar)"] },
      { id: "rajbari", name_bn: "রাজবাড়ী", name_en: "Rajbari", lat: 23.7574, lon: 89.6445, upazilas: ["রাজবাড়ী সদর (Rajbari Sadar)", "গোয়ালন্দ (Goalanda)", "পাংশা (Pangsha)", "বালিয়াকান্দি (Baliakandi)", "কালুখালী (Kalukhali)"] },
      { id: "shariatpur", name_bn: "শরীয়তপুর", name_en: "Shariatpur", lat: 23.2423, lon: 90.4348, upazilas: ["শরীয়তপুর সদর (Shariatpur Sadar)", "নড়িয়া (Naria)", "জাজিরা (Zajira)", "গোসাইরহাট (Gosairhat)", "ভেদরগঞ্জ (Bhedarganj)", "ডামুড্যা (Damudya)"] }
    ]
  },
  {
    id: "chattogram",
    name_bn: "চট্টগ্রাম বিভাগ",
    name_en: "Chattogram Division",
    name_ar: "إقليم شيتاغونغ",
    districts: [
      { id: "chattogram", name_bn: "চট্টগ্রাম", name_en: "Chattogram", lat: 22.3569, lon: 91.7832, upazilas: ["কোতোয়ালী (Kotwali)", "পাঁচলাইশ (Panchlaish)", "চান্দগাঁও (Chandgaon)", "বন্দর (Bandar)", "পতেঙ্গা (Patenga)", "হালিশহর (Halishahar)", "ডবলমুরিং (Double Mooring)", "পাহাড়তলী (Pahartali)", "আনোয়ারা (Anwara)", "বাঁশখালী (Banshkhali)", "বোয়ালখালী (Boalkhali)", "চন্দনাইশ (Chandanaish)", "ফটিকছড়ি (Fatikchhari)", "হাটহাজারী (Hathazari)", "লোহাগাড়া (Lohagara)", "মীরসরাই (Mirsharai)", "পটিয়া (Patiya)", "রাঙ্গুনিয়া (Rangunia)", "রাউজান (Raozan)", "সন্দ্বীপ (Sandwip)", "সাতকানিয়া (Satkania)", "সীতাকুণ্ড (Sitakunda)", "কর্ণফুলী (Karnaphuli)"] },
      { id: "coxsbazar", name_bn: "কক্সবাজার", name_en: "Cox's Bazar", lat: 21.4272, lon: 92.0058, upazilas: ["কক্সবাজার সদর (Cox's Bazar Sadar)", "চকরিয়া (Chakaria)", "কুতুবদিয়া (Kutubdia)", "উখিয়া (Ukhia)", "মহেশখালী (Maheshkhali)", "পেকুয়া (Pekua)", "রামু (Ramu)", "টেকনাফ (Teknaf)", "ঈদগাঁও (Eidgaon)"] },
      { id: "cumilla", name_bn: "কুমিল্লা", name_en: "Cumilla", lat: 23.4607, lon: 91.1809, upazilas: ["কুমিল্লা আদর্শ সদর (Cumilla Adarsha Sadar)", "কুমিল্লা সদর দক্ষিণ (Cumilla Sadar Dakshin)", "বরুড়া (Barura)", "ব্রাহ্মণপাড়া (Brahmanpara)", "বুড়িচং (Burichang)", "চান্দিনা (Chandina)", "চৌদ্দগ্রাম (Chauddagram)", "দাউদকান্দি (Daudkandi)", "দেবিদ্বার (Debidwar)", "হোমনা (Homna)", "লাকসাম (Laksam)", "মুরাদনগর (Muradnagar)", "নাঙ্গলকোট (Nangalkot)", "মেঘনা (Meghna)", "তিতাস (Titas)", "মনোহরগঞ্জ (Monohorgonj)", "লালমাই (Lalmai)"] },
      { id: "brahmanbaria", name_bn: "ব্রাহ্মণবাড়িয়া", name_en: "Brahmanbaria", lat: 23.9571, lon: 91.1119, upazilas: ["ব্রাহ্মণবাড়িয়া সদর (Brahmanbaria Sadar)", "আশুগঞ্জ (Ashuganj)", "নাসিরনগর (Nasirnagar)", "নবীনগর (Nabinagar)", "সরাইল (Sarail)", "কসবা (Kasba)", "আখাউড়া (Akhaura)", "বাঞ্ছারামপুর (Bancharampur)", "বিজয়নগর (Bijoynagar)"] },
      { id: "chandpur", name_bn: "চাঁদপুর", name_en: "Chandpur", lat: 23.2332, lon: 90.6712, upazilas: ["চাঁদপুর সদর (Chandpur Sadar)", "ফরিদগঞ্জ (Faridganj)", "হাইমচর (Haimchar)", "হাজীগঞ্জ (Hajiganj)", "কচুয়া (Kachua)", "মতলব উত্তর (Matlab Uttar)", "মতলব দক্ষিণ (Matlab Dakshin)", "শাহরাস্তি (Shahrasti)"] },
      { id: "noakhali", name_bn: "নোয়াখালী", name_en: "Noakhali", lat: 22.8696, lon: 91.0995, upazilas: ["নোয়াখালী সদর / সুধারাম (Noakhali Sadar)", "বেগমগঞ্জ (Begumganj)", "চাটখিল (Chatkhil)", "কোম্পানীগঞ্জ (Companiganj)", "হাতিয়া (Hatiya)", "সেনবাগ (Senbagh)", "সুবর্ণচর (Subarnachar)", "সোনাইমুড়ী (Sonaimuri)", "কবিরহাট (Kabirhat)"] },
      { id: "feni", name_bn: "ফেনী", name_en: "Feni", lat: 23.0159, lon: 91.3976, upazilas: ["ফেনী সদর (Feni Sadar)", "ছাগলনাইয়া (Chhagalnaiya)", "দাগনভূঞা (Daganbhuiyan)", "পরশুরাম (Parshuram)", "ফুলগাজী (Fulgazi)", "সোনাগাজী (Sonagazi)"] },
      { id: "lakshmipur", name_bn: "লক্ষ্মীপুর", name_en: "Lakshmipur", lat: 22.9447, lon: 90.8282, upazilas: ["লক্ষ্মীপুর সদর (Lakshmipur Sadar)", "রায়পুর (Raipur)", "রামগঞ্জ (Ramganj)", "রামগতি (Ramgati)", "কমলনগর (Kamalnagar)"] },
      { id: "rangamati", name_bn: "রাঙ্গামাটি", name_en: "Rangamati", lat: 22.6533, lon: 92.1789, upazilas: ["রাঙ্গামাটি সদর (Rangamati Sadar)", "বেলাইছড়ি (Belaichhari)", "বাঘাইছড়ি (Bagaichhari)", "বরকল (Barkal)", "জুরাছড়ি (Juraichhari)", "রাজস্থলী (Rajasthali)", "কাপ্তাই (Kaptai)", "লংগদু (Langadu)", "নানিয়ারচর (Naniarchar)", "কাউখালী (Kawkhali)"] },
      { id: "khagrachhari", name_bn: "খাগড়াছড়ি", name_en: "Khagrachhari", lat: 23.1193, lon: 91.9847, upazilas: ["খাগড়াছড়ি সদর (Khagrachhari Sadar)", "দীঘিনালা (Dighinala)", "পানছড়ি (Panchhari)", "লক্ষ্মীছড়ি (Lakshmichhari)", "মহালছড়ি (Mahalchhari)", "মানিকছড়ি (Manikchhari)", "রামগড় (Ramgarh)", "মাটিরাঙ্গা (Matiranga)", "গুইমারা (Guimara)"] },
      { id: "bandarban", name_bn: "বান্দরবান", name_en: "Bandarban", lat: 22.1953, lon: 92.2184, upazilas: ["বান্দরবান সদর (Bandarban Sadar)", "থানচি (Thanchi)", "লামা (Lama)", "নাইক্ষ্যংছড়ি (Naikhongchhari)", "আলীকদম (Alikadam)", "রোয়াংছড়ি (Rowangchhari)", "রুমা (Ruma)"] }
    ]
  },
  {
    id: "rajshahi",
    name_bn: "রাজশাহী বিভাগ",
    name_en: "Rajshahi Division",
    name_ar: "إقليم راجشاهي",
    districts: [
      { id: "rajshahi", name_bn: "রাজশাহী", name_en: "Rajshahi", lat: 24.3745, lon: 88.6042, upazilas: ["বোয়ালিয়া (Boalia)", "মতিহার / রুয়েট (Motihar / RUET)", "রাজপাড়া (Rajpara)", "শাহ মখদুম (Shah Makhdum)", "পবা (Paba)", "বাঘা (Bagha)", "বাগমারা (Bagmara)", "চারঘাট (Charghat)", "দুর্গাপুর (Durgapur)", "গোদাগাড়ী (Godagari)", "মোহনপুর (Mohanpur)", "পুঠিয়া (Puthia)", "তানোর (Tanore)"] },
      { id: "bogura", name_bn: "বগুড়া", name_en: "Bogura", lat: 24.8481, lon: 89.3730, upazilas: ["বগুড়া সদর (Bogura Sadar)", "আদমদীঘি (Adamdighi)", "ধুনট (Dhunat)", "দুপচাঁচিয়া (Dupchanchia)", "গাবতলী (Gabtali)", "কাহালু (Kahaloo)", "নন্দীগ্রাম (Nandigram)", "সারিয়াকান্দি (Sariakandi)", "শাজাহানপুর (Shajahanpur)", "শেরপুর (Sherpur)", "শিবগঞ্জ (Shibganj)", "সোনাতলা (Sonatala)"] },
      { id: "pabna", name_bn: "পাবনা", name_en: "Pabna", lat: 24.0063, lon: 89.2372, upazilas: ["পাবনা সদর (Pabna Sadar)", "আটঘরিয়া (Atgharia)", "বেড়া (Bera)", "ভাঙ্গুড়া (Bhangura)", "চাটমোহর (Chatmohar)", "ফরিদপুর (Faridpur)", "ঈশ্বরদী (Ishwardi)", "সাঁথিয়া (Santhia)", "সুজানগর (Sujanagar)"] },
      { id: "sirajganj", name_bn: "সিরাজগঞ্জ", name_en: "Sirajganj", lat: 24.4534, lon: 89.7007, upazilas: ["সিরাজগঞ্জ সদর (Sirajganj Sadar)", "বেলকুচি (Belkuchi)", "চৌহালী (Chauhali)", "কামারখন্দ (Kamarkhanda)", "কাজীপুর (Kazipur)", "রায়গঞ্জ (Raiganj)", "শাহজাদপুর (Shahjadpur)", "তাড়াশ (Tarash)", "উল্লাপাড়া (Ullahpara)"] },
      { id: "naogaon", name_bn: "নওগাঁ", name_en: "Naogaon", lat: 24.7936, lon: 88.9318, upazilas: ["নওগাঁ সদর (Naogaon Sadar)", "আত্রাই (Atrai)", "বদলগাছী (Badalgachhi)", "মান্দা (Manda)", "ধামইরহাট (Dhamoirhat)", "মহাদেবপুর (Mohadevpur)", "নিয়ামতপুর (Niamatpur)", "পত্নীতলা (Patnitala)", "পোরশা (Porsha)", "রাণীনগর (Raninagar)", "সাপাহার (Sapahar)"] },
      { id: "natore", name_bn: "নাটোর", name_en: "Natore", lat: 24.4206, lon: 89.0006, upazilas: ["নাটোর সদর (Natore Sadar)", "বাগাতিপাড়া (Bagatipara)", "বড়াইগ্রাম (Baraigram)", "গুরুদাসপুর (Gurudaspur)", "লালপুর (Lalpur)", "সিংড়া (Singra)", "নলডাঙ্গা (Naldanga)"] },
      { id: "chapainawabganj", name_bn: "চাঁপাইনবাবগঞ্জ", name_en: "Chapainawabganj", lat: 24.5965, lon: 88.2775, upazilas: ["চাঁপাইনবাবগঞ্জ সদর (Chapainawabganj Sadar)", "ভোলাহাট (Bholahat)", "গোমস্তাপুর (Gomastapur)", "নাচোল (Nachole)", "শিবগঞ্জ (Shibganj)"] },
      { id: "joypurhat", name_bn: "জয়পুরহাট", name_en: "Joypurhat", lat: 25.0968, lon: 89.0227, upazilas: ["জয়পুরহাট সদর (Joypurhat Sadar)", "আক্কেলপুর (Akkelpur)", "কালাই (Kalai)", "ক্ষেতলাল (Khetlal)", "পাঁচবিবি (Panchbibi)"] }
    ]
  },
  {
    id: "khulna",
    name_bn: "খুলনা বিভাগ",
    name_en: "Khulna Division",
    name_ar: "إقليم خولنا",
    districts: [
      { id: "khulna", name_bn: "খুলনা", name_en: "Khulna", lat: 22.8456, lon: 89.5403, upazilas: ["খুলনা সদর (Khulna Sadar)", "সোনাডাঙ্গা (Sonadanga)", "খালিশপুর (Khalishpur)", "দৌলতপুর (Daulatpur)", "খান জাহান আলী (Khan Jahan Ali)", "বটিয়াঘাটা (Batiaghata)", "দাকোপ (Dacope)", "ডুমুরিয়া (Dumuria)", "দিঘলিয়া (Dighalia)", "কয়রা (Koyra)", "পাইকগাছা (Paikgachha)", "ফুলতলা (Phultala)", "রূপসা (Rupsha)", "তেরখাদা (Terokhada)"] },
      { id: "jashore", name_bn: "যশোর", name_en: "Jashore", lat: 23.1664, lon: 89.2081, upazilas: ["যশোর সদর (Jashore Sadar)", "অভয়নগর (Abhaynagar)", "বাঘারপাড়া (Bagherpara)", "চৌগাছা (Chaugachha)", "ঝিকরগাছা (Jhikargachha)", "কেশবপুর (Keshabpur)", "মণিরামপুর (Manirampur)", "শার্শা (Sharsha)"] },
      { id: "kushtia", name_bn: "কুষ্টিয়া", name_en: "Kushtia", lat: 23.9013, lon: 89.1204, upazilas: ["কুষ্টিয়া সদর (Kushtia Sadar)", "কুমারখালী (Kumarkhali)", "খোকসা (Khoksa)", "মিরপুর (Mirpur)", "দৌলতপুর (Daulatpur)", "ভেড়ামারা (Bheramara)"] },
      { id: "satkhira", name_bn: "সাতক্ষীরা", name_en: "Satkhira", lat: 22.7185, lon: 89.0705, upazilas: ["সাতক্ষীরা সদর (Satkhira Sadar)", "আশাশুনি (Assasuni)", "দেবহাটা (Debhata)", "কলারোয়া (Kalaroa)", "কালীগঞ্জ (Kaliganj)", "শ্যামনগর (Shyamnagar)", "তালা (Tala)"] },
      { id: "bagerhat", name_bn: "বাগেরহাট", name_en: "Bagerhat", lat: 22.6516, lon: 89.7859, upazilas: ["বাগেরহাট সদর (Bagerhat Sadar)", "চিতলমারী (Chitalmari)", "ফকিরহাট (Fakirhat)", "কচুয়া (Kachua)", "মোল্লাহাট (Mollahat)", "মোংলা (Mongla)", "মোরেলগঞ্জ (Morrelganj)", "রামপাল (Rampal)", "শরণখোলা (Sarankhola)"] },
      { id: "jhenaidah", name_bn: "ঝিনাইদহ", name_en: "Jhenaidah", lat: 23.5450, lon: 89.1726, upazilas: ["ঝিনাইদহ সদর (Jhenaidah Sadar)", "হরিণাকুণ্ডু (Harinakunda)", "কালীগঞ্জ (Kaliganj)", "কোটচাঁদপুর (Kotchandpur)", "মহেশপুর (Maheshpur)", "শৈলকুপা (Shailkupa)"] },
      { id: "chuadanga", name_bn: "চুয়াডাঙ্গা", name_en: "Chuadanga", lat: 23.6402, lon: 88.8418, upazilas: ["চুয়াডাঙ্গা সদর (Chuadanga Sadar)", "আলমডাঙ্গা (Alamdanga)", "দামুড়হুদা (Damurhuda)", "জীবননগর (Jibannagar)"] },
      { id: "magura", name_bn: "মাগুরা", name_en: "Magura", lat: 23.4873, lon: 89.4199, upazilas: ["মাগুরা সদর (Magura Sadar)", "মহম্মদপুর (Mohammadpur)", "শালিখা (Shalikha)", "শ্রীপুর (Sreepur)"] },
      { id: "meherpur", name_bn: "মেহেরপুর", name_en: "Meherpur", lat: 23.7622, lon: 88.6318, upazilas: ["মেহেরপুর সদর (Meherpur Sadar)", "গাংনী (Gangni)", "মুজিবনগর (Mujibnagar)"] },
      { id: "narail", name_bn: "নড়াইল", name_en: "Narail", lat: 23.1725, lon: 89.5127, upazilas: ["নড়াইল সদর (Narail Sadar)", "কালিয়া (Kalia)", "লোহাগড়া (Lohagara)"] }
    ]
  },
  {
    id: "sylhet",
    name_bn: "সিলেট বিভাগ",
    name_en: "Sylhet Division",
    name_ar: "إقليم سيلهيت",
    districts: [
      { id: "sylhet", name_bn: "সিলেট", name_en: "Sylhet", lat: 24.8949, lon: 91.8687, upazilas: ["সিলেট সদর / সাস্ট (Sylhet Sadar / SUST)", "বালাগঞ্জ (Balaganj)", "বিয়ানীবাজার (Beanibazar)", "বিশ্বনাথ (Bishwanath)", "কোম্পানীগঞ্জ (Companiganj)", "ফেঞ্চুগঞ্জ (Fenchuganj)", "গোলাপগঞ্জ (Golapganj)", "গোয়াইনঘাট (Gowainghat)", "জৈন্তাপুর (Jaintiapur)", "কানাইঘাট (Kanaighat)", "জকিগঞ্জ (Zakiganj)", "দক্ষিণ সুরমা (Dakshin Surma)", "ওসমানীনগর (Osmaninagar)"] },
      { id: "moulvibazar", name_bn: "মৌলভীবাজার", name_en: "Moulvibazar", lat: 24.4829, lon: 91.7774, upazilas: ["মৌলভীবাজার সদর (Moulvibazar Sadar)", "বড়লেখা (Barlekha)", "জুড়ী (Juri)", "কমলগঞ্জ (Kamalganj)", "কুলাউড়া (Kulaura)", "রাজনগর (Rajnagar)", "শ্রীমঙ্গল (Sreemangal)"] },
      { id: "habiganj", name_bn: "হবিগঞ্জ", name_en: "Habiganj", lat: 24.3749, lon: 91.4155, upazilas: ["হবিগঞ্জ সদর (Habiganj Sadar)", "আজমিরীগঞ্জ (Ajmiriganj)", "বাহুবল (Bahubal)", "বানিয়াচং (Baniachong)", "চুনারুঘাট (Chunarughat)", "লাখাই (Lakhai)", "মাধবপুর (Madhabpur)", "নবীগঞ্জ (Nabiganj)", "শায়েস্তাগঞ্জ (Shayestaganj)"] },
      { id: "sunamganj", name_bn: "সুনামগঞ্জ", name_en: "Sunamganj", lat: 25.0658, lon: 91.3950, upazilas: ["সুনামগঞ্জ সদর (Sunamganj Sadar)", "বিশ্বম্ভরপুর (Bishwamvarpur)", "ছাতক (Chhatak)", "দিরাই (Derai)", "ধর্মপাশা (Dharamapasha)", "দোয়ারাবাজার (Dowarabazar)", "জগন্নাথপুর (Jagannathpur)", "জামালগঞ্জ (Jamalganj)", "শাল্লা (Shalla)", "তাহিরপুর (Tahirpur)", "শান্তিগঞ্জ (Shantiganj)", "মধ্যনগর (Madhyanagar)"] }
    ]
  },
  {
    id: "rangpur",
    name_bn: "রংপুর বিভাগ",
    name_en: "Rangpur Division",
    name_ar: "إقليم رانغبور",
    districts: [
      { id: "rangpur", name_bn: "রংপুর", name_en: "Rangpur", lat: 25.7439, lon: 89.2752, upazilas: ["রংপুর সদর (Rangpur Sadar)", "বদরগঞ্জ (Badarganj)", "গঙ্গাচড়া (Gangachara)", "কাউনিয়া (Kaunia)", "মিঠাপুকুর (Mithapukur)", "পীরগাছা (Pirgachha)", "পীরগঞ্জ (Pirganj)", "তারাগঞ্জ (Taraganj)"] },
      { id: "dinajpur", name_bn: "দিনাজপুর", name_en: "Dinajpur", lat: 25.6279, lon: 88.6332, upazilas: ["দিনাজপুর সদর (Dinajpur Sadar)", "বীরগঞ্জ (Birganj)", "খানসামা (Khansama)", "চিরিরবন্দর (Chirirbandar)", "পার্বতীপুর (Parbatipur)", "ফুলবাড়ী (Phulbari)", "বিরামপুর (Birampur)", "বোচাগঞ্জ (Bochaganj)", "কাহারোল (Kaharole)", "কোটালীপাড়া / নবাবগঞ্জ (Nawabganj)", "ঘোড়াঘাট (Ghoraghat)", "হাকিমপুর (Hakimpur)", "বিরল (Biral)"] },
      { id: "kurigram", name_bn: "কুড়িগ্রাম", name_en: "Kurigram", lat: 25.8054, lon: 89.6362, upazilas: ["কুড়িগ্রাম সদর (Kurigram Sadar)", "ভূরুঙ্গামারী (Bhurungamari)", "চর রাজিবপুর (Char Rajibpur)", "চিলমারী (Chilmari)", "ফুলবাড়ী (Phulbari)", "নাগেশ্বরী (Nageshwari)", "রাজারহাট (Rajarhat)", "রৌমারী (Raomari)", "উলিপুর (Ulipur)"] },
      { id: "gaibandha", name_bn: "গাইবান্ধা", name_en: "Gaibandha", lat: 25.3288, lon: 89.5281, upazilas: ["গাইবান্ধা সদর (Gaibandha Sadar)", "ফুলছড়ি (Fulchhari)", "গোবিন্দগঞ্জ (Gobindaganj)", "পলাশবাড়ী (Palashbari)", "সাদুল্লাপুর (Sadullapur)", "সাঘাটা (Saghata)", "সুন্দরগঞ্জ (Sundarganj)"] },
      { id: "nilphamari", name_bn: "নীলফামারী", name_en: "Nilphamari", lat: 25.9318, lon: 88.8561, upazilas: ["নীলফামারী সদর (Nilphamari Sadar)", "সৈয়দপুর (Saidpur)", "ডোমার (Domar)", "ডিমলা (Dimla)", "জলঢাকা (Jaldhaka)", "কিশোরগঞ্জ (Kishoreganj)"] },
      { id: "panchagarh", name_bn: "পঞ্চগড়", name_en: "Panchagarh", lat: 26.3411, lon: 88.5542, upazilas: ["পঞ্চগড় সদর (Panchagarh Sadar)", "আটোয়ারী (Atwari)", "বোদা (Boda)", "দেবীগঞ্জ (Debiganj)", "তেঁতুলিয়া (Tetulia)"] },
      { id: "thakurgaon", name_bn: "ঠাকুরগাঁও", name_en: "Thakurgaon", lat: 26.0337, lon: 88.4617, upazilas: ["ঠাকুরগাঁও সদর (Thakurgaon Sadar)", "বালিয়াডাঙ্গী (Baliadangi)", "হরিপুর (Haripur)", "পীরগঞ্জ (Pirganj)", "রাণীশংকৈল (Ranisankail)"] },
      { id: "lalmonirhat", name_bn: "লালমনিরহাট", name_en: "Lalmonirhat", lat: 25.9165, lon: 89.4532, upazilas: ["লালমনিরহাট সদর (Lalmonirhat Sadar)", "আদিতমারী (Aditmari)", "হাতীবান্ধা (Hatibandha)", "কালীগঞ্জ (Kaliganj)", "পাটগ্রাম (Patgram)"] }
    ]
  },
  {
    id: "barishal",
    name_bn: "বরিশাল বিভাগ",
    name_en: "Barishal Division",
    name_ar: "إقليم باريشال",
    districts: [
      { id: "barishal", name_bn: "বরিশাল", name_en: "Barishal", lat: 22.7010, lon: 90.3535, upazilas: ["বরিশাল সদর (Barishal Sadar)", "আগৈলঝাড়া (Agailjhara)", "বাবুগঞ্জ (Babuganj)", "বাকেরগঞ্জ (Bakerganj)", "বানারীপাড়া (Banaripara)", "গৌরনদী (Gournadi)", "হিজলা (Hizla)", "মেহেন্দিগঞ্জ (Mehendiganj)", "মুলাদী (Muladi)", "উজিরপুর (Wazirpur)"] },
      { id: "bhola", name_bn: "ভোলা", name_en: "Bhola", lat: 22.6859, lon: 90.6482, upazilas: ["ভোলা সদর (Bhola Sadar)", "বোরহানউদ্দিন (Borhanuddin)", "চরফ্যাশন (Char Fasson)", "দৌলতখান (Daulatkhan)", "লালমোহন (Lalmohan)", "মনপুরা (Manpura)", "তজুমদ্দিন (Tazumuddin)"] },
      { id: "patuakhali", name_bn: "পটুয়াখালী", name_en: "Patuakhali", lat: 22.3596, lon: 90.3299, upazilas: ["পটুয়াখালী সদর (Patuakhali Sadar)", "বাউফল (Bauphal)", "দশমিনা (Dashmina)", "গলাচিপা (Galachipa)", "কলাপাড়া (Kalapara)", "মির্জাগঞ্জ (Mirzaganj)", "দুমকি (Dumki)", "রাঙ্গাবালী (Rangabali)"] },
      { id: "pirojpur", name_bn: "পিরোজপুর", name_en: "Pirojpur", lat: 22.5841, lon: 89.9720, upazilas: ["পিরোজপুর সদর (Pirojpur Sadar)", "ভাণ্ডারিয়া (Bhandaria)", "কাউখালী (Kawkhali)", "মঠবাড়িয়া (Mathbaria)", "নাজিরপুর (Nazirpur)", "নেছারাবাদ / স্বরূপকাঠি (Nesarabad)", "ইন্দুরকানী (Indurkani)"] },
      { id: "barguna", name_bn: "বরগুনা", name_en: "Barguna", lat: 22.1592, lon: 90.1259, upazilas: ["বরগুনা সদর (Barguna Sadar)", "আমতলী (Amtali)", "বামনা (Bamna)", "বেতাগী (Betagi)", "পাথরঘাটা (Patharghata)", "তালতলী (Taltali)"] },
      { id: "jhalokati", name_bn: "ঝালকাঠি", name_en: "Jhalokati", lat: 22.6406, lon: 90.1987, upazilas: ["ঝালকাঠি সদর (Jhalokati Sadar)", "কাঁঠালিয়া (Kathalia)", "নলছিটি (Nalchity)", "রাজাপুর (Rajapur)"] }
    ]
  },
  {
    id: "mymensingh",
    name_bn: "ময়মনসিংহ বিভাগ",
    name_en: "Mymensingh Division",
    name_ar: "إقليم ميمنسينغ",
    districts: [
      { id: "mymensingh", name_bn: "ময়মনসিংহ", name_en: "Mymensingh", lat: 24.7471, lon: 90.4203, upazilas: ["ময়মনসিংহ সদর (Mymensingh Sadar)", "ভালুকা (Bhaluka)", "ত্রিশাল (Trishal)", "হালুয়াঘাট (Haluaghat)", "মুক্তাগাছা (Muktagachha)", "ধোবাউড়া (Dhobaura)", "ফুলবাড়িয়া (Fulbaria)", "গফরগাঁও (Gaffargaon)", "গৌরীপুর (Gauripur)", "ঈশ্বরগঞ্জ (Ishwarganj)", "নান্দাইল (Nandail)", "ফুলপুর (Phulpur)", "তারাকান্দা (Tarakanda)"] },
      { id: "jamalpur", name_bn: "জামালপুর", name_en: "Jamalpur", lat: 24.9375, lon: 89.9378, upazilas: ["জামালপুর সদর (Jamalpur Sadar)", "বকশীগঞ্জ (Baksiganj)", "দেওয়ানগঞ্জ (Dewanganj)", "ইসলামপুর (Islampur)", "মাদারগঞ্জ (Madarganj)", "মেলান্দহ (Melandaha)", "সরিষাবাড়ী (Sarishabari)"] },
      { id: "netrokona", name_bn: "নেত্রকোণা", name_en: "Netrokona", lat: 24.8709, lon: 90.7279, upazilas: ["নেত্রকোণা সদর (Netrokona Sadar)", "আটপাড়া (Atpara)", "বারহাট্টা (Barhatta)", "দুর্গাপুর (Durgapur)", "কলমাকান্দা (Kalmakanda)", "কেন্দুয়া (Kendua)", "খালিয়াজুরী (Khaliajuri)", "মদন (Madan)", "মোহনগঞ্জ (Mohanganj)", "পূর্বধলা (Purbadhala)"] },
      { id: "sherpur", name_bn: "শেরপুর", name_en: "Sherpur", lat: 25.0205, lon: 90.0153, upazilas: ["শেরপুর সদর (Sherpur Sadar)", "ঝিনাইগাতী (Jhenaigati)", "নকলা (Nakla)", "নালিতাবাড়ী (Nalitabari)", "শ্রীবরদী (Sreebardi)"] }
    ]
  }
]);

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

  const savedBdLoc = getSavedBdLocationSelection();

  // Finalize profile by prioritizing saved Bangladesh Division/District/Upazila coordinates,
  // then overlaying consistent GPS coordinates, and applying user's Madhab Toggle preference
  const finalizeProfileWithGpsAndMadhab = (profileObj) => {
    if (savedBdLoc && typeof savedBdLoc.lat === "number" && typeof savedBdLoc.lon === "number") {
      profileObj.regionCode = "BD";
      profileObj.subRegion = "SOUTH_ASIA";
      profileObj.lat = savedBdLoc.lat;
      profileObj.lon = savedBdLoc.lon;
      profileObj.tzHours = 6.0;
      profileObj.fajrAngle = 18.0;
      profileObj.ishaAngle = 18.0;
      profileObj.ishaFixedMins = 0;
      profileObj.asrShadowFactor = 2;
      profileObj.bdLocationMeta = savedBdLoc;
      profileObj.geoSource = "BD_ZILA_UPAZILA_SELECTOR";
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

  // Tier 0: Explicit Bangladesh Division -> District (64 Zilas) -> Upazila/Thana User Selection (BD_SELECTED_LOC_STORAGE_KEY)
  if (savedBdLoc && typeof savedBdLoc.lat === "number" && typeof savedBdLoc.lon === "number") {
    const bdCustomProfile = {
      ...REGIONAL_PRAYER_PROFILES.bn,
      regionCode: "BD",
      subRegion: "SOUTH_ASIA",
      lat: savedBdLoc.lat,
      lon: savedBdLoc.lon,
      tzHours: 6.0,
      fajrAngle: 18.0,
      ishaAngle: 18.0,
      ishaFixedMins: 0,
      asrShadowFactor: 2,
      bdLocationMeta: savedBdLoc
    };
    return finalizeProfileWithGpsAndMadhab(bdCustomProfile);
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
}


// ============================================================================
// MUSLIM BANGLA / MUSLIM'S DAY INDIVIDUAL CIRCULAR ICON & AVATAR REGISTRY
// Every single habit, Dua, and Waqt item is wrapped in its own circular logo
// ============================================================================
const HABIT_CIRCULAR_ICONS = deepFreeze({
  s24_01_waking_dua: { icon: "🌅", theme: "amber" },
  s24_02_miswak_wudu: { icon: "🪥", theme: "teal" },
  s24_03_tahajjud: { icon: "🌌", theme: "indigo" },
  s24_04_fajr_sunnah_fard: { icon: "🕌", theme: "emerald" },
  s24_05_post_fajr_barakah: { icon: "📖", theme: "gold" },
  s24_06_ishraq_reflection: { icon: "☀️", theme: "amber" },
  s24_07_home_exit_dua: { icon: "🚪", theme: "cyan" },
  s24_08_salat_duha: { icon: "✨", theme: "gold" },
  s24_09_halal_ihsan_work: { icon: "💼", theme: "emerald" },
  s24_10_tayammun_right: { icon: "🤚", theme: "teal" },
  s24_11_dhuhr_rawatib: { icon: "🕛", theme: "emerald" },
  s24_12_qaylulah_nap: { icon: "🛋️", theme: "purple" },
  s24_13_asr_prayer: { icon: "🌤️", theme: "amber" },
  s24_14_evening_adhkar: { icon: "🛡️", theme: "gold" },
  s24_15_maghrib_sunnah: { icon: "🌇", theme: "rose" },
  s24_16_family_silat_rahim: { icon: "🏡", theme: "emerald" },
  s24_17_isha_witr: { icon: "🌙", theme: "indigo" },
  s24_18_surah_mulk_baqarah: { icon: "📜", theme: "gold" },
  s24_19_sleep_wudu_dusting: { icon: "🛏️", theme: "teal" },
  s24_20_kursi_3quls: { icon: "🤲", theme: "emerald" },
  s24_21_tasbih_fatimah: { icon: "📿", theme: "gold" },
  s24_22_forgiving_before_sleep: { icon: "💚", theme: "emerald" },
  s24_23_one_third_stomach: { icon: "🍽️", theme: "amber" },
  s24_24_water_three_sips: { icon: "💧", theme: "cyan" },
  s24_25_tibb_nabawi_superfoods: { icon: "🍯", theme: "gold" },
  s24_26_fitrah_grooming: { icon: "🌸", theme: "teal" },
  s24_27_salam_smiling: { icon: "😊", theme: "emerald" },
  s24_28_guarding_tongue_anger: { icon: "🤐", theme: "purple" },
  s24_29_daily_sadaqah_istighfar: { icon: "🪙", theme: "gold" },
  s24_30_honoring_parents: { icon: "🤍", theme: "rose" },
  s24_31_mon_thu_fasting: { icon: "🌙", theme: "indigo" },
  s24_32_jumuah_kahf_salawat: { icon: "🕋", theme: "gold" }
});

const DUA_CIRCULAR_ICONS = deepFreeze({
  dua_01_kalimat_tammat: { icon: "🛡️", theme: "emerald" },
  dua_02_tahlil: { icon: "☝️", theme: "gold" },
  dua_03_sayyidul_istighfar: { icon: "💧", theme: "teal" },
  dua_04_bismillahi_la_yadurru: { icon: "🔰", theme: "emerald" },
  dua_05_hasbiyallah: { icon: "🤲", theme: "amber" },
  dua_06_afiyah_badan: { icon: "🌿", theme: "teal" },
  dua_07_afiyah_six_directions: { icon: "🕋", theme: "gold" },
  dua_08_raditu_billahi: { icon: "☪️", theme: "emerald" },
  dua_09_ya_hayyu_ya_qayyum: { icon: "✨", theme: "purple" },
  dua_10_subhanallahi_adada: { icon: "📿", theme: "gold" },
  dua_11_ilman_nafia: { icon: "📚", theme: "cyan" },
  dua_12_bika_asbahna_sleep: { icon: "🌅", theme: "amber" },
  dua_13_surah_hashr_last3: { icon: "🪽", theme: "gold" },
  dua_14_ayatul_kursi: { icon: "👑", theme: "emerald" },
  dua_15_baqarah_last2: { icon: "🌙", theme: "indigo" }
});

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

function formatRemainingDurationText(remainingMins, locale = appState.locale) {
  const safeMins = Math.max(1, Math.ceil(remainingMins));
  const hrs = Math.floor(safeMins / 60);
  const mins = safeMins % 60;

  if (locale === "bn") {
    if (hrs > 0 && mins > 0) {
      return `${localizeDigits(hrs, "bn")} ঘণ্টা ${localizeDigits(mins, "bn")} মিনিট বাকি`;
    }
    if (hrs > 0) {
      return `${localizeDigits(hrs, "bn")} ঘণ্টা বাকি`;
    }
    return `${localizeDigits(mins, "bn")} মিনিট বাকি`;
  }

  if (locale === "ar") {
    if (hrs > 0 && mins > 0) {
      return `متبقي ${localizeDigits(hrs, "ar")} س و ${localizeDigits(mins, "ar")} د`;
    }
    if (hrs > 0) {
      return `متبقي ${localizeDigits(hrs, "ar")} ساعة`;
    }
    return `متبقي ${localizeDigits(mins, "ar")} دقيقة`;
  }

  if (hrs > 0 && mins > 0) {
    return `${hrs} hr ${mins} min left`;
  }
  if (hrs > 0) {
    return `${hrs} hr left`;
  }
  return `${mins} min left`;
}

function renderFiveWaqtStrip(now = new Date()) {
  const gridEl = document.getElementById("five-waqt-grid");
  if (!gridEl) return;
  const sched = computeSeasonalPrayerSchedule(now);
  const nowMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const lang = appState.locale || "bn";
  const middayMeta = resolveMiddayWaqtMeta(now, lang);

  // Authentic Waqt End Boundaries:
  // - Fajr: Fajr start -> Sunrise
  // - Duha / Ishraq (Forenoon): Ishraq -> Zawal
  // - Dhuhr: Dhuhr start -> Asr start
  // - Asr: Asr start -> Sunset
  // - Maghrib: Maghrib start -> Isha start
  // - Isha: Isha start -> Fajr start (next day)
  const waqts = [
    {
      id: "fajr",
      name: t("waqt_fajr"),
      icon: "🌅",
      start: sched.fajr,
      end: sched.sunrise,
      phase: "tahajjud_fajr"
    },
    {
      id: "dhuhr",
      name: middayMeta.pillName,
      icon: middayMeta.pillIcon,
      start: sched.dhuhr,
      end: sched.asr,
      phase: "dhuhr_asr"
    },
    {
      id: "asr",
      name: t("waqt_asr"),
      icon: "🌤️",
      start: sched.asr,
      end: sched.sunset,
      phase: "dhuhr_asr"
    },
    {
      id: "maghrib",
      name: t("waqt_maghrib"),
      icon: "🌇",
      start: sched.maghrib,
      end: sched.isha,
      phase: "maghrib_isha"
    },
    {
      id: "isha",
      name: t("waqt_isha"),
      icon: "🌙",
      start: sched.isha,
      end: sched.fajr + 1440,
      phase: "maghrib_isha"
    }
  ];

  // Authentic 3 Prohibited Salah Windows (Sahih Muslim 831) synchronized with Live Waqt Bar:
  const pWindows = sched.prohibitedWindows || {
    sunrise: { start: sched.sunrise, end: sched.sunrise + 15 },
    zawal: { start: sched.zawal, end: sched.dhuhr },
    sunset: { start: sched.sunset - 15, end: sched.sunset }
  };

  // Update the Live Ongoing Waqt Progress Bar & Countdown (100% Non-Contradictory with Prohibited Salah Times!)
  const boxEl = document.getElementById("live-waqt-countdown-box");
  const titleEl = document.getElementById("live-waqt-title");
  const rangeEl = document.getElementById("live-waqt-range");
  const fillEl = document.getElementById("live-waqt-fill");
  const statusEl = document.getElementById("live-waqt-status-label");
  const remainingEl = document.getElementById("live-waqt-remaining");

  if (titleEl && rangeEl && fillEl && statusEl && remainingEl) {
    let activeWaqtTitle = "";
    let winStart = 0;
    let winEnd = 0;
    let currentPos = nowMins;
    let isProhibitedNow = false;
    let exactEndDisplay = false;
    let customStatusText = "";
    let customRangeText = "";
    let customRemainingText = "";
    let nightDualRowsHtml = "";

    // Common Card-in-Card (Mix of Style 1 Modern Typography & Style 3 Structured Inner-Card) CSS styles
    const innerCardStyle =
      "margin-top:10px;padding:10px 12px;background:var(--bg-card-elevated, rgba(16,185,129,0.06));border:1px solid rgba(16,185,129,0.24);border-radius:14px;display:flex;flex-direction:column;gap:5px;font-size:0.81rem;";
    const prohibitedInnerCardStyle =
      "margin-top:10px;padding:10px 12px;background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.34);border-radius:14px;display:flex;flex-direction:column;gap:4px;font-size:0.8rem;";

    if (nowMins >= sched.fajr && nowMins < pWindows.sunrise.start) {
      // 1. Fajr Fard Waqt + Prime Time (Al-Isfar) Card-in-Card
      activeWaqtTitle =
        lang === "bn"
          ? "ফজর (সুবহে সাদিক হতে সূর্যোদয় পর্যন্ত)"
          : lang === "ar"
          ? "الفجر (من الصبح الصادق حتى الشروق)"
          : "Fajr (Subh Sadiq until Sunrise)";
      winStart = sched.fajr;
      winEnd = pWindows.sunrise.start;

      const fajrStartClock = formatShortWaqtClock(sched.fajr, lang);
      const fajrEndClock = formatShortWaqtClock((pWindows.sunrise.start - 1 + 1440) % 1440, lang);
      const fajrPrimeEnd = Math.min(pWindows.sunrise.start - 5, sched.fajr + 38);
      const fajrPrimeClock = formatShortWaqtClock(fajrPrimeEnd, lang);
      const isPrimeActive = nowMins < fajrPrimeEnd;
      const minsLeftPrime = Math.max(1, fajrPrimeEnd - nowMins);
      const primeLeftStr = formatRemainingDurationText(minsLeftPrime, lang);

      nightDualRowsHtml = `
        <div id="live-tahajjud-subrow" style="${innerCardStyle}">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
            <span style="font-weight:800;color:var(--accent-emerald-dark);">
              🕌 ${
                lang === "bn"
                  ? `ফজরের উত্তম সময় (আল-ইসফার): ${fajrStartClock} - ${fajrPrimeClock}`
                  : lang === "ar"
                  ? `الوقت المختار للفجر (الإسفار): ${fajrStartClock} - ${fajrPrimeClock}`
                  : `Fajr Prime Time (Al-Isfar): ${fajrStartClock} - ${fajrPrimeClock}`
              }
            </span>
            ${
              isPrimeActive
                ? `<strong style="font-weight:900;color:var(--danger, #dc2626);background:rgba(220,38,38,0.09);padding:2px 9px;border-radius:999px;border:1px solid rgba(220,38,38,0.28);">${primeLeftStr}</strong>`
                : ""
            }
          </div>
          <div style="font-weight:700;font-size:0.77rem;color:${
            isPrimeActive ? "var(--text-muted)" : "var(--danger, #dc2626)"
          };">
            ${
              isPrimeActive
                ? lang === "bn"
                  ? `ফজরের ২ রাকাত সুন্নাত ফরজের পূর্বে আদায় করুন (ওয়াক্ত শেষ: ${fajrEndClock})`
                  : lang === "ar"
                  ? `ركعتا سنة الفجر قبل الفرض (ينتهي الفجر ${fajrEndClock})`
                  : `Pray 2 Rak'ah Fajr Sunnah before Fard (Ends ${fajrEndClock})`
                : lang === "bn"
                ? `উত্তম সময় সমাপ্ত (ফজর সূর্যোদয়ের পূর্ব ${fajrEndClock} পর্যন্ত জায়েয)`
                : lang === "ar"
                ? `انتهى الوقت المختار (الفجر ممتد حتى ${fajrEndClock})`
                : `Prime time ended (Fajr valid until ${fajrEndClock})`
            }
          </div>
        </div>
      `;
    } else if (nowMins >= pWindows.sunrise.start && nowMins < pWindows.sunrise.end) {
      // 2. Prohibited Window 1: Sunrise (15 mins) — Card-in-Card Warning UI
      activeWaqtTitle =
        lang === "bn"
          ? "⛔ নিষিদ্ধ সময়: সূর্যোদয় কাল"
          : lang === "ar"
          ? "⛔ وقت نهي: طلوع الشمس"
          : "⛔ Prohibited: Sunrise Window";
      winStart = pWindows.sunrise.start;
      winEnd = pWindows.sunrise.end;
      isProhibitedNow = true;
      exactEndDisplay = true;

      const ishraqStartClock = formatShortWaqtClock(pWindows.sunrise.end, lang);
      nightDualRowsHtml = `
        <div id="live-tahajjud-subrow" style="${prohibitedInnerCardStyle}">
          <div style="font-weight:800;color:var(--danger, #b91c1c);line-height:1.4;">
            ⚠️ ${
              lang === "bn"
                ? "এখন সূর্যোদয়ের নিষিদ্ধ সময় চলছে — সকল প্রকার নামাজ আদায় সম্পূর্ণ নিষিদ্ধ (সহীহ মুসলিম ৮৩১)"
                : lang === "ar"
                ? "وقت النهي عند طلوع الشمس جارٍ الآن — تحرم فيه الصلاة (صحيح مسلم ٨٣١)"
                : "Sunrise prohibited window active — all Salah is forbidden now (Sahih Muslim 831)"
            }
          </div>
          <div style="font-weight:700;font-size:0.76rem;color:var(--text-primary);">
            ${
              lang === "bn"
                ? `পরবর্তী বৈধ ওয়াক্ত: ইশরাক / চাশত (${ishraqStartClock})`
                : lang === "ar"
                ? `الوقت المباح القادم: الإشراق / الضحى (${ishraqStartClock})`
                : `Next Permitted Waqt: Ishraq / Duha (${ishraqStartClock})`
            }
          </div>
        </div>
      `;
    } else if (nowMins >= pWindows.sunrise.end && nowMins < pWindows.zawal.start) {
      // 3. Ishraq & Duha (Chasht) Permitted Window: after Sunrise prohibited end until Zawal start
      activeWaqtTitle =
        lang === "bn"
          ? "চাশত / ইশরাক (যাওয়ালের পূর্ব পর্যন্ত)"
          : lang === "ar"
          ? "وقت الإشراق والضحى (قبل الزوال)"
          : "Ishraq & Duha (Until Zawal)";
      winStart = pWindows.sunrise.end;
      winEnd = pWindows.zawal.start;

      const ishraqStartClock = formatShortWaqtClock(pWindows.sunrise.end, lang);
      const ishraqPrimeEnd = Math.min(pWindows.zawal.start - 15, pWindows.sunrise.end + 45);
      const ishraqPrimeClock = formatShortWaqtClock(ishraqPrimeEnd, lang);
      const zawalStartClock = formatShortWaqtClock(pWindows.zawal.start, lang);

      nightDualRowsHtml = `
        <div id="live-tahajjud-subrow" style="${innerCardStyle}">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
            <span style="font-weight:800;color:var(--accent-emerald-dark);">
              ☀️ ${
                lang === "bn"
                  ? `ইশরাকের উত্তম সময়: ${ishraqStartClock} - ${ishraqPrimeClock}`
                  : lang === "ar"
                  ? `وقت صلاة الإشراق المختار: ${ishraqStartClock} - ${ishraqPrimeClock}`
                  : `Ishraq Prime Window: ${ishraqStartClock} - ${ishraqPrimeClock}`
              }
            </span>
            <span style="font-weight:800;color:var(--accent-gold);font-size:0.76rem;">
              ${
                lang === "bn"
                  ? `দ্বিপ্রহর নিষিদ্ধ সময় শুরু: ${zawalStartClock}`
                  : lang === "ar"
                  ? `يبدأ وقت الزوال: ${zawalStartClock}`
                  : `Zawal Prohibited at: ${zawalStartClock}`
              }
            </span>
          </div>
        </div>
      `;
    } else if (nowMins >= pWindows.zawal.start && nowMins < pWindows.zawal.end) {
      // 4. Prohibited Window 2: Zawal / Solar Zenith — Card-in-Card Warning UI (Jumu'ah-Aware on Fridays)
      activeWaqtTitle =
        lang === "bn"
          ? "⛔ নিষিদ্ধ সময়: দ্বিপ্রহর / যাওয়াল"
          : lang === "ar"
          ? "⛔ وقت نهي: الزوال (الاستواء)"
          : "⛔ Prohibited: Zawal (Zenith)";
      winStart = pWindows.zawal.start;
      winEnd = pWindows.zawal.end;
      isProhibitedNow = true;
      exactEndDisplay = true;

      const dhuhrStartClock = formatShortWaqtClock(pWindows.zawal.end, lang);
      nightDualRowsHtml = `
        <div id="live-tahajjud-subrow" style="${prohibitedInnerCardStyle}">
          <div style="font-weight:800;color:var(--danger, #b91c1c);line-height:1.4;">
            ⚠️ ${middayMeta.zawalWaitWarning}
          </div>
          <div style="font-weight:700;font-size:0.76rem;color:var(--text-primary);">
            ${middayMeta.zawalNextWaqtLabel(dhuhrStartClock)}
          </div>
        </div>
      `;
    } else if (nowMins >= pWindows.zawal.end && nowMins < sched.asr) {
      // 5. Midday Fard Waqt: Automatically switches to Jumu'ah (জুমু'আ) on Fridays and Dhuhr (যোহর) on other days
      activeWaqtTitle = middayMeta.liveMainTitle;
      winStart = pWindows.zawal.end;
      winEnd = sched.asr;

      const dhuhrStartClock = formatShortWaqtClock(pWindows.zawal.end, lang);
      const dhuhrEndClock = formatShortWaqtClock((sched.asr - 1 + 1440) % 1440, lang);
      const dhuhrPrimeEnd = Math.min(sched.asr - 15, pWindows.zawal.end + 50);
      const dhuhrPrimeClock = formatShortWaqtClock(dhuhrPrimeEnd, lang);
      const isPrimeActive = nowMins < dhuhrPrimeEnd;
      const minsLeftPrime = Math.max(1, dhuhrPrimeEnd - nowMins);
      const primeLeftStr = formatRemainingDurationText(minsLeftPrime, lang);

      nightDualRowsHtml = `
        <div id="live-tahajjud-subrow" style="${innerCardStyle}">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
            <span style="font-weight:800;color:var(--accent-emerald-dark);">
              🕌 ${middayMeta.primeWindowLabel}: ${dhuhrStartClock} - ${dhuhrPrimeClock}
            </span>
            ${
              isPrimeActive
                ? `<strong style="font-weight:900;color:var(--danger, #dc2626);background:rgba(220,38,38,0.09);padding:2px 9px;border-radius:999px;border:1px solid rgba(220,38,38,0.28);">${primeLeftStr}</strong>`
                : ""
            }
          </div>
          <div style="font-weight:700;font-size:0.77rem;color:${
            isPrimeActive ? "var(--text-muted)" : "var(--danger, #dc2626)"
          };">
            ${
              isPrimeActive
                ? middayMeta.primeActiveSubtext(dhuhrEndClock)
                : middayMeta.primeEndedSubtext(dhuhrEndClock)
            }
          </div>
        </div>
      `;
    } else if (nowMins >= sched.asr && nowMins < pWindows.sunset.start) {
      // 6. Asr Fard Waqt + Prime Time (Fadhilah Window before Sun Yellowing) Card-in-Card
      const isHanafiActive = sched.profile && sched.profile.asrShadowFactor === 2;
      activeWaqtTitle = isHanafiActive
        ? lang === "bn"
          ? "আসর — হানাফী (দ্বিগুণ ছায়া হতে সূর্যাস্তের পূর্ব পর্যন্ত)"
          : lang === "ar"
          ? "العصر — حنفي (من مصير الظل مثليه حتى الغروب)"
          : "Asr — Hanafi (2x Shadow until Sunset)"
        : lang === "bn"
        ? "আসর — শাফিঈ/জমহুর (একগুণ ছায়া হতে সূর্যাস্তের পূর্ব পর্যন্ত)"
        : lang === "ar"
        ? "العصر — جمهور/شافعي (من مصير الظل مثله حتى الغروب)"
        : "Asr — Standard/Shafi'i (1x Shadow until Sunset)";
      winStart = sched.asr;
      winEnd = pWindows.sunset.start;

      const asrStartClock = formatShortWaqtClock(sched.asr, lang);
      const asrEndClock = formatShortWaqtClock((pWindows.sunset.start - 1 + 1440) % 1440, lang);
      const asrPrimeEnd = Math.max(sched.asr + 30, pWindows.sunset.start - 25);
      const asrPrimeClock = formatShortWaqtClock(asrPrimeEnd, lang);
      const isPrimeActive = nowMins < asrPrimeEnd;
      const minsLeftPrime = Math.max(1, asrPrimeEnd - nowMins);
      const primeLeftStr = formatRemainingDurationText(minsLeftPrime, lang);

      nightDualRowsHtml = `
        <div id="live-tahajjud-subrow" style="${innerCardStyle}">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
            <span style="font-weight:800;color:var(--accent-emerald-dark);">
              🕌 ${
                lang === "bn"
                  ? `আসরের উত্তম সময় (ফাদিলাহ): ${asrStartClock} - ${asrPrimeClock}`
                  : lang === "ar"
                  ? `الوقت المختار للعصر (قبل الاصفرار): ${asrStartClock} - ${asrPrimeClock}`
                  : `Asr Prime Time (Fadhilah): ${asrStartClock} - ${asrPrimeClock}`
              }
            </span>
            ${
              isPrimeActive
                ? `<strong style="font-weight:900;color:var(--danger, #dc2626);background:rgba(220,38,38,0.09);padding:2px 9px;border-radius:999px;border:1px solid rgba(220,38,38,0.28);">${primeLeftStr}</strong>`
                : ""
            }
          </div>
          <div style="font-weight:700;font-size:0.77rem;color:${
            isPrimeActive ? "var(--text-muted)" : "var(--danger, #dc2626)"
          };">
            ${
              isPrimeActive
                ? lang === "bn"
                  ? `আসরের ফাদিলাহ সময় চলমান • সূর্যাস্তের পূর্বে সন্ধ্যার আযকার পাঠ করুন`
                  : lang === "ar"
                  ? `وقت الفضيلة جارٍ • اقرأ أذكار المساء قبل الغروب`
                  : `Asr Fadhilah active • Recite Evening Adhkar before sunset`
                : lang === "bn"
                ? `ফাদিলাহ সময় সমাপ্ত — সূর্যাস্তের আগে নামায মাকরূহ, দ্রুত আদায় করুন (শেষ: ${asrEndClock})`
                : lang === "ar"
                ? `انتهى وقت الاختيار — بادر بالصلاة قبل الغروب (${asrEndClock})`
                : `Prime time ended — pray immediately before sunset (${asrEndClock})`
            }
          </div>
        </div>
      `;
    } else if (nowMins >= pWindows.sunset.start && nowMins < sched.maghrib) {
      // 7. Prohibited Window 3: Sunset / Ghurub (15 mins before sunset until Maghrib) — Card-in-Card Warning UI
      activeWaqtTitle =
        lang === "bn"
          ? "⛔ নিষিদ্ধ সময়: সূর্যাস্ত কাল"
          : lang === "ar"
          ? "⛔ وقت نهي: غروب الشمس"
          : "⛔ Prohibited: Sunset Window";
      winStart = pWindows.sunset.start;
      winEnd = sched.maghrib;
      isProhibitedNow = true;
      exactEndDisplay = true;

      const maghribStartClock = formatShortWaqtClock(sched.maghrib, lang);
      nightDualRowsHtml = `
        <div id="live-tahajjud-subrow" style="${prohibitedInnerCardStyle}">
          <div style="font-weight:800;color:var(--danger, #b91c1c);line-height:1.4;">
            ⚠️ ${
              lang === "bn"
                ? "সূর্যাস্তের নিষিদ্ধ সময় চলছে — মাগরিব শুরু হওয়া পর্যন্ত যেকোনো সালাত নিষিদ্ধ (সহীহ মুসলিম ৮৩১)"
                : lang === "ar"
                ? "وقت النهي عند غروب الشمس جارٍ الآن — تحرم الصلاة حتى تغرب (مسلم ٨٣١)"
                : "Sunset prohibited window active — Salah is forbidden until Maghrib (Sahih Muslim 831)"
            }
          </div>
          <div style="font-weight:700;font-size:0.76rem;color:var(--text-primary);">
            ${
              lang === "bn"
                ? `পরবর্তী ওয়াক্ত: মাগরিব (${maghribStartClock})`
                : lang === "ar"
                ? `الصلاة القادمة: المغرب (${maghribStartClock})`
                : `Next Waqt: Maghrib (${maghribStartClock})`
            }
          </div>
        </div>
      `;
    } else if (nowMins >= sched.maghrib && nowMins < sched.isha) {
      // 8. Maghrib Fard Waqt + Prime Time (Ta'jil) Card-in-Card
      activeWaqtTitle =
        lang === "bn"
          ? "মাগরিব (সূর্যাস্ত হতে সন্ধ্যার লাল আভা পর্যন্ত)"
          : lang === "ar"
          ? "المغرب (من الغروب حتى مغيب الشفق)"
          : "Maghrib (Sunset until Red Twilight Ends)";
      winStart = sched.maghrib;
      winEnd = sched.isha;

      const maghribStartClock = formatShortWaqtClock(sched.maghrib, lang);
      const maghribEndClock = formatShortWaqtClock((sched.isha - 1 + 1440) % 1440, lang);
      const maghribPrimeEnd = Math.min(sched.isha - 5, sched.maghrib + 25);
      const maghribPrimeClock = formatShortWaqtClock(maghribPrimeEnd, lang);
      const isPrimeActive = nowMins < maghribPrimeEnd;
      const minsLeftPrime = Math.max(1, maghribPrimeEnd - nowMins);
      const primeLeftStr = formatRemainingDurationText(minsLeftPrime, lang);

      nightDualRowsHtml = `
        <div id="live-tahajjud-subrow" style="${innerCardStyle}">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
            <span style="font-weight:800;color:var(--accent-emerald-dark);">
              🕌 ${
                lang === "bn"
                  ? `মাগরিবের উত্তম সময় (তা'জিল): ${maghribStartClock} - ${maghribPrimeClock}`
                  : lang === "ar"
                  ? `الوقت المختار للمغرب (التعجيل): ${maghribStartClock} - ${maghribPrimeClock}`
                  : `Maghrib Prime Time (Ta'jil): ${maghribStartClock} - ${maghribPrimeClock}`
              }
            </span>
            ${
              isPrimeActive
                ? `<strong style="font-weight:900;color:var(--danger, #dc2626);background:rgba(220,38,38,0.09);padding:2px 9px;border-radius:999px;border:1px solid rgba(220,38,38,0.28);">${primeLeftStr}</strong>`
                : ""
            }
          </div>
          <div style="font-weight:700;font-size:0.77rem;color:${
            isPrimeActive ? "var(--text-muted)" : "var(--danger, #dc2626)"
          };">
            ${
              isPrimeActive
                ? lang === "bn"
                  ? `তাৎক্ষণিক আদায়ের সময় ও ২ রাকাত সুন্নাত (মাগরিব ইশার পূর্ব ${maghribEndClock} পর্যন্ত জায়েয)`
                  : lang === "ar"
                  ? `وقت التعجيل وركعتا السنة (المغرب ممتد حتى ${maghribEndClock})`
                  : `Prompt prayer & 2 Rak'ah Sunnah (Maghrib valid until ${maghribEndClock})`
                : lang === "bn"
                ? `তা'জিল সময় সমাপ্ত (মাগরিব ইশার পূর্ব ${maghribEndClock} পর্যন্ত জায়েয)`
                : lang === "ar"
                ? `انتهى وقت التعجيل (المغرب ممتد حتى ${maghribEndClock})`
                : `Ta'jil window ended (Maghrib valid until ${maghribEndClock})`
            }
          </div>
        </div>
      `;
    } else {
      // 9. World-Standard Dual-Layer Night Architecture (Isha Whole Night + Tahajjud After 1st Third & Last Third)
      winStart = sched.isha;
      winEnd = sched.fajr + 1440;
      currentPos = nowMins < sched.fajr ? nowMins + 1440 : nowMins;
    }

    // Detect if we are currently inside the Night Isha + Tahajjud window
    const isNightIshaWindow = nowMins >= sched.isha || nowMins < sched.fajr;

    if (isNightIshaWindow) {
      const normFirstThirdEnd =
        sched.firstThirdEnd < sched.isha ? sched.firstThirdEnd + 1440 : sched.firstThirdEnd;
      const normLastThirdStart =
        sched.lastThirdStart < sched.isha ? sched.lastThirdStart + 1440 : sched.lastThirdStart;
      const fajrEndMinusOne = (sched.fajr - 1 + 1440) % 1440;

      const ishaStartClock = formatShortWaqtClock(sched.isha, lang);
      const fajrEndClock = formatShortWaqtClock(fajrEndMinusOne, lang);
      const firstThirdEndMinusOne = (sched.firstThirdEnd - 1 + 1440) % 1440;
      const firstThirdClock = formatShortWaqtClock(firstThirdEndMinusOne, lang);
      const tahajjudEarlyStartClock = formatShortWaqtClock(sched.firstThirdEnd, lang);
      const lastThirdClock = formatShortWaqtClock(sched.lastThirdStart, lang);

      activeWaqtTitle =
        lang === "bn"
          ? "ইশা (সারারাত ফজরের পূর্ব পর্যন্ত)"
          : lang === "ar"
          ? "العشاء (ممتد طوال الليل حتى الفجر)"
          : "Isha (Valid Whole Night Until Fajr)";
      customRangeText = `${ishaStartClock} - ${fajrEndClock}`;
      customStatusText =
        lang === "bn"
          ? "চলমান"
          : lang === "ar"
          ? "جارٍ الآن"
          : "Ongoing";

      if (currentPos < normFirstThirdEnd) {
        // Phase 9A: Prime 1st Third of the Night (Mustahabb Isha Window: Isha Start -> 1st Third End)
        const minsLeftInFirstThird = Math.max(1, normFirstThirdEnd - currentPos);
        const firstThirdLeftStr = formatRemainingDurationText(minsLeftInFirstThird, lang);
        const minsUntilTahajjudOpen = Math.max(1, normFirstThirdEnd - currentPos);
        const tahajjudStartsInStr = formatRemainingDurationText(minsUntilTahajjudOpen, lang);

        nightDualRowsHtml = `
          <div id="live-tahajjud-subrow" style="margin-top:10px;padding-top:9px;border-top:1px dashed rgba(16,185,129,0.28);display:flex;flex-direction:column;gap:8px;font-size:0.81rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
              <span style="font-weight:800;color:var(--accent-emerald-dark);">
                🕌 ${
                  lang === "bn"
                    ? `ইশার উত্তম সময় (১ম প্রহর): ${ishaStartClock} - ${firstThirdClock}`
                    : lang === "ar"
                    ? `الوقت المختار للعشاء (الثلث الأول): ${ishaStartClock} - ${firstThirdClock}`
                    : `Isha Prime Time (1st Third): ${ishaStartClock} - ${firstThirdClock}`
                }
              </span>
              <strong style="font-weight:900;color:var(--danger, #dc2626);background:rgba(220,38,38,0.09);padding:2px 9px;border-radius:999px;border:1px solid rgba(220,38,38,0.28);">
                ⏳ ${firstThirdLeftStr}
              </strong>
            </div>
            <div style="${innerCardStyle}margin-top:2px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                <span style="font-weight:800;color:var(--accent-emerald-dark);">
                  🌌 ${
                    lang === "bn"
                      ? `তাহাজ্জুদ / কিয়ামুল লাইল: ${tahajjudEarlyStartClock} - ${fajrEndClock}`
                      : lang === "ar"
                      ? `التهجد / قيام الليل: ${tahajjudEarlyStartClock} - ${fajrEndClock}`
                      : `Tahajjud / Qiyam al-Layl: ${tahajjudEarlyStartClock} - ${fajrEndClock}`
                  }
                </span>
                <strong style="font-weight:800;color:var(--accent-gold);">
                  ⏳ ${
                    lang === "bn"
                      ? `শুরু হতে ${tahajjudStartsInStr} (শ্রেষ্ঠ শেষ ১/৩: ${lastThirdClock})`
                      : lang === "ar"
                      ? `يبدأ بعد ${tahajjudStartsInStr} (الأفضل: ${lastThirdClock})`
                      : `Starts in ${tahajjudStartsInStr} (Best 1/3: ${lastThirdClock})`
                  }
                </strong>
              </div>
            </div>
          </div>
        `;
      } else if (currentPos >= normFirstThirdEnd && currentPos < normLastThirdStart) {
        // Phase 9B: After 1st Third of the Night — Prime 1/3rd Isha has finished! Card-in-Card Tahajjud Active
        const tahajjudTotal = Math.max(1, winEnd - normFirstThirdEnd);
        const tahajjudElapsed = Math.max(0, Math.min(tahajjudTotal, currentPos - normFirstThirdEnd));
        const tahajjudPct = Math.max(5, Math.min(100, Math.round((tahajjudElapsed / tahajjudTotal) * 100)));
        const tahajjudRemainingStr = formatRemainingDurationText(winEnd - currentPos, lang);

        nightDualRowsHtml = `
          <div id="live-tahajjud-subrow" style="margin-top:10px;padding-top:9px;border-top:1px dashed rgba(16,185,129,0.28);display:flex;flex-direction:column;gap:8px;font-size:0.81rem;">
            <div style="display:flex;flex-direction:column;gap:2px;">
              <span style="font-weight:800;color:var(--text-primary);">
                🕌 ${
                  lang === "bn"
                    ? `ইশার উত্তম সময় (১ম প্রহর): ${ishaStartClock} - ${firstThirdClock}`
                    : lang === "ar"
                    ? `الوقت المختار للعشاء (الثلث الأول): ${ishaStartClock} - ${firstThirdClock}`
                    : `Isha Prime Time (1st Third): ${ishaStartClock} - ${firstThirdClock}`
                }
              </span>
              <strong style="font-weight:800;color:var(--danger, #dc2626);font-size:0.79rem;">
                ${
                  lang === "bn"
                    ? "১ম প্রহর সমাপ্ত (ইশা ফজর পর্যন্ত জায়েয)"
                    : lang === "ar"
                    ? "انتهى الثلث الأول (العشاء ممتد للفجر)"
                    : "1st Third Ended (Valid till Fajr)"
                }
              </strong>
            </div>
            <div style="${innerCardStyle}margin-top:2px;">
              <div class="live-waqt-top-row" style="margin-bottom:5px;">
                <strong style="font-size:0.9rem;font-weight:900;color:var(--accent-emerald-dark);">
                  🌌 ${
                    lang === "bn"
                      ? "তাহাজ্জুদ / কিয়ামুল লাইল"
                      : lang === "ar"
                      ? "صلاة التهجد / قيام الليل"
                      : "Tahajjud / Qiyam al-Layl"
                  }
                </strong>
                <span class="live-waqt-range" style="font-size:0.86rem;">
                  ${tahajjudEarlyStartClock} - ${fajrEndClock}
                </span>
              </div>
              <div class="live-waqt-track" style="height:9px;margin-bottom:6px;">
                <div class="live-waqt-fill" style="width:${tahajjudPct}%;background:linear-gradient(90deg,#0d9488,#10b981);"></div>
              </div>
              <div class="live-waqt-bottom-row" style="font-size:0.78rem;">
                <span class="live-waqt-running">
                  <span class="live-waqt-dot"></span>
                  <span>${
                    lang === "bn"
                      ? `চলমান (শ্রেষ্ঠ শেষ ১/৩ প্রহর শুরু: ${lastThirdClock})`
                      : lang === "ar"
                      ? `جارٍ الآن (يبدأ الثلث الأخير الأفضل: ${lastThirdClock})`
                      : `Ongoing (Golden Last 1/3 starts: ${lastThirdClock})`
                  }</span>
                </span>
                <strong style="color:var(--danger, #dc2626);font-weight:900;">${tahajjudRemainingStr}</strong>
              </div>
            </div>
          </div>
        `;
      } else {
        // Phase 9C: Last Third of the Night (Al-Thuluth al-Akhir — Golden Tahajjud Window + Isha Whole Night before Fajr)
        const lastThirdTotal = Math.max(1, winEnd - normLastThirdStart);
        const lastThirdElapsed = Math.max(0, Math.min(lastThirdTotal, currentPos - normLastThirdStart));
        const lastThirdPct = Math.max(6, Math.min(100, Math.round((lastThirdElapsed / lastThirdTotal) * 100)));
        const tahajjudRemainingStr = formatRemainingDurationText(winEnd - currentPos, lang);

        nightDualRowsHtml = `
          <div id="live-tahajjud-subrow" style="margin-top:10px;padding-top:9px;border-top:1px dashed rgba(16,185,129,0.28);display:flex;flex-direction:column;gap:8px;font-size:0.81rem;">
            <div style="display:flex;flex-direction:column;gap:2px;">
              <span style="font-weight:800;color:var(--text-primary);">
                🕌 ${
                  lang === "bn"
                    ? `ইশার উত্তম সময় (১ম প্রহর): ${ishaStartClock} - ${firstThirdClock}`
                    : lang === "ar"
                    ? `الوقت المختار للعشاء (الثلث الأول): ${ishaStartClock} - ${firstThirdClock}`
                    : `Isha Prime Time (1st Third): ${ishaStartClock} - ${firstThirdClock}`
                }
              </span>
              <strong style="font-weight:800;color:var(--danger, #dc2626);font-size:0.79rem;">
                ${
                  lang === "bn"
                    ? "১ম প্রহর সমাপ্ত (ইশা ফজর পর্যন্ত জায়েয)"
                    : lang === "ar"
                    ? "انتهى الثلث الأول (العشاء ممتد للفجر)"
                    : "1st Third Ended (Valid till Fajr)"
                }
              </strong>
            </div>
            <div style="${innerCardStyle}margin-top:2px;">
              <div class="live-waqt-top-row" style="margin-bottom:5px;">
                <strong style="font-size:0.9rem;font-weight:900;color:var(--accent-emerald-dark);">
                  🌌 ${
                    lang === "bn"
                      ? "তাহাজ্জুদ — রাতের শেষ তৃতীয়াংশ (শ্রেষ্ঠ সময়)"
                      : lang === "ar"
                      ? "التهجد — الثلث الأخير من الليل (أفضل الوقت)"
                      : "Tahajjud — Golden Last Third of Night"
                  }
                </strong>
                <span class="live-waqt-range" style="font-size:0.86rem;">
                  ${lastThirdClock} - ${fajrEndClock}
                </span>
              </div>
              <div class="live-waqt-track" style="height:9px;margin-bottom:6px;">
                <div class="live-waqt-fill" style="width:${lastThirdPct}%;background:linear-gradient(90deg,#10b981,#eab308);"></div>
              </div>
              <div class="live-waqt-bottom-row" style="font-size:0.78rem;">
                <span class="live-waqt-running">
                  <span class="live-waqt-dot"></span>
                  <span>${
                    lang === "bn"
                      ? `চলমান (১ম প্রহর শেষে শুরু: ${tahajjudEarlyStartClock})`
                      : lang === "ar"
                      ? `جارٍ الآن (بدأ بعد الثلث الأول: ${tahajjudEarlyStartClock})`
                      : `Ongoing (Opened after 1st 1/3 at ${tahajjudEarlyStartClock})`
                  }</span>
                </span>
                <strong style="color:var(--danger, #dc2626);font-weight:900;">${tahajjudRemainingStr}</strong>
              </div>
            </div>
          </div>
        `;
      }
    }

    const totalDuration = Math.max(1, winEnd - winStart);
    const elapsed = Math.max(0, Math.min(totalDuration, currentPos - winStart));
    const remaining = Math.max(0, winEnd - currentPos);
    const pct = Math.max(4, Math.min(100, Math.round((elapsed / totalDuration) * 100)));

    // For permitted prayer windows, display end time minus 1 minute (e.g., 06:22 - 11:37 before Zawal at 11:38)
    // so there is ZERO overlap with prohibited times! For prohibited windows, display exact start-end (e.g. 06:07 - 06:22).
    const displayEndMins = exactEndDisplay
      ? winEnd % 1440
      : (winEnd - 1 + 1440) % 1440;

    titleEl.textContent = activeWaqtTitle;
    rangeEl.textContent =
      customRangeText ||
      `${formatShortWaqtClock(winStart, lang)} - ${formatShortWaqtClock(displayEndMins, lang)}`;
    fillEl.style.width = `${pct}%`;

    if (boxEl) {
      boxEl.classList.toggle("waqt-prohibited-active", isProhibitedNow);
      const existingSubRow = document.getElementById("live-tahajjud-subrow");
      if (existingSubRow) existingSubRow.remove();
      if (nightDualRowsHtml) {
        boxEl.insertAdjacentHTML("beforeend", nightDualRowsHtml);
      }
    }

    if (isProhibitedNow) {
      statusEl.textContent =
        lang === "ar"
          ? "صلاة النافلة ممنوعة الآن"
          : lang === "en"
          ? "Salah Prohibited"
          : "সালাত নিষিদ্ধ";
    } else if (customStatusText) {
      statusEl.textContent = customStatusText;
    } else {
      statusEl.textContent =
        lang === "ar" ? "جارٍ الآن" : lang === "en" ? "Ongoing" : "চলমান";
    }
    remainingEl.textContent =
      customRemainingText || formatRemainingDurationText(remaining, lang);
    remainingEl.style.color = "var(--danger, #dc2626)";
  }

  gridEl.innerHTML = waqts
    .map((w) => {
      // Ensure Asr pill ends at pWindows.sunset.start so it doesn't conflict with Sunset prohibited time
      const effectiveEnd = w.id === "asr" ? pWindows.sunset.start : w.end;
      const isActive =
        w.id === "isha"
          ? nowMins >= w.start || nowMins < sched.fajr
          : nowMins >= w.start && nowMins < effectiveEnd;
      const isPassed = w.id !== "isha" && nowMins >= effectiveEnd && nowMins >= sched.fajr;
      return `
        <button type="button" class="waqt-pill-card ${isActive ? "waqt-active" : ""} ${isPassed ? "waqt-passed" : ""}" data-waqt-phase="${w.phase}">
          <div class="waqt-circle-logo">${w.icon}</div>
          <span class="waqt-name">${w.name}</span>
          <strong class="waqt-time">${formatShortWaqtClock(w.start, lang)}</strong>
        </button>
      `;
    })
    .join("");
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
  renderDiaryHistory();
  updateIntegrityUI(true);
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
            <span class="habit-time">${getHabitTime(habit)}</span>
            ${statusBadgeHtml}
          </div>
          <h4>${getHabitTitle(habit)}</h4>
          <p class="habit-snippet">${getHabitWisdom(habit)}</p>
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

// ============================================================================
// NATIVE SUNNAH 24 7-PHASE GRAPH ENGINE (WEEKLY, MONTHLY, 90D, 180D, 365D)
// Uses our own 7 Native APK Phases:
// ১. তাহাজ্জুদ ও ফজর (tahajjud_fajr)
// ২. সকাল ও কর্মক্ষেত্র (duha_work)
// ৩. যোহর, কাইলুলা ও আসর (dhuhr_asr)
// ৪. মাগরিব ও ইশা (maghrib_isha)
// ৫. সুন্নাহ সম্মত ঘুম (sleep_sunnah)
// ৬. তিব্বে নববী ও ফিতরাত (diet_hygiene)
// ৭. আখলাক ও সুন্নাহ দিবস (character_social)
// ============================================================================
const CATEGORY_GRAPH_DEFINITIONS = deepFreeze([
  {
    id: "tahajjud_fajr",
    phaseKey: "tahajjud_fajr",
    titleKey: "phase_tahajjud",
    barColor: "#0d7a49",
    bgSoft: "#e2f2ea",
    svgIcon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0d7a49" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L4 9h16L12 3z"/><path d="M6 9v8M10 9v8M14 9v8M18 9v8"/><path d="M3 17h18M2 20h20"/></svg>`,
    includeMorningDuas: true
  },
  {
    id: "duha_work",
    phaseKey: "duha_work",
    titleKey: "phase_duha",
    barColor: "#0e8074",
    bgSoft: "#dff2f0",
    svgIcon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0e8074" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
  },
  {
    id: "dhuhr_asr",
    phaseKey: "dhuhr_asr",
    titleKey: "phase_dhuhr",
    barColor: "#c2780e",
    bgSoft: "#f9eedb",
    svgIcon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#c2780e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 8.5c-1.2-1.2-3-.5-3 1.2 0 1.5 3 3.3 3 3.3s3-1.8 3-3.3c0-1.7-1.8-2.4-3-1.2z"/><line x1="8" y1="17" x2="16" y2="17"/></svg>`,
    includeEveningDuas: true
  },
  {
    id: "maghrib_isha",
    phaseKey: "maghrib_isha",
    titleKey: "phase_maghrib",
    barColor: "#4f46e5",
    bgSoft: "#e8e8f8",
    svgIcon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
  },
  {
    id: "sleep_sunnah",
    phaseKey: "sleep_sunnah",
    titleKey: "phase_sleep",
    barColor: "#3b8728",
    bgSoft: "#e5f3e1",
    svgIcon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3b8728" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"/><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><line x1="3" y1="16" x2="21" y2="16"/></svg>`
  },
  {
    id: "diet_hygiene",
    phaseKey: "diet_hygiene",
    titleKey: "phase_diet",
    barColor: "#cb443b",
    bgSoft: "#fae5e3",
    svgIcon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#cb443b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`
  },
  {
    id: "character_social",
    phaseKey: "character_social",
    titleKey: "phase_character",
    barColor: "#9c6d12",
    bgSoft: "#f8eedc",
    svgIcon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#9c6d12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5c-1.4-1.4-3.5-.6-3.5 1.4 0 1.8 3.5 3.8 3.5 3.8s3.5-2 3.5-3.8c0-2-2.1-2.8-3.5-1.4z"/><path d="M3 16l4-2h6l3 2h5l-4 4H8l-5-4z"/></svg>`
  }
]);

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

    const perDayTarget = Math.max(1, phaseHabitIds.length);
    const totalPossible = Math.max(1, perDayTarget * numDays);
    let totalCompleted = 0;

    activeDateKeys.forEach((dKey) => {
      const completedH = appState.completionsByDate[dKey] || [];
      phaseHabitIds.forEach((hId) => {
        if (completedH.includes(hId)) totalCompleted++;
      });
    });

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
      .map((h) => `<div class="compact-history-item">✓ ${getHabitTitle(h)}</div>`)
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


function getLocalizedMoodLabel(moodCode) {
  if (!moodCode) return t("mood_khushu");
  if (moodCode.includes("Khushu")) return t("mood_khushu");
  if (moodCode.includes("Shukr")) return t("mood_shukr");
  if (moodCode.includes("Sabr")) return t("mood_sabr");
  if (moodCode.includes("Tawbah")) return t("mood_tawbah");
  return moodCode;
}

function renderDiaryHistory() {
  const listEl = document.getElementById("diary-history-list");
  if (!listEl) return;
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
      <h4>📅 ${localizeDigits(entry.date, appState.locale)} — ${getLocalizedMoodLabel(entry.mood)}</h4>
      <p><strong>${t("diary_lbl_shukr")}</strong> ${entry.gratitude}</p>
      <p><strong>${t("diary_lbl_tawbah")}</strong> ${entry.shortcoming}</p>
      <p><strong>${t("diary_lbl_niyyah")}</strong> ${entry.niyyah}</p>
      <small style="color:#059669;font-size:0.68rem;font-weight:700;">SHA-256: ${(entry.entryHash || "").slice(0, 28)}...</small>
    `;
    listEl.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadAndVerifyState();
  initXStyleAutoGeographicDetector();
  applyLanguageToDOM();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  // Automatic Real-Time Waqt Lock, Live Prayer Progress Bar & Midnight Rollover Watcher (Refreshes every 15s)
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

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTabProgrammatically(btn.dataset.tab, true);
    });
  });

  document.getElementById("reset-today-btn").addEventListener("click", async () => {
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

  document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("fact-modal").classList.add("hidden");
  });

  
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
      await saveAndSealState();
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

  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mood-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedMood = btn.dataset.mood;
    });
  });

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

  document.getElementById("add-custom-habit-btn").addEventListener("click", async () => {
    const title = document.getElementById("custom-title").value.trim();
    const phase = document.getElementById("custom-phase").value;
    const fact = document.getElementById("custom-fact").value.trim();
    if (!title) return;

    appState.customHabits.push({
      id: "s24_custom_" + Date.now(),
      isCustom: true,
      phase,
      title,
      title_bn: title,
      title_ar: title,
      customFact: fact
    });

    document.getElementById("custom-title").value = "";
    document.getElementById("custom-fact").value = "";
    await saveAndSealState();
    renderHabits();
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
        const expectedSig = await computeSHA256(getCanonicalStatePayload(imported));
        if (expectedSig !== imported.signature) {
          updateIntegrityUI(false);
          alert(t("alert_tamper"));
          e.target.value = "";
          return;
        }
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
let navTabStack = ["tab-routine"];
let tabScrollPositions = { "tab-routine": 0 };
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

// Computes the exact viewport anchor offset so opening a non-Routine section
// (Adhkar, Muhasabah, Vault & Info) for the first time brings the user slightly
// down directly into that section's content card instead of jumping to the very top.
function computeSectionFocusScrollOffset(targetTabId) {
  if (!targetTabId || targetTabId === "tab-routine") return 0;
  const headerEl = document.querySelector(".app-header");
  const tabNavEl = document.querySelector(".tab-nav");
  const targetSectionEl = document.getElementById(targetTabId);
  const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 58;

  if (tabNavEl) {
    const navRect = tabNavEl.getBoundingClientRect();
    const absoluteNavTop = (window.scrollY || window.pageYOffset || 0) + navRect.top;
    return Math.max(0, Math.round(absoluteNavTop - headerHeight - 6));
  }
  if (targetSectionEl) {
    const secRect = targetSectionEl.getBoundingClientRect();
    const absoluteSecTop = (window.scrollY || window.pageYOffset || 0) + secRect.top;
    return Math.max(0, Math.round(absoluteSecTop - headerHeight - 12));
  }
  return 0;
}

function switchTabProgrammatically(targetTabId, recordInStack = true) {
  const currentActiveBtn = document.querySelector(".tab-btn.active");
  if (currentActiveBtn) {
    tabScrollPositions[currentActiveBtn.dataset.tab] = window.scrollY || window.pageYOffset || 0;
  }

  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === targetTabId);
  });
  document.querySelectorAll(".tab-content").forEach((c) => {
    c.classList.toggle("active", c.id === targetTabId);
  });

  if (recordInStack && navTabStack[navTabStack.length - 1] !== targetTabId) {
    navTabStack.push(targetTabId);
    pushAppHistoryState(targetTabId);
  }

  requestAnimationFrame(() => {
    const hasSavedPosition =
      Object.prototype.hasOwnProperty.call(tabScrollPositions, targetTabId) &&
      tabScrollPositions[targetTabId] > 0;

    if (hasSavedPosition) {
      window.scrollTo({ top: tabScrollPositions[targetTabId], behavior: "instant" });
    } else if (targetTabId !== "tab-routine") {
      const focusOffset = computeSectionFocusScrollOffset(targetTabId);
      tabScrollPositions[targetTabId] = focusOffset;
      window.scrollTo({ top: focusOffset, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  });
}

// Global handler invoked by both Android Native Back Button & Browser popstate
// Strictly preserves section scroll positions during navigation and lets the user
// exit upon clicking back twice from any scroll position without auto-scrolling to top.
window.handleSunnahBackNavigation = function () {
  // 1. If Fact / History Modal is open -> Close modal first (stay at exact scroll position)
  const modal = document.getElementById("fact-modal");
  if (modal && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
    return true;
  }

  // 2. If Header Location Popover is open -> Close popover first
  const locPanel = document.getElementById("bd-loc-cascading-panel");
  const locToggleBtn = document.getElementById("bd-loc-toggle-btn");
  if (locPanel && locPanel.classList.contains("is-open")) {
    locPanel.classList.remove("is-open");
    if (locToggleBtn) locToggleBtn.setAttribute("aria-expanded", "false");
    return true;
  }

  // 3. If a Phase Filter Chip (other than "all") is active on Routine tab -> Reset to "All 24H" without scrolling to top
  const activeTab = document.querySelector(".tab-content.active")?.id;
  if (activeTab === "tab-routine" && activePhase !== "all") {
    activePhase = "all";
    document.querySelectorAll(".filter-bar .chip").forEach((c) => {
      c.classList.toggle("active", c.dataset.phase === "all");
    });
    renderHabits();
    return true;
  }

  // 4. If user navigated across tabs (Adhkar, Muhasabah, Vault, Routine) -> Return directly to the previous section with its exact saved scroll position
  if (navTabStack.length > 1) {
    navTabStack.pop(); // remove current section
    const prevTab = navTabStack[navTabStack.length - 1] || "tab-routine";
    switchTabProgrammatically(prevTab, false);
    return true;
  }

  if (activeTab && activeTab !== "tab-routine") {
    switchTabProgrammatically("tab-routine", false);
    return true;
  }

  // 5. On the root section -> Require double back-press within 2s to exit from any position (no auto-scroll to top)
  const now = Date.now();
  if (now - lastBackTapTime < 2000) {
    return false; // Allow native APK exit on second tap from current position
  }
  lastBackTapTime = now;
  showExitToast();
  pushAppHistoryState("root-guard");
  return true;
};

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
// SNAPTUBE-STYLE IN-APP APK UPDATE ENGINE (PLAY-PROTECT SAFE • v4.2)
// ============================================================================
let latestRemoteApkUrl = "";
let latestRemoteVersionTag = "";

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
  const existing = document.getElementById("s24-update-banner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "s24-update-banner";
  banner.className = "update-banner-card";
  banner.setAttribute("data-cached", isAlreadyOnDevice ? "true" : "false");

  const msgText =
    appState.locale === "ar"
      ? `✨ تحديث جديد (${newVersion}) متاح لتطبيق سنة ٢٤!`
      : appState.locale === "en"
      ? `✨ Update (${newVersion}) Available for Sunnah 24!`
      : `✨ সুন্নাহ ২৪-এর নতুন আপডেট (${newVersion}) প্রস্তুত!`;

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

    // 1. If already downloaded -> Immediately trigger native package installer
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

    // 2. Download in-app via DownloadManager & auto-launch installer at 100%
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

    // 3. Fallback for older APK bridges
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
  setTimeout(() => initInAppUpdateChecker(false), 2500);

  const splash = document.getElementById("s24-startup-splash");
  if (splash) {
    setTimeout(() => {
      splash.classList.add("splash-hidden");
      setTimeout(() => splash.remove(), 450);
    }, 550);
  }
});



// ============================================================================
// STANDALONE STATIC PROHIBITED TIME FOR SALAH ENGINE (SAHIH MUSLIM 831)
// Automatically computes and displays the 3 daily seasonal prohibited prayer
// windows (Sunrise, Midday Zenith/Zawal, Sunset) from computeSeasonalPrayerSchedule()
// along with the warning box and Sahih Muslim 831 Hadith proof—without redundant
// active-window alerts (since Live Ongoing Prayers already handles live states).
// ============================================================================
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
// MUSLIM BANGLA / MUSLIM'S DAY 5-WAQT STRIP INTERACTION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  const waqtGrid = document.getElementById("five-waqt-grid");
  if (waqtGrid) {
    waqtGrid.addEventListener("click", (e) => {
      const pill = e.target.closest("[data-waqt-phase]");
      if (!pill) return;
      const phase = pill.getAttribute("data-waqt-phase");
      switchTabProgrammatically("tab-routine", true);
      activePhase = phase;
      document.querySelectorAll(".filter-bar .chip").forEach((c) => {
        c.classList.toggle("active", c.dataset.phase === phase);
      });
      renderHabits();
      if (navigator.vibrate) navigator.vibrate(12);
    });
  }
});


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
  // Always keep clean Commercial White ('light') theme locked
  document.documentElement.setAttribute("data-theme", "light");
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", "#ffffff");

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
  syncMadhabToggleUI();

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

function injectBdLocationSelectorStyles() {
  if (document.getElementById("s24-bd-loc-selector-styles")) return;
  const styleEl = document.createElement("style");
  styleEl.id = "s24-bd-loc-selector-styles";
  styleEl.textContent = `
    .header-madhab-loc-stack {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 4px;
    }
    .header-loc-pill-btn {
      background: #f4fbf7;
      color: var(--accent-emerald-dark, #065f46);
      border: 1.5px solid rgba(16, 185, 129, 0.42);
      padding: 3.5px 9px;
      border-radius: 999px;
      font-size: 0.66rem;
      font-weight: 800;
      font-family: inherit;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(15, 45, 34, 0.08);
      transition: transform 0.16s ease, background 0.2s ease, border-color 0.2s ease;
      white-space: nowrap;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header-loc-pill-btn:hover {
      background: #e6f7ef;
      border-color: var(--accent-emerald, #10b981);
    }
    .header-loc-pill-btn:active {
      transform: scale(0.95);
    }
    .header-loc-popover {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: min(305px, calc(100vw - 24px));
      background: #ffffff;
      border: 1.5px solid rgba(16, 185, 129, 0.38);
      border-radius: 18px;
      padding: 12px;
      box-shadow: 0 18px 40px rgba(15, 45, 34, 0.22), 0 4px 12px rgba(15, 45, 34, 0.08);
      z-index: 220;
      display: none;
      flex-direction: column;
      gap: 9px;
      animation: locPopIn 0.18s cubic-bezier(0.22, 1, 0.36, 1);
    }
    html[dir="rtl"] .header-loc-popover {
      right: auto;
      left: 0;
    }
    @keyframes locPopIn {
      from { opacity: 0; transform: translateY(-6px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .header-loc-popover.is-open {
      display: flex;
    }
    .bd-loc-popover-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      padding-bottom: 6px;
      border-bottom: 1px dashed rgba(16, 185, 129, 0.25);
    }
    .bd-loc-popover-title {
      font-size: 0.74rem;
      font-weight: 900;
      color: var(--accent-emerald-dark, #065f46);
    }
    .bd-loc-coords-pill {
      font-size: 0.63rem;
      font-weight: 800;
      color: var(--accent-gold, #b45309);
      background: var(--accent-gold-soft, #fef3c7);
      border: 1px solid rgba(180, 83, 9, 0.25);
      padding: 2px 7px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .bd-loc-selects-grid {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .bd-loc-field {
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: left;
    }
    html[dir="rtl"] .bd-loc-field {
      text-align: right;
    }
    .bd-loc-field label {
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--text-muted, #5b7268);
      padding-left: 2px;
    }
    .bd-loc-select {
      width: 100%;
      background: #f8fbf9;
      color: var(--text-primary, #1e352b);
      border: 1.2px solid rgba(16, 185, 129, 0.35);
      border-radius: 10px;
      padding: 7px 9px;
      font-size: 0.76rem;
      font-weight: 700;
      font-family: inherit;
      outline: none;
      cursor: pointer;
    }
    .bd-loc-select:focus {
      border-color: var(--accent-emerald, #10b981);
      background: #ffffff;
    }
    .bd-loc-actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding-top: 4px;
    }
    .bd-loc-auto-btn {
      background: #f3f8f5;
      color: var(--text-muted, #5b7268);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 999px;
      padding: 5px 11px;
      font-size: 0.68rem;
      font-weight: 800;
      cursor: pointer;
      font-family: inherit;
    }
    .bd-loc-done-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      border-radius: 999px;
      padding: 5px 14px;
      font-size: 0.7rem;
      font-weight: 800;
      cursor: pointer;
      font-family: inherit;
      box-shadow: 0 3px 10px rgba(16, 185, 129, 0.25);
    }
  `;
  document.head.appendChild(styleEl);
}

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
        ? "📍 دكا ▾"
        : lang === "en"
        ? "📍 Dhaka ▾"
        : "📍 ঢাকা ▾";
  } else {
    const distShort = getLocalizedBdDistrictName(distObj, lang);
    const upzShort = getLocalizedUpazilaName(activeLoc.upazilaName, lang);
    // Keep header pill super clean and concise
    if (!upzShort || upzShort === distShort || upzShort.includes("সদর") || upzShort.toLowerCase().includes("sadar")) {
      summaryLabelEl.textContent = `📍 ${distShort} ▾`;
    } else {
      summaryLabelEl.textContent = `📍 ${upzShort}, ${distShort} ▾`;
    }
  }

  if (coordsPillEl) {
    coordsPillEl.textContent = `${localizeDigits(activeLoc.lat.toFixed(2), lang)}°N, ${localizeDigits(activeLoc.lon.toFixed(2), lang)}°E`;
  }
  if (popTitleEl) {
    popTitleEl.textContent =
      lang === "ar"
        ? "📍 اختر الموقع (دكا افتراضياً)"
        : lang === "en"
        ? "📍 Select Location (Dhaka Default)"
        : "📍 অবস্থান নির্বাচন (ঢাকা ডিফল্ট)";
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
  injectBdLocationSelectorStyles();

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

  if (toggleBtn && panelEl) {
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


