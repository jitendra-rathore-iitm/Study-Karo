from flask import Blueprint, request, jsonify
import os
import tempfile
import PyPDF2
import io
from jose import jwt
from . import db
from .model import User

pdf_bp = Blueprint("pdf", __name__)

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"

def verify_token():
    """Verify JWT token from request"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, jsonify({"error": "Authorization header missing or invalid"}), 401
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            return None, jsonify({"error": "Invalid token"}), 401
        return user_id, None, None
    except jwt.JWTError:
        return None, jsonify({"error": "Invalid token"}), 401

@pdf_bp.route("/pdf/extract", methods=["POST"])
def extract_pdf_text():
    """Extract text from uploaded PDF file"""
    try:
        # Verify authentication
        user_id, error_response, status_code = verify_token()
        if error_response:
            return error_response, status_code

        # Check if file is present
        if 'pdf' not in request.files:
            return jsonify({"error": "No PDF file provided"}), 400
        
        file = request.files['pdf']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "File must be a PDF"}), 400
        
        # Check file size (10MB limit)
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            return jsonify({"error": "File size must be less than 10MB"}), 400
        
        # Extract text from PDF
        try:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
            
            # Clean up text
            text = text.strip()
            
            if not text:
                return jsonify({"error": "No text could be extracted from the PDF. The PDF might be image-based or corrupted."}), 400
            
            # Count words
            word_count = len(text.split())
            
            return jsonify({
                "success": True,
                "text": text,
                "wordCount": word_count,
                "pageCount": len(pdf_reader.pages),
                "filename": file.filename
            }), 200
            
        except Exception as e:
            return jsonify({"error": f"Failed to extract text from PDF: {str(e)}"}), 400
            
    except Exception as e:
        return jsonify({"error": f"PDF processing failed: {str(e)}"}), 500

@pdf_bp.route("/pdf/summarize", methods=["POST"])
def summarize_pdf():
    """Summarize PDF text using AI"""
    try:
        # Verify authentication
        user_id, error_response, status_code = verify_token()
        if error_response:
            return error_response, status_code

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        text = data.get('text')
        prompt = data.get('prompt', 'Summarize this document:')
        model = data.get('model')
        api_key = data.get('apiKey')
        provider = data.get('provider')
        options = data.get('options', {})

        if not all([text, model, api_key, provider]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Import AI routes to use the API calling functions
        from . import ai_routes
        
        # Prepare the full prompt
        full_prompt = f"{prompt}\n\nDocument Text:\n{text}"
        
        # Route to appropriate provider
        if provider == 'openai':
            result = ai_routes.call_openai_api(model, full_prompt, api_key, options)
        elif provider == 'google':
            result = ai_routes.call_google_api(model, full_prompt, api_key, options)
        elif provider == 'perplexity':
            result = ai_routes.call_perplexity_api(model, full_prompt, api_key, options)
        else:
            return jsonify({"error": "Unsupported provider"}), 400

        if result.get('error'):
            return jsonify({"error": result['error']}), 400

        return jsonify({
            "success": True,
            "summary": result.get('content', ''),
            "model": model,
            "provider": provider,
            "wordCount": len(text.split()),
            "summaryWordCount": len(result.get('content', '').split())
        }), 200

    except Exception as e:
        return jsonify({"error": f"Summarization failed: {str(e)}"}), 500

@pdf_bp.route("/pdf/health", methods=["GET"])
def pdf_health():
    """Health check for PDF processing service"""
    return jsonify({
        "status": "ok",
        "service": "PDF Processing",
        "features": ["text_extraction", "ai_summarization"]
    })
