# Personality Prediction System Through CV Analysis

This project analyzes uploaded CVs (PDF, DOCX) and predicts the candidate's MBTI personality type and OCEAN traits using Machine Learning and NLP. 

It consists of a Python/Flask Backend and a Next.js Frontend.

## Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB Database (optional depending on use-case, but required for NextAuth user storage)

## 1. Backend Setup

The backend houses the ML models, CV parsers, and Flask API.

```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment Setup
cp .env.example .env
# Edit .env and enter your config details

# Run the backend
python app.py
```
The Flask API should now be running on `http://localhost:5000`.

## 2. Frontend Setup

The frontend is a modern Next.js application that provides the UI and authentication.

```bash
cd frontend

# Install dependencies
npm install

# Environment Setup
cp .env.local.example .env.local
# Edit .env.local and add your MongoDB connection string and Auth secrets

# Run the frontend
npm run dev
```
The Frontend should now be accessible at `http://localhost:3000`.

## Disclaimer
The dataset `mbti_1.csv` is quite large and is intentionally omitted from source control. However, a pre-trained `.pkl` model is provided to allow the system to work instantly.
