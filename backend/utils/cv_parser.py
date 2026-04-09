import PyPDF2
import docx
import re

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in range(len(reader.pages)):
                text += reader.pages[page].extract_text()
    except Exception as e:
        print(f"Error extracting from PDF: {e}")
    return text

def extract_text_from_docx(docx_path):
    text = ""
    try:
        doc = docx.Document(docx_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error extracting from DOCX: {e}")
    return text

def clean_text(text):
    # Remove non-ascii characters
    text = re.sub(r'[^\x00-\x7f]', r' ', text)
    # Remove newlines and tabs
    text = text.replace('\n', ' ').replace('\t', ' ')
    # Remove special characters
    text = re.sub(r'[^a-zA-Z0-9\s.,]', ' ', text)
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_cv_text(file_path):
    if file_path.endswith('.pdf'):
        raw_text = extract_text_from_pdf(file_path)
    elif file_path.endswith('.docx'):
        raw_text = extract_text_from_docx(file_path)
    else:
        # Fallback to plain text read
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                raw_text = f.read()
        except:
            return ""
    
    return clean_text(raw_text)
