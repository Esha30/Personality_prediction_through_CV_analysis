import pandas as pd
import numpy as np
import re
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer

# Use absolute paths relative to this file so Flask always finds the assets
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
CSV_PATH = os.path.join(BASE_DIR, 'mbti_1.csv')
from sklearn.svm import LinearSVC
from transformers import pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialize VADER for backup/quick analysis
analyzer = SentimentIntensityAnalyzer()

# Advanced: Zero-Shot Classifier for direct OCEAN trait extraction
# Using a lightweight model to ensure it runs well
print("Initializing Advanced NLP Transformers...")
try:
    # Use a smaller model for faster inference and lower memory
    zero_shot_classifier = pipeline("zero-shot-classification", model="valhalla/distilbart-mnli-12-3")
except Exception as e:
    print(f"Transformer initialization failed: {e}. Using rule-based fallback.")
    zero_shot_classifier = None

def train_mbti_model(csv_path=None):
    # ... (keeping the same logic for the MBTI guide part)
    if csv_path is None:
        csv_path = CSV_PATH
    if not os.path.exists(csv_path): return None, None
    df = pd.read_csv(csv_path).dropna()
    def clean(t): return re.sub(r'[^a-zA-Z\s]', ' ', t.lower().replace('|||', ' '))
    df['posts'] = df['posts'].apply(clean)
    vectorizer = TfidfVectorizer(max_features=3000, stop_words='english')
    X = vectorizer.fit_transform(df['posts'])
    model = LinearSVC().fit(X, df['type'])
    with open(MODEL_PATH, 'wb') as f: pickle.dump((vectorizer, model), f)
    return vectorizer, model

def predict_personality(text):
    # 1. MBTI Prediction (Using the provided dataset model)
    if not os.path.exists(MODEL_PATH): train_mbti_model()
    with open(MODEL_PATH, 'rb') as f: vectorizer, model = pickle.load(f)
    mbti_type = model.predict(vectorizer.transform([text]))[0]
    
    # 2. Advanced OCEAN Trait Extraction (Using Transformers)
    ocean_labels = ["Extraversion", "Openness", "Agreeableness", "Conscientiousness", "Emotional Stability"]
    
    if zero_shot_classifier:
        # We chunk the text because Transformers have a token limit (e.g. 512 or 1024)
        truncated_text = text[:1000] # Use a representative sample for zero-shot
        result = zero_shot_classifier(truncated_text, ocean_labels, multi_label=True)
        # Result scores are 0-1
        traits = {label: int(score * 100) for label, score in zip(result['labels'], result['scores'])}
    else:
        # Fallback to MBTI Mapping if Transformer isn't available
        traits = {
            'Extraversion': 80 if 'E' in mbti_type else 30,
            'Openness': 85 if 'N' in mbti_type else 35,
            'Agreeableness': 75 if 'F' in mbti_type else 40,
            'Conscientiousness': 80 if 'J' in mbti_type else 45,
            'Emotional Stability': int((analyzer.polarity_scores(text)['compound'] + 1) * 50)
        }
        
    # Ensure Emotional Stability is influenced by VADER sentiment for better accuracy
    vs = analyzer.polarity_scores(text)
    sentiment_score = int((vs['compound'] + 1) * 50)
    traits['Emotional Stability'] = (traits['Emotional Stability'] + sentiment_score) // 2

    return mbti_type, traits
