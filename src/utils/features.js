// SHE360 AI — Shared utilities: multilingual, safety profile, wellness, encryption, offline mode
// ─── MULTILINGUAL SUPPORT ───────────────────────────────────────────────────

export const LANGUAGES = [
  { code: 'en-IN', label: 'English', flag: '🇮🇳' },
  { code: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn-IN', label: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta-IN', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te-IN', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr-IN', label: 'मराठी', flag: '🇮🇳' },
  { code: 'gu-IN', label: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

export const VOICE_KEYWORDS = {
  'en-IN': ['help', 'danger', 'bachao', 'emergency', 'sos'],
  'hi-IN': ['मदद', 'खतरा', 'बचाओ', 'emergency', 'sos', 'bachao'],
  'bn-IN': ['সাহায্য', 'বিপদ', 'bachao', 'emergency', 'sos'],
  'ta-IN': ['உதவி', 'ஆபத்து', 'bachao', 'emergency', 'sos'],
  'te-IN': ['సహాయం', 'ప్రమాదం', 'bachao', 'emergency', 'sos'],
  'mr-IN': ['मदत', 'धोका', 'bachao', 'emergency', 'sos'],
  'gu-IN': ['મદદ', 'ખતરો', 'bachao', 'emergency', 'sos'],
  'kn-IN': ['ಸಹಾಯ', 'ಅಪಾಯ', 'bachao', 'emergency', 'sos'],
};

export const LANGUAGE_NAMES = {
  'en-IN': 'English',
  'hi-IN': 'Hindi',
  'bn-IN': 'Bengali',
  'ta-IN': 'Tamil',
  'te-IN': 'Telugu',
  'mr-IN': 'Marathi',
  'gu-IN': 'Gujarati',
  'kn-IN': 'Kannada',
};

export const detectMessageLanguage = (text) => {
  if (!text?.trim()) return 'en-IN';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
  if (/[\u0900-\u097F]/.test(text)) {
    const marathiHints = ['आहे', 'मी', 'तुम्ही', 'नाही', 'काय', 'माझे', 'तुझे'];
    if (marathiHints.some(w => text.includes(w))) return 'mr-IN';
    return 'hi-IN';
  }
  return 'en-IN';
};

export const CHAT_GREETINGS = {
  'en-IN': "Hello! 💜 I'm your Mindful AI Assistant. How are you feeling today? You can share anything — this is your safe space.",
  'hi-IN': 'नमस्ते! 💜 मैं आपकी Mindful AI सहायिका हूँ। आज आप कैसा महसूस कर रही हैं? कुछ भी साझा करें — यह आपकी सुरक्षित जगह है।',
  'bn-IN': 'নমস্কার! 💜 আমি আপনার Mindful AI সহায়ক। আজ আপনি কেমন অনুভব করছেন? যা খুশি শেয়ার করুন — এটি আপনার নিরাপদ স্থান।',
  'ta-IN': 'வணக்கம்! 💜 நான் உங்கள் Mindful AI உதவியாளர். இன்று நீங்கள் எப்படி உணர்கிறீர்கள்? எதையும் பகிரலாம் — இது உங்கள் பாதுகாப்பான இடம்.',
  'te-IN': 'నమస్కారం! 💜 నేను మీ Mindful AI సహాయకురాలిని. ఈరోజు మీరు ఎలా భావిస్తున్నారు? ఏదైనా పంచుకోండి — ఇది మీ సురక్షిత ప్రదేశం.',
  'mr-IN': 'नमस्कार! 💜 मी तुमची Mindful AI सहाय्यक आहे. आज तुम्ही कसे वाटत आहे? काहीही सामायिक करा — ही तुमची सुरक्षित जागा आहे.',
  'gu-IN': 'નમસ્તે! 💜 હું તમારી Mindful AI સહાયક છું. આજે તમે કેવું અનુભવો છો? કંઈ પણ શેર કરો — આ તમારી સુરક્ષિત જગ્યા છે.',
  'kn-IN': 'ನಮಸ್ಕಾರ! 💜 ನಾನು ನಿಮ್ಮ Mindful AI ಸಹಾಯಕ. ಇಂದು ನೀವು ಹೇಗೆ ಭಾವಿಸುತ್ತಿದ್ದೀರಿ? ಏನನ್ನಾದರೂ ಹಂಚಿಕೊಳ್ಳಿ — ಇದು ನಿಮ್ಮ ಸುರಕ್ಷಿತ ಸ್ಥಳ.',
};

export const CHAT_FALLBACK = {
  'en-IN': "I'm having trouble connecting right now. Please try again later. 💜",
  'hi-IN': 'अभी कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें। 💜',
  'bn-IN': 'এখন সংযোগে সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন। 💜',
  'ta-IN': 'இப்போது இணைப்பில் சிக்கல் உள்ளது. பிறகு முயற்சிக்கவும். 💜',
  'te-IN': 'ఇప్పుడు కనెక్ట్ అవ్వడంలో సమస్య ఉంది. దయచేసి తర్వాత మళ్ళీ ప్రయత్నించండి. 💜',
  'mr-IN': 'आत्ता कनेक्ट करण्यात अडचण येत आहे. कृपया नंतर पुन्हा प्रयत्न करा. 💜',
  'gu-IN': 'હમણાં કનેક્ટ કરવામાં સમસ્યા છે. કૃપા કરીને પછી ફરી પ્રયાસ કરો. 💜',
  'kn-IN': 'ಈಗ ಸಂಪರ್ಕಿಸಲು ಸಮಸ್ಯೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ. 💜',
};

export const CHAT_PLACEHOLDERS = {
  'en-IN': 'Share your thoughts... (Enter to send)',
  'hi-IN': 'अपने विचार साझा करें... (भेजने के लिए Enter)',
  'bn-IN': 'আপনার কথা শেয়ার করুন... (পাঠাতে Enter)',
  'ta-IN': 'உங்கள் எண்ணங்களை பகிருங்கள்... (அனுப்ப Enter)',
  'te-IN': 'మీ ఆలోచనలు పంచుకోండి... (పంపడానికి Enter)',
  'mr-IN': 'तुमचे विचार सामायिक करा... (पाठवण्यासाठी Enter)',
  'gu-IN': 'તમારા વિચારો શેર કરો... (મોકલવા Enter)',
  'kn-IN': 'ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ... (ಕಳುಹಿಸಲು Enter)',
};

export const UI_STRINGS = {
  'en-IN': { sos: 'Emergency SOS', voiceGuard: 'Voice Guard', safeCheckIn: 'I reached safely', help: 'Help' },
  'hi-IN': { sos: 'आपातकालीन SOS', voiceGuard: 'वॉयस गार्ड', safeCheckIn: 'मैं सुरक्षित पहुँच गई', help: 'मदद' },
  'bn-IN': { sos: 'জরুরি SOS', voiceGuard: 'ভয়েস গার্ড', safeCheckIn: 'আমি নিরাপদে পৌঁছেছি', help: 'সাহায্য' },
  'ta-IN': { sos: 'அவசர SOS', voiceGuard: 'குரல் பாதுகாப்பு', safeCheckIn: 'நான் பாதுகாப்பாக வந்துவிட்டேன்', help: 'உதவி' },
  'te-IN': { sos: 'అత్యవసర SOS', voiceGuard: 'వాయిస్ గార్డ్', safeCheckIn: 'నేను సురక్షితంగా చేరాను', help: 'సహాయం' },
  'mr-IN': { sos: 'आणीबाणी SOS', voiceGuard: 'व्हॉइस गार्ड', safeCheckIn: 'मी सुरक्षितपणे पोहोचले', help: 'मदत' },
  'gu-IN': { sos: 'ઇમરજન્સી SOS', voiceGuard: 'વોઇસ ગાર્ડ', safeCheckIn: 'હું સુરક્ષિત પહોંચી ગઈ', help: 'મદદ' },
  'kn-IN': { sos: 'ತುರ್ತು SOS', voiceGuard: 'ವಾಯ್ಸ್ ಗಾರ್ಡ್', safeCheckIn: 'ನಾನು ಸುರಕ್ಷಿತವಾಗಿ ಬಂದಿದ್ದೇನೆ', help: 'ಸಹಾಯ' },
};

// ─── CONTACT ROLES ────────────────────────────────────────────────────────────

export const CONTACT_ROLES = {
  family: { label: 'Family', color: '#9D8DF1', access: ['location', 'sos', 'checkin', 'mood'] },
  friend: { label: 'Friend', color: '#4FD1C5', access: ['checkin', 'sos'] },
  guardian: { label: 'Emergency Guardian', color: '#FF4B91', access: ['location', 'sos', 'checkin', 'mood', 'health', 'vault'] },
};

export const getContactAccess = (role) => CONTACT_ROLES[role]?.access ?? ['sos'];

// ─── AI PERSONAL SAFETY PROFILE ───────────────────────────────────────────────

export const generateSafetyRiskModel = (profile, moodHistory = []) => {
  let riskScore = 30;
  const suggestions = [];

  const hour = new Date().getHours();
  const isLateNight = hour >= 22 || hour < 6;
  const isEvening = hour >= 18 && hour < 22;

  if (profile.travelAlone) { riskScore += 15; suggestions.push('Share live location when traveling alone'); }
  if (profile.lateNightCommute) { riskScore += 20; suggestions.push('Use well-lit routes after 10 PM'); }
  if (profile.publicTransport) { riskScore += 10; suggestions.push('Sit near the driver or women-only section'); }
  if (isLateNight) { riskScore += 15; suggestions.push('Late night detected — enable Voice Guard'); }
  if (isEvening) { riskScore += 8; suggestions.push('Evening commute — check verified safe spaces nearby'); }

  const recentMoods = moodHistory.slice(-3);
  const cloudyCount = recentMoods.filter(m => m.label === 'Cloudy').length;
  if (cloudyCount >= 2) {
    riskScore += 10;
    suggestions.push('Mood trend suggests stress — practice mindfulness before travel');
  }

  if (profile.routine === 'office') suggestions.push('Office commute: leave 15 mins early for safer routes');
  if (profile.routine === 'student') suggestions.push('Campus safety: save verified safe spaces on your route');
  if (profile.routine === 'night-shift') { riskScore += 12; suggestions.push('Night shift: pre-share route with guardian contacts'); }

  const level = riskScore > 65 ? 'High' : riskScore > 45 ? 'Moderate' : 'Low';
  const levelColor = level === 'High' ? '#FF4B91' : level === 'Moderate' ? '#F6AD55' : '#4FD1C5';

  return {
    riskScore: Math.min(riskScore, 100),
    level,
    levelColor,
    suggestions: suggestions.slice(0, 4),
    timeContext: isLateNight ? 'Late Night' : isEvening ? 'Evening' : 'Daytime',
    safeRouteTip: level === 'High'
      ? 'Avoid isolated shortcuts. Use main roads with CCTV coverage.'
      : 'Current conditions are favorable. Stay aware of surroundings.',
  };
};

// ─── ADAPTIVE WELLNESS PLANS ──────────────────────────────────────────────────

export const generateWeeklyWellnessPlan = (moodHistory = [], healthReports = [], sleepHours = 7, activityLevel = 'moderate') => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const recentMoods = moodHistory.slice(-7);
  const avgMood = recentMoods.length
    ? recentMoods.reduce((s, m) => s + (m.label === 'Sunny' ? 3 : m.label === 'Neutral' ? 2 : 1), 0) / recentMoods.length
    : 2;
  const lastHealth = healthReports[0];
  const highHealthRisk = lastHealth?.result?.risk_level === 'High';

  const activities = {
    mindfulness: avgMood < 2 ? '15-min guided meditation' : '5-min breathing exercise',
    exercise: activityLevel === 'low' ? '20-min gentle walk' : activityLevel === 'high' ? '30-min cardio' : '15-min yoga',
    hydration: sleepHours < 6 ? '3L water + electrolytes' : '2.5L water daily',
    sleep: sleepHours < 7 ? 'Target 8hrs sleep, no screens after 10 PM' : 'Maintain 7-8hrs consistent sleep',
    nutrition: highHealthRisk ? 'Iron-rich foods, consult doctor' : 'Balanced meals with fruits & vegetables',
    safety: 'Daily safety check-in with trusted contact',
  };

  return days.map((day, i) => ({
    day,
    focus: i % 3 === 0 ? 'Mind & Body' : i % 3 === 1 ? 'Safety & Rest' : 'Nutrition & Activity',
    tasks: [
      { type: 'mindfulness', task: activities.mindfulness, done: false },
      { type: 'exercise', task: i % 2 === 0 ? activities.exercise : '10-min stretching', done: false },
      { type: 'hydration', task: activities.hydration, done: false },
      ...(i === 0 || i === 3 ? [{ type: 'safety', task: activities.safety, done: false }] : []),
      ...(i === 6 ? [{ type: 'sleep', task: activities.sleep, done: false }] : []),
    ],
    moodTarget: avgMood < 2 ? 'Aim for Neutral' : 'Maintain Sunny',
  }));
};

// ─── CONTEXT-AWARE REMINDERS ────────────────────────────────────────────────

export const generateContextReminders = (profile, moodHistory = [], checkIns = []) => {
  const reminders = [];
  const hour = new Date().getHours();

  if (hour >= 22 || hour < 5) {
    reminders.push({ id: 'late-travel', icon: '🌙', text: 'Late-night travel detected. Share live location with a guardian.', priority: 'high' });
  }
  if (hour >= 12 && hour <= 14) {
    reminders.push({ id: 'hydration', icon: '💧', text: 'Midday reminder: Stay hydrated — aim for 2 glasses of water now.', priority: 'normal' });
  }
  const lastMood = moodHistory[moodHistory.length - 1];
  if (lastMood?.label === 'Cloudy') {
    reminders.push({ id: 'mindfulness', icon: '🧘', text: 'Stressful period detected. Try a 5-min mindfulness exercise.', priority: 'high' });
  }
  if (profile.lateNightCommute && hour >= 18) {
    reminders.push({ id: 'commute', icon: '🚌', text: 'Evening commute ahead — check safe route before leaving.', priority: 'normal' });
  }
  const today = new Date().toDateString();
  const todayCheckIn = checkIns.find(c => new Date(c.date).toDateString() === today);
  if (!todayCheckIn && hour >= 20) {
    reminders.push({ id: 'checkin', icon: '✅', text: 'Haven\'t checked in today. Let your trusted circle know you\'re safe.', priority: 'normal' });
  }
  return reminders;
};

// ─── WELLNESS CHALLENGES ─────────────────────────────────────────────────────

export const DEFAULT_CHALLENGES = [
  { id: 'hydration-7', title: 'Hydration Hero', desc: 'Drink 8 glasses of water for 7 days', icon: '💧', target: 7, type: 'hydration' },
  { id: 'mindful-5', title: 'Mindful Moments', desc: 'Complete 5 mindfulness sessions', icon: '🧘', target: 5, type: 'mindfulness' },
  { id: 'safety-14', title: 'Safety Streak', desc: '14-day safety check-in streak', icon: '🛡️', target: 14, type: 'safety' },
  { id: 'walk-10', title: 'Step Up', desc: '10 days of 20-min walks', icon: '🚶', target: 10, type: 'exercise' },
  { id: 'mood-7', title: 'Mood Tracker', desc: 'Log mood for 7 consecutive days', icon: '💜', target: 7, type: 'mood' },
];

export const ACHIEVEMENTS = [
  { id: 'first-checkin', title: 'First Check-in', desc: 'Completed your first safety check-in', icon: '⭐' },
  { id: 'week-streak', title: 'Week Warrior', desc: '7-day activity streak', icon: '🔥' },
  { id: 'guardian-setup', title: 'Guardian Ready', desc: 'Added an emergency guardian contact', icon: '🛡️' },
  { id: 'wellness-complete', title: 'Wellness Champion', desc: 'Completed a full weekly wellness plan', icon: '🏆' },
  { id: 'vault-secured', title: 'Vault Secured', desc: 'Encrypted your personal data vault', icon: '🔐' },
];

// ─── VERIFIED SAFE SPACES ─────────────────────────────────────────────────────

export const DEFAULT_SAFE_SPACES = [
  { id: 1, name: 'Delhi University — North Campus', type: 'Campus', partner: 'DU Safety Cell', verified: true, address: 'Delhi 110007', hours: '24/7' },
  { id: 2, name: 'Apollo Pharmacy — Connaught Place', type: 'Business', partner: 'Apollo Hospitals', verified: true, address: 'CP, New Delhi', hours: '8 AM - 11 PM' },
  { id: 3, name: 'Infosys Campus — Gurugram', type: 'Organization', partner: 'Infosys SHE', verified: true, address: 'Sector 60, Gurugram', hours: '24/7' },
  { id: 4, name: 'Metro Station — Rajiv Chowk', type: 'Transit', partner: 'DMRC Women Safety', verified: true, address: 'Connaught Place Metro', hours: '5 AM - 11 PM' },
];

// ─── ENCRYPTION (Web Crypto API) ──────────────────────────────────────────────

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const deriveKey = async (passphrase, salt) => {
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encryptVaultData = async (data, passphrase) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(data)));
  return {
    salt: Array.from(salt),
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  };
};

