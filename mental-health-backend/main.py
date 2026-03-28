import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv

# 1. Load Environment Variables (Fixes your API Key Error)
load_dotenv() 
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()


# UPDATE THIS SECTION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load the ML Model
# Ensure 'depression_model (1).pkl' is in the SAME folder as this script
try:
    artifact = joblib.load("depression_model (1).pkl")
    model = artifact["model"]
    feature_columns = artifact["feature_columns"]
    sleep_mapping = artifact["sleep_mapping"]
except FileNotFoundError:
    print("CRITICAL WARNING: Model file not found. Prediction endpoint will fail.")

# --- LOGIC FOR RISK ASSESSMENT ---

# Define the exact inputs your model expects
class AssessmentInput(BaseModel):
    age: int
    gender: str
    city: str
    occupation_status: str
    profession: str
    degree: str
    academic_pressure: float
    work_pressure: float
    cgpa: float
    study_satisfaction: float
    job_satisfaction: float
    financial_stress: float
    sleep_duration: str
    dietary_habits: str
    work_study_hours: int
    suicidal_thoughts: str
    family_history_mental_illness: str

# Helper function (Your exact logic)
def clean_diet(val):
    valid_diet = {
        'Healthy':'Healthy', 'More Healthy':'Healthy', 'No Healthy':'Unhealthy',
        'Less than Healthy':'Unhealthy', 'Less Healthy':'Unhealthy', 
        'Unhealthy':'Unhealthy', 'Moderate':'Moderate'
    }
    return valid_diet.get(val, 'Other')

@app.post("/predict")
def predict_risk(data: AssessmentInput):
    try:
        # Convert Pydantic object to Dict, then DataFrame
        input_data = data.model_dump()
        df = pd.DataFrame([input_data])

        # Apply your transformations
        df['dietary_habits'] = df['dietary_habits'].apply(clean_diet)
        df['sleep_duration'] = df['sleep_duration'].map(sleep_mapping)

        # One-Hot Encoding (simulating your training steps)
        df_encoded = pd.get_dummies(df)
        
        # Reindex to match training columns
        df_final = df_encoded.reindex(columns=feature_columns, fill_value=0)

        # Predict
        probability = model.predict_proba(df_final)[0][1]
        prediction = int(model.predict(df_final)[0])

        return {
            "prediction": prediction, # 0 or 1
            "risk_score": probability # 0.0 to 1.0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- LOGIC FOR CHATBOT ---

class ChatRequest(BaseModel):
    history: list

@app.post("/chat/")
def chat_endpoint(request: ChatRequest):
    try:
        # UPDATED SYSTEM PROMPT
        system_msg = {
            "role": "system",
            "content": (
                "You are a dedicated Mental Health Assistant. "
                "CRITICAL RULE: You are only allowed to discuss matters pertaining to mental health, "
                "emotional well-being, psychology, and wellness strategies. "
                "If a user asks about anything else (e.g., cooking, coding, general facts, sports, etc.), "
                "politely decline and explain that your purpose is to support their mental health journey."
            )
        }
        
        messages = [system_msg] + request.history
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))