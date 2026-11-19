// ============================================================================
// SUNNAH 24 — DATA MODULE: REGIONAL PRAYER PROFILES, IANA TIMEZONE REGISTRY,
// BANGLADESH 8 DIVISIONS / 64 DISTRICTS / UPAZILAS & 195+ GLOBAL COUNTRIES
// ============================================================================

const GEO_LOCATION_CACHE_KEY = "SUNNAH_24_X_GEO_COORDS_V1";
const MADHAB_STORAGE_KEY = "SUNNAH_24_ASR_MADHAB_PREF_V1";
const BD_SELECTED_LOC_STORAGE_KEY = "SUNNAH_24_BD_SELECTED_LOCATION_V1";
const GLOBAL_SELECTED_LOC_STORAGE_KEY = "SUNNAH_24_GLOBAL_LOCATION_V3";

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

const GLOBAL_COUNTRIES_DIRECTORY = deepFreeze([
  { code: "BD", name: "Bangladesh", isBangladeshSpecial: true },
  {
    code: "AF", name: "Afghanistan", regionCode: "BD", subRegion: "SOUTH_ASIA", tzHours: 4.5, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Kabul", lat: 34.5553, lon: 69.2075 },
      { name: "Kandahar", lat: 31.6289, lon: 65.7372 },
      { name: "Herat", lat: 34.3529, lon: 62.2040 },
      { name: "Mazar-i-Sharif", lat: 36.7069, lon: 67.1147 },
      { name: "Jalalabad", lat: 34.4198, lon: 70.4474 }
    ]
  },
  {
    code: "AL", name: "Albania", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Tirana", lat: 41.3275, lon: 19.8187 },
      { name: "Durrës", lat: 41.3246, lon: 19.4565 },
      { name: "Vlorë", lat: 40.4661, lon: 19.4914 }
    ]
  },
  {
    code: "DZ", name: "Algeria", regionCode: "ME", subRegion: "AFRICA", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Algiers", lat: 36.7538, lon: 3.0588 },
      { name: "Oran", lat: 35.6971, lon: -0.6308 },
      { name: "Constantine", lat: 36.3650, lon: 6.6147 },
      { name: "Annaba", lat: 36.9000, lon: 7.7667 }
    ]
  },
  {
    code: "AD", name: "Andorra", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Andorra la Vella", lat: 42.5063, lon: 1.5218 }]
  },
  {
    code: "AO", name: "Angola", regionCode: "ME", subRegion: "AFRICA", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Luanda", lat: -8.8390, lon: 13.2894 }]
  },
  {
    code: "AR", name: "Argentina", regionCode: "WEST", subRegion: "NORTH_AMERICA", tzHours: -3.0, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
      { name: "Córdoba", lat: -31.4201, lon: -64.1888 },
      { name: "Rosario", lat: -32.9442, lon: -60.6505 }
    ]
  },
  {
    code: "AM", name: "Armenia", regionCode: "ME", subRegion: "CENTRAL_ASIA", tzHours: 4.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Yerevan", lat: 40.1792, lon: 44.4991 }]
  },
  {
    code: "AU", name: "Australia", regionCode: "WEST", subRegion: "OCEANIA", tzHours: 10.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Sydney", lat: -33.8688, lon: 151.2093, tzHours: 10.0 },
      { name: "Melbourne", lat: -37.8136, lon: 144.9631, tzHours: 10.0 },
      { name: "Brisbane", lat: -27.4705, lon: 153.0260, tzHours: 10.0 },
      { name: "Perth", lat: -31.9505, lon: 115.8605, tzHours: 8.0 },
      { name: "Adelaide", lat: -34.9285, lon: 138.6007, tzHours: 9.5 },
      { name: "Canberra", lat: -35.2809, lon: 149.1300, tzHours: 10.0 }
    ]
  },
  {
    code: "AT", name: "Austria", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Vienna", lat: 48.2082, lon: 16.3738 },
      { name: "Graz", lat: 47.0707, lon: 15.4395 },
      { name: "Salzburg", lat: 47.8095, lon: 13.0550 }
    ]
  },
  {
    code: "AZ", name: "Azerbaijan", regionCode: "ME", subRegion: "CENTRAL_ASIA", tzHours: 4.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Baku", lat: 40.4093, lon: 49.8671 },
      { name: "Ganja", lat: 40.6828, lon: 46.3606 }
    ]
  },
  {
    code: "BH", name: "Bahrain", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 0, ishaFixedMins: 90, asrShadowFactor: 1,
    cities: [
      { name: "Manama", lat: 26.2285, lon: 50.5860 },
      { name: "Muharraq", lat: 26.2572, lon: 50.6119 },
      { name: "Riffa", lat: 26.1300, lon: 50.5550 }
    ]
  },
  {
    code: "BY", name: "Belarus", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Minsk", lat: 53.9006, lon: 27.5590 }]
  },
  {
    code: "BE", name: "Belgium", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Brussels", lat: 50.8503, lon: 4.3517 },
      { name: "Antwerp", lat: 51.2194, lon: 4.4025 },
      { name: "Ghent", lat: 51.0543, lon: 3.7174 }
    ]
  },
  {
    code: "BT", name: "Bhutan", regionCode: "BD", subRegion: "SOUTH_ASIA", tzHours: 6.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [{ name: "Thimphu", lat: 27.4728, lon: 89.6393 }]
  },
  {
    code: "BA", name: "Bosnia and Herzegovina", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Sarajevo", lat: 43.8563, lon: 18.4131 },
      { name: "Mostar", lat: 43.3438, lon: 17.8078 },
      { name: "Tuzla", lat: 44.5384, lon: 18.6763 }
    ]
  },
  {
    code: "BR", name: "Brazil", regionCode: "WEST", subRegion: "NORTH_AMERICA", tzHours: -3.0, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
      { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
      { name: "Brasília", lat: -15.7975, lon: -47.8919 }
    ]
  },
  {
    code: "BN", name: "Brunei Darussalam", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 8.0, fajrAngle: 20.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Bandar Seri Begawan", lat: 4.9031, lon: 114.9398 }]
  },
  {
    code: "BG", name: "Bulgaria", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Sofia", lat: 42.6977, lon: 23.3219 }]
  },
  {
    code: "KH", name: "Cambodia", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 7.0, fajrAngle: 20.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Phnom Penh", lat: 11.5564, lon: 104.9282 }]
  },
  {
    code: "CM", name: "Cameroon", regionCode: "ME", subRegion: "AFRICA", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Yaoundé", lat: 3.8480, lon: 11.5021 },
      { name: "Douala", lat: 4.0511, lon: 9.7679 }
    ]
  },
  {
    code: "CA", name: "Canada", regionCode: "WEST", subRegion: "NORTH_AMERICA", tzHours: -5.0, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Toronto", lat: 43.6532, lon: -79.3832, tzHours: -5.0 },
      { name: "Montreal", lat: 45.5017, lon: -73.5673, tzHours: -5.0 },
      { name: "Ottawa", lat: 45.4215, lon: -75.6972, tzHours: -5.0 },
      { name: "Vancouver", lat: 49.2827, lon: -123.1207, tzHours: -8.0 },
      { name: "Calgary", lat: 51.0447, lon: -114.0719, tzHours: -7.0 },
      { name: "Edmonton", lat: 53.5461, lon: -113.4938, tzHours: -7.0 },
      { name: "Winnipeg", lat: 49.8951, lon: -97.1384, tzHours: -6.0 },
      { name: "Halifax", lat: 44.6488, lon: -63.5752, tzHours: -4.0 }
    ]
  },
  {
    code: "TD", name: "Chad", regionCode: "ME", subRegion: "AFRICA", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "N'Djamena", lat: 12.1348, lon: 15.0557 }]
  },
  {
    code: "CN", name: "China", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 8.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Beijing", lat: 39.9042, lon: 116.4074 },
      { name: "Shanghai", lat: 31.2304, lon: 121.4737 },
      { name: "Guangzhou", lat: 23.1291, lon: 113.2644 },
      { name: "Urumqi", lat: 43.8256, lon: 87.6168 },
      { name: "Yinchuan", lat: 38.4872, lon: 106.2309 },
      { name: "Xi'an", lat: 34.3416, lon: 108.9398 }
    ]
  },
  {
    code: "KM", name: "Comoros", regionCode: "ME", subRegion: "AFRICA", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Moroni", lat: -11.7172, lon: 43.2473 }]
  },
  {
    code: "HR", name: "Croatia (Hrvatska)", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Zagreb", lat: 45.8150, lon: 15.9819 }]
  },
  {
    code: "CY", name: "Cyprus", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Nicosia", lat: 35.1856, lon: 33.3823 }]
  },
  {
    code: "CZ", name: "Czech Republic", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Prague", lat: 50.0755, lon: 14.4378 }]
  },
  {
    code: "DK", name: "Denmark", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Copenhagen", lat: 55.6761, lon: 12.5683 },
      { name: "Aarhus", lat: 56.1629, lon: 10.2039 }
    ]
  },
  {
    code: "DJ", name: "Djibouti", regionCode: "ME", subRegion: "AFRICA", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Djibouti City", lat: 11.8251, lon: 42.5903 }]
  },
  {
    code: "EG", name: "Egypt", regionCode: "ME", subRegion: "AFRICA", tzHours: 2.0, fajrAngle: 19.5, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Cairo", lat: 30.0444, lon: 31.2357 },
      { name: "Alexandria", lat: 31.2001, lon: 29.9187 },
      { name: "Giza", lat: 30.0131, lon: 31.2089 },
      { name: "Port Said", lat: 31.2653, lon: 32.3019 },
      { name: "Suez", lat: 29.9668, lon: 32.5498 },
      { name: "Luxor", lat: 25.6872, lon: 32.6396 },
      { name: "Aswan", lat: 24.0889, lon: 32.8998 }
    ]
  },
  {
    code: "ET", name: "Ethiopia", regionCode: "ME", subRegion: "AFRICA", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Addis Ababa", lat: 9.0320, lon: 38.7469 },
      { name: "Dire Dawa", lat: 9.6009, lon: 41.8501 }
    ]
  },
  {
    code: "FI", name: "Finland", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Helsinki", lat: 60.1699, lon: 24.9384 },
      { name: "Espoo", lat: 60.2055, lon: 24.6559 }
    ]
  },
  {
    code: "FR", name: "France", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Paris", lat: 48.8566, lon: 2.3522 },
      { name: "Marseille", lat: 43.2965, lon: 5.3698 },
      { name: "Lyon", lat: 45.7640, lon: 4.8357 },
      { name: "Toulouse", lat: 43.6047, lon: 1.4442 },
      { name: "Nice", lat: 43.7102, lon: 7.2620 },
      { name: "Lille", lat: 50.6292, lon: 3.0573 }
    ]
  },
  {
    code: "DE", name: "Germany", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Berlin", lat: 52.5200, lon: 13.4050 },
      { name: "Hamburg", lat: 53.5511, lon: 9.9937 },
      { name: "Munich", lat: 48.1351, lon: 11.5820 },
      { name: "Cologne", lat: 50.9375, lon: 6.9603 },
      { name: "Frankfurt", lat: 50.1109, lon: 8.6821 },
      { name: "Stuttgart", lat: 48.7758, lon: 9.1829 },
      { name: "Düsseldorf", lat: 51.2277, lon: 6.7735 }
    ]
  },
  {
    code: "GH", name: "Ghana", regionCode: "ME", subRegion: "AFRICA", tzHours: 0.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Accra", lat: 5.6037, lon: -0.1870 },
      { name: "Kumasi", lat: 6.6885, lon: -1.6244 }
    ]
  },
  {
    code: "GR", name: "Greece", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Athens", lat: 37.9838, lon: 23.7275 },
      { name: "Thessaloniki", lat: 40.6401, lon: 22.9444 }
    ]
  },
  {
    code: "GN", name: "Guinea", regionCode: "ME", subRegion: "AFRICA", tzHours: 0.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Conakry", lat: 9.6412, lon: -13.5784 }]
  },
  {
    code: "HK", name: "Hong Kong", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 8.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Hong Kong", lat: 22.3193, lon: 114.1694 }]
  },
  {
    code: "HU", name: "Hungary", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Budapest", lat: 47.4979, lon: 19.0402 }]
  },
  {
    code: "IN", name: "India", regionCode: "BD", subRegion: "SOUTH_ASIA", tzHours: 5.5, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
      { name: "New Delhi", lat: 28.6139, lon: 77.2090 },
      { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
      { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
      { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
      { name: "Chennai", lat: 13.0827, lon: 80.2707 },
      { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
      { name: "Pune", lat: 18.5204, lon: 73.8567 },
      { name: "Surat", lat: 21.1702, lon: 72.8311 },
      { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
      { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
      { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
      { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
      { name: "Patna", lat: 25.5941, lon: 85.1376 },
      { name: "Bhopal", lat: 23.2599, lon: 77.4126 },
      { name: "Guwahati", lat: 26.1445, lon: 91.7362 },
      { name: "Agartala", lat: 23.8315, lon: 91.2868 },
      { name: "Silchar", lat: 24.8333, lon: 92.7789 },
      { name: "Murshidabad", lat: 24.1759, lon: 88.2802 },
      { name: "Malda", lat: 25.0108, lon: 88.1411 },
      { name: "Srinagar", lat: 34.0837, lon: 74.7973 },
      { name: "Kochi", lat: 9.9312, lon: 76.2673 },
      { name: "Kozhikode", lat: 11.2588, lon: 75.7804 }
    ]
  },
  {
    code: "ID", name: "Indonesia", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 7.0, fajrAngle: 20.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Jakarta", lat: -6.2088, lon: 106.8456, tzHours: 7.0 },
      { name: "Surabaya", lat: -7.2575, lon: 112.7521, tzHours: 7.0 },
      { name: "Bandung", lat: -6.9175, lon: 107.6191, tzHours: 7.0 },
      { name: "Medan", lat: 3.5952, lon: 98.6722, tzHours: 7.0 },
      { name: "Semarang", lat: -6.9667, lon: 110.4167, tzHours: 7.0 },
      { name: "Makassar", lat: -5.1477, lon: 119.4327, tzHours: 8.0 },
      { name: "Banda Aceh", lat: 5.5483, lon: 95.3238, tzHours: 7.0 },
      { name: "Yogyakarta", lat: -7.7956, lon: 110.3695, tzHours: 7.0 }
    ]
  },
  {
    code: "IR", name: "Iran (Islamic Republic of)", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 3.5, fajrAngle: 17.7, ishaAngle: 14.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Tehran", lat: 35.6892, lon: 51.3890 },
      { name: "Mashhad", lat: 36.2605, lon: 59.6168 },
      { name: "Isfahan", lat: 32.6546, lon: 51.6680 },
      { name: "Shiraz", lat: 29.5918, lon: 52.5837 },
      { name: "Tabriz", lat: 38.0962, lon: 46.2738 },
      { name: "Qom", lat: 34.6416, lon: 50.8746 },
      { name: "Abadan", lat: 30.3392, lon: 48.3043 },
      { name: "Ahvaz", lat: 31.3183, lon: 48.6706 },
      { name: "Kermanshah", lat: 34.3142, lon: 47.0650 },
      { name: "Rasht", lat: 37.2808, lon: 49.5832 }
    ]
  },
  {
    code: "IQ", name: "Iraq", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 3.0, fajrAngle: 19.5, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Baghdad", lat: 33.3152, lon: 44.3661 },
      { name: "Basra", lat: 30.5081, lon: 47.7835 },
      { name: "Mosul", lat: 36.3489, lon: 43.1577 },
      { name: "Erbil", lat: 36.1901, lon: 44.0091 },
      { name: "Kirkuk", lat: 35.4681, lon: 44.3922 },
      { name: "Najaf", lat: 32.0000, lon: 44.3333 },
      { name: "Karbala", lat: 32.6160, lon: 44.0249 }
    ]
  },
  {
    code: "IE", name: "Ireland", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 0.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Dublin", lat: 53.3498, lon: -6.2603 },
      { name: "Cork", lat: 51.8985, lon: -8.4756 },
      { name: "Galway", lat: 53.2707, lon: -9.0568 }
    ]
  },
  {
    code: "IT", name: "Italy", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Rome", lat: 41.9028, lon: 12.4964 },
      { name: "Milan", lat: 45.4642, lon: 9.1900 },
      { name: "Naples", lat: 40.8518, lon: 14.2681 },
      { name: "Turin", lat: 45.0703, lon: 7.6869 },
      { name: "Venice", lat: 45.4408, lon: 12.3155 },
      { name: "Florence", lat: 43.7696, lon: 11.2558 },
      { name: "Bologna", lat: 44.4949, lon: 11.3426 }
    ]
  },
  {
    code: "JP", name: "Japan", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 9.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
      { name: "Osaka", lat: 34.6937, lon: 135.5023 },
      { name: "Nagoya", lat: 35.1815, lon: 136.9066 },
      { name: "Kyoto", lat: 35.0116, lon: 135.7681 },
      { name: "Fukuoka", lat: 33.5902, lon: 130.4017 }
    ]
  },
  {
    code: "JO", name: "Jordan", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Amman", lat: 31.9454, lon: 35.9284 },
      { name: "Zarqa", lat: 32.0608, lon: 36.0942 },
      { name: "Irbid", lat: 32.5568, lon: 35.8469 },
      { name: "Aqaba", lat: 29.5321, lon: 35.0063 }
    ]
  },
  {
    code: "KZ", name: "Kazakhstan", regionCode: "ME", subRegion: "CENTRAL_ASIA", tzHours: 5.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Almaty", lat: 43.2220, lon: 76.8512 },
      { name: "Astana", lat: 51.1694, lon: 71.4491 },
      { name: "Shymkent", lat: 42.3417, lon: 69.5901 }
    ]
  },
  {
    code: "KE", name: "Kenya", regionCode: "ME", subRegion: "AFRICA", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Nairobi", lat: -1.2921, lon: 36.8219 },
      { name: "Mombasa", lat: -4.0435, lon: 39.6682 }
    ]
  },
  {
    code: "KR", name: "South Korea", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 9.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Seoul", lat: 37.5665, lon: 126.9780 },
      { name: "Busan", lat: 35.1796, lon: 129.0756 },
      { name: "Incheon", lat: 37.4563, lon: 126.7052 }
    ]
  },
  {
    code: "KW", name: "Kuwait", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Kuwait City", lat: 29.3759, lon: 47.9774 },
      { name: "Al Ahmadi", lat: 29.0769, lon: 48.0839 },
      { name: "Hawalli", lat: 29.3328, lon: 48.0286 },
      { name: "Salmiya", lat: 29.3340, lon: 48.0768 }
    ]
  },
  {
    code: "KG", name: "Kyrgyzstan", regionCode: "ME", subRegion: "CENTRAL_ASIA", tzHours: 6.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Bishkek", lat: 42.8746, lon: 74.5698 },
      { name: "Osh", lat: 40.5140, lon: 72.8161 }
    ]
  },
  {
    code: "LB", name: "Lebanon", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Beirut", lat: 33.8938, lon: 35.5018 },
      { name: "Tripoli", lat: 34.4367, lon: 35.8497 },
      { name: "Sidon", lat: 33.5571, lon: 35.3729 }
    ]
  },
  {
    code: "LY", name: "Libyan Arab Jamahiriya", regionCode: "ME", subRegion: "AFRICA", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Tripoli", lat: 32.8872, lon: 13.1913 },
      { name: "Benghazi", lat: 32.1194, lon: 20.0868 },
      { name: "Misrata", lat: 32.3754, lon: 15.0925 }
    ]
  },
  {
    code: "MY", name: "Malaysia", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 8.0, fajrAngle: 20.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Kuala Lumpur", lat: 3.1390, lon: 101.6869 },
      { name: "George Town (Penang)", lat: 5.4141, lon: 100.3288 },
      { name: "Johor Bahru", lat: 1.4927, lon: 103.7414 },
      { name: "Ipoh", lat: 4.5975, lon: 101.0901 },
      { name: "Shah Alam", lat: 3.0733, lon: 101.5185 },
      { name: "Malacca City", lat: 2.1896, lon: 102.2501 },
      { name: "Kota Kinabalu", lat: 5.9804, lon: 116.0735 },
      { name: "Kuching", lat: 1.5533, lon: 110.3592 }
    ]
  },
  {
    code: "MV", name: "Maldives", regionCode: "BD", subRegion: "SOUTH_ASIA", tzHours: 5.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Malé", lat: 4.1755, lon: 73.5093 },
      { name: "Addu City", lat: -0.6301, lon: 73.1586 }
    ]
  },
  {
    code: "ML", name: "Mali", regionCode: "ME", subRegion: "AFRICA", tzHours: 0.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Bamako", lat: 12.6392, lon: -8.0029 },
      { name: "Timbuktu", lat: 16.7666, lon: -3.0026 }
    ]
  },
  {
    code: "MR", name: "Mauritania", regionCode: "ME", subRegion: "AFRICA", tzHours: 0.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Nouakchott", lat: 18.0735, lon: -15.9582 }]
  },
  {
    code: "MU", name: "Mauritius", regionCode: "ME", subRegion: "AFRICA", tzHours: 4.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Port Louis", lat: -20.1609, lon: 57.5012 }]
  },
  {
    code: "MA", name: "Morocco", regionCode: "ME", subRegion: "AFRICA", tzHours: 1.0, fajrAngle: 19.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Casablanca", lat: 33.5731, lon: -7.5898 },
      { name: "Rabat", lat: 34.0209, lon: -6.8416 },
      { name: "Marrakesh", lat: 31.6295, lon: -7.9811 },
      { name: "Fes", lat: 34.0181, lon: -5.0078 },
      { name: "Tangier", lat: 35.7595, lon: -5.8340 }
    ]
  },
  {
    code: "MM", name: "Myanmar", regionCode: "BD", subRegion: "SOUTH_ASIA", tzHours: 6.5, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Yangon", lat: 16.8409, lon: 96.1735 },
      { name: "Mandalay", lat: 21.9588, lon: 96.0891 },
      { name: "Naypyidaw", lat: 19.7633, lon: 96.0785 }
    ]
  },
  {
    code: "NP", name: "Nepal", regionCode: "BD", subRegion: "SOUTH_ASIA", tzHours: 5.75, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Kathmandu", lat: 27.7172, lon: 85.3240 },
      { name: "Pokhara", lat: 28.2096, lon: 83.9856 }
    ]
  },
  {
    code: "NL", name: "Netherlands", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Amsterdam", lat: 52.3676, lon: 4.9041 },
      { name: "Rotterdam", lat: 51.9244, lon: 4.4777 },
      { name: "The Hague", lat: 52.0705, lon: 4.3007 },
      { name: "Utrecht", lat: 52.0907, lon: 5.1214 }
    ]
  },
  {
    code: "NZ", name: "New Zealand", regionCode: "WEST", subRegion: "OCEANIA", tzHours: 12.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Auckland", lat: -36.8485, lon: 174.7633 },
      { name: "Wellington", lat: -41.2866, lon: 174.7756 },
      { name: "Christchurch", lat: -43.5320, lon: 172.6306 }
    ]
  },
  {
    code: "NE", name: "Niger", regionCode: "ME", subRegion: "AFRICA", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Niamey", lat: 13.5116, lon: 2.1254 }]
  },
  {
    code: "NG", name: "Nigeria", regionCode: "ME", subRegion: "AFRICA", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Lagos", lat: 6.5244, lon: 3.3792 },
      { name: "Abuja", lat: 9.0765, lon: 7.3986 },
      { name: "Kano", lat: 12.0022, lon: 8.5920 },
      { name: "Ibadan", lat: 7.3775, lon: 3.9470 },
      { name: "Kaduna", lat: 10.5105, lon: 7.4165 }
    ]
  },
  {
    code: "NO", name: "Norway", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Oslo", lat: 59.9139, lon: 10.7522 },
      { name: "Bergen", lat: 60.3913, lon: 5.3221 },
      { name: "Stavanger", lat: 58.9700, lon: 5.7331 }
    ]
  },
  {
    code: "OM", name: "Oman", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 4.0, fajrAngle: 18.2, ishaAngle: 18.2, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Muscat", lat: 23.5880, lon: 58.3829 },
      { name: "Salalah", lat: 17.0151, lon: 54.0924 },
      { name: "Sohar", lat: 24.3461, lon: 56.7075 },
      { name: "Nizwa", lat: 22.9333, lon: 57.5333 }
    ]
  },
  {
    code: "PK", name: "Pakistan", regionCode: "BD", subRegion: "SOUTH_ASIA", tzHours: 5.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Karachi", lat: 24.8607, lon: 67.0011 },
      { name: "Lahore", lat: 31.5204, lon: 74.3587 },
      { name: "Islamabad", lat: 33.6844, lon: 73.0479 },
      { name: "Rawalpindi", lat: 33.5651, lon: 73.0169 },
      { name: "Faisalabad", lat: 31.4504, lon: 73.1350 },
      { name: "Multan", lat: 30.1575, lon: 71.5249 },
      { name: "Peshawar", lat: 34.0151, lon: 71.5249 },
      { name: "Quetta", lat: 30.1798, lon: 66.9750 },
      { name: "Sialkot", lat: 32.4945, lon: 74.5229 },
      { name: "Gujranwala", lat: 32.1877, lon: 74.1945 }
    ]
  },
  {
    code: "PS", name: "Palestine", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Jerusalem (Al-Quds)", lat: 31.7683, lon: 35.2137 },
      { name: "Gaza", lat: 31.5017, lon: 34.4668 },
      { name: "Ramallah", lat: 31.9038, lon: 35.2034 },
      { name: "Hebron (Al-Khalil)", lat: 31.5326, lon: 35.0998 },
      { name: "Nablus", lat: 32.2211, lon: 35.2544 }
    ]
  },
  {
    code: "PH", name: "Philippines", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 8.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Manila", lat: 14.5995, lon: 120.9842 },
      { name: "Davao City", lat: 7.1907, lon: 125.4553 },
      { name: "Zamboanga City", lat: 6.9214, lon: 122.0790 }
    ]
  },
  {
    code: "PL", name: "Poland", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Warsaw", lat: 52.2297, lon: 21.0122 },
      { name: "Kraków", lat: 50.0647, lon: 19.9450 }
    ]
  },
  {
    code: "PT", name: "Portugal", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 0.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Lisbon", lat: 38.7223, lon: -9.1393 },
      { name: "Porto", lat: 41.1579, lon: -8.6291 }
    ]
  },
  {
    code: "QA", name: "Qatar", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 0, ishaFixedMins: 90, asrShadowFactor: 1,
    cities: [
      { name: "Doha", lat: 25.2854, lon: 51.5310 },
      { name: "Al Rayyan", lat: 25.2919, lon: 51.4244 },
      { name: "Al Wakrah", lat: 25.1715, lon: 51.6034 },
      { name: "Al Khor", lat: 25.6804, lon: 51.4969 }
    ]
  },
  {
    code: "RO", name: "Romania", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Bucharest", lat: 44.4268, lon: 26.1025 }]
  },
  {
    code: "RU", name: "Russian Federation", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Moscow", lat: 55.7558, lon: 37.6173, tzHours: 3.0 },
      { name: "Saint Petersburg", lat: 59.9311, lon: 30.3609, tzHours: 3.0 },
      { name: "Kazan", lat: 55.7961, lon: 49.1064, tzHours: 3.0 },
      { name: "Makhachkala", lat: 42.9849, lon: 47.5047, tzHours: 3.0 },
      { name: "Grozny", lat: 43.3189, lon: 45.6981, tzHours: 3.0 },
      { name: "Ufa", lat: 54.7388, lon: 55.9721, tzHours: 5.0 }
    ]
  },
  {
    code: "SA", name: "Saudi Arabia", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 3.0, fajrAngle: 18.5, ishaAngle: 0, ishaFixedMins: 90, asrShadowFactor: 1,
    cities: [
      { name: "Makkah", lat: 21.4225, lon: 39.8262 },
      { name: "Madinah", lat: 24.4672, lon: 39.6112 },
      { name: "Riyadh", lat: 24.7136, lon: 46.6753 },
      { name: "Jeddah", lat: 21.5433, lon: 39.1728 },
      { name: "Dammam", lat: 26.4207, lon: 50.0888 },
      { name: "Taif", lat: 21.2703, lon: 40.4158 },
      { name: "Tabuk", lat: 28.3835, lon: 36.5662 },
      { name: "Abha", lat: 18.2164, lon: 42.5053 },
      { name: "Buraidah", lat: 26.3260, lon: 43.9750 },
      { name: "Khobar", lat: 26.2172, lon: 50.1971 },
      { name: "Jubail", lat: 27.0116, lon: 49.6583 },
      { name: "Hail", lat: 27.5114, lon: 41.7208 },
      { name: "Najran", lat: 17.4924, lon: 44.1277 },
      { name: "Jazan", lat: 16.8892, lon: 42.5511 },
      { name: "Yanbu", lat: 24.0891, lon: 38.0637 }
    ]
  },
  {
    code: "SN", name: "Senegal", regionCode: "ME", subRegion: "AFRICA", tzHours: 0.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Dakar", lat: 14.7167, lon: -17.4677 }]
  },
  {
    code: "SG", name: "Singapore", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 8.0, fajrAngle: 20.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Singapore", lat: 1.3521, lon: 103.8198 }]
  },
  {
    code: "SO", name: "Somalia", regionCode: "ME", subRegion: "AFRICA", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Mogadishu", lat: 2.0469, lon: 45.3182 },
      { name: "Hargeisa", lat: 9.5600, lon: 44.0650 }
    ]
  },
  {
    code: "ZA", name: "South Africa", regionCode: "ME", subRegion: "AFRICA", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Johannesburg", lat: -26.2041, lon: 28.0473 },
      { name: "Cape Town", lat: -33.9249, lon: 18.4241 },
      { name: "Durban", lat: -29.8587, lon: 31.0218 },
      { name: "Pretoria", lat: -25.7479, lon: 28.2293 }
    ]
  },
  {
    code: "ES", name: "Spain", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Madrid", lat: 40.4168, lon: -3.7038 },
      { name: "Barcelona", lat: 41.3851, lon: 2.1734 },
      { name: "Valencia", lat: 39.4699, lon: -0.3763 },
      { name: "Seville", lat: 37.3891, lon: -5.9845 },
      { name: "Granada", lat: 37.1773, lon: -3.5986 },
      { name: "Cordoba", lat: 37.8882, lon: -4.7794 }
    ]
  },
  {
    code: "LK", name: "Sri Lanka", regionCode: "BD", subRegion: "SOUTH_ASIA", tzHours: 5.5, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Colombo", lat: 6.9271, lon: 79.8612 },
      { name: "Kandy", lat: 7.2906, lon: 80.6337 },
      { name: "Galle", lat: 6.0535, lon: 80.2210 }
    ]
  },
  {
    code: "SD", name: "Sudan", regionCode: "ME", subRegion: "AFRICA", tzHours: 2.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Khartoum", lat: 15.5007, lon: 32.5599 },
      { name: "Omdurman", lat: 15.6445, lon: 32.4777 },
      { name: "Port Sudan", lat: 19.6158, lon: 37.2164 }
    ]
  },
  {
    code: "SE", name: "Sweden", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Stockholm", lat: 59.3293, lon: 18.0686 },
      { name: "Gothenburg", lat: 57.7089, lon: 11.9746 },
      { name: "Malmö", lat: 55.6050, lon: 13.0038 }
    ]
  },
  {
    code: "CH", name: "Switzerland", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Zurich", lat: 47.3769, lon: 8.5417 },
      { name: "Geneva", lat: 46.2044, lon: 6.1432 },
      { name: "Basel", lat: 47.5596, lon: 7.5886 },
      { name: "Bern", lat: 46.9480, lon: 7.4474 }
    ]
  },
  {
    code: "SY", name: "Syrian Arab Republic", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.5, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Damascus", lat: 33.5138, lon: 36.2765 },
      { name: "Aleppo", lat: 36.2021, lon: 37.1343 },
      { name: "Homs", lat: 34.7324, lon: 36.7137 }
    ]
  },
  {
    code: "TJ", name: "Tajikistan", regionCode: "ME", subRegion: "CENTRAL_ASIA", tzHours: 5.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [{ name: "Dushanbe", lat: 38.5598, lon: 68.7870 }]
  },
  {
    code: "TZ", name: "Tanzania", regionCode: "ME", subRegion: "AFRICA", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Dar es Salaam", lat: -6.7924, lon: 39.2083 },
      { name: "Zanzibar City", lat: -6.1659, lon: 39.2026 }
    ]
  },
  {
    code: "TH", name: "Thailand", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 7.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Bangkok", lat: 13.7563, lon: 100.5018 },
      { name: "Phuket", lat: 7.8804, lon: 98.3923 },
      { name: "Hat Yai", lat: 7.0086, lon: 100.4747 }
    ]
  },
  {
    code: "TN", name: "Tunisia", regionCode: "ME", subRegion: "AFRICA", tzHours: 1.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Tunis", lat: 36.8065, lon: 10.1815 },
      { name: "Sfax", lat: 34.7406, lon: 10.7603 }
    ]
  },
  {
    code: "TR", name: "Turkey", regionCode: "ME", subRegion: "TURKEY", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Istanbul", lat: 41.0082, lon: 28.9784 },
      { name: "Ankara", lat: 39.9334, lon: 32.8597 },
      { name: "Izmir", lat: 38.4237, lon: 27.1428 },
      { name: "Bursa", lat: 40.1885, lon: 29.0610 },
      { name: "Konya", lat: 37.8746, lon: 32.4932 },
      { name: "Antalya", lat: 36.8969, lon: 30.7133 },
      { name: "Adana", lat: 37.0000, lon: 35.3213 },
      { name: "Gaziantep", lat: 37.0662, lon: 37.3833 }
    ]
  },
  {
    code: "TM", name: "Turkmenistan", regionCode: "ME", subRegion: "CENTRAL_ASIA", tzHours: 5.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [{ name: "Ashgabat", lat: 37.9601, lon: 58.3261 }]
  },
  {
    code: "UG", name: "Uganda", regionCode: "ME", subRegion: "AFRICA", tzHours: 3.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [{ name: "Kampala", lat: 0.3476, lon: 32.5825 }]
  },
  {
    code: "AE", name: "United Arab Emirates", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 4.0, fajrAngle: 18.2, ishaAngle: 18.2, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Dubai", lat: 25.2048, lon: 55.2708 },
      { name: "Abu Dhabi", lat: 24.4539, lon: 54.3773 },
      { name: "Sharjah", lat: 25.3463, lon: 55.4209 },
      { name: "Ajman", lat: 25.4052, lon: 55.5136 },
      { name: "Al Ain", lat: 24.1302, lon: 55.8023 },
      { name: "Ras Al Khaimah", lat: 25.7895, lon: 55.9432 },
      { name: "Fujairah", lat: 25.1288, lon: 56.3265 }
    ]
  },
  {
    code: "GB", name: "United Kingdom", regionCode: "WEST", subRegion: "WESTERN_EUROPE", tzHours: 0.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "London", lat: 51.5074, lon: -0.1278 },
      { name: "Birmingham", lat: 52.4862, lon: -1.8904 },
      { name: "Manchester", lat: 53.4808, lon: -2.2426 },
      { name: "Bradford", lat: 53.7960, lon: -1.7594 },
      { name: "Leeds", lat: 53.8008, lon: -1.5491 },
      { name: "Glasgow", lat: 55.8642, lon: -4.2518 },
      { name: "Liverpool", lat: 53.4084, lon: -2.9916 },
      { name: "Sheffield", lat: 53.3811, lon: -1.4701 },
      { name: "Edinburgh", lat: 55.9533, lon: -3.1883 },
      { name: "Cardiff", lat: 51.4816, lon: -3.1791 }
    ]
  },
  {
    code: "US", name: "United States", regionCode: "WEST", subRegion: "NORTH_AMERICA", tzHours: -5.0, fajrAngle: 15.0, ishaAngle: 15.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "New York", lat: 40.7128, lon: -74.0060, tzHours: -5.0 },
      { name: "Chicago", lat: 41.8781, lon: -87.6298, tzHours: -6.0 },
      { name: "Detroit", lat: 42.3314, lon: -83.0458, tzHours: -5.0 },
      { name: "Houston", lat: 29.7604, lon: -95.3698, tzHours: -6.0 },
      { name: "Dallas", lat: 32.7767, lon: -96.7970, tzHours: -6.0 },
      { name: "Los Angeles", lat: 34.0522, lon: -118.2437, tzHours: -8.0 },
      { name: "San Francisco", lat: 37.7749, lon: -122.4194, tzHours: -8.0 },
      { name: "Washington D.C.", lat: 38.9072, lon: -77.0369, tzHours: -5.0 },
      { name: "Philadelphia", lat: 39.9526, lon: -75.1652, tzHours: -5.0 },
      { name: "Atlanta", lat: 33.7490, lon: -84.3880, tzHours: -5.0 },
      { name: "Miami", lat: 25.7617, lon: -80.1918, tzHours: -5.0 },
      { name: "Boston", lat: 42.3601, lon: -71.0589, tzHours: -5.0 },
      { name: "Seattle", lat: 47.6062, lon: -122.3321, tzHours: -8.0 }
    ]
  },
  {
    code: "UZ", name: "Uzbekistan", regionCode: "ME", subRegion: "CENTRAL_ASIA", tzHours: 5.0, fajrAngle: 18.0, ishaAngle: 17.0, ishaFixedMins: 0, asrShadowFactor: 2,
    cities: [
      { name: "Tashkent", lat: 41.2995, lon: 69.2401 },
      { name: "Samarkand", lat: 39.6542, lon: 66.9597 },
      { name: "Bukhara", lat: 39.7747, lon: 64.4286 }
    ]
  },
  {
    code: "VN", name: "Vietnam", regionCode: "ME", subRegion: "SE_ASIA", tzHours: 7.0, fajrAngle: 18.0, ishaAngle: 18.0, ishaFixedMins: 0, asrShadowFactor: 1,
    cities: [
      { name: "Ho Chi Minh City", lat: 10.8231, lon: 106.6297 },
      { name: "Hanoi", lat: 21.0285, lon: 105.8542 }
    ]
  },
  {
    code: "YE", name: "Yemen", regionCode: "ME", subRegion: "MIDDLE_EAST", tzHours: 3.0, fajrAngle: 18.5, ishaAngle: 0, ishaFixedMins: 90, asrShadowFactor: 1,
    cities: [
      { name: "Sana'a", lat: 15.3694, lon: 44.1910 },
      { name: "Aden", lat: 12.7855, lon: 45.0187 },
      { name: "Taiz", lat: 13.5795, lon: 44.0209 },
      { name: "Mukalla", lat: 14.5425, lon: 49.1242 }
    ]
  }
]);

