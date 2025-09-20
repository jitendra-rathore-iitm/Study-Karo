from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from jose import jwt
from datetime import datetime, timedelta, timezone
import os
from . import db
from .model import User

api_bp = Blueprint("api", __name__)

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@api_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify(status="ok")

@api_bp.route("/", methods=["GET"])
def api_root():
    return jsonify(message="Study Karo API")

@api_bp.route("/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        print(f"Registration request data: {data}")
        
        # Validate required fields
        if not data or not all(k in data for k in ("name", "email", "password")):
            return jsonify({"error": "Name, email, and password are required"}), 400
        
        name = data.get("name").strip()
        email = data.get("email").strip().lower()
        password = data.get("password")
        
        # Validate email format
        if "@" not in email or "." not in email:
            return jsonify({"error": "Invalid email format"}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 409
        
        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(
            name=name,
            email=email,
            password=hashed_password
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate token
        token = create_access_token(data={"sub": str(new_user.id), "email": email})
        
        return jsonify({
            "message": "User registered successfully",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email
            },
            "token": token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Registration failed"}), 500

@api_bp.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        print(f"Login request data: {data}")
        
        if not data or not all(k in data for k in ("email", "password")):
            return jsonify({"error": "Email and password are required"}), 400
        
        email = data.get("email").strip().lower()
        password = data.get("password")
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Generate token
        token = create_access_token(data={"sub": str(user.id), "email": email})
        
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },
            "token": token
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Login failed"}), 500

@api_bp.route("/auth/me", methods=["GET"])
def get_current_user():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authorization header missing or invalid"}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                return jsonify({"error": "Invalid token"}), 401
        except jwt.JWTError:
            return jsonify({"error": "Invalid token"}), 401
        
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to get user info"}), 500