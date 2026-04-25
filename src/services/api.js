import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE_URL, timeout: 3000 });

// ─── LOCAL FALLBACK LOGIC ───────────────────────────────────────────────────

const localPCOS = (data) => {
  let score = 0;
  if (data.irregularPeriods) score += 40;
  if (data.weightGain) score += 20;
  if (data.hairGrowth) score += 20;
  if (data.acne) score += 20;
  if (data.cycleLength < 21 || data.cycleLength > 35) score += 10;
  const risk_level = score > 50 ? 'High' : score > 30 ? 'Moderate' : 'Low';
  return {
    risk_score: Math.min(score, 100),
    risk_level,
    recommendation:
      risk_level === 'High'
        ? '⚠️ Please consult a gynecologist soon.'
        : risk_level === 'Moderate'
        ? '🔍 Monitor your cycle and maintain a balanced diet.'
        : '✅ Your symptoms appear normal. Stay healthy!',
  };
};

const localAnemia = (data) => {
  let score = 0;
  if (data.fatigue) score += 40;
  if (data.paleSkin) score += 30;
  if (data.dizziness) score += 30;
  
  const risk_level = score >= 70 ? 'High' : score >= 40 ? 'Moderate' : 'Low';
  return {
    risk_score: score,
    risk_level,
    recommendation:
      risk_level === 'High'
        ? '⚠️ High risk of anemia. Please check your iron levels with a doctor.'
        : risk_level === 'Moderate'
        ? '🔍 Consider an iron-rich diet and monitor your symptoms.'
        : '✅ Your iron levels appear to be fine. Stay healthy!',
  };
};

const localSentiment = (text) => {
  const t = text.toLowerCase();
  const positive = ['happy', 'good', 'great', 'fine', 'excited', 'wonderful', 'love', 'joy', 'amazing', 'fantastic', 'better', 'nice', 'smile', 'glad', 'thank', 'hopeful'];
  const negative = ['sad', 'bad', 'upset', 'depressed', 'stressed', 'tired', 'angry', 'hate', 'scared', 'anxious', 'worry', 'pain', 'hurt', 'lonely', 'fear', 'overwhelm'];
  const pos = positive.filter(w => t.includes(w)).length;
  const neg = negative.filter(w => t.includes(w)).length;
  const sentiment = pos > neg ? 'Positive' : neg > pos ? 'Negative' : 'Neutral';
  return { sentiment, score: pos - neg };
};

const localChatFallback = (text) => {
  const { sentiment } = localSentiment(text);
  const AI_RESPONSES = {
    Negative: [
      "I hear that you're feeling a bit down. 💜 Remember, it's okay to have these moments. Would you like to try a quick 4-7-8 breathing exercise?",
      "Thank you for sharing that with me. You're not alone in this. Would you like some grounding techniques to help right now?",
      "It sounds tough. One step at a time is enough. I'm proud of you for reaching out. 🌸",
    ],
    Positive: [
      "That's wonderful to hear! 🌟 Your positivity is contagious. What made today feel good?",
      "So glad you're feeling this way! Celebrating these moments is so important. Keep going! 💫",
      "Absolutely love this energy! You deserve every good thing that comes your way. ☀️",
    ],
    Neutral: [
      "I'm listening. Tell me more — sometimes just talking it out helps clarity arrive. 🌿",
      "A balanced day has its own beauty. Is there anything on your mind you'd like to explore?",
      "Thank you for sharing. I'm here whenever you need to express more. How can I support you today?",
    ],
  };
  const responses = AI_RESPONSES[sentiment] || AI_RESPONSES.Neutral;
  return responses[Math.floor(Math.random() * responses.length)];
};

const localUnsafeZones = () => [
  { lat: 28.62, lng: 77.21, radius: 500, reason: 'High density / Low lighting' },
  { lat: 28.65, lng: 77.24, radius: 300, reason: 'Crowded area precaution' },
];

// ─── EXPORTED API FUNCTIONS ─────────────────────────────────────────────────

export const getPCOSPrediction = async (data) => {
  try {
    const res = await api.post('/predict/pcos', {
      irregular_periods: data.irregularPeriods,
      weight_gain: data.weightGain,
      hair_growth: data.hairGrowth,
      acne: data.acne,
      cycle_length: parseInt(data.cycleLength),
    });
    return res.data;
  } catch {
    return localPCOS(data);
  }
};

export const getAnemiaPrediction = async (data) => {
  try {
    const res = await api.post('/predict/anemia', {
      fatigue: data.fatigue,
      pale_skin: data.paleSkin,
      dizziness: data.dizziness,
    });
    // The backend returns symptoms_analyzed, risk_level, advice. We map to risk_score, risk_level, recommendation
    return {
      risk_score: res.data.symptoms_analyzed * 33, // rough mock to 100%
      risk_level: res.data.risk_level,
      recommendation: res.data.advice
    };
  } catch {
    return localAnemia(data);
  }
};

export const getSentiment = async (text) => {
  try {
    const res = await api.post('/nlp/sentiment', { text });
    return res.data;
  } catch {
    return localSentiment(text);
  }
};

export const getUnsafeZones = async () => {
  try {
    const res = await api.get('/safety/unsafe-zones');
    return res.data;
  } catch {
    return localUnsafeZones();
  }
};

export const getGroqChatResponse = async (chatHistory) => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("No Groq API Key found");

    // Format messages for Groq API
    const messages = chatHistory.map(m => ({
      role: m.sender === 'ai' ? 'assistant' : 'user',
      content: m.text
    }));

    // Add a system prompt at the beginning
    messages.unshift({
      role: 'system',
      content: 'You are SHE360 Mindful Assistant, an empathetic, supportive, and kind AI companion designed for women\'s wellness. Act as a trusted friend, listen to their problems, and provide positive and caring advice. Keep your responses concise (2-3 sentences mostly) and use emojis appropriately. Never act cold or overly robotic.'
    });

    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error/Missing Key. Using local fallback.");
    const lastUserMsg = chatHistory[chatHistory.length - 1]?.text || "";
    return localChatFallback(lastUserMsg);
  }
};

export default api;
