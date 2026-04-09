import sys
import os

# Add current dir to path
sys.path.append(os.getcwd())

try:
    print("Testing imports...")
    from personality_model import predict_personality
    print("Imports successful.")
    
    print("Testing prediction with dummy text...")
    mbti, traits = predict_personality("I am a very outgoing and creative person who loves coding and helping others.")
    print(f"Prediction successful: {mbti}, {traits}")
except Exception as e:
    print(f"Error caught: {e}")
    import traceback
    traceback.print_exc()
