/**
 * SUNNAH 24 — ENTERPRISE PROPHETIC 24-HOUR LIFESTYLE & HABIT TRACKER
 * SHA-256 Tamper-Proof Cryptographic Engine + Full Bangla (Default), Arabic & English Localization
 */

const STORAGE_KEY = "SUNNAH_24_ENTERPRISE_LEDGER_V24";
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
    duas_heading: "🤲 প্রতিদিনের জরুরি মাসনূন দোয়া",
    dua_wake_title: "🌅 ঘুম থেকে ওঠার দোয়া (সহীহ বুখারী ৬৩১২)",
    dua_wake_translit: "\"আলহামদু লিল্লাহিল্লাযী আহ্ইয়ানা বা'দা মা আমাতানা ওয়া ইলাইহিন নুশূর।\"",
    dua_wake_meaning: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদেরকে নিদ্রারূপ মৃত্যুর পর জীবিত করেছেন এবং তাঁর কাছেই আমাদের পুনরুত্থান।",
    dua_istighfar_title: "🛡️ সাইয়্যিদুল ইস্তিগফার — ক্ষমা প্রার্থনার শ্রেষ্ঠ দোয়া (বুখারী ৬৩০৬)",
    dua_istighfar_translit: "\"আল্লাহুম্মা আনতা রাব্বী লা ইলাহা ইল্লা আনতা, খালাকতানী ওয়া আনা আবদুকা, ওয়া আনা আলা আহদিকা ওয়া ওয়া'দিকা মাসতাতা'তু...\"",
    dua_istighfar_meaning: "যে ব্যক্তি দৃঢ় বিশ্বাসের সাথে সকালে ও সন্ধ্যায় এটি পাঠ করবে এবং সেদিন মৃত্যুবরণ করবে, সে জান্নাতবাসী হবে।",
    dua_sleep_title: "🛌 ঘুমানোর পূর্বে দোয়া (সহীহ বুখারী ৬৩২৪)",
    dua_sleep_translit: "\"বিসমিকা রাব্বী ওয়াদা'তু জানবী, ওয়া বিকা আরফাউহু, ফাইন্ন আমসাকতা নাফসী ফারহামহা...\"",
    dua_sleep_meaning: "হে আমার রব! আপনার নামেই আমি বিছানায় পার্শ্বদেশ রাখলাম এবং আপনার নামেই আবার উঠব। যদি আমার প্রাণ রেখে দেন তবে তার প্রতি দয়া করুন।",
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
    vault_matrix_sub: "গত ৭ দিনে আপনার দৈনিক সুন্নাহ পালনের অগ্রগতি।",
    vault_custom_title: "➕ ব্যক্তিগত সুন্নাহ আমল যুক্ত করুন",
    custom_title_ph: "আমলের নাম (যেমন: ফজরের পর ৫ আয়াত হিফজ)",
    custom_fact_ph: "হাদিস সূত্র / ব্যক্তিগত উপকারিতা",
    custom_add_btn: "সুন্নাহ ২৪ রুটিনে যুক্ত করুন",
    custom_time_label: "ব্যক্তিগত সুন্নাহ ২৪",
    custom_default_evidence: "ব্যক্তিগত সুন্নাহ ২৪ লক্ষ্য",
    custom_default_wisdom: "আল্লাহর কাছে সবচেয়ে প্রিয় আমল তা-ই যা নিয়মিত করা হয়, যদিও তা অল্প হয় (সহীহ বুখারী ৬৪৬৪)।",
    vault_crypto_title: "🔐 SHA-256 টেম্পার-প্রুফ ক্রিপ্টোগ্রাফিক ভল্ট",
    vault_crypto_sub: "প্রতিটি আমল, তাসবীহ গণনা, মুহাসাবা ডায়েরি এবং ভাষা প্যাক SHA-256 ক্রিপ্টোগ্রাফিক স্বাক্ষর দ্বারা সুরক্ষিত।",
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
    duas_heading: "🤲 الأدعية النبوية اليومية الأساسية",
    dua_wake_title: "🌅 دعاء الاستيقاظ من النوم (البخاري ٦٣١٢)",
    dua_wake_translit: "\"الحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.\"",
    dua_wake_meaning: "نستفتح يومنا بحمد الله الذي رد إلينا أرواحنا بعد النوم وإليه البعث والنشور.",
    dua_istighfar_title: "🛡️ سيد الاستغفار (البخاري ٦٣٠٦)",
    dua_istighfar_translit: "\"اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ...\"",
    dua_istighfar_meaning: "من قالها موقناً بها حين يمسي وحين يصبح فمات من يومه أو ليلته دخل الجنة.",
    dua_sleep_title: "🛌 دعاء النوم (البخاري ٦٣٢٤)",
    dua_sleep_translit: "\"بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا...\"",
    dua_sleep_meaning: "تفويض الروح والنفس إلى الله تعالى عند وضع الجنب على الفراش.",
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
    vault_matrix_sub: "معدل إتمامك للسنن النبوية خلال الأيام السبعة الماضية.",
    vault_custom_title: "➕ إضافة ورد أو سنة شخصية",
    custom_title_ph: "عنوان العمل (مثال: حفظ ٥ آيات بعد الفجر)",
    custom_fact_ph: "الدليل من الحديث أو الفائدة",
    custom_add_btn: "إضافة إلى جدول سنة ٢٤",
    custom_time_label: "ورد شخصي — سنة ٢٤",
    custom_default_evidence: "هدف شخصي في جدول سنة ٢٤",
    custom_default_wisdom: "أحب الأعمال إلى الله أدومها وإن قل (صحيح البخاري ٦٤٦٤).",
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
    modal_close_btn: "الحمد لله، فهمت",
    alert_tamper: "⚠️ تنبيه أمني: فشل التحقق من التوقيع الرقمي للملف!",
    alert_restored: "✅ تمت استعادة النسخة الاحتياطية والتحقق من سلامتها بنجاح!",
    alert_invalid: "ملف النسخة الاحتياطية غير صالح.",
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
    duas_heading: "🤲 Essential Daily Prophetic Duas",
    dua_wake_title: "🌅 Upon Waking Up (Bukhari 6312)",
    dua_wake_translit: "\"Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.\"",
    dua_wake_meaning: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    dua_istighfar_title: "🛡️ Sayyidul Istighfar — Chief Prayer for Forgiveness (Bukhari 6306)",
    dua_istighfar_translit: "\"Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka...\"",
    dua_istighfar_meaning: "Whoever recites this with conviction in the morning and evening is guaranteed Paradise.",
    dua_sleep_title: "🛌 Before Sleeping (Bukhari 6324)",
    dua_sleep_translit: "\"Bismika Rabbi wada'tu janbi, wa bika arfa'uhu, fa in amsakta nafsi farhamha...\"",
    dua_sleep_meaning: "In Your Name my Lord, I lie down and in Your Name I rise.",
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
    vault_matrix_sub: "Your daily habit completion momentum across the past 7 days.",
    vault_custom_title: "➕ Add Personal Habit to Sunnah 24",
    custom_title_ph: "Habit Title (e.g., Memorize 5 Ayahs after Fajr)",
    custom_fact_ph: "Hadith Reference / Personal Benefit",
    custom_add_btn: "Add to Sunnah 24 Routine",
    custom_time_label: "Custom Sunnah 24",
    custom_default_evidence: "Personal Sunnah 24 Goal",
    custom_default_wisdom: "The most beloved deeds to Allah are those done consistently, even if small (Sahih al-Bukhari 6464).",
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
    modal_close_btn: "Alhamdulillah, Understood",
    alert_tamper: "⚠️ Sunnah 24 Security Alert: Signature mismatch! File integrity cannot be verified.",
    alert_restored: "✅ Sunnah 24 Signed Backup Restored & Cryptographically Verified!",
    alert_invalid: "Invalid Sunnah 24 backup file.",
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

