"""SHE360 AI — FastAPI prediction engine for health, safety & wellness endpoints."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI(title="SHE360 AI Prediction Engine")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class PCOSInput(BaseModel):
    irregular_periods: bool
    weight_gain: bool
    hair_growth: bool
    acne: bool
    cycle_length: int

class AnemiaInput(BaseModel):
    fatigue: bool
    pale_skin: bool
    dizziness: bool

class SentimentInput(BaseModel):
    text: str

class SafetyProfileInput(BaseModel):
    routine: str = "office"
    travel_alone: bool = True
    late_night_commute: bool = False
    public_transport: bool = True

class WellnessPlanInput(BaseModel):
    mood_count: int = 0
    health_risk: str = "Low"
    sleep_hours: float = 7.0
    activity_level: str = "moderate"

# --- Endpoints ---

@app.post("/predict/pcos")
async def predict_pcos(data: PCOSInput):
    # Simulated ML Logic (Decision Tree Heuristic)
    score = 0
    if data.irregular_periods: score += 40
    if data.weight_gain: score += 20
    if data.hair_growth: score += 20
    if data.acne: score += 20
    
    # Simulate variations
    if data.cycle_length < 21 or data.cycle_length > 35:
        score += 10
        
    risk_level = "High" if score > 50 else "Moderate" if score > 30 else "Low"
    
    return {
        "risk_score": min(score, 100),
        "risk_level": risk_level,
        "recommendation": "Consult a specialist" if risk_level == "High" else "Monitor cycle regularly"
    }

@app.post("/predict/anemia")
async def predict_anemia(data: AnemiaInput):
    symptoms_count = sum([data.fatigue, data.pale_skin, data.dizziness])
    risk_level = "High" if symptoms_count >= 3 else "Moderate" if symptoms_count == 2 else "Low"
    
    return {
        "symptoms_analyzed": symptoms_count,
        "risk_level": risk_level,
        "advice": "Check iron levels" if risk_level != "Low" else "Keep healthy diet"
    }

@app.post("/nlp/sentiment")
async def analyze_sentiment(data: SentimentInput):
    text = data.text.lower()
    positive_words = ['happy', 'good', 'great', 'fine', 'excited', 'wonderful']
    negative_words = ['sad', 'bad', 'upset', 'depressed', 'stressed', 'tired']
    
    pos_score = sum(1 for word in positive_words if word in text)
    neg_score = sum(1 for word in negative_words if word in text)
    
    sentiment = "Positive" if pos_score > neg_score else "Negative" if neg_score > pos_score else "Neutral"
    
    return {"sentiment": sentiment, "score": pos_score - neg_score}

@app.get("/safety/unsafe-zones")
async def get_unsafe_zones():
    return [
        {"lat": 28.62, "lng": 77.21, "radius": 500, "reason": "High density / Low lighting"},
        {"lat": 28.65, "lng": 77.24, "radius": 300, "reason": "Crowded area precaution"}
    ]

@app.post("/safety/risk-profile")
async def get_risk_profile(data: SafetyProfileInput):
    score = 30
    suggestions = []
    if data.travel_alone:
        score += 15
        suggestions.append("Share live location when traveling alone")
    if data.late_night_commute:
        score += 20
        suggestions.append("Use well-lit routes after 10 PM")
    if data.public_transport:
        score += 10
        suggestions.append("Sit near driver or women-only section")
    if data.routine == "night-shift":
        score += 12
        suggestions.append("Pre-share route with guardian contacts")
    level = "High" if score > 65 else "Moderate" if score > 45 else "Low"
    return {"risk_score": min(score, 100), "level": level, "suggestions": suggestions}

@app.post("/wellness/weekly-plan")
async def get_weekly_plan(data: WellnessPlanInput):
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    focus_areas = ["Mind & Body", "Safety & Rest", "Nutrition & Activity"]
    plan = []
    for i, day in enumerate(days):
        tasks = [
            {"type": "mindfulness", "task": "10-min breathing exercise", "done": False},
            {"type": "hydration", "task": f"{2.5 if data.sleep_hours >= 7 else 3}L water daily", "done": False},
        ]
        if data.health_risk != "Low":
            tasks.append({"type": "health", "task": "Monitor health symptoms", "done": False})
        if i % 2 == 0:
            tasks.append({"type": "safety", "task": "Daily safety check-in", "done": False})
        plan.append({"day": day, "focus": focus_areas[i % 3], "tasks": tasks})
    return {"plan": plan, "generated": True}

@app.get("/safety/verified-spaces")
async def get_verified_spaces():
    return [
        {"id": 1, "name": "Delhi University — North Campus", "type": "Campus", "partner": "DU Safety Cell", "verified": True, "address": "Delhi 110007", "hours": "24/7"},
        {"id": 2, "name": "Apollo Pharmacy — Connaught Place", "type": "Business", "partner": "Apollo Hospitals", "verified": True, "address": "CP, New Delhi", "hours": "8 AM - 11 PM"},
        {"id": 3, "name": "Infosys Campus — Gurugram", "type": "Organization", "partner": "Infosys SHE", "verified": True, "address": "Sector 60, Gurugram", "hours": "24/7"},
        {"id": 4, "name": "Metro Station — Rajiv Chowk", "type": "Transit", "partner": "DMRC Women Safety", "verified": True, "address": "Connaught Place Metro", "hours": "5 AM - 11 PM"},
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
