/**
 * SUNNAH 24 — ENTERPRISE PROPHETIC 24-HOUR LIFESTYLE & HABIT TRACKER (v3.5)
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
    vault_archive_title: "🗓️ দীর্ঘমেয়াদী সুন্নাহ আর্কাইভ (৬ মাস / ১৮০ দিন)",
    vault_archive_sub: "আপনার বিগত কয়েক মাসের সকল দিনের রেকর্ড ডিভাইসে স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে।",
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
    tasbih_options: [
      { target: 33, label: "সুবহানাল্লাহ (আল্লাহ পবিত্র ও মহান)", text: "সুবহানাল্লাহ — ৩৩ বার" },
      { target: 33, label: "আলহামদুলিল্লাহ (সকল প্রশংসা আল্লাহর)", text: "আলহামদুলিল্লাহ — ৩৩ বার" },
      { target: 34, label: "আল্লাহু আকবার (আল্লাহ সর্বশ্রেষ্ঠ)", text: "আল্লাহু আকবার — ৩৪ বার" },
      { target: 100, label: "আস্তাগফিরুল্লাহ ওয়া আতুবু ইলাইহি", text: "আস্তাগফিরুল্লাহ ওয়া আতুবু ইলাইহি — ১০০ বার" },
      { target: 100, label: "সুবহানাল্লাহি ওয়া বিহামদিহি", text: "সুবহানাল্লাহি ওয়া বিহামদিহি — ১০০ বার" },
      { target: 10, label: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ ﷺ", text: "নবীজি ﷺ-এর ওপর দরূদ পাঠ — ১০ বার" },
      { target: 100, label: "লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু", text: "দৈনিক তাহলীল দুর্গ — ১০০ বার" },
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
    tab_routine: "🕒 جدول ٢٤ ساعة",
    tab_adhkar: "📿 الأذكار والسبحة",
    tab_diary: "📖 المحاسبة اليومية",
    tab_vault: "🔐 الخزنة والمعلومات",
    search_placeholder: "🔍 ابحث في ٣٢ سنة نبوية، حديث، دعاء أو حكمة...",
    phase_all: "كل ٢٤ ساعة",
    phase_tahajjud: "🌌 التهجد والفجر",
    phase_duha: "☀️ الضحى والعمل",
    phase_dhuhr: "🌤️ الظهر والقيلولة والعصر",
    phase_maghrib: "🌆 المغرب والعشاء",
    phase_sleep: "🛌 سنن النوم",
    phase_diet: "🍯 الطب النبوي والفطرة",
    phase_character: "🤝 الأخلاق وأيام السنة",
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
    vault_archive_title: "🗓️ أرشيف السنن طويل المدى (٦ أشهر / ١٨٠ يوماً)",
    vault_archive_sub: "يتم حفظ سجل أيامك وأشهرك السابقة تلقائياً في الجهاز.",
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
    tasbih_options: [
      { target: 33, label: "سبحان الله", text: "سبحان الله — ٣٣ مرة" },
      { target: 33, label: "الحمد لله", text: "الحمد لله — ٣٣ مرة" },
      { target: 34, label: "الله أكبر", text: "الله أكبر — ٣٤ مرة" },
      { target: 100, label: "أستغفر الله وأتوب إليه", text: "أستغفر الله وأتوب إليه — ١٠٠ مرة" },
      { target: 100, label: "سبحان الله وبحمده", text: "سبحان الله وبحمده — ١٠٠ مرة" },
      { target: 10, label: "اللهم صل وسلم على نبينا محمد ﷺ", text: "الصلاة على النبي ﷺ — ١٠ مرات" },
      { target: 100, label: "لا إله إلا الله وحده لا شريك له", text: "التهليل اليومي — ١٠٠ مرة" },
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
    vault_archive_title: "🗓️ Long-Term Sunnah Archive (6 Months / 180 Days)",
    vault_archive_sub: "Your multi-month daily history is automatically preserved across 3 device storage layers.",
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
    tasbih_options: [
      { target: 33, label: "SubhanAllah (Glory be to Allah)", text: "SubhanAllah — 33x" },
      { target: 33, label: "Alhamdulillah (Praise be to Allah)", text: "Alhamdulillah — 33x" },
      { target: 34, label: "Allahu Akbar (Allah is the Greatest)", text: "Allahu Akbar — 34x" },
      { target: 100, label: "Astaghfirullah wa atubu ilayh", text: "Astaghfirullah wa atubu ilayh — 100x" },
      { target: 100, label: "SubhanAllahi wa bihamdihi", text: "SubhanAllahi wa bihamdihi — 100x" },
      { target: 10, label: "Allahumma salli 'ala Muhammad ﷺ", text: "Salawat upon the Prophet ﷺ — 10x" },
      { target: 100, label: "La ilaha illallahu wahdahu la sharika lah", text: "Daily Tahleel Fortress — 100x" },
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
  }
]);

// Application State (Default Language set to Bangla: 'bn')
let appState = {
  appName: "Sunnah 24",
  version: 35,
  locale: "bn",
  i18nHash: "",
  customHabits: [],
  completionsByDate: {},
  diaryEntries: [],
  lifetimeDhikr: 0,
  lastUpdated: 0,
  signature: ""
};

let activePhase = "all";
let searchQuery = "";
let selectedMood = "Khushu";
let tasbihCount = 0;
let tasbihTarget = 33;
let verifiedI18nDigest = "";
let historyRangeDays = 180;
let lastObservedDateKey = getTodayKey();

function t(key, replacements = {}) {
  const lang = I18N_DICTIONARIES[appState.locale] ? appState.locale : "bn";
  let str = I18N_DICTIONARIES[lang][key] || I18N_DICTIONARIES.bn[key] || key;
  Object.keys(replacements).forEach((k) => {
    str = str.replace(`{${k}}`, replacements[k]);
  });
  return str;
}

function getHabitTitle(habit) {
  if (appState.locale === "bn") return habit.title_bn || habit.title;
  if (appState.locale === "ar") return habit.title_ar || habit.title;
  return habit.title;
}

function getHabitTime(habit) {
  if (habit.isCustom) return t("custom_time_label");
  if (appState.locale === "bn") return habit.time_bn || habit.time;
  if (appState.locale === "ar") return habit.time_ar || habit.time;
  return habit.time;
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

  return {
    appName: "Sunnah 24",
    version: 35,
    locale: base.locale || "bn",
    i18nHash: verifiedI18nDigest,
    customHabits: Array.from(mergedCustomMap.values()),
    completionsByDate: finalCompletions,
    diaryEntries: Array.from(mergedDiaryMap.values()).sort((a, b) => Number(a.id) - Number(b.id)),
    lifetimeDhikr: maxDhikr,
    lastUpdated: Date.now(),
    signature: ""
  };
}

async function saveAndSealState() {
  verifiedI18nDigest = await computeI18nDictionaryHash();
  appState.version = 35;
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
  statusEl.textContent = `${layers.join(" • ")} | সংরক্ষিত সক্রিয় দিন: ${localizeDigits(totalDays, appState.locale)}`;
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
      badge.textContent = t("badge_verified");
      badge.className = "badge-verified";
    } else {
      badge.textContent = t("badge_tampered");
      badge.className = "badge-verified badge-tampered";
    }
  }
}

function renderTasbihOptions() {
  const selector = document.getElementById("tasbih-selector");
  if (!selector) return;
  const currentIdx = selector.selectedIndex >= 0 ? selector.selectedIndex : 0;
  const options = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).tasbih_options;

  selector.innerHTML = "";
  options.forEach((opt) => {
    const optionEl = document.createElement("option");
    optionEl.value = `${opt.target}|${opt.label}`;
    optionEl.textContent = opt.text;
    selector.appendChild(optionEl);
  });

  selector.selectedIndex = currentIdx < options.length ? currentIdx : 0;
  const chosen = options[selector.selectedIndex];
  tasbihTarget = chosen.target;
  document.getElementById("tasbih-current").textContent = localizeDigits(tasbihCount, appState.locale);
  document.getElementById("tasbih-target").textContent = `/ ${localizeDigits(tasbihTarget, appState.locale)}`;
  document.getElementById("tasbih-label").textContent = chosen.label;
  document.getElementById("lifetime-dhikr-count").textContent = localizeDigits(
    appState.lifetimeDhikr || 0,
    appState.locale
  );
}

function renderDuas() {
  const container = document.getElementById("duas-list-container");
  if (!container) return;
  container.innerHTML = "";

  const lang = appState.locale || "bn";

  SUNNAH_24_DUAS.forEach((dua) => {
    const title = lang === "bn" ? dua.title_bn : lang === "ar" ? dua.title_ar : dua.title_en;
    const badge = lang === "bn" ? dua.badge_bn : lang === "ar" ? dua.badge_ar : dua.badge_en;
    const translit = lang === "bn" ? dua.translit_bn : lang === "en" ? dua.translit_en : "";
    const meaning = lang === "bn" ? dua.meaning_bn : lang === "ar" ? dua.meaning_ar : dua.meaning_en;
    const virtue = lang === "bn" ? dua.virtue_bn : lang === "ar" ? dua.virtue_ar : dua.virtue_en;

    const card = document.createElement("div");
    card.className = "dua-card";
    card.innerHTML = `
      <div class="dua-header">
        <h4>${title}</h4>
        <span class="dua-badge">${badge}</span>
      </div>
      <p class="dua-arabic">${dua.arabic}</p>
      ${translit ? `<p class="translit">${translit}</p>` : ""}
      <p class="muted-small">${meaning}</p>
      <p class="dua-virtue">${virtue}</p>
    `;
    container.appendChild(card);
  });
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

// Accurate Hijri Date Formatter with Authentic Bangla, Arabic & English Month Names
function getAccurateHijriDate(dateObj, locale) {
  const hijriMonths = {
    bn: [
      "মহররম",
      "সফর",
      "রবিউল আউয়াল",
      "রবিউস সানি",
      "জমাদিউল আউয়াল",
      "জমাদিউস সানি",
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
      }).formatToParts(dateObj);

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
    const jd = Math.floor(dateObj.getTime() / 86400000) + 2440588;
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

  const lang = hijriMonths[locale] ? locale : "bn";
  const monthName = hijriMonths[lang][hMonth - 1] || hijriMonths.bn[0];
  const dayStr = localizeDigits(hDay, lang);
  const yearStr = localizeDigits(hYear, lang);

  if (lang === "bn") return `${dayStr} ${monthName}, ${yearStr} হিজরি`;
  if (lang === "ar") return `${dayStr} ${monthName} ${yearStr} هـ`;
  return `${dayStr} ${monthName} ${yearStr} AH`;
}

function renderHeaderDatesAndPhase() {
  const now = new Date();
  const localeTag = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).localeTag;

  const greg = now.toLocaleDateString(localeTag, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const hijri = getAccurateHijriDate(now, appState.locale);
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
  const todayKey = getTodayKey();
  const completedToday = appState.completionsByDate[todayKey] || [];
  const allHabits = getAllHabits();

  const filtered = allHabits.filter((h) => {
    const matchesPhase = activePhase === "all" || h.phase === activePhase;
    const q = searchQuery.toLowerCase();
    const localizedTitle = getHabitTitle(h).toLowerCase();
    const localizedWisdom = getHabitWisdom(h).toLowerCase();
    const localizedEvidence = getHabitEvidence(h).toLowerCase();

    const matchesSearch =
      !q ||
      localizedTitle.includes(q) ||
      localizedWisdom.includes(q) ||
      localizedEvidence.includes(q) ||
      (h.title && h.title.toLowerCase().includes(q));
    return matchesPhase && matchesSearch;
  });

  document.getElementById("filter-count-label").textContent = t("showing_habits", {
    shown: localizeDigits(filtered.length, appState.locale),
    total: localizeDigits(allHabits.length, appState.locale)
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
          <span class="habit-time">${getHabitTime(habit)}</span>
          <h4>${getHabitTitle(habit)}</h4>
          <p class="habit-snippet">${getHabitWisdom(habit)}</p>
        </div>
      </div>
      <button class="info-btn" data-info="${habit.id}">${t("proof_btn")}</button>
    `;

    container.appendChild(card);
  });

  const total = allHabits.length;
  const doneCount = completedToday.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  document.getElementById("daily-score-text").textContent = `${localizeDigits(pct, appState.locale)}%`;
  document.getElementById("completed-count-text").textContent = t("completed_habits", {
    done: localizeDigits(doneCount, appState.locale),
    total: localizeDigits(total, appState.locale)
  });
  document.getElementById("daily-progress-bar").style.width = `${pct}%`;
  document.getElementById("streak-count").textContent = localizeDigits(
    calculateStreak(),
    appState.locale
  );

  renderWeeklyChart();
  renderLongTermArchive();
}

// 7-Day Consistency Matrix Using Local Timezone Date Keys + Interactive Day Inspection
function renderWeeklyChart() {
  const chart = document.getElementById("weekly-chart");
  if (!chart) return;
  chart.innerHTML = "";
  const totalHabits = getAllHabits().length;
  const localeTag = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).localeTag;
  const todayKey = getTodayKey();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getLocalDateKey(d);
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
}

// 6-Month (180-Day) Long-Term Archive & Monthly Summary Renderer
function renderLongTermArchive() {
  const monthlyEl = document.getElementById("monthly-summary-list");
  const historyListEl = document.getElementById("longterm-history-list");
  if (!monthlyEl || !historyListEl) return;

  monthlyEl.innerHTML = "";
  historyListEl.innerHTML = "";

  const totalHabits = getAllHabits().length || 32;
  const localeTag = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).localeTag;

  const recordedRows = [];
  const monthlyStats = {};

  for (let i = 0; i < historyRangeDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getLocalDateKey(d);
    const doneList = appState.completionsByDate[key] || [];
    const count = doneList.length;

    if (count > 0 || i === 0) {
      const pct = Math.min(100, Math.round((count / totalHabits) * 100));
      const monthKey = key.slice(0, 7); // YYYY-MM
      if (!monthlyStats[monthKey]) {
        const monthLabel = d.toLocaleDateString(localeTag, { month: "long", year: "numeric" });
        monthlyStats[monthKey] = { label: monthLabel, activeDays: 0, totalPct: 0 };
      }
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

      recordedRows.push({
        key,
        readableDate,
        count,
        pct
      });
    }
  }

  const monthKeys = Object.keys(monthlyStats).sort().reverse();
  monthKeys.forEach((mKey) => {
    const st = monthlyStats[mKey];
    const avg = st.activeDays > 0 ? Math.round(st.totalPct / st.activeDays) : 0;
    const card = document.createElement("div");
    card.className = "month-summary-card";
    card.innerHTML = `
      <h4>🗓️ ${st.label}</h4>
      <p>${t("archive_active_days")} <strong>${localizeDigits(st.activeDays, appState.locale)}</strong></p>
      <p>${t("archive_avg_score")} <strong>${localizeDigits(avg, appState.locale)}%</strong></p>
    `;
    monthlyEl.appendChild(card);
  });

  if (recordedRows.length === 0) {
    historyListEl.innerHTML = `<p class="muted">${t("archive_empty")}</p>`;
    return;
  }

  recordedRows.forEach((row) => {
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
  const wisdomSection = document.getElementById("modal-wisdom")?.parentElement;
  if (wisdomSection) wisdomSection.style.display = "block";

  document.getElementById("modal-title").textContent = getHabitTitle(habit);
  document.getElementById("modal-category").textContent = getHabitTime(habit);
  document.getElementById("modal-evidence").textContent = getHabitEvidence(habit);
  document.getElementById("modal-wisdom").textContent = getHabitWisdom(habit);
  document.getElementById("fact-modal").classList.remove("hidden");
  if (typeof pushAppHistoryState === "function") pushAppHistoryState("modal");
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
  document.getElementById("modal-title").textContent = getHabitTitle(habit);
  document.getElementById("modal-category").textContent = getHabitTime(habit);
  document.getElementById("modal-evidence").textContent = getHabitEvidence(habit);
  document.getElementById("modal-wisdom").textContent = getHabitWisdom(habit);
  document.getElementById("fact-modal").classList.remove("hidden");
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
      <small style="color:#10b981;font-size:0.68rem;">SHA-256: ${(entry.entryHash || "").slice(0, 28)}...</small>
    `;
    listEl.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadAndVerifyState();
  applyLanguageToDOM();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  // Automatic Midnight Rollover Watcher (Preserves yesterday's record & refreshes UI cleanly at 12:00 AM local time)
  setInterval(() => {
    const currentKey = getTodayKey();
    if (currentKey !== lastObservedDateKey) {
      lastObservedDateKey = currentKey;
      renderHeaderDatesAndPhase();
      renderHabits();
    }
  }, 30000);

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

  const rangeSelect = document.getElementById("history-range-selector");
  if (rangeSelect) {
    rangeSelect.addEventListener("change", (e) => {
      historyRangeDays = parseInt(e.target.value, 10) || 180;
      renderLongTermArchive();
    });
  }

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  document.getElementById("habit-search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderHabits();
  });

  document.getElementById("reset-today-btn").addEventListener("click", async () => {
    const todayKey = getTodayKey();
    appState.completionsByDate[todayKey] = [];
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

  // Click on any day in 7-Day Matrix or 6-Month Archive to inspect completed habits
  document.getElementById("tab-vault").addEventListener("click", (e) => {
    const dayEl = e.target.closest("[data-date-inspect]");
    if (dayEl) {
      openDayHistoryModal(dayEl.getAttribute("data-date-inspect"));
    }
  });

  document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("fact-modal").classList.add("hidden");
  });

  const selector = document.getElementById("tasbih-selector");
  selector.addEventListener("change", () => {
    const [target, label] = selector.value.split("|");
    tasbihTarget = parseInt(target, 10);
    tasbihCount = 0;
    document.getElementById("tasbih-current").textContent = localizeDigits(0, appState.locale);
    document.getElementById("tasbih-target").textContent = `/ ${localizeDigits(tasbihTarget, appState.locale)}`;
    document.getElementById("tasbih-label").textContent = label;
  });

  document.getElementById("tasbih-tap-area").addEventListener("click", async () => {
    tasbihCount++;
    appState.lifetimeDhikr = (appState.lifetimeDhikr || 0) + 1;
    if (navigator.vibrate) navigator.vibrate(25);
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
    await saveAndSealState();
  });

  document.getElementById("tasbih-reset-btn").addEventListener("click", () => {
    tasbihCount = 0;
    document.getElementById("tasbih-current").textContent = localizeDigits(0, appState.locale);
  });

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
      if (!imported.locale) imported.locale = "bn";
      if (!imported.i18nHash) imported.i18nHash = verifiedI18nDigest;

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

function switchTabProgrammatically(targetTabId, recordInStack = true) {
  const currentActiveBtn = document.querySelector(".tab-btn.active");
  if (currentActiveBtn) {
    tabScrollPositions[currentActiveBtn.dataset.tab] = window.scrollY || 0;
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

  const savedScroll = tabScrollPositions[targetTabId] || 0;
  window.scrollTo({ top: savedScroll, behavior: "instant" });
}

// Global handler invoked by both Android Native Back Button & Browser popstate
window.handleSunnahBackNavigation = function () {
  // 1. If Fact / History Modal is open -> Close modal first
  const modal = document.getElementById("fact-modal");
  if (modal && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
    return true;
  }

  // 2. If Search box has text -> Clear search and stay on page
  const searchInput = document.getElementById("habit-search-input");
  if (searchQuery && searchInput) {
    searchQuery = "";
    searchInput.value = "";
    renderHabits();
    return true;
  }

  // 3. If a Phase Filter Chip (other than "all") is active on Routine tab -> Reset to "All 24H"
  const activeTab = document.querySelector(".tab-content.active")?.id;
  if (activeTab === "tab-routine" && activePhase !== "all") {
    activePhase = "all";
    document.querySelectorAll(".filter-bar .chip").forEach((c) => {
      c.classList.toggle("active", c.dataset.phase === "all");
    });
    renderHabits();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  // 4. If user is on Adhkar, Muhasabah, or Vault tab -> Go back to previous tab in stack
  if (navTabStack.length > 1) {
    navTabStack.pop(); // remove current
    const prevTab = navTabStack[navTabStack.length - 1] || "tab-routine";
    switchTabProgrammatically(prevTab, false);
    return true;
  }

  if (activeTab && activeTab !== "tab-routine") {
    switchTabProgrammatically("tab-routine", false);
    return true;
  }

  // 5. If scrolled far down on the Home Routine tab -> Smooth scroll back to top
  if (window.scrollY > 220) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  // 6. At the very top of Home Routine tab -> Require double back-press within 2s to exit
  const now = Date.now();
  if (now - lastBackTapTime < 2000) {
    return false; // Allow native APK exit on second tap
  }
  lastBackTapTime = now;
  showExitToast();
  pushAppHistoryState("root-guard");
  return true;
};

document.addEventListener("DOMContentLoaded", () => {
  // Seed initial history state so back button is intercepted by WebView
  pushAppHistoryState("root-guard");

  // Track Tab clicks in navigation stack
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab;
      if (navTabStack[navTabStack.length - 1] !== targetTab) {
        navTabStack.push(targetTab);
        pushAppHistoryState(targetTab);
      }
    });
  });

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

  // Localize button text automatically when language changes
  const updateApkButtonLabel = () => {
    const span = apkBtn.querySelector("span");
    if (!span) return;
    if (appState.locale === "ar") {
      span.textContent = "تحميل التطبيق (APK)";
    } else if (appState.locale === "en") {
      span.textContent = "Install App (APK)";
    } else {
      span.textContent = "অ্যাপ ইনস্টল (APK)";
    }
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
      // Fallback stays on /releases/latest/download/Sunnah-24-v3.6-Enterprise-Signed.apk
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initWebsiteOnlyApkInstaller();
});

// ============================================================================
// HASSLE-FREE IN-APP APK UPDATE CHECKER & OTA NOTIFICATION
// ============================================================================
const CURRENT_APP_VERSION = "v3.6"; // Bump this whenever you release a new version

function initInAppUpdateChecker() {
  // Only run inside the native APK / Android wrapper
  const isInsideNativeApk =
    Boolean(window.AndroidDownloader) ||
    Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ||
    window.location.protocol === "capacitor:" ||
    window.location.protocol === "file:";

  if (!isInsideNativeApk) return;

  // Check GitHub Releases for latest version
  fetch("https://api.github.com/repos/MKRWeb/sunnah-24/releases/latest", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((release) => {
      if (!release || !release.tag_name) return;
      const latestTag = release.tag_name; // e.g. "v3.7"

      if (latestTag !== CURRENT_APP_VERSION) {
        // Find the .apk asset download URL
        const apkAsset = (release.assets || []).find(
          (a) => a.name && a.name.toLowerCase().endsWith(".apk")
        );
        const downloadUrl = apkAsset ? apkAsset.browser_download_url : `https://github.com/MKRWeb/sunnah-24/releases/download/${latestTag}/Sunnah-24-Release-Signed.apk`;

        showUpdateNotificationBanner(latestTag, downloadUrl);
      }
    })
    .catch(() => {});
}

    // ============================================================================
// HASSLE-FREE IN-APP APK UPDATE CHECKER & USER-CONTROLLED "ইনস্টল করুন" FLOW
// ============================================================================
let downloadedApkUrl = "";

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
  return "v3.8.0";
}

function initInAppUpdateChecker() {
  const isInsideNativeApk =
    Boolean(window.AndroidDownloader) ||
    Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ||
    window.location.protocol === "capacitor:" ||
    window.location.protocol === "file:";

  if (!isInsideNativeApk) return;

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
        if (apkAsset && apkAsset.browser_download_url) {
          showUpdateNotificationBanner(latestTag, apkAsset.browser_download_url);
        }
      }
    })
    .catch(() => {});
}

function showUpdateNotificationBanner(newVersion, apkUrl) {
  if (document.getElementById("s24-update-banner")) return;
  downloadedApkUrl = apkUrl;

  const banner = document.createElement("div");
  banner.id = "s24-update-banner";
  banner.className = "update-banner-card";

  const msgText =
    appState.locale === "ar"
      ? `✨ يتوفر تحديث جديد (${newVersion}) لتطبيق سنة ٢٤!`
      : appState.locale === "en"
      ? `✨ New Update (${newVersion}) Available for Sunnah 24!`
      : `✨ সুন্নাহ ২৪-এর নতুন আপডেট (${newVersion}) এসেছে!`;

  const subText =
    appState.locale === "ar"
      ? "جاهز للتحميل والتثبيت فوق النسخة الحالية."
      : appState.locale === "en"
      ? "Ready to download and install over your existing app."
      : "ডাউনলোড করে আগের অ্যাপের ওপর আপডেট করার জন্য প্রস্তুত।";

  const btnText =
    appState.locale === "ar"
      ? "⬇️ تحميل التحديث"
      : appState.locale === "en"
      ? "⬇️ Download Update"
      : "⬇️ আপডেট ডাউনলোড করুন";

  const dismissText =
    appState.locale === "ar"
      ? "لاحقاً"
      : appState.locale === "en"
      ? "Later"
      : "পরে";

  banner.innerHTML = `
    <div class="update-banner-content">
      <span>🚀</span>
      <div>
        <strong id="s24-update-title">${msgText}</strong>
        <small id="s24-update-status">${subText}</small>
      </div>
    </div>
    <div class="update-banner-actions">
      <button id="trigger-native-update-btn" class="btn-update-action">${btnText}</button>
      <button class="btn-update-dismiss" onclick="document.getElementById('s24-update-banner').remove()">${dismissText}</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById("trigger-native-update-btn").addEventListener("click", () => {
    const btn = document.getElementById("trigger-native-update-btn");
    const statusEl = document.getElementById("s24-update-status");

    // If download is complete, clicking "ইনস্টল করুন" starts the installer immediately
    if (banner.getAttribute("data-ready") === "true") {
      if (window.AndroidDownloader && typeof window.AndroidDownloader.installDownloadedApk === "function") {
        window.AndroidDownloader.installDownloadedApk();
      }
      return;
    }

    // Otherwise, start the background download
    if (
      window.AndroidDownloader &&
      typeof window.AndroidDownloader.downloadAndInstallApk === "function"
    ) {
      btn.disabled = true;
      btn.textContent = appState.locale === "bn" ? "⏳ ডাউনলোড হচ্ছে..." : "⏳ Downloading...";
      if (statusEl) {
        statusEl.textContent = appState.locale === "bn" ? "ফাইল ডাউনলোড হচ্ছে..." : "Downloading update file...";
      }
      window.AndroidDownloader.downloadAndInstallApk(downloadedApkUrl);
    } else {
      window.open(downloadedApkUrl, "_blank");
    }
  });
}

// Live Progress Listener from Native Android Bridge
window.onSunnahApkDownloadProgress = function (percent, statusText) {
  const btn = document.getElementById("trigger-native-update-btn");
  const statusEl = document.getElementById("s24-update-status");
  
  if (btn && percent >= 0 && percent < 100) {
    btn.textContent = `⬇️ ${localizeDigits(percent, appState.locale)}%`;
  }
  if (statusEl && statusText) {
    statusEl.textContent = statusText;
  }

  // When download finishes (100%), transform button into "ইনস্টল করুন"
  if (percent >= 100) {
    if (btn) {
      btn.disabled = false;
      btn.style.background = "var(--accent-gold)";
      btn.style.color = "#05130e";
      btn.textContent = appState.locale === "bn" ? "📦 ইনস্টল করুন" : "📦 Install Now";
    }
    if (statusEl) {
      statusEl.textContent =
        appState.locale === "bn"
          ? "ডাউনলোড সম্পন্ন! ইনস্টল করতে বোতামে চাপ দিন।"
          : "Download finished! Tap button to start installation.";
    }
    const banner = document.getElementById("s24-update-banner");
    if (banner) banner.setAttribute("data-ready", "true");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initInAppUpdateChecker();
});
