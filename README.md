<div align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="SHE360 Logo">
  <h1>SHE360 AI - Smart Women Safety & Health System</h1>
  <p>A comprehensive, AI-powered platform focusing on <strong>Safety</strong>, <strong>Health</strong>, and <strong>Mental Wellness</strong>.</p>
</div>

**SHE360 AI** is a highly interactive platform unified into a single dashboard. Built with a modern, fully responsive **Glassmorphism UI**, this application actively predicts risks, assists the user, and provides deep personalization to foster an environment of complete safety and holistic wellness.

## 🌟 Pitch-Ready "WOW" Features
We engineered this platform to not just look good, but to act as a truly smart companion in real-world scenarios:

- 🎭 **Fake Escape Call:** A discreet button that instantly triggers a highly realistic full-screen "Incoming Call from Mom" UI to help users confidently escape uncomfortable situations without drawing suspicion.
- 🗺️ **AI Safe Route Mapper:** A simulated map navigation feature that uses AI logic to scan routes based on lighting, crowd density, and CCTV presence, explicitly recommending the safest path rather than just the shortest.
- ✅ **Trusted Circle Check-In:** A quick, one-click mechanism under the Emergency Contacts that simulates sending live GPS coordinates and an "I reached safely!" notification to a user's entire trusted network.
- 💡 **Daily AI Wellness Tips:** A smart dashboard widget that analyzes your recently logged mood and health assessment data to provide pinpoint-accurate daily motivational and health-related actions.

## 🚀 Core Features

### 🛡️ 1. Safety Hub (Guardian Lens)
- **High-Accuracy SOS:** A prominent button offering a 5-second cancel countdown. Once triggered, alerts are readied for dispatch.
- **Voice Guard SOS 🎤:** Completely hands-free! Utilizes Native Browser Speech Recognition. Saying keywords like *"Help"*, *"Danger"*, or *"Bachao"* automatically triggers the SOS protocol.
- **Live GPS Sharing:** Fetches high-accuracy geolocation and generates a ready-to-share Google Maps link copied straight to the clipboard.
- **Quick Helpline Links:** Instant tap-to-call buttons for local Authorities (Police, Ambulance, Cyber Crime).

### 🩺 2. Health Suite
- **PCOS Predictive AI Wizard:** A beautifully crafted, interactive questionnaire evaluating symptoms and cycle lengths.
- **Dynamic Analysis:** Generates a real-time risk score (`Low`, `Moderate`, `High`) with actionable medical advice.
- **Assessment History:** Saves all previous checkups to give the user a historical view of their health trends.

### 💜 3. MindSpace (Mental Wellness)
- **Mindful Chat Assistant:** Connected to the ultra-fast **Groq LLaMA-3.3-70b-versatile LLM**. It acts as a supportive, empathetic, and personalized mental wellness coach.
- **AI Sentiment Analysis:** Automatically detects textual sentiment to auto-log your mood as "Sunny" or "Cloudy" without manual entry.
- **7-Day Trend Analytics:** Evaluates and visualizes your emotional stability over the course of a week.

## 🛠️ Technology Stack
- **Frontend Framework:** React + Vite
- **Styling Architecture:** Plain CSS focusing heavily on a custom Glassmorphism design system. Fully Mobile-First and responsive.
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **AI Brain:** Groq API (LLaMA 3.3 70B Model)
- **Backend structure:** Prepared FastAPI backend (`backend/main.py`) framework equipped with independent local/mock fallbacks ensuring frontend operates 100% serverless for demonstrations.

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

4. **Launch the Engine:**
   ```bash
   npm run dev
   ```
   *Navigate to `http://localhost:5173/` in your browser.*

## 🔮 Future Improvements
While the current MVP is fully functional and production-ready, the roadmap for future enhancements includes:
- **Cloud Database Integration:** Migrating from `localStorage` to **MongoDB / PostgreSQL** for cross-device synchronization and long-term secure health data storage.
- **Hardware Integration:** Syncing with **Smartwatches** (Apple Watch/Wear OS) for automatic Fall Detection and pulse-rate monitoring to trigger SOS.
- **Real-Time Google Maps API:** Fully integrating the actual Google Maps API for true turn-by-turn safe route navigation rather than simulated UI.
- **Push Notification Service:** Integrating Firebase Cloud Messaging (FCM) to send actual push notifications to trusted contacts in real-time.

## 📝 Usage & Privacy Notes
For pure ease-of-use and presentation fluidity, this project currently persists data (contacts, health reports, mood logs, Light/Dark theme preference) utilizing browser `localStorage`. This guarantees rapid load times, offline fallback reliability, and strict privacy protection on the local machine demo.

<div align="center">
  <h3>Made with ❤️ for Women Empowerment & Safety</h3>
  <p><b>Developed by Tanya Garg & Team</b></p>
  
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/tanya-garg-5b08b5258/)
  [![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/Tanya-garg10)
</div>