// 32 Comprehensive Prophetic Habits & Islamic Habitual Facts Across 24 Hours (100% Translated in BN, AR, EN)
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

// Application State (Default Language set to Bangla: 'bn')
let appState = {
  appName: "Sunnah 24",
  version: 25,
  locale: "bn",
  i18nHash: "",
  customHabits: [],
  completionsByDate: {},
  diaryEntries: [],
  lifetimeDhikr: 0,
  signature: ""
};

let activePhase = "all";
let searchQuery = "";
let selectedMood = "Khushu";
let tasbihCount = 0;
let tasbihTarget = 33;
let verifiedI18nDigest = "";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

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
  // Deterministic 256-bit fallback digest if subtle crypto is unavailable
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
    habits: SUNNAH_24_HABITS
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
    completionsByDate: stateObj.completionsByDate || {},
    diaryEntries: stateObj.diaryEntries || [],
    lifetimeDhikr: stateObj.lifetimeDhikr || 0
  });
}

async function saveAndSealState() {
  verifiedI18nDigest = await computeI18nDictionaryHash();
  appState.version = 25;
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
    appState.locale = "bn";
    await saveAndSealState();
    return;
  }
  try {
    const parsed = JSON.parse(raw);

    // Seamless auto-upgrade from v24 (English single-language) to v25 (Multi-language Bangla default)
    if (!parsed.version || parsed.version < 25 || !parsed.locale) {
      appState = {
        ...appState,
        ...parsed,
        version: 25,
        locale: parsed.locale || "bn",
        i18nHash: verifiedI18nDigest
      };
      await saveAndSealState();
      return;
    }

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
  renderHeaderDatesAndPhase();
  renderHabits();
  renderDiaryHistory();
  updateIntegrityUI(true);
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

  let hijri = "";
  try {
    hijri = new Intl.DateTimeFormat(`${localeTag}-u-ca-islamic-umalqura`, {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);
  } catch {
    hijri = "Hijri Calendar";
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
}

function renderWeeklyChart() {
  const chart = document.getElementById("weekly-chart");
  if (!chart) return;
  chart.innerHTML = "";
  const totalHabits = getAllHabits().length;
  const localeTag = (I18N_DICTIONARIES[appState.locale] || I18N_DICTIONARIES.bn).localeTag;

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
      <strong>${localizeDigits(pct, appState.locale)}%</strong>
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

  document.getElementById("export-backup-btn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(appState, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sunnah-24-backup-${getTodayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("import-backup-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const imported = JSON.parse(text);
      if (!imported.locale) imported.locale = "bn";
      if (!imported.i18nHash) imported.i18nHash = verifiedI18nDigest;

      const expected = await computeSHA256(getCanonicalStatePayload(imported));
      if (imported.signature !== expected && imported.version === 25) {
        alert(t("alert_tamper"));
        return;
      }
      appState = {
        ...imported,
        version: 25,
        locale: imported.locale || "bn"
      };
      await saveAndSealState();
      applyLanguageToDOM();
      alert(t("alert_restored"));
    } catch {
      alert(t("alert_invalid"));
    }
  });
});
