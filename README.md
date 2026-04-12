# SHE360 AI - Smart Women Safety & Health System

**SHE360 AI** is a comprehensive, AI-powered platform unified into a single dashboard. It focuses on three core pillars: **Safety**, **Health**, and **Mental Wellness**. Built with a modern, fully responsive Glassmorphism UI, this application actively predicts risks and assists the user.

## 🚀 Features

### 1. Safety Hub (Guardian Lens)
- **Emergency SOS Dashboard:** 5-second countdown to cancel or trigger emergency alerts.
- **Voice Guard Detection:** Uses native browser Speech Recognition. Saying "Help", "Danger", or "Bachao" automatically triggers the SOS.
- **Live Location Sharing:** Auto-fetches GPS coordinates and copies a Google Maps link to the clipboard.
- **Quick Helpline Access:** Direct call buttons for Police, Ambulance, and Women Help Desks.
- **Contact Management:** Easily save and manage emergency contacts.

### 2. Health Suite
- **PCOS Predictive AI Wizard:** An interactive, multi-step symptom assessment.
- **Dynamic Analysis:** Local machine learning heuristics fallback calculating variable risk scores.
- **Assessment History:** Visual progress and risk scoring saved directly in the browser.

### 3. MindSpace (Mental Wellness)
- **Mindful Chat Assistant:** Integrated with the **Groq LLaMA-3.3-70b-versatile** LLM, acting as a supportive, empathetic wellness coach.
- **Mood Logging:** Real-time emoji-based mood tracking.
- **7-Day Trend Chart:** Dynamic visual representation of emotional health over the week.
- **AI Sentiment Analysis:** Uses sentiment scoring to automatically detect "Sunny" or "Cloudy" moods based on user chat input.

### 4. Interactive Dashboard
- Centralized overview showing current safety status, last health report, today's mood, and AI insights.

## 🛠️ Technology Stack
- **Frontend:** React, Vite, Framer Motion (for animations)
- **Styling:** Custom standard CSS with a sleek Glassmorphism design and fully mobile-first responsive grid layouts.
- **Icons:** Lucide React
- **AI Integration:** Groq API (LLaMA-3.3-70b)
- **Backend structure:** Prepared FastAPI backend (`backend/main.py`) logic with robust local/mock fallback API services for standalone frontend operation.

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

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`.
   - Add your [Groq API Key](https://console.groq.com/keys) to the file:
     ```env
     VITE_GROQ_API_KEY=your_actual_key_here
     ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

## 📝 Usage Notes
The application currently stores history and contacts in the browser's `localStorage` for privacy and persistence between sessions, ensuring the app is lightweight and completely serverless-capable for its core frontend demo features.
