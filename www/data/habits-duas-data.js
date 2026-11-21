// ============================================================================
// SUNNAH 24 — DATA MODULE: 32 PROPHETIC HABITS, 15 MASNOON DUAS, ICON
// REGISTRIES, CATEGORY DEFINITIONS & HADITH POSTER ARTICLES
// ============================================================================

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

// ============================================================================
// V13.0 TWO BLESSINGS OF LIFETIME (HEALTH & FREE TIME — SAHIH BUKHARI 6412)
// 3D HOMEPAGE CARD LOCALIZATION & DECORATED QURAN + HADITH ARTICLE ENGINE
// ============================================================================
const TWO_BLESSINGS_CONTENT = deepFreeze({
  bn: {
    narrator: "ইবনু আব্বাস (রা.) হতে বর্ণিত রাসূল ﷺ ইরশাদ করেন—",
    headline: "এমন দু’টি নিয়ামত আছে,",
    sublinePrefix: "যে দু’টোতে",
    sublineHighlight: "অধিকাংশ মানুষ উদাসীন",
    tileHealth: "সুস্থতা",
    tileFreeTime: "অবসর",
    source: "সহীহ বুখারী: ৬৪১২",
    cta: "বিস্তারিত নির্দেশনা",
    articleBadge: "۞ সহীহ বুখারী: ৬৪১২",
    articleTitle: "জীবনের অমূল্য দু’টি নিয়ামত: সুস্থতা ও অবসর সময়",
    articleSubtitle: "আল-কুরআনুল কারীম ও রাসূলুল্লাহ ﷺ-এর সহীহ হাদিসের আলোকে সময়ের সদ্ব্যবহার",
    blocks: [
      {
        type: "hadith",
        title: "১. মূল হাদিস শরীফ (সহীহ বুখারী ৬৪১২)",
        ref: "সহীহ বুখারী • হাদিস ৬৪১২",
        arabic: "عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: قَالَ النَّبِيُّ ﷺ: «نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ»",
        text: "অর্থ: হযরত আব্দুল্লাহ ইবনু আব্বাস (রা.) হতে বর্ণিত, নবী করীম ﷺ ইরশাদ করেছেন: «এমন দু’টি নিয়ামত রয়েছে, যে দু’টির বিষয়ে অধিকাংশ মানুষই ধোঁকায় পতিত (উদাসীন ও ক্ষতিগ্রস্ত): (১) শারীরিক সুস্থতা এবং (২) অবসর সময়।»"
      },
      {
        type: "quran",
        title: "২. মহাকাল ও সময়ের শপথ (সূরা আল-আসর)",
        ref: "আল-কুরআন • ১০৩:১–৩",
        arabic: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
        text: "অর্থ: «মহাকালের (সময়ের) শপথ! নিশ্চয়ই সমস্ত মানুষ ক্ষতির মধ্যে নিমজ্জিত; তবে তারা ব্যতীত—যারা ঈমান এনেছে, নেক আমল করেছে এবং পরস্পরকে সত্যের উপদেশ দিয়েছে ও ধৈর্য ধারণের উপদেশ দিয়েছে।»"
      },
      {
        type: "quran",
        title: "৩. অবসর মিললেই নতুন ইবাদতে আত্মনিয়োগের নির্দেশ",
        ref: "সূরা আলাম নাশরাহ • ৯৪:৭–৮",
        arabic: "فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب",
        text: "অর্থ: «অতএব যখনই তুমি (দৈনন্দিন কাজ থেকে) অবসর পাও, তখনই (ইবাদত ও কল্যাণকর কাজে) কঠোর পরিশ্রম করো এবং একনিষ্ঠভাবে তোমার রবের প্রতি মনোনিবেশ করো।»"
      },
      {
        type: "hadith",
        title: "৪. পাঁচটি অবস্থার পূর্বে পাঁচটি নিয়ামতকে গনীমত মনে করা",
        ref: "মুস্তাদরাকে হাকেম • ৭৮৪৬ (সহীহ)",
        arabic: "«اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ: شَبَابَكَ قَبْلَ هَرَمِكَ، وَصِحَّتَكَ قَبْلَ سَقَمِكَ، وَغِنَاكَ قَبْلَ فَقْرِكَ، وَفَرَاغَكَ قَبْلَ شُغْلِكَ، وَحَيَاتَكَ قَبْلَ مَوْتِكَ»",
        text: "রাসূলুল্লাহ ﷺ বলেছেন: «পাঁচটি অবস্থার পূর্বে পাঁচটি জিনিসকে মূল্যবান সম্পদ মনে করো: (১) বার্ধক্য আসার পূর্বে তোমার যৌবনকে, (২) অসুস্থতা আসার পূর্বে তোমার সুস্থতাকে, (৩) দরিদ্রতা আসার পূর্বে তোমার সচ্ছলতাকে, (৪) ব্যস্ততা আসার পূর্বে তোমার অবসর সময়কে এবং (৫) মৃত্যু আসার পূর্বে তোমার জীবনকে।»"
      },
      {
        type: "hadith",
        title: "৫. কিয়ামতের ময়দানে সময় ও যৌবনের চূড়ান্ত হিসাব",
        ref: "জামে তিরমিযী • ২৪১৬ (সহীহ)",
        arabic: "«لَا تَزُولُ قَدَمَا عَبْدٍ يَوْمَ الْقِيَامَةِ حَتَّى يُسْأَلَ عَنْ عُمُرِهِ فِيمَا أَفْنَاهُ، وَعَنْ عِلْمِهِ فِيمَ فَعَلَ، وَعَنْ مَالِهِ مِنْ أَيْنَ اكْتَسَبَهُ وَفِيمَ أَنْفَقَهُ، وَعَنْ جِسْمِهِ فِيمَ أَبْلَاهُ»",
        text: "নবীজি ﷺ বলেছেন: «কিয়ামতের দিন কোনো বান্দার পা এক চুলও নড়তে পারবে না যতক্ষণ না তাকে চারটি বিষয়ে জিজ্ঞাসা করা হবে: (১) তার জীবনকাল কোন কাজে ব্যয় করেছে, (২) অর্জিত জ্ঞান অনুযায়ী কী আমল করেছে, (৩) সম্পদ কোথা থেকে উপার্জন করেছে ও কোথায় ব্যয় করেছে এবং (৪) তার শরীর ও সুস্থতা কোন কাজে ক্ষয় করেছে।»"
      },
      {
        type: "action",
        title: "৬. মুমিনের ২৪ ঘণ্টার আমলী করণীয়",
        ref: "সুন্নাহ ২৪ • জীবন দর্শন",
        takeaways: [
          "সুস্থ থাকা অবস্থায় ৫ ওয়াক্ত সালাত, তাহাজ্জুদ ও সুন্নাহ রোজা নিয়মিত আদায় করা—কারণ অসুস্থ হলে সুস্থ অবস্থার পূর্ণ সওয়াব লেখা হয় (সহীহ বুখারী ২৯৯৬)।",
          "অবসর সময়কে মোবাইল স্ক্রলিং বা অহেতুক গল্পে নষ্ট না করে যিকির, কুরআন তিলাওয়াত, জ্ঞানার্জন ও পরিবারের খেদমতে ব্যয় করা।",
          "প্রতিটি নিঃশ্বাস ও মুহূর্তকে আখিরাতের পাথেয় হিসেবে সংরক্ষণ করা।"
        ]
      }
    ]
  },
  ar: {
    narrator: "عن ابن عباس رضي الله عنهما قال: قال النبي ﷺ—",
    headline: "نعمتان مغبون فيهما",
    sublinePrefix: "كثير من الناس:",
    sublineHighlight: "الصحة والفراغ",
    tileHealth: "الصحة",
    tileFreeTime: "الفراغ",
    source: "صحيح البخاري: ٦٤١٢",
    cta: "اقرأ المقال كاملاً",
    articleBadge: "۞ صحيح البخاري: ٦٤١٢",
    articleTitle: "نعمتان عظيمتان في عمر الإنسان: الصحة والفراغ",
    articleSubtitle: "توجيهات القرآن الكريم والسنة النبوية الصحيحة في اغتنام العمر والوقت",
    blocks: [
      {
        type: "hadith",
        title: "١. الحديث النبوي الشريف (صحيح البخاري ٦٤١٢)",
        ref: "صحيح البخاري • ٦٤١٢",
        arabic: "عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: قَالَ النَّبِيُّ ﷺ: «نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ»",
        text: "يبيّن النبي ﷺ أن أكثر الناس يفرّطون في هاتين النعمتين العظيمتين ولا يقدّرون قيمتهما إلا بعد زوالهما بالمرض أو الانشغال."
      },
      {
        type: "quran",
        title: "٢. قسم الله العظيم بالزمن والعصر",
        ref: "سورة العصر • ١٠٣:١–٣",
        arabic: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
        text: "أقسم الله تعالى بالدهر والوقت على أن الإنسان في نقصان وخسارة إلا من استثمر وقته بالإيمان والعمل الصالح والتواصي بالحق والصبر."
      },
      {
        type: "quran",
        title: "٣. استثمار وقت الفراغ في الطاعة والإقبال على الله",
        ref: "سورة الشرح • ٩٤:٧–٨",
        arabic: "فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب",
        text: "أمر إلهي كريم بأن المسلم إذا فرغ من أشغال دنياه اجتهد في العبادة والذكر وتوجه بقلبه إلى ربه سبحانه."
      },
      {
        type: "hadith",
        title: "٤. اغتنام الخمس قبل الخمس",
        ref: "المستدرك للحاكم • ٧٨٤٦",
        arabic: "«اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ: شَبَابَكَ قَبْلَ هَرَمِكَ، وَصِحَّتَكَ قَبْلَ سَقَمِكَ، وَغِنَاكَ قَبْلَ فَقْرِكَ، وَفَرَاغَكَ قَبْلَ شُغْلِكَ، وَحَيَاتَكَ قَبْلَ مَوْتِكَ»",
        text: "وصية نبوية جامعة للمبادرة بالأعمال الصالحة في زمن القوة والصحة والفراغ قبل حلول العجز والانشغال."
      },
      {
        type: "hadith",
        title: "٥. السؤال عن العمر والجسم يوم القيامة",
        ref: "جامع الترمذي • ٢٤١٦",
        arabic: "«لَا تَزُولُ قَدَمَا عَبْدٍ يَوْمَ الْقِيَامَةِ حَتَّى يُسْأَلَ عَنْ عُمُرِهِ فِيمَا أَفْنَاهُ... وَعَنْ جِسْمِهِ فِيمَ أَبْلَاهُ»",
        text: "سيُسأل كل إنسان بين يدي الله عن عمره كله كيف أمضاه، وعن صحته وجسده في أي شيء أبلاه."
      },
      {
        type: "action",
        title: "٦. خطوات عملية لحفظ الصحة والفراغ",
        ref: "منهج سنة ٢٤",
        takeaways: [
          "المداومة على الفرائض والسنن في حال الصحة ليكتب الله لك أجرها كاملاً عند المرض أو السفر (صحيح البخاري ٢٩٩٦).",
          "ملء أوقات الفراغ بتلاوة القرآن، الأذكار، طلب العلم النافع، وصلة الرحم.",
          "تجنب إهدار الساعات فيما لا ينفع في الدنيا ولا في الآخرة."
        ]
      }
    ]
  },
  en: {
    narrator: "Narrated by Ibn Abbas (RA), the Prophet ﷺ said—",
    headline: "There are two blessings",
    sublinePrefix: "which",
    sublineHighlight: "many people lose out on",
    tileHealth: "Health",
    tileFreeTime: "Free Time",
    source: "Sahih al-Bukhari: 6412",
    cta: "Read Full Guide",
    articleBadge: "۞ Sahih al-Bukhari: 6412",
    articleTitle: "Two Priceless Blessings of Lifetime: Health & Free Time",
    articleSubtitle: "Divine Guidance from the Holy Quran & Authentic Hadith on Guarding Your Time",
    blocks: [
      {
        type: "hadith",
        title: "1. The Prophetic Hadith on Health & Free Time",
        ref: "Sahih al-Bukhari • 6412",
        arabic: "عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: قَالَ النَّبِيُّ ﷺ: «نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ»",
        text: "Ibn Abbas (RA) reported that the Messenger of Allah ﷺ said: \"There are two blessings which many people are deceived into losing: (1) good health and (2) free time.\""
      },
      {
        type: "quran",
        title: "2. Allah's Oath by Time (Surah Al-Asr)",
        ref: "Holy Quran • 103:1–3",
        arabic: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
        text: "\"By time! Indeed, mankind is in loss—except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.\""
      },
      {
        type: "quran",
        title: "3. Turning Free Moments into Devotion (Surah Ash-Sharh)",
        ref: "Holy Quran • 94:7–8",
        arabic: "فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب",
        text: "\"So when you have finished [your duties], then stand up [for worship], and to your Lord direct [your] longing.\""
      },
      {
        type: "hadith",
        title: "4. Seize Five Blessings Before Five Trials",
        ref: "Al-Mustadrak • 7846 (Sahih)",
        arabic: "«اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ: شَبَابَكَ قَبْلَ هَرَمِكَ، وَصِحَّتَكَ قَبْلَ سَقَمِكَ، وَغِنَاكَ قَبْلَ فَقْرِكَ، وَفَرَاغَكَ قَبْلَ شُغْلِكَ، وَحَيَاتَكَ قَبْلَ مَوْتِكَ»",
        text: "The Prophet ﷺ advised: \"Take advantage of five before five: your youth before your old age, your health before your illness, your wealth before your poverty, your free time before your busyness, and your life before your death.\""
      },
      {
        type: "hadith",
        title: "5. Accountability for Lifetime & Physical Health",
        ref: "Jami` at-Tirmidhi • 2416",
        arabic: "«لَا تَزُولُ قَدَمَا عَبْدٍ يَوْمَ الْقِيَامَةِ حَتَّى يُسْأَلَ عَنْ عُمُرِهِ فِيمَا أَفْنَاهُ... وَعَنْ جِسْمِهِ فِيمَ أَبْلَاهُ»",
        text: "The Prophet ﷺ said: \"The feet of the son of Adam will not move on the Day of Resurrection until he is asked about four things: his life and how he spent it, his knowledge and how he acted upon it, his wealth and how he earned and spent it, and his body/health and how he wore it out.\""
      },
      {
        type: "action",
        title: "6. Practical Sunnah 24 Action Steps",
        ref: "Sunnah 24 • Daily Protocol",
        takeaways: [
          "Invest physical health in punctual Salah, Tahajjud, and Sunnah fasting—when illness strikes, Allah continues recording the full reward of what you practiced while healthy (Sahih al-Bukhari 2996).",
          "Replace passive scrolling during free time with Quran recitation, Dhikr, beneficial learning, and serving family.",
          "Treat every hour of your 24-hour cycle as an irreversible trust from Allah."
        ]
      }
    ]
  }
});

