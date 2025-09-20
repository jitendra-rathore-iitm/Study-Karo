import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_super_secret_key_for_development')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql+psycopg2://jitendra:jitendra123@localhost:5432/studykaro')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    with app.app_context():
        from . import model
        from . import routes
        from . import ai_routes
        from . import pdf_routes
        app.register_blueprint(routes.api_bp, url_prefix='/api')
        app.register_blueprint(ai_routes.ai_bp, url_prefix='/api')
        app.register_blueprint(pdf_routes.pdf_bp, url_prefix='/api')
        db.create_all()
    return app

