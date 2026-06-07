<div align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="SHE360 Logo">
  <h1>SHE360 AI - Smart Women Safety & Health System</h1>
  <p>A comprehensive, AI-powered platform focusing on <strong>Safety</strong>, <strong>Health</strong>, <strong>Mental Wellness</strong>, and <strong>Personal Insights</strong>.</p>
</div>

**SHE360 AI** is a highly interactive platform unified into a single dashboard. Built with a modern, fully responsive **Glassmorphism UI**, this application actively predicts risks, assists the user, and provides deep personalization to foster an environment of complete safety and holistic wellness.

## 🌟 Pitch-Ready "WOW" Features
We engineered this platform to not just look good, but to act as a truly smart companion in real-world scenarios:

- 🎭 **Fake Escape Call:** A discreet button that instantly triggers a highly realistic full-screen "Incoming Call from Mom" UI to help users confidently escape uncomfortable situations without drawing suspicion.
- 🗺️ **AI Safe Route Mapper:** A simulated map navigation feature that uses AI logic to scan routes based on lighting, crowd density, and CCTV presence, explicitly recommending the safest path rather than just the shortest.
- ✅ **Trusted Circle Check-In:** A quick, one-click mechanism under Emergency Contacts that sends an "I reached safely!" notification to a user's entire trusted network.
- 💡 **Daily AI Wellness Tips:** A smart dashboard widget that analyzes your recently logged mood and health assessment data to provide pinpoint-accurate daily motivational and health-related actions.
- 🧠 **AI Personal Safety Profile:** A personalized risk model based on routines, travel habits, time of day, and mood trends — proactively suggesting safer behaviors and routes.
- 🌐 **Multilingual Mindful Assistant:** Chat in Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, or English — the AI replies in the **same language you write in**.
- 🔐 **Encrypted Data Vault:** AES-256 encrypted storage for sensitive health records, emergency notes, and personal notes with user-controlled passphrase.
- 📴 **Offline Emergency Mode:** Core safety features (SOS, emergency contacts, cached info) remain available even without internet.

## 🚀 Core Features

### 🏠 Dashboard
- Real-time stat cards for safety status, health reports, mood, and AI insights
- 7-day mood trend visualization
- Daily AI wellness tips based on mood and health data
- Quick overview of all new platform capabilities

### 🛡️ Safety Hub (Guardian Lens)
- **High-Accuracy SOS:** Prominent button with 5-second cancel countdown
- **Voice Guard SOS 🎤:** Hands-free SOS via browser Speech Recognition — supports **8 Indian languages** with localized keywords (*"Help"*, *"Bachao"*, *"मदद"*, *"உதவி"*, etc.)
- **Live GPS Sharing:** High-accuracy geolocation with Google Maps link copied to clipboard
- **AI Personal Safety Profile:** Edit routines and travel habits; get real-time risk scores and proactive safety suggestions
- **Verified Safe Spaces:** Partner locations (campuses, businesses, metro stations) marked as verified safe zones
- **Trusted Contact Roles:** Assign Family, Friend, or Emergency Guardian roles with different access levels (location, SOS, check-in, mood, health, vault)
- **Smart Commute Scheduler:** Add calendar events and get safe departure times and recommended routes
- **Offline Emergency Mode:** Automatic caching of emergency contacts and critical info for offline use
- **Quick Helpline Links:** Tap-to-call for Police, Women Helpline, Ambulance, Cyber Crime

### 🩺 Health Suite
- **PCOS Predictive AI Wizard:** Interactive questionnaire evaluating symptoms and cycle lengths
- **Dynamic Analysis:** Real-time risk score (`Low`, `Moderate`, `High`) with actionable medical advice
- **Assessment History:** Saves all previous checkups for historical health trend tracking

### 💜 MindSpace (Mental Wellness)
- **Mindful Chat Assistant:** Powered by **Groq LLaMA-3.3-70b-versatile** — empathetic, supportive mental wellness coach
- **Multilingual Chat:** Write in any supported Indian language; assistant automatically detects and replies in the same language
- **Adaptive Wellness Plans:** Generate weekly plans combining mood trends, health assessments, sleep patterns, and activity levels
- **AI Sentiment Analysis:** Auto-detects textual sentiment to log mood as "Sunny" or "Cloudy"
- **7-Day Trend Analytics:** Visualizes emotional stability over the week