// ============================================================================
// V13.1 FOUR QUALITIES (AMANAH, TRUTHFULNESS, GOOD CHARACTER & HALAL FOOD —
// MUSNAD AHMAD 6652) — QURAN & HADITH INSTRUCTIONS & CTA-ONLY MODAL ENGINE
// ============================================================================
const FOUR_QUALITIES_CONTENT = deepFreeze({
  bn: {
    narrator: "রাসূলুল্লাহ্ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেন,",
    numText: "৪ টি",
    wordText: "গুণ",
    statement: "চারটি গুণ যখন তোমার মধ্যে থাকবে, তখন দুনিয়ার কোনো কিছু হাতছাড়া হয়ে গেলেও তোমার কোনো ক্ষতি নেই",
    tileAmanah: "আমানত সংরক্ষণ",
    tileSidq: "সত্য কথা",
    tileKhuluq: "উত্তম চরিত্র",
    tileHalal: "হালাল খাদ্য",
    source: "মুসনাদে আহমাদ: ৬৬৫২",
    cta: "বিস্তারিত নির্দেশনা",
    articleBadge: "মুসনাদে আহমাদ: ৬৬৫২",
    articleTitle: "মুমিনের অমূল্য ৪টি গুণ: আমানত, সত্যবাদিতা, উত্তম চরিত্র ও হালাল খাদ্য",
    articleSubtitle: "আল্লাহর কুরআন ও রাসূলুল্লাহ ﷺ-এর সহীহ হাদিসের আলোকে শাশ্বত দিকনির্দেশনা",
    blocks: [
      {
        type: "hadith",
        title: "মূল হাদিস ও জীবনের স্থায়ী ভিত্তি",
        ref: "মুসনাদে আহমাদ ৬৬৫২ • সহীহ",
        arabic: "أَرْبَعٌ إِذَا كُنَّ فِيكَ فَلَا عَلَيْكَ مَا فَاتَكَ مِنَ الدُّنْيَا",
        text: "আবদুল্লাহ ইবনু আমর (রা.) বর্ণনা করেন, রাসূলুল্লাহ ﷺ ইরশাদ করেছেন: চারটি গুণ যখন তোমার মধ্যে থাকবে, তখন দুনিয়ার কোনো কিছু হাতছাড়া হয়ে গেলেও তোমার কোনো ক্ষতি নেই—(১) আমানতের হেফাজত করা, (২) সত্য কথা বলা, (৩) উত্তম চরিত্র অবলম্বন করা এবং (৪) পবিত্র-হালাল খাদ্য গ্রহণ করা।"
      },
      {
        type: "quran",
        title: "১. আমানত সংরক্ষণ: আল্লাহর আদেশ ও মুমিনের পরিচয়",
        ref: "সূরা আন-নিসা ৪:৫৮ ও সূরা মু'মিনূন ২৩:৮",
        arabic: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا",
        text: "আল্লাহ তাআলা নির্দেশ দিচ্ছেন: নিশ্চয়ই আল্লাহ তোমাদেরকে আদেশ দেন যে, তোমরা আমানতসমূহ তার হকদারের কাছে পৌঁছে দেবে (সূরা আন-নিসা ৪:৫৮)। যারা নিজেদের আমানত ও অঙ্গীকার রক্ষা করে, তারাই সফলকাম মুমিন (সূরা মু'মিনূন ২৩:৮)।"
      },
      {
        type: "quran",
        title: "২. সত্য কথা: তাকওয়া ও হিদায়াতের পথ",
        ref: "সূরা আত-তাওবা ৯:১১৯ ও সহীহ বুখারী ৬০৯৪",
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ",
        text: "আল্লাহ তাআলা বলেন: হে মুমিনগণ! আল্লাহকে ভয় করো এবং সত্যবাদীদের সাথে থাকো (সূরা আত-তাওবা ৯:১১৯)। রাসূলুল্লাহ ﷺ বলেছেন: সত্যবাদিতা নেকির পথ দেখায়, আর নেকি জান্নাতে নিয়ে যায়; বান্দা সর্বদা সত্য বলতে থাকলে আল্লাহর কাছে তাকে সিদ্দীক (মহাসত্যবাদী) হিসেবে লিখে দেওয়া হয় (সহীহ বুখারী ৬০৯৪)।"
      },
      {
        type: "hadith",
        title: "৩. উত্তম চরিত্র: মীযানের পাল্লায় সবচেয়ে ভারী আমল",
        ref: "সূরা আল-কলম ৬৮:৪ ও সুনানে তিরমিযী ২০০৩",
        arabic: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ • مَا مِنْ شَيْءٍ أَثْقَلُ فِي الْمِيزَانِ مِنْ حُسْنِ الْخُلُقِ",
        text: "আল্লাহ তাআলা তাঁর রাসূল ﷺ-এর প্রশংসায় বলেন: নিশ্চয়ই আপনি মহান চরিত্রের ওপর অধিষ্ঠিত (সূরা আল-কলম ৬৮:৪)। নবীজি ﷺ বলেছেন: কিয়ামতের দিন মুমিনের মীযানের পাল্লায় উত্তম চরিত্রের চেয়ে ভারী আর কোনো জিনিস হবে না (সুনানে তিরমিযী ২০০৩)।"
      },
      {
        type: "quran",
        title: "৪. হালাল খাদ্য: দোয়া কবুল ও আমলের বরকতের শর্ত",
        ref: "সূরা আল-বাকারা ২:১৬৮ ও সহীহ মুসলিম ১০১৫",
        arabic: "يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا",
        text: "আল্লাহ তাআলা বলেন: হে মানুষ! যমীনের বুকে যা কিছু হালাল ও পবিত্র (তাইয়্যিব) রয়েছে, তা থেকে আহার করো (সূরা আল-বাকারা ২:১৬৮)। রাসূলুল্লাহ ﷺ উল্লেখ করেছেন যে, যে ব্যক্তির খাদ্য, পানীয় ও পোশাক হারাম, তার দোয়া কীভাবে কবুল হবে? (সহীহ মুসলিম ১০১৫)।"
      },
      {
        type: "action",
        title: "দৈনন্দিন জীবনে বাস্তবায়নের নির্দেশনা",
        ref: "সুন্নাহ ২৪ কার্যকরী প্রোটোকল",
        takeaways: [
          "অর্থ, দায়িত্ব, গোপনীয়তা ও সময়কে আমানত মনে করে যথাযথভাবে আদায় ও সংরক্ষণ করুন।",
          "কথা, লেনদেন ও সাক্ষ্যে সর্বদা সত্য বলুন এবং সন্দেহজনক কথা বা গীবত থেকে বিরত থাকুন।",
          "রাগ সংবরণ করে ধৈর্য, নম্রতা, ক্ষমা ও হাসিমুখের মাধ্যমে উত্তম আখলাক চর্চা করুন।",
          "উপার্জন ও খাদ্য-পানীয়ের ক্ষেত্রে সর্বদা হালাল ও পবিত্র পন্থা অবলম্বন করুন।"
        ]
      }
    ]
  },
  ar: {
    narrator: "قال رسول الله صلى الله عليه وسلم:",
    numText: "٤ خصال",
    wordText: "إذا وُجدت",
    statement: "إذا كنّ فيك فلا عليك ما فاتك من الدنيا إذا حفظت أمانة وصدق حديث وحسن خلق وعفة طعمة",
    tileAmanah: "حفظ الأمانة",
    tileSidq: "صدق الحديث",
    tileKhuluq: "حسن الخلق",
    tileHalal: "عفة الطعمة (حلال)",
    source: "مسند أحمد: ٦٦٥٢",
    cta: "التفاصيل والأدلة",
    articleBadge: "مسند أحمد: ٦٦٥٢",
    articleTitle: "الخصال الأربع الجامعة: الأمانة والصدق وحسن الخلق وعفة الطعمة",
    articleSubtitle: "هداية القرآن الكريم والسنة النبوية الصحيحة في تزكية النفس وبناء الحياة",
    blocks: [
      {
        type: "hadith",
        title: "الحديث الشريف وأصل هذه الخصال",
        ref: "مسند أحمد ٦٦٥٢ • صحيح",
        arabic: "أَرْبَعٌ إِذَا كُنَّ فِيكَ فَلَا عَلَيْكَ مَا فَاتَكَ مِنَ الدُّنْيَا: حِفْظُ أَمَانَةٍ، وَصِدْقُ حَدِيثٍ، وَحُسْنُ خَلِيقَةٍ، وَعِفَّةٌ فِي طُعْمَةٍ",
        text: "عن عبد الله بن عمرو رضي الله عنهما قال: قال رسول الله ﷺ: أربع إذا كن فيك فلا عليك ما فاتك من الدنيا: حفظ أمانة، وصدق حديث، وحسن خليقة، وعفة في طعمة."
      },
      {
        type: "quran",
        title: "١. حفظ الأمانة: أمر الله وصفة المؤمنين",
        ref: "النساء ٤:٥٨ والمؤمنون ٢٣:٨",
        arabic: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا",
        text: "يأمر الله تعالى بأداء الأمانات إلى أهلها في المال والعمل والعهود، وجعل حفظ الأمانة والعهد من صفات المؤمنين المفلحين في سورة المؤمنون."
      },
      {
        type: "quran",
        title: "٢. صدق الحديث: طريق البر والجنة",
        ref: "التوبة ٩:١١٩ وصحيح البخاري ٦٠٩٤",
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ",
        text: "أمر الله بملازمة الصادقين، وقال النبي ﷺ: «إن الصدق يهدي إلى البر، وإن البر يهدي إلى الجنة، ولا يزال الرجل يصدق ويتحرى الصدق حتى يكتب عند الله صديقاً»."
      },
      {
        type: "hadith",
        title: "٣. حسن الخلق: أثقل ما يوضع في الميزان",
        ref: "القلم ٦٨:٤ وسنن الترمذي ٢٠٠٣",
        arabic: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ • مَا مِنْ شَيْءٍ أَثْقَلُ فِي الْمِيزَانِ مِنْ حُسْنِ الْخُلُقِ",
        text: "أثنى الله على نبيه ﷺ بعظيم خلقه، وأخبر ﷺ أن حسن الخلق أثقل شيء في ميزان العبد يوم القيامة، وأن صاحب الخلق الحسن يدرك درجة الصائم القائم."
      },
      {
        type: "quran",
        title: "٤. عفة الطعمة: الحلال الطيب أساس القبول",
        ref: "البقرة ٢:١٦٨ وصحيح مسلم ١٠١٥",
        arabic: "يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا",
        text: "أمر الله بأكل الحلال الطيب، وحذر النبي ﷺ من أكل الحرام ومطعم الحرام؛ فالحلال أساس بركة الرزق وإجابة الدعاء."
      },
      {
        type: "action",
        title: "خطوات عملية للتطبيق اليومي",
        ref: "منهج حياة سنة ٢٤",
        takeaways: [
          "أدِّ كل أمانة مادية أو معنوية أو وظيفية بإتقان وصدق.",
          "الزم الصدق في القول والمعاملة واجتنب الكذب والغش والغيبة.",
          "قابل الإساءة بالحلم والرفق والبشاشة وطيب الكلام.",
          "احرص على أن يكون كسبك وطعامك حلالاً طيباً خالياً من الشبهات."
        ]
      }
    ]
  },
  en: {
    narrator: "The Messenger of Allah (peace and blessings be upon him) said:",
    numText: "4 Traits",
    wordText: "Qualities",
    statement: "If four qualities are with you, then whatever you miss of worldly affairs will not harm you",
    tileAmanah: "Guarding Amanah",
    tileSidq: "Speaking Truth",
    tileKhuluq: "Good Character",
    tileHalal: "Halal Nourishment",
    source: "Musnad Ahmad: 6652",
    cta: "Detailed Guidance",
    articleBadge: "Musnad Ahmad: 6652",
    articleTitle: "Four Anchors of a Believer: Amanah, Truthfulness, Good Character & Halal Food",
    articleSubtitle: "Timeless instructions from the Quran and authentic Hadith of Prophet Muhammad ﷺ",
    blocks: [
      {
        type: "hadith",
        title: "Core Hadith & Unshakeable Foundation",
        ref: "Musnad Ahmad 6652 • Sahih",
        arabic: "أَرْبَعٌ إِذَا كُنَّ فِيكَ فَلَا عَلَيْكَ مَا فَاتَكَ مِنَ الدُّنْيَا: حِفْظُ أَمَانَةٍ، وَصِدْقُ حَدِيثٍ، وَحُسْنُ خَلِيقَةٍ، وَعِفَّةٌ فِي طُعْمَةٍ",
        text: "'Abdullah ibn 'Amr (RA) narrated that the Prophet ﷺ said: Four things—if they are in you, then whatever of the world passes you by will not harm you: guarding a trust (Amanah), truthfulness in speech, good character, and restraint/purity in one's nourishment (Halal food).'"
      },
      {
        type: "quran",
        title: "1. Guarding Amanah (Trusts & Covenants)",
        ref: "Surah An-Nisa 4:58 & Surah Al-Mu'minun 23:8",
        arabic: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا",
        text: "Allah commands: 'Indeed, Allah commands you to render trusts to whom they are due' (4:58). True believers are those who faithfully uphold their trusts and covenants (23:8)."
      },
      {
        type: "quran",
        title: "2. Speaking the Truth (Sidq)",
        ref: "Surah At-Tawbah 9:119 & Sahih al-Bukhari 6094",
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ",
        text: "Allah instructs: 'O you who have believed, fear Allah and be with those who are true' (9:119). The Prophet ﷺ taught that truthfulness leads to righteousness, and righteousness leads to Paradise (Sahih al-Bukhari 6094)."
      },
      {
        type: "hadith",
        title: "3. Good Character (Husn al-Khuluq)",
        ref: "Surah Al-Qalam 68:4 & Jami` at-Tirmidhi 2003",
        arabic: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ • مَا مِنْ شَيْءٍ أَثْقَلُ فِي الْمِيزَانِ مِنْ حُسْنِ الْخُلُقِ",
        text: "Allah praised the Prophet ﷺ: 'And indeed, you are of a great moral character' (68:4). Nothing weighs heavier on the believer's scale on the Day of Judgement than good character (Jami` at-Tirmidhi 2003)."
      },
      {
        type: "quran",
        title: "4. Halal & Tayyib Nourishment",
        ref: "Surah Al-Baqarah 2:168 & Sahih Muslim 1015",
        arabic: "يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا",
        text: "Allah commands: 'O mankind, eat from whatever is on earth that is lawful and good' (2:168). Lawful and pure sustenance preserves Barakah in provision and acceptance of supplication (Sahih Muslim 1015)."
      },
      {
        type: "action",
        title: "Practical Daily Implementation",
        ref: "Sunnah 24 Actionable Guide",
        takeaways: [
          "Fulfill every financial, professional, and personal trust with integrity.",
          "Commit to honesty in words, promises, and dealings without deception.",
          "Cultivate patience, humility, warmth, and gentle speech in daily interactions.",
          "Ensure earnings and food remain strictly Halal and Tayyib (lawful and wholesome)."
        ]
      }
    ]
  }
});

