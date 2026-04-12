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
    # Mocking location-based safety zones
    return [
        {"lat": 28.62, "lng": 77.21, "radius": 500, "reason": "High density / Low lighting"},
        {"lat": 28.65, "lng": 77.24, "radius": 300, "reason": "Crowded area precaution"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
