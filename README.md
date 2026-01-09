
🚀 Getting Started
1. Prerequisites
Python 3.10+

Node.js & npm

How to run

2. Backend Setup (FastAPI)
Bash

# Navigate to backend
cd mental-health-backend

# Install system dependencies (Mac)
brew install libomp

# Install Python dependencies
pip install fastapi uvicorn openai python-dotenv pandas joblib xgboost lightgbm scikit-learn


# Run the server
uvicorn main:app --reload

3. Frontend Setup (React)
# Navigate to frontend
cd mental-health-ui

# Install dependencies
npm install

# Start the development server
npm run dev