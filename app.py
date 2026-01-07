import streamlit as st
import pandas as pd
import joblib
import numpy as np
import os

# --- 1. Load the Model Artifact ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "depression_model (1).pkl")
@st.cache_resource # This keeps the model in memory so it doesn't reload every time
def load_artifact():
    # If it fails, we want to know exactly what the file system sees
    if not os.path.exists(MODEL_PATH):
        st.error(f"Looking for file at: {MODEL_PATH}")
        st.write("Files actually in this folder:", os.listdir(BASE_DIR))
    return joblib.load(MODEL_PATH)

artifact = load_artifact()
model = artifact["model"]
feature_columns = artifact["feature_columns"]
sleep_mapping = artifact["sleep_mapping"]

# --- 2. Helper Functions (From your logic) ---
valid_diet = {
    'Healthy':'Healthy', 'More Healthy':'Healthy', 'No Healthy':'Unhealthy',
    'Less than Healthy':'Unhealthy', 'Less Healthy':'Unhealthy', 
    'Unhealthy':'Unhealthy', 'Moderate':'Moderate'
}

def clean_diet(val):
    return valid_diet.get(val, 'Other')

# --- 3. Streamlit UI Layout ---
st.set_page_config(page_title="Mental Health Screening Tool", page_icon="🧠")
st.title("🧠 Depression Risk Assessment")
st.write("Please fill out the details below for a quick screening.")

# Create two columns for a cleaner layout
col1, col2 = st.columns(2)

with col1:
    age = st.number_input("Age", 18, 100, 22)
    gender = st.selectbox("Gender", ["Male", "Female"])
    city = st.text_input("City", "Srinagar")
    occupation = st.selectbox("Occupation Status", ["Student", "Working Professional"])
    profession = st.text_input("Profession", "Engineering")
    degree = st.text_input("Degree", "B.Tech")
    
with col2:
    academic_pressure = st.slider("Academic Pressure (1-5)", 0.0, 5.0, 3.0)
    work_pressure = st.slider("Work Pressure (1-5)", 0.0, 5.0, 2.0)
    cgpa = st.number_input("CGPA", 0.0, 10.0, 7.5)
    study_sat = st.slider("Study Satisfaction (1-5)", 0.0, 5.0, 3.0)
    job_sat = st.slider("Job Satisfaction (1-5)", 0.0, 5.0, 3.0)
    fin_stress = st.slider("Financial Stress (1-5)", 0.0, 5.0, 2.0)

st.divider()

col3, col4 = st.columns(2)
with col3:
    sleep = st.selectbox("Sleep Duration", list(sleep_mapping.keys()))
    diet = st.selectbox("Dietary Habits", ["Healthy", "Moderate", "Unhealthy", "Less Healthy"])
    work_hours = st.number_input("Work/Study Hours per Day", 0, 24, 8)

with col4:
    suicidal = st.radio("Have you ever had suicidal thoughts?", ["Yes", "No"], index=1)
    family_hist = st.radio("Family history of mental illness?", ["Yes", "No"], index=1)

# --- 4. Prediction Logic ---
if st.button("Analyze Results", type="primary", use_container_width=True):
    # Construct input dictionary
    user_input = {
        'age': age, 'gender': gender, 'city': city, 'occupation_status': occupation,
        'profession': profession, 'academic_pressure': academic_pressure,
        'work_pressure': work_pressure, 'cgpa': cgpa, 'study_satisfaction': study_sat,
        'job_satisfaction': job_sat, 'sleep_duration': sleep, 'dietary_habits': diet,
        'degree': degree, 'suicidal_thoughts': suicidal, 'work_study_hours': work_hours,
        'financial_stress': fin_stress, 'family_history_mental_illness': family_hist
    }

    # Convert to DataFrame
    df = pd.DataFrame([user_input])

    # Transform inputs using your specific logic
    df['dietary_habits'] = df['dietary_habits'].apply(clean_diet)
    df['sleep_duration'] = df['sleep_duration'].map(sleep_mapping)
    
    # One-Hot Encoding
    df_encoded = pd.get_dummies(df)
    
    # Reindex to match the EXACT columns the model was trained on
    df_final = df_encoded.reindex(columns=feature_columns, fill_value=0)

    # Predict
    probability = model.predict_proba(df_final)[0][1]
    prediction = model.predict(df_final)[0]
    # --- 5. Display Result ---
    # --- 5. Display Result ---
    st.subheader("Results:")
    if prediction == 1:
        st.error(f"**High Risk Detected.** (Confidence: {probability:.2%})")
        
        # Immediate Action
        st.info("💡 **Immediate Recommendation:** Please reach out to a mental health professional or a Certified Core Energetics Practitioner for personalized support.")
        
        # Wellness Strategies Section
        st.subheader("Personal Wellness Action Plan")
        st.write("While seeking professional help is the priority, here are some daily strategies to support your wellness:")
        
        with st.expander("🧘 Practice Mindfulness & Self-Care"):
            st.write("""
            - **Grounding:** Take a walk in nature or try 5 minutes of guided meditation.
            - **Rest:** Prioritize 7-9 hours of sleep to help your brain process emotions.
            - **Mindfulness:** Focus on the present moment without judgment.
            """)
            
        with st.expander("🏃 Movement & Nutrition"):
            st.write("""
            - **Exercise:** Aim for 30 minutes of movement to reduce stress hormones and boost endorphins.
            - **Brain Food:** Increase Omega-3s (like fish/walnuts) and limit caffeine and alcohol.
            """)
            
        with st.expander("🛡️ Social Connection & Boundaries"):
            st.write("""
            - **Connect:** Reach out to one trusted friend or family member today.
            - **Say No:** Protect your energy by setting clear boundaries with work and technology.
            - **Digital Detox:** Turn off non-essential notifications to reduce anxiety.
            """)
            
        st.markdown("---")
        st.caption("This tool is for screening purposes and does not replace a clinical diagnosis.")

    else:
        st.success(f"**Low Risk Detected.** (Confidence: {1 - probability:.2%})")
        st.write("You seem to be managing well! Continue prioritizing your wellness by maintaining your current routines.")