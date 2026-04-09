from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from utils.cv_parser import get_cv_text
from personality_model import predict_personality

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Use absolute path so Flask works regardless of where it is launched from
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "Backend is running"}), 200

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'cv' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['cv']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # 1. Extract text from CV
            text = get_cv_text(filepath)
            
            if not text:
                return jsonify({"error": "Could not extract text from CV. Please try another file."}), 400
                
            # 2. Predict personality
            mbti_type, ocean_traits = predict_personality(text)
            
            # 3. Clean up (optional)
            # os.remove(filepath)
            
            return jsonify({
                "mbti": mbti_type,
                "traits": ocean_traits,
                "filename": filename,
                "status": "success"
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return jsonify({"error": "Invalid file type. Please upload PDF, DOCX or TXT."}), 400

if __name__ == '__main__':
    # Disable debug mode to prevent multiple processes from contending for model loading
    app.run(host='0.0.0.0', debug=False, port=5000, threaded=True)