export const decryptVaultData = async (encrypted, passphrase) => {
  const salt = new Uint8Array(encrypted.salt);
  const iv = new Uint8Array(encrypted.iv);
  const data = new Uint8Array(encrypted.data);
  const key = await deriveKey(passphrase, salt);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return JSON.parse(decoder.decode(decrypted));
};

// ─── OFFLINE EMERGENCY MODE ───────────────────────────────────────────────────

export const cacheEmergencyData = (contacts, profile) => {
  const emergencyCache = {
    contacts: contacts.filter(c => c.role === 'guardian' || !c.role).map(c => ({ name: c.name, phone: c.phone, role: c.role })),
    userName: profile.userName,
    bloodGroup: profile.bloodGroup || 'Not set',
    medicalNotes: profile.medicalNotes || '',
    cachedAt: new Date().toISOString(),
  };
  localStorage.setItem('she360-offline-emergency', JSON.stringify(emergencyCache));
  return emergencyCache;
};

export const getOfflineEmergencyData = () => {
  try {
    const cached = localStorage.getItem('she360-offline-emergency');
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
};

export const isOnline = () => navigator.onLine;

// ─── SMART COMMUTE ────────────────────────────────────────────────────────────

export const suggestCommuteTime = (event) => {
  const eventTime = new Date(event.datetime);
  const now = new Date();
  const diffMins = (eventTime - now) / 60000;
  const travelMins = event.travelMins || 30;
  const safetyBuffer = event.isLateNight ? 20 : 10;
  const departBy = new Date(eventTime.getTime() - (travelMins + safetyBuffer) * 60000);
  const route = event.isLateNight ? 'Main roads with CCTV (safest)' : 'Balanced route (safe + fast)';

  return {
    eventTitle: event.title,
    departBy: departBy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    safeRoute: route,
    minutesUntilDepart: Math.max(0, Math.round((departBy - now) / 60000)),
    isUpcoming: diffMins > 0 && diffMins < 480,
    safetyTip: event.isLateNight
      ? 'Late event — share live location with guardian before leaving'
      : 'Daytime commute — verified safe spaces available on route',
  };
};