### 📊 Insights (Analytics & Gamification)
- **Personal Analytics Dashboard:** Visual insights into safety check-ins, mood patterns, health trends, and wellness progress
- **Wellness Challenges:** Optional challenges for mindfulness, exercise, hydration, and safety check-ins with progress tracking
- **Achievements & Streaks:** Unlock badges for milestones like first check-in, guardian setup, vault secured, and more

### 👤 My Profile
- **Accessibility Mode:** Larger text, high-contrast themes, screen-reader optimization, and simplified navigation
- **Multilingual Voice Support:** Select from 8 Indian languages for voice commands and UI
- **Encrypted Data Vault:** Secure health records, emergency contacts, and personal notes with AES-256 encryption (Web Crypto API)
- **Security Settings:** Location tracking, voice listener, offline emergency cache, blood group for emergencies

### 🔔 Context-Aware Reminders
- Smart notifications based on time of day, mood, travel habits, and check-in history
- Examples: late-night travel alerts, hydration reminders, mindfulness prompts, daily check-in nudges

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + Vite 8 |
| **Styling** | Plain CSS (Glassmorphism design system), fully responsive |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **AI** | Groq API (LLaMA 3.3 70B) for mental health chat |
| **Encryption** | Web Crypto API (AES-GCM, PBKDF2) for data vault |
| **Backend (optional)** | FastAPI (`backend/main.py`) with mock/heuristic ML |
| **Persistence** | Browser `localStorage` with offline emergency cache |
| **State** | React Context (`UserContext`) |

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanya-garg10/SHE360-AI-Smart-Women-Safety-Health-System.git
   cd "she360 ai"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the AI Environment:**
   - Copy the provided template: `cp .env.example .env`
   - Open `.env` and add your [Groq API Key](https://console.groq.com/keys):
     ```env
     VITE_GROQ_API_KEY=your_actual_key_here
     ```

4. **Launch the app:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173/` in your browser.

5. **Optional — Start the backend API:**
   ```bash
   cd backend
   pip install fastapi uvicorn
   python main.py
   ```
   The frontend works fully without the backend using local fallbacks.

---
## 📱 App Navigation

| Tab | Description |
|-----|-------------|
| **Dashboard** | Overview stats, mood trends, AI tips |
| **My Profile** | Accessibility, language, encrypted vault, security |
| **Safety Hub** | SOS, voice guard, safety profile, safe spaces, commute |
| **Health Suite** | PCOS assessment wizard and history |
| **MindSpace** | AI chat, wellness plans, mood tracking |
| **Insights** | Analytics dashboard, challenges, achievements |

---
## 🌐 Supported Languages

| Language | Code | Voice SOS | Chat Reply |
|----------|------|-----------|------------|
| English | `en-IN` | ✅ | ✅ |
| Hindi | `hi-IN` | ✅ | ✅ |
| Bengali | `bn-IN` | ✅ | ✅ |
| Tamil | `ta-IN` | ✅ | ✅ |
| Telugu | `te-IN` | ✅ | ✅ |
| Marathi | `mr-IN` | ✅ | ✅ |
| Gujarati | `gu-IN` | ✅ | ✅ |
| Kannada | `kn-IN` | ✅ | ✅ |

## 🔮 Future Improvements

While the current MVP is fully functional and production-ready, the roadmap for future enhancements includes:

- **Cloud Database Integration:** Migrating from `localStorage` to **MongoDB / PostgreSQL** for cross-device synchronization and long-term secure health data storage
- **Hardware Integration:** Syncing with **Smartwatches** (Apple Watch/Wear OS) for automatic Fall Detection and pulse-rate monitoring to trigger SOS
- **Real-Time Google Maps API:** Fully integrating the actual Google Maps API for true turn-by-turn safe route navigation
- **Push Notification Service:** Integrating Firebase Cloud Messaging (FCM) to send actual push notifications to trusted contacts in real-time
- **SMS/WhatsApp SOS:** Real dispatch to emergency contacts on SOS trigger

## 📝 Usage & Privacy Notes

- Data (contacts, health reports, mood logs, wellness plans, challenges, accessibility settings) is persisted in browser `localStorage` for fast load times and demo reliability.
- The **Encrypted Data Vault** uses AES-256-GCM with PBKDF2 key derivation — only you hold the passphrase.
- **Offline Emergency Mode** caches critical contacts and info locally so SOS features work without internet.
- No data is sent to external servers except Groq API calls for the Mindful Assistant (when API key is configured).

<div align="center">
  <h3>Made with ❤️ for Women Empowerment & Safety</h3>
  <p><b>Developed by Tanya Garg & Team</b></p>
  
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/tanya-garg-5b08b5258/)
  [![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/Tanya-garg10)
</div>
