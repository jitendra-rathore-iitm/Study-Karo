from flask import Blueprint, request, jsonify
import requests
import os
from jose import jwt

ai_bp = Blueprint("ai", __name__)

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

@ai_bp.route("/ai/generate", methods=["POST"])
def generate_content():
    try:
        # Verify authentication
        user_id, error_response, status_code = verify_token()
        if error_response:
            return error_response, status_code

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        model = data.get('model')
        prompt = data.get('prompt')
        api_key = data.get('apiKey')
        provider = data.get('provider')
        options = data.get('options', {})

        if not all([model, prompt, api_key, provider]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Route to appropriate provider
        if provider == 'openai':
            result = call_openai_api(model, prompt, api_key, options)
        elif provider == 'google':
            result = call_google_api(model, prompt, api_key, options)
        elif provider == 'perplexity':
            result = call_perplexity_api(model, prompt, api_key, options)
        else:
            return jsonify({"error": "Unsupported provider"}), 400

        if result.get('error'):
            return jsonify({"error": result['error']}), 400

        return jsonify({
            "success": True,
            "content": result.get('content', ''),
            "model": model,
            "provider": provider
        }), 200

    except Exception as e:
        return jsonify({"error": f"Generation failed: {str(e)}"}), 500

def call_openai_api(model, prompt, api_key, options):
    """Call OpenAI API with optimized settings"""
    try:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # Optimized data payload with better defaults
        data = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": options.get('maxTokens', 1000),
            "temperature": options.get('temperature', 0.7),
            "stream": False,  # Disable streaming for better performance
            "top_p": 1.0,     # Default top_p for consistent results
            "frequency_penalty": 0.0,  # No frequency penalty
            "presence_penalty": 0.0    # No presence penalty
        }

        # Reduced timeout for better responsiveness
        response = requests.post(url, headers=headers, json=data, timeout=20)
        response.raise_for_status()
        
        result = response.json()
        
        # Enhanced error handling
        if 'choices' not in result or not result['choices']:
            return {"error": "No response from OpenAI API"}
            
        content = result['choices'][0]['message']['content']
        
        return {"content": content}
        
    except requests.exceptions.Timeout:
        return {"error": "OpenAI API request timed out"}
    except requests.exceptions.RequestException as e:
        return {"error": f"OpenAI API error: {str(e)}"}
    except KeyError as e:
        return {"error": f"Unexpected response format from OpenAI: {str(e)}"}
    except Exception as e:
        return {"error": f"OpenAI error: {str(e)}"}

def call_google_api(model, prompt, api_key, options):
    """Call Google Gemini API with optimized settings"""
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": api_key
        }
        
        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "maxOutputTokens": options.get('maxTokens', 1000),
                "temperature": options.get('temperature', 0.7),
                "topP": 1.0,
                "topK": 40
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }

        # Reduced timeout for better responsiveness
        response = requests.post(url, headers=headers, json=data, timeout=20)
        response.raise_for_status()
        
        result = response.json()
        
        # Enhanced error handling
        if 'candidates' not in result or not result['candidates']:
            return {"error": "No response from Google API"}
            
        content = result['candidates'][0]['content']['parts'][0]['text']
        
        return {"content": content}
        
    except requests.exceptions.Timeout:
        return {"error": "Google API request timed out"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Google API error: {str(e)}"}
    except KeyError as e:
        return {"error": f"Unexpected response format from Google: {str(e)}"}
    except Exception as e:
        return {"error": f"Google error: {str(e)}"}

def call_perplexity_api(model, prompt, api_key, options):
    """Call Perplexity API with optimized settings"""
    try:
        url = "https://api.perplexity.ai/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": options.get('maxTokens', 1000),
            "temperature": options.get('temperature', 0.7),
            "stream": False,  # Disable streaming for better performance
            "top_p": 1.0,     # Default top_p for consistent results
            "frequency_penalty": 0.0,  # No frequency penalty
            "presence_penalty": 0.0    # No presence penalty
        }

        # Reduced timeout for better responsiveness
        response = requests.post(url, headers=headers, json=data, timeout=20)
        response.raise_for_status()
        
        result = response.json()
        
        # Enhanced error handling
        if 'choices' not in result or not result['choices']:
            return {"error": "No response from Perplexity API"}
            
        content = result['choices'][0]['message']['content']
        
        return {"content": content}
        
    except requests.exceptions.Timeout:
        return {"error": "Perplexity API request timed out"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Perplexity API error: {str(e)}"}
    except KeyError as e:
        return {"error": f"Unexpected response format from Perplexity: {str(e)}"}
    except Exception as e:
        return {"error": f"Perplexity error: {str(e)}"}

@ai_bp.route("/ai/test", methods=["POST"])
def test_connection():
    """Test AI model connection"""
    try:
        # Verify authentication
        user_id, error_response, status_code = verify_token()
        if error_response:
            return error_response, status_code

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        model = data.get('model')
        api_key = data.get('apiKey')
        provider = data.get('provider')

        if not all([model, api_key, provider]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Test with a simple prompt
        test_prompt = "Hello, this is a test message. Please respond with 'Connection successful'."
        
        if provider == 'openai':
            result = call_openai_api(model, test_prompt, api_key, {})
        elif provider == 'google':
            result = call_google_api(model, test_prompt, api_key, {})
        elif provider == 'perplexity':
            result = call_perplexity_api(model, test_prompt, api_key, {})
        else:
            return jsonify({"error": "Unsupported provider"}), 400

        if result.get('error'):
            return jsonify({"error": result['error']}), 400

        return jsonify({
            "success": True,
            "message": "Connection successful",
            "response": result.get('content', '')
        }), 200

    except Exception as e:
        return jsonify({"error": f"Test failed: {str(e)}"}), 500
